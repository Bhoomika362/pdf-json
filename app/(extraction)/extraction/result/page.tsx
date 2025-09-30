"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResultPage() {
  const [extractionData, setExtractionData] = useState<any>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const storedData = sessionStorage.getItem('extractionResult');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setExtractionData(parsed.data);
      setFileName(parsed.fileName);
      setPdfPreviewUrl(parsed.pdfUrl);
    } else {
      router.push('/extraction');
    }
  }, [router]);

  const downloadJSON = () => {
    if (!extractionData || !isClient) return;

    const dataStr = JSON.stringify(extractionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(".pdf", "")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    // Clean up PDF URL
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    sessionStorage.removeItem('extractionResult');
    router.push('/extraction');
  };

  if (!isClient || !extractionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>New Extraction</span>
          </Button>
          <Button
            onClick={downloadJSON}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </Button>
        </div>

        {/* Two-Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-150px)]">
          {/* Left Section - PDF Preview */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{fileName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-full">
                {pdfPreviewUrl ? (
                  <iframe
                    src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>PDF preview not available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Section - JSON Result */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl">Extraction Results</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="bg-gray-50 rounded-lg p-4 h-full overflow-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(extractionData, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
