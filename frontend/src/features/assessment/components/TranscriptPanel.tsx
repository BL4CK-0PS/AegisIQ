import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface TranscriptPanelProps {
  transcript: string;
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-sm">Transcript</CardTitle>
      </CardHeader>
      <div className="min-h-[200px] rounded-lg bg-surface-800/50 p-4">
        {transcript ? (
          <p className="text-sm text-surface-300 whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-sm text-surface-600 italic">
            Your response transcript will appear here...
          </p>
        )}
      </div>
    </Card>
  );
}
