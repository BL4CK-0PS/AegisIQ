import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReportSummary from "../ReportSummary";

const highScoreReport = {
  overall_score: 85,
  confidence: 0.92,
  summary: "Strong cybersecurity fundamentals with room for growth in threat hunting.",
  capability_scores: [
    { name: "Incident Response", score: 9, max_score: 10, confidence: 0.95, category: "technical" },
  ],
  strengths: ["Deep knowledge of incident response procedures", "Excellent threat detection skills"],
  weaknesses: ["Limited experience with advanced persistent threats"],
};

const midScoreReport = {
  overall_score: 65,
  confidence: 0.78,
  summary: "Adequate baseline with significant gaps.",
  capability_scores: [],
  strengths: ["Good foundational knowledge"],
  weaknesses: ["Insufficient hands-on experience", "Weak in malware analysis"],
};

const lowScoreReport = {
  overall_score: 40,
  confidence: 0.65,
  summary: "Needs substantial improvement.",
  capability_scores: [],
  strengths: [],
  weaknesses: ["Lacks core security concepts"],
};

describe("ReportSummary", () => {
  it("renders the executive summary text", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText(highScoreReport.summary)).toBeInTheDocument();
  });

  it("renders the overall score", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("renders the confidence percentage", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("Confidence: 92%")).toBeInTheDocument();
  });

  it("renders strengths section with correct items", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("Strengths")).toBeInTheDocument();
    expect(
      screen.getByText("Deep knowledge of incident response procedures"),
    ).toBeInTheDocument();
    expect(screen.getByText("Excellent threat detection skills")).toBeInTheDocument();
  });

  it("renders weaknesses section with correct items", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("Weaknesses")).toBeInTheDocument();
    expect(
      screen.getByText("Limited experience with advanced persistent threats"),
    ).toBeInTheDocument();
  });

  it("renders 'Strong' and 'Weak' badges for each item", () => {
    render(<ReportSummary report={highScoreReport} />);
    const strongBadges = screen.getAllByText("Strong");
    const weakBadges = screen.getAllByText("Weak");
    expect(strongBadges).toHaveLength(2);
    expect(weakBadges).toHaveLength(1);
  });

  it("shows correct score color for high scores (>=80)", () => {
    render(<ReportSummary report={highScoreReport} />);
    const scoreEl = screen.getByText("85");
    expect(scoreEl.className).toContain("text-green-600");
  });

  it("shows correct score color for mid scores (60-79)", () => {
    render(<ReportSummary report={midScoreReport} />);
    const scoreEl = screen.getByText("65");
    expect(scoreEl.className).toContain("text-yellow-600");
  });

  it("shows correct score color for low scores (<60)", () => {
    render(<ReportSummary report={lowScoreReport} />);
    const scoreEl = screen.getByText("40");
    expect(scoreEl.className).toContain("text-red-600");
  });

  it("handles empty strengths and weaknesses", () => {
    render(<ReportSummary report={lowScoreReport} />);
    expect(screen.getByText("Strengths")).toBeInTheDocument();
    expect(screen.getByText("Weaknesses")).toBeInTheDocument();
    expect(screen.getByText("Lacks core security concepts")).toBeInTheDocument();
  });

  it("renders the overall score label", () => {
    render(<ReportSummary report={highScoreReport} />);
    expect(screen.getByText("Overall Score")).toBeInTheDocument();
  });
});
