"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUp, Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { processPDFWithSchema } from "./agent";

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedData, setConvertedData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [schemaString, setSchemaString] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 10MB are allowed.");
    }

    setFiles(validFiles);
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;

    if (schemaString.trim()) {
      try {
        JSON.parse(schemaString);
      } catch (err) {
        toast.error(
          "Invalid JSON schema. Please check the syntax and try again."
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      // Create PDF preview URL
      const pdfUrl = URL.createObjectURL(files[0]);
      setPdfPreviewUrl(pdfUrl);

      // Encode the PDF file as base64
      const encodedFile = await encodeFileAsBase64(files[0]);

      // Call the server action to process the PDF
      const result = await processPDFWithSchema(
        encodedFile,
        files[0].name,
        schemaString.trim() || undefined
      );

      if (result.success) {
        setConvertedData(result.data); // Store just the extracted data
        toast.success("PDF converted to JSON successfully!");
      } else {
        toast.error(result.error || "Failed to process PDF");
      }
    } catch (err) {
      console.error("PDF processing error:", err);
      toast.error("Failed to process PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setConvertedData(null);
    setSchemaString("");
    
    // Clean up PDF preview URL
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const downloadJSON = () => {
    if (!convertedData || !isClient) return;

    // The download will now contain just the clean data
    const dataStr = JSON.stringify(convertedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(".pdf", "")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              PDF to JSON Converter
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a PDF (e.g., invoice, bank statement, report). Provide a JSON
            schema describing the data you want. Our AI parses the PDF and maps
            extracted fields into your provided JSON schema blueprint.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Upload PDF</CardTitle>
            <CardDescription>
              Drag and drop your PDF file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileChange({
                    target: { files: e.dataTransfer.files },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-blue-600">
                      {files[0].name}
                    </span>
                  ) : (
                    <span>Drop your PDF here or click to browse</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>

              {/* Schema Input */}
              <div className="space-y-2">
                <label
                  htmlFor="schema"
                  className="text-sm font-medium text-gray-700"
                >
                  JSON Schema
                </label>
                <textarea
                  id="schema"
                  rows={6}
                  value={schemaString}
                  onChange={(e) => setSchemaString(e.target.value)}
                  placeholder='Enter your JSON schema blueprint here...&#10;&#10;Invoice Example:&#10;{&#10;  "type": "object",&#10;  "properties": {&#10;    "invoiceNumber": { "type": "string" },&#10;    "date": { "type": "string" },&#10;    "totalAmount": { "type": "number" },&#10;    "vendor": { "type": "string" },&#10;    "items": {&#10;      "type": "array",&#10;      "items": {&#10;        "type": "object",&#10;        "properties": {&#10;          "description": { "type": "string" },&#10;          "quantity": { "type": "number" },&#10;          "price": { "type": "number" }&#10;        }&#10;      }&#10;    }&#10;  }&#10;}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm font-mono"
                />
                <p className="text-xs text-gray-500">
                  Define the structure you want for your JSON output. The AI
                  will use this as a blueprint to extract and map PDF data.
                  Leave empty for default extraction.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={files.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Converting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Convert to JSON</span>
                    </span>
                  )}
                </Button>

                {files.length > 0 && (
                  <Button type="button" variant="outline" onClick={clearFiles}>
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Card */}
        {convertedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{files[0].name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {pdfPreviewUrl ? (
                    <iframe
                      src={pdfPreviewUrl}
                      className="w-full h-96 border-0"
                      title="PDF Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>PDF preview not available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Results Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Conversion Results</CardTitle>
                    
                  </div>
                  <Button
                    onClick={downloadJSON}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 overflow-auto max-h-96">
                    {JSON.stringify(convertedData, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
