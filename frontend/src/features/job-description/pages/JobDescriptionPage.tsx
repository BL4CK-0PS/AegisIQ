import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { JobDescriptionUpload } from "@/components/forms/JobDescriptionUpload";
import { ParseResult } from "../components/ParseResult";
import { roleDefinitionService, type SkillDNAParseResult } from "@/services/role-definition.service";

export default function JobDescriptionPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<SkillDNAParseResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setParseResult(null);
    setIsUploading(true);

    try {
      const text = await file.text();
      setIsUploading(false);
      setIsProcessing(true);

      const result = await roleDefinitionService.parseText(text, file.name);
      setParseResult(result);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to process job description. Please try again.");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setParseResult(null);
    setFileName("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Role Definition</h1>
        <p className="text-sm text-surface-400">
          Upload a job description to generate a tailored Skill DNA Profile
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {isProcessing ? (
            <Card variant="elevated">
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <LoadingSpinner size="md" />
                  <p className="text-sm text-surface-400">
                    Analyzing "{fileName}" — extracting capabilities and skills...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : parseResult ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-surface-500">Analyzed</p>
                  <p className="text-sm font-medium text-surface-200">{fileName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Parse Another
                </Button>
              </div>
              <ParseResult result={parseResult} />
            </>
          ) : (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Upload Job Description</CardTitle>
                  <CardDescription>
                    PDF, DOCX, or TXT files are supported
                  </CardDescription>
                </CardHeader>
              </Card>
              <JobDescriptionUpload onUpload={handleUpload} isLoading={isUploading} />
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Upload", desc: "Upload your job description file", icon: Upload },
                  { step: 2, title: "Extract", desc: "AI extracts capabilities and skills", icon: FileText },
                  { step: 3, title: "Generate", desc: "Create your Skill DNA Profile", icon: CheckCircle },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-900/30 text-sm font-bold text-primary-400">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-200">{item.title}</p>
                      <p className="text-xs text-surface-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {parseResult && (
            <Button
              onClick={() => navigate("/skill-dna-profile")}
              className="w-full"
              rightIcon={<ArrowRight size={16} />}
            >
              View Skill DNA Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
