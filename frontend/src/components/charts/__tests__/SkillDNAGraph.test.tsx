import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("recharts", () => ({
  RadarChart: ({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => (
    <div data-testid="radar-chart" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  Radar: ({ name }: { name?: string }) => (
    <div data-testid={`radar-${name?.toLowerCase().replace(/\s/g, "-") ?? "unknown"}`} />
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

import { SkillDNAGraph } from "../SkillDNAGraph";

const sampleCapabilities = [
  { name: "Incident Response", score: 85, benchmark: 70 },
  { name: "Threat Hunting", score: 60, benchmark: 75 },
  { name: "Malware Analysis", score: 90, benchmark: 80 },
];

describe("SkillDNAGraph", () => {
  it("renders the chart title", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} />);
    expect(screen.getByText("Skill DNA Graph")).toBeInTheDocument();
  });

  it("renders a radar chart with correct data", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} />);
    const chart = screen.getByTestId("radar-chart");
    const data = JSON.parse(chart.getAttribute("data-props")!).data;
    expect(data).toHaveLength(3);
    expect(data[0]).toEqual({ name: "Incident Response", score: 85, benchmark: 70 });
    expect(data[1]).toEqual({ name: "Threat Hunting", score: 60, benchmark: 75 });
    expect(data[2]).toEqual({ name: "Malware Analysis", score: 90, benchmark: 80 });
  });

  it("always renders the 'Your Score' radar", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} />);
    expect(screen.getByTestId("radar-your-score")).toBeInTheDocument();
  });

  it("hides benchmark radar when showBenchmark is false (default)", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} />);
    expect(screen.queryByTestId("radar-benchmark")).not.toBeInTheDocument();
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("shows benchmark radar and legend when showBenchmark is true", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} showBenchmark />);
    expect(screen.getByTestId("radar-benchmark")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("uses default benchmark of 70 when benchmark is not provided", () => {
    const capsNoBenchmark = [
      { name: "Forensics", score: 50 },
    ];
    render(<SkillDNAGraph capabilities={capsNoBenchmark} />);
    const chart = screen.getByTestId("radar-chart");
    const data = JSON.parse(chart.getAttribute("data-props")!).data;
    expect(data[0].benchmark).toBe(70);
  });

  it("renders grid, axes, and tooltip", () => {
    render(<SkillDNAGraph capabilities={sampleCapabilities} />);
    expect(screen.getByTestId("polar-grid")).toBeInTheDocument();
    expect(screen.getByTestId("polar-angle-axis")).toBeInTheDocument();
    expect(screen.getByTestId("polar-radius-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("handles empty capabilities array", () => {
    render(<SkillDNAGraph capabilities={[]} />);
    expect(screen.getByText("Skill DNA Graph")).toBeInTheDocument();
    const chart = screen.getByTestId("radar-chart");
    const data = JSON.parse(chart.getAttribute("data-props")!).data;
    expect(data).toHaveLength(0);
  });
});
