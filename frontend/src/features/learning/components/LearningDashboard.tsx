import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LearningDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weak Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-surface-400">
              No skill gaps identified yet. Complete an assessment to get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RecommendedLabs />
        <MentorChat />
      </div>
    </div>
  );
}

function RecommendedLabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Labs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-surface-400">
          No labs recommended yet. Complete an assessment to get lab recommendations.
        </p>
      </CardContent>
    </Card>
  );
}

function MentorChat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Mentor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 flex items-center justify-center py-8">
          <p className="text-sm text-surface-400 text-center">
            Start a conversation with your AI mentor. Complete an assessment first to get personalized guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your mentor..."
            className="flex-1 rounded-lg border border-surface-600 bg-surface-800 px-3 py-1.5 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            type="button"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
