"use server";

import OpenAI from "openai";
import { getUser } from "@/lib/db/queries";
import { landingExtractMarkdown } from "./landingExtraction";
import { Agent, Runner } from "@openai/agents";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const landingApiKey = process.env.LANDINGAI_API_KEY;

if (!landingApiKey) throw new Error("Missing LANDINGAI_API_KEY");

export const processPDFWithSchema = async (file: File, schema?: string) => {
  const user = await getUser();
  if (!user) throw new Error("User must be logged in");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Call LandingAI ADE to get markdown only
    const ade = await landingExtractMarkdown(fileBuffer, landingApiKey);

    const extractedMarkdown = ade.markdown || "";

    // Use OpenAI to map markdown to user schema (or generic JSON if schema missing)
    const schemaInstruction = schema && schema.trim().length > 0
      ? `Return ONLY JSON conforming to this JSON Schema (not an example):\n${schema}`
      : "Return ONLY a concise, structured JSON capturing key fields in the document.";

    //   const calculatorTool =({
    //     name : "Calculator",
    //     description : "perform basic arithmetic operations",
    //     input_schema: {
    //       type: `${extractedMarkdown}`,
    //       properties: {
    //         expression: { description: "Math expression to evaluate" }
    //       },
    //       required: ["expression"]
    //   }
    // });

      const agent = new Agent({
        model: "gpt-5-mini",
        name  : "Json Mapping agent",
        instructions : "You convert document markdown into structured JSON. Always return ONLY valid JSON, no extra text.",
        tools : [],
      })
      const runner = new Runner();
      const result = await runner.run(agent,[
        {
          role: "user",
          content : [
            {type : "input_text", text : `${schemaInstruction}\n\nDocument Markdown:\n${extractedMarkdown}`}
          ]
        }
      ]);

    const outputText = result.finalOutput ?? ""
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      throw new Error("OpenAI response was not valid JSON: " + outputText);
    }

    return { success: true, data: parsed, filename: file.name };
  } catch (error) {
    console.error("PDF processing error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
