import { Card } from '@/components/ui/Card';
import { Brain, Lightbulb, Target } from 'lucide-react';

interface CapabilityScore {
  name: string;
  score: number;
  max_score: number;
  confidence: number;
  category: string;
}

interface Report {
  overall_score: number;
  confidence: number;
  summary: string;
  capability_scores: CapabilityScore[];
  strengths: string[];
  weaknesses: string[];
}

interface MentorFeedbackProps {
  report: Report;
}

export default function MentorFeedback({ report }: MentorFeedbackProps) {
  const topStrengths = report.strengths.slice(0, 2);

  const improvementTips = report.weaknesses.map((weakness) => {
    if (weakness.toLowerCase().includes('network') || weakness.toLowerCase().includes('segmentation')) {
      return {
        weakness,
        tip: 'Consider implementing micro-segmentation starting with your most critical assets. Document the network topology and create a phased rollout plan.',
      };
    }
    if (weakness.toLowerCase().includes('detection') || weakness.toLowerCase().includes('threat')) {
      return {
        weakness,
        tip: 'Enhance detection by deploying behavioral analytics alongside signature-based rules. Establish baseline behaviors for critical systems first.',
      };
    }
    if (weakness.toLowerCase().includes('patch') || weakness.toLowerCase().includes('update')) {
      return {
        weakness,
        tip: 'Implement automated patch management with staging environments. Prioritize internet-facing systems and critical vulnerabilities.',
      };
    }
    if (weakness.toLowerCase().includes('redundancy') || weakness.toLowerCase().includes('monitoring')) {
      return {
        weakness,
        tip: 'Deploy redundant monitoring systems with automatic failover. Consider cloud-based SIEM as a backup to on-premises solutions.',
      };
    }
    return {
      weakness,
      tip: 'Develop a targeted improvement plan with measurable milestones and assign ownership to a specific team member.',
    };
  });

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Mentor Feedback</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-semibold">Build on Your Strengths</h3>
          </div>
          <div className="space-y-2">
            {topStrengths.map((strength, index) => (
              <div
                key={index}
                className="rounded-md border border-green-200 bg-green-50 p-3"
              >
                <p className="text-sm text-green-800">{strength}</p>
                <p className="mt-1 text-xs text-green-600">
                  Continue documenting and refining these processes. Share best practices
                  across other capability areas.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <h3 className="text-sm font-semibold">Improvement Tips</h3>
          </div>
          <div className="space-y-3">
            {improvementTips.map((item, index) => (
              <div
                key={index}
                className="rounded-md border border-yellow-200 bg-yellow-50 p-3"
              >
                <p className="mb-1 text-sm font-medium text-yellow-800">
                  {item.weakness}
                </p>
                <p className="text-xs text-yellow-700">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Recommended Next Steps</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Prioritize addressing the highest-scoring weakness first</li>
            <li>Assign dedicated resources to each improvement area</li>
            <li>Establish a 30-60-90 day review cycle to track progress</li>
            <li>Schedule a follow-up assessment after implementing changes</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}
