"use server";

import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to validate JSON schema structure
function validateJsonSchema(schemaObj: any): boolean {
  if (typeof schemaObj !== "object" || schemaObj === null) {
    return false;
  }
  
  // Basic validation - ensure it's a proper object with string values or nested objects
  for (const [key, value] of Object.entries(schemaObj)) {
    if (typeof key !== "string") return false;
    if (typeof value !== "string" && typeof value !== "object") return false;
  }
  
  return true;
}

export const processPDFWithSchema = async (
  fileData: string,
  fileName: string,
  schema?: string
) => {
  try {
    console.log("Processing PDF with OpenAI direct API...");
    
    // 1️⃣ Convert base64 to buffer and upload to OpenAI
    const base64Data = fileData.split(",")[1]; // Remove data:application/pdf;base64, prefix
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Create a File object for upload
    const file = new File([pdfBuffer], fileName, { type: "application/pdf" });

    const fileUpload = await client.files.create({
      file: file,
      purpose: "assistants",
    });

    console.log("File uploaded to OpenAI:", fileUpload.id);

    // 2️⃣ Parse and validate schema
    let parsedSchema = null;
    if (schema && schema.trim()) {
      try {
        parsedSchema = JSON.parse(schema);
        if (!validateJsonSchema(parsedSchema)) {
          throw new Error("Invalid schema structure");
        }
      } catch (error) {
        throw new Error("Invalid JSON schema provided: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    }

    // 3️⃣ Create default schema if none provided
    const defaultSchema = {
      title: "string",
      content: "string", 
      metadata: {
        author: "string",
        created: "string",
        pages: "string"
      }
    };

    const finalSchema = parsedSchema || defaultSchema;

    // 4️⃣ Create an assistant to process the PDF
    const assistant = await client.beta.assistants.create({
      name: "PDF Text Extractor",
      instructions: `You are an AI assistant that extracts text from PDF documents and maps it to JSON schemas. You must be accurate and never hallucinate information that is not present in the document.

Extract all text content from the uploaded PDF file and map it to the provided JSON schema. Return only valid JSON without explanations or additional text.

Instructions:
1. Extract text ONLY from the actual PDF content - do not make up or hallucinate any information
2. If a field is not found in the PDF, use null as the value
3. For monetary values, extract as strings with currency symbols (e.g., "$100.00")
4. For dates, use the exact format found in the document
5. Be precise and accurate - only extract what is actually visible in the PDF
6. Handle different document types (invoices, statements, reports, etc.)
7. Return only the JSON object, no additional text or explanations`,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
    });

    // Create a thread
    const thread = await client.beta.threads.create({
      messages: [
        {
          role: "user",
          content: `Extract all text content from the uploaded PDF file and map it to the following JSON schema:

JSON Schema:
${JSON.stringify(finalSchema, null, 2)}

PDF File: ${fileName}`,
          attachments: [
            {
              file_id: fileUpload.id,
              tools: [{ type: "file_search" }],
            },
          ],
        },
      ],
    });

    // Run the assistant
    const run = await client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    let responseContent = null;
    
    if (run.status === "completed") {
      const messages = await client.beta.threads.messages.list(thread.id);
      const messageContent = messages.data[0].content[0];
      
      if (messageContent.type === "text") {
        responseContent = messageContent.text.value;
        console.log("Assistant Response:", responseContent);
        
        // Clean up assistant and thread
        await client.beta.assistants.delete(assistant.id);
        await client.beta.threads.delete(thread.id);
      } else {
        throw new Error("Unexpected response type from assistant");
      }
    } else {
      throw new Error(`Assistant run failed with status: ${run.status}`);
    }

    // 5️⃣ Extract and parse the JSON response
    let finalJson = null;
    
    console.log("Raw AI Response:", responseContent); // Debug log
    
    if (responseContent) {
      try {
        // Try to parse the response as JSON
        finalJson = JSON.parse(responseContent.trim());
      } catch (parseError) {
        console.log("Direct JSON parse failed, trying to extract JSON...");
        // If direct parsing fails, try to extract JSON from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log("Found JSON match:", jsonMatch[0]);
          try {
            finalJson = JSON.parse(jsonMatch[0]);
          } catch (secondParseError) {
            console.error("Failed to parse extracted JSON:", secondParseError);
            throw new Error("Invalid JSON response from AI: " + responseContent);
          }
        } else {
          console.error("No JSON pattern found in response:", responseContent);
          throw new Error("No valid JSON found in AI response: " + responseContent);
        }
      }
    } else {
      throw new Error("No response content from AI");
    }

    // 6️⃣ Clean up uploaded file
    try {
      await client.files.delete(fileUpload.id);
      console.log("File cleaned up:", fileUpload.id);
    } catch (cleanupError) {
      console.warn("Failed to cleanup file:", cleanupError);
    }

    return {
      success: true,
      data: finalJson,
      filename: fileName,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process PDF",
    };
  }
};