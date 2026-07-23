import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, AlertTriangle, ShieldCheck, Target, Eye, Monitor, Mic, Maximize, AlertCircle, Shield, Copy, MousePointerClick, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";
import { assessmentService, type ResultsResponse, type ProctoringSummary } from "@/services/assessment.service";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function formatCriterionName(raw?: string): string {
  return (raw ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = Math.min((score / maxScore) * 100, 100);
  const color =
    pct >= 80 ? "bg-success-500" : pct >= 60 ? "bg-warning-500" : "bg-danger-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-700">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ProctoringSummaryCard({ summary }: { summary?: ProctoringSummary }) {
  const hasData = !!summary;

  const integrityScore = summary?.integrity_score ?? 100;
  const violationCount = summary?.violation_count ?? 0;
  const isClean = violationCount === 0;

  const integrityColor = isClean
    ? "text-success-400"
    : integrityScore >= 80
      ? "text-success-400"
      : integrityScore >= 50
        ? "text-warning-400"
        : "text-danger-400";

  const integrityBarColor = isClean
    ? "bg-success-400"
    : integrityScore >= 80
      ? "bg-success-400"
      : integrityScore >= 50
        ? "bg-warning-400"
        : "bg-danger-400";

  const stats = [
    { label: "Tab Switches", count: summary?.tab_switches ?? 0, icon: Monitor, active: (summary?.tab_switches ?? 0) > 0 },
    { label: "Fullscreen Exits", count: summary?.fullscreen_exits ?? 0, icon: Maximize, active: (summary?.fullscreen_exits ?? 0) > 0 },
    { label: "Screen Share Stops", count: summary?.screen_share_stops ?? 0, icon: Monitor, active: (summary?.screen_share_stops ?? 0) > 0 },
    { label: "Audio Anomalies", count: summary?.audio_anomalies ?? 0, icon: Mic, active: (summary?.audio_anomalies ?? 0) > 0 },
    { label: "Clipboard Attempts", count: summary?.clipboard_attempts ?? 0, icon: Copy, active: (summary?.clipboard_attempts ?? 0) > 0 },
    { label: "Context Menu Blocks", count: summary?.context_menu_blocks ?? 0, icon: MousePointerClick, active: (summary?.context_menu_blocks ?? 0) > 0 },
  ];

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye size={18} className="text-primary-400" />
              Proctoring & Anti-Cheat Summary
            </CardTitle>
            <CardDescription>Monitoring data recorded during the assessment session</CardDescription>
          </div>
          {summary?.cheating_risk_flagged && (
            <Badge variant="danger" size="md">
              <AlertCircle size={12} className="mr-1" />
              Risk Flagged
            </Badge>
          )}
          {!hasData && (
            <Badge variant="success" size="md">
              <CheckCircle2 size={12} className="mr-1" />
              Clean
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <div>
            <p className={cn("text-3xl font-bold", integrityColor)}>
              {integrityScore}%
            </p>
            <p className="text-xs text-surface-500">Integrity Score</p>
          </div>
          <div className="flex-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-700">
              <div
                className={cn("h-full rounded-full transition-all", integrityBarColor)}
                style={{ width: `${integrityScore}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-surface-200">
              {isClean ? (
                <span className="text-success-400">No Violations</span>
              ) : (
                <>{violationCount} violation{violationCount !== 1 ? "s" : ""}</>
              )}
            </p>
            <p className="text-xs text-surface-500">Total violations</p>
          </div>
        </div>

        {isClean && (
          <div className="rounded-lg border border-success-700/30 bg-success-900/10 p-4 text-center">
            <Shield size={20} className="mx-auto mb-2 text-success-400" />
            <p className="text-sm font-medium text-success-400">
              No Anti-Cheat Violations Detected
            </p>
            <p className="mt-1 text-xs text-surface-400">
              100% Integrity — Assessment completed with full compliance
            </p>
          </div>
        )}

        {!isClean && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className={cn(
                  "rounded-lg border p-3 text-center",
                  s.active ? "border-danger-700/50 bg-danger-900/10" : "border-surface-700/50 bg-surface-800/50",
                )}
              >
                <s.icon size={14} className={cn("mx-auto mb-1", s.active ? "text-danger-400" : "text-surface-500")} />
                <p className="text-lg font-bold text-surface-100">{s.count}</p>
                <p className="text-[10px] text-surface-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 rounded-lg border border-surface-700/50 bg-surface-800/50 p-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            summary?.voice_enabled ? "bg-success-900/20" : "bg-surface-700/50",
          )}>
            <Mic size={14} className={summary?.voice_enabled ? "text-success-400" : "text-surface-500"} />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-200">Voice / Audio Input</p>
            <p className="text-xs text-surface-500">
              {summary?.voice_enabled
                ? "Mic active — voice dictation was used during assessment"
                : "No voice input recorded — text-only responses"}
            </p>
          </div>
        </div>

        {hasData && (summary?.violations ?? []).length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-surface-400">Violation Log</p>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-surface-700/50 p-2">
              {(summary?.violations ?? []).map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-surface-300">{v.detail}</span>
                  <span className="text-surface-500">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<ResultsResponse>({
    queryKey: ["assessment-results", id],
    queryFn: () => assessmentService.getResults(id!),
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="No assessment selected"
          description="Navigate to an assessment to view its report"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-surface-500">Loading report...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<AlertTriangle className="h-8 w-8" />}
          title="Unable to load report"
          description="This assessment may not have been evaluated yet"
        />
      </div>
    );
  }

  const results = data.results ?? [];

  const avgScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.overall_score ?? 0), 0) / results.length
      : 0;

  const avgConfidence =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.confidence ?? 0), 0) / results.length
      : 0;

  const allDemonstrated = [...new Set(results.flatMap((r) => r.demonstrated_skills ?? []))];
  const allMissing = [...new Set(results.flatMap((r) => r.missing_concepts ?? []))];
  const allMitres = [...new Set(results.flatMap((r) => r.mitre_technique_ids ?? []))];

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      <div className="min-h-14">
        <h1 className="text-2xl font-bold text-surface-100 leading-tight">Assessment Report</h1>
        <p className="text-sm text-surface-400 mt-0.5">
          Evaluation results for assessment {id.slice(0, 8)}…
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="elevated">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
              <Target className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">{avgScore.toFixed(1)}</p>
              <p className="text-xs text-surface-500">Average Score</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-900/30">
              <ShieldCheck className="h-6 w-6 text-success-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">
                {(avgConfidence * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-surface-500">Confidence</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-900/30">
              <ClipboardCheck className="h-6 w-6 text-cyber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">{data.evaluation_count}</p>
              <p className="text-xs text-surface-500">Questions Evaluated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProctoringSummaryCard summary={data.proctoring_summary} />

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Evaluation Breakdown</CardTitle>
          <CardDescription>Score and confidence per evaluated question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.length === 0 ? (
            <p className="text-sm text-surface-500 py-4 text-center">No evaluation results yet</p>
          ) : results.map((r) => (
            <div key={r.id} className="rounded-lg border border-surface-700/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-surface-200">
                   Question {(r.id ?? "").slice(0, 8)}...
                 </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.passed
                      ? "bg-success-900/30 text-success-400"
                      : "bg-danger-900/30 text-danger-400"
                  }`}
                >
                  {r.proficiency_level}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>Score: {(r.overall_score ?? 0).toFixed(1)}</span>
                  <span>Confidence: {((r.confidence ?? 0) * 100).toFixed(0)}%</span>
                </div>
                <ScoreBar score={r.overall_score ?? 0} />
              </div>
              {r.overall_justification && (
                <p className="text-xs text-surface-500 italic">{r.overall_justification}</p>
              )}
              {(r.criteria_scores ?? []).length > 0 && (
                <div className="space-y-2">
                  {(r.criteria_scores ?? []).map((c, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-surface-300 font-medium">
                          {formatCriterionName(c.criterion_name)}
                        </span>
                        <span className="text-surface-400">
                          {c.score}/{c.max_score}
                        </span>
                      </div>
                      <ScoreBar score={c.score} maxScore={c.max_score} />
                      {c.justification && (
                        <p className="text-[11px] text-surface-500 italic">{c.justification}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Demonstrated Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {allDemonstrated.length === 0 ? (
              <p className="text-sm text-surface-500">None recorded</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allDemonstrated.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-success-900/20 px-3 py-1 text-xs text-success-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Missing Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            {allMissing.length === 0 ? (
              <p className="text-sm text-surface-500">None identified</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allMissing.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full bg-warning-900/20 px-3 py-1 text-xs text-warning-400"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>MITRE ATT&CK Mapping</CardTitle>
          <CardDescription>Techniques identified from evaluated responses</CardDescription>
        </CardHeader>
        <CardContent>
          {allMitres.length === 0 ? (
            <p className="text-sm text-surface-500 py-2 text-center">
              No MITRE techniques identified for this assessment
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allMitres.map((technique) => (
                <span
                  key={technique}
                  className="rounded bg-cyber-900/20 px-2 py-1 font-mono text-xs text-cyber-400"
                >
                  {technique}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </ErrorBoundary>
  );
}
