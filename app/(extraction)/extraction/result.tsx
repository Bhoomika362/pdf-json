"use client";
 
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
 
export default function ResultsPage() {
  const router = useRouter();
  const [convertedData, setConvertedData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
 
    // Get data from sessionStorage (passed from the main page)
    const storedData = sessionStorage.getItem("extractionResult");
    const storedFile = sessionStorage.getItem("extractionFile");
 
    if (storedData && storedFile) {
      try {
        setConvertedData(JSON.parse(storedData));
        const fileInfo = JSON.parse(storedFile);
        setFileName(fileInfo.name);
        setFileSize(fileInfo.size);
        setFileUrl(fileInfo.url || "");
       
        // Debug logging
        console.log("File info:", fileInfo);
        console.log("File URL:", fileInfo.url);
      } catch (error) {
        console.error("Error parsing stored data:", error);
        // If there's an error, redirect back to extraction page
        router.push("/extraction");
      }
    } else {
      // If no data, redirect back to extraction page
      router.push("/extraction");
    }
  }, [router]);
 
  const downloadJSON = () => {
    if (!convertedData || !isClient) return;
 
    const dataStr = JSON.stringify(convertedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(".pdf", "")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
 
  const copyToClipboard = () => {
    if (!convertedData || !isClient) return;
    navigator.clipboard.writeText(JSON.stringify(convertedData, null, 2));
    toast.success("JSON copied to clipboard!");
  };
 
  const goBack = () => {
    // Clear the stored data and revoke blob URL
    sessionStorage.removeItem("extractionResult");
    sessionStorage.removeItem("extractionFile");
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    router.push("/extraction");
  };
 
  const handlePdfError = () => {
    console.log("PDF failed to load in iframe");
    setPdfLoadError(true);
  };
 
  if (!isClient || !convertedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Upload</span>
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Conversion Results
                </h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
              <Button onClick={downloadJSON} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </div>
        </div>
      </div>
 
      {/* Two Screen Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Uploaded File */}
          <div className="flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Uploaded File</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex-1 flex flex-col">
                  {/* File Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-500">
                        {(fileSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
 
                  {/* PDF Preview */}
                  <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col">
                    {fileUrl && !pdfLoadError ? (
                      <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">
                            PDF Preview
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Open PDF
                          </Button>
                        </div>
                        <div className="flex-1 p-4">
                          <iframe
                            src={fileUrl}
                            className="w-full h-full border-0"
                            title="PDF Preview"
                            style={{ minHeight: "400px" }}
                            onError={handlePdfError}
                            onLoad={() => console.log("PDF iframe loaded successfully")}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-2">PDF Document</p>
                        <p className="text-sm text-gray-500 mb-2">{fileName}</p>
                        <p className="text-xs text-gray-400 mb-4">
                          PDF preview not available
                        </p>
                        {fileUrl && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Open PDF in New Tab
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
 
          {/* Right Side - JSON Response */}
          <div className="flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>JSON Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex-1 flex flex-col">
                  <div className="bg-white rounded-lg p-4 flex-1 flex flex-col">
                    <pre className="text-sm text-gray-700 overflow-auto flex-1 whitespace-pre-wrap">
                      {JSON.stringify(convertedData, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}