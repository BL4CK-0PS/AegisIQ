import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Capability {
  name: string;
  weight: number;
}

interface ParseResultProps {
  result: {
    role: string;
    skills: string[];
    capabilities: Capability[];
    experience: string;
    certifications: string[];
  };
}

export function ParseResult({ result }: ParseResultProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs text-surface-500">Role Title</p>
          <p className="text-sm font-medium text-surface-200">{result.role}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-surface-500">Experience</p>
          <p className="text-sm text-surface-300">{result.experience}</p>
        </div>
        <div>
          <p className="mb-2 text-xs text-surface-500">Skills</p>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((skill) => (
              <Badge key={skill} variant="primary">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-surface-500">Capabilities</p>
          <div className="space-y-2">
            {result.capabilities.map((cap) => (
              <div key={cap.name} className="flex items-center justify-between">
                <span className="text-sm text-surface-300">{cap.name}</span>
                <span className="text-sm font-medium text-primary-400">
                  {Math.round(cap.weight * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-surface-500">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {result.certifications.map((cert) => (
              <Badge key={cert} variant="warning">{cert}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
