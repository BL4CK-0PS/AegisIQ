import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { JobDescriptionUpload } from "@/components/forms/JobDescriptionUpload";
import { ParseResult } from "../components/ParseResult";
import { roleDefinitionService, type ParsedRoleDefinition } from "@/services/role-definition.service";

export default function JobDescriptionPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParsedRoleDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleDefinitionId, setRoleDefinitionId] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await roleDefinitionService.upload(file);
      setRoleDefinitionId(result.role_definition_id);
      const parsed = await roleDefinitionService.parse(result.role_definition_id);
      setParseResult(parsed);
    } catch {
      setError("API not configured yet. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateSkillDNA = async () => {
    setIsProcessing(true);
    try {
      if (roleDefinitionId) {
        await roleDefinitionService.get(roleDefinitionId);
      }
      navigate("/skill-dna-profile");
    } catch {
      setError("Failed to generate Skill DNA Profile.");
    } finally {
      setIsProcessing(false);
    }
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
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Upload Job Description</CardTitle>
              <CardDescription>
                PDF, DOCX, or TXT files are supported
              </CardDescription>
            </CardHeader>
            <JobDescriptionUpload onUpload={handleUpload} isLoading={isUploading} />
          </Card>

          {parseResult && (
            <ParseResult result={parseResult} />
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
              onClick={handleGenerateSkillDNA}
              isLoading={isProcessing}
              className="w-full"
              rightIcon={<ArrowRight size={16} />}
            >
              Generate Skill DNA Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
