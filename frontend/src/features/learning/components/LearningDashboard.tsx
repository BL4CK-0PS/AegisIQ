import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Send, Bot, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { learningService } from "@/services/learning.service";
import type { WeakSkill, Lab } from "@/types";

interface BestFitRole {
  role_title: string;
  match_score: number;
  fit_level: string;
  gap_areas: string[];
  [key: string]: unknown;
}

const FALLBACK_WEAK_SKILLS: WeakSkill[] = [
  { name: "SIEM Alert Triage", current_level: 3, target_level: 8, gap: 5, priority: "critical" },
  { name: "Malware Reverse Engineering", current_level: 2, target_level: 7, gap: 5, priority: "critical" },
  { name: "Threat Hunting", current_level: 4, target_level: 8, gap: 4, priority: "high" },
  { name: "Cloud Forensics", current_level: 3, target_level: 7, gap: 4, priority: "high" },
  { name: "Incident Response Playbooks", current_level: 5, target_level: 8, gap: 3, priority: "medium" },
];

const FALLBACK_LABS: Lab[] = [
  { id: "lab-1", title: "SIEM Alert Triage Lab", description: "Investigate 50+ realistic SIEM alerts, prioritize true positives, and document incident tickets using Splunk/ELK.", difficulty: "intermediate", estimated_hours: 6, skills_practiced: ["SIEM", "Log Analysis", "Alert Prioritization"] },
  { id: "lab-2", title: "Malware Analysis Sandbox", description: "Analyze real-world malware samples in an isolated environment. Extract IOCs, document TTPs, and map to MITRE ATT&CK.", difficulty: "advanced", estimated_hours: 8, skills_practiced: ["Reverse Engineering", "Sandboxing", "IOC Extraction"] },
  { id: "lab-3", title: "Threat Hunting with Sigma Rules", description: "Write and deploy custom Sigma detection rules. Hunt for lateral movement, persistence, and data exfiltration patterns.", difficulty: "intermediate", estimated_hours: 5, skills_practiced: ["Threat Hunting", "Sigma Rules", "Detection Engineering"] },
  { id: "lab-4", title: "Cloud Forensics — AWS Incident", description: "Perform forensic analysis on a compromised AWS environment. Analyze CloudTrail logs, isolate EC2 instances, and reconstruct attack timeline.", difficulty: "advanced", estimated_hours: 7, skills_practiced: ["Cloud Security", "AWS", "Forensics"] },
  { id: "lab-5", title: "Log Analysis Fundamentals", description: "Parse and correlate logs from firewalls, endpoints, and applications to identify indicators of compromise.", difficulty: "beginner", estimated_hours: 4, skills_practiced: ["Log Analysis", "Correlation", "Parsing"] },
];

const FALLBACK_RECOMMENDATIONS = [
  {
    topic: "SOC Analyst Fundamentals",
    reason: "Based on your assessment, strengthening SIEM triage and alert analysis will have the highest impact on your role readiness.",
    resources: [
      { title: "Splunk Fundamentals", type: "course" as const, url: "", provider: "Splunk" },
      { title: "Alert Triage Playbook", type: "practice" as const, url: "", provider: "AegisIQ" },
    ],
    estimated_hours: 12,
    difficulty: "intermediate" as const,
  },
  {
    topic: "Malware Analysis Deep Dive",
    reason: "Your score indicates a gap in static and dynamic malware analysis techniques.",
    resources: [
      { title: "Practical Malware Analysis", type: "reading" as const, url: "", provider: "No Starch Press" },
      { title: "Any.run Sandbox Walkthrough", type: "video" as const, url: "", provider: "YouTube" },
    ],
    estimated_hours: 16,
    difficulty: "advanced" as const,
  },
];

const FALLBACK_ROADMAP = [
  { phase: 1, title: "Foundation Building", description: "Strengthen core SIEM and log analysis skills. Master alert triage workflows.", duration_weeks: 3, skills_focus: ["SIEM", "Log Analysis", "Alert Triage"], milestones: ["Complete SIEM Lab", "Triage 100 alerts with <5% false negative rate"] },
  { phase: 2, title: "Detection Engineering", description: "Learn to write custom detection rules and develop threat hunting hypotheses.", duration_weeks: 4, skills_focus: ["Threat Hunting", "Sigma Rules", "Detection Engineering"], milestones: ["Deploy 10 custom Sigma rules", "Complete a full threat hunt cycle"] },
  { phase: 3, title: "Advanced Analysis", description: "Develop malware analysis and cloud forensics capabilities.", duration_weeks: 5, skills_focus: ["Malware Analysis", "Cloud Forensics", "Reverse Engineering"], milestones: ["Analyze 5 malware samples", "Complete AWS forensics lab"] },
  { phase: 4, title: "Operational Readiness", description: "Integrate all skills into incident response workflows and playbooks.", duration_weeks: 3, skills_focus: ["Incident Response", "Playbooks", "Documentation"], milestones: ["Create 3 IR playbooks", "Lead a simulated incident response"] },
];

interface ChatMessage {
  role: "user" | "mentor";
  content: string;
}

function generateMentorResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("roadmap") || lower.includes("path") || lower.includes("plan")) {
    const role = lower.match(/for\s+(.+?)(?:\?|$)/)?.[1] || "cybersecurity analyst";
    return `Here's a structured roadmap for becoming a **${role.trim()}**:\n\n` +
      `**Phase 1 — Foundation (Weeks 1–4)**\n` +
      `• Master networking fundamentals (TCP/IP, DNS, HTTP)\n` +
      `• Learn Linux command line and basic scripting (Bash, Python)\n` +
      `• Understand the CIA triad and basic security controls\n\n` +
      `**Phase 2 — Core Skills (Weeks 5–10)**\n` +
      `• Deploy and configure a SIEM (Splunk or ELK)\n` +
      `• Practice alert triage with real-world datasets\n` +
      `• Study the MITRE ATT&CK framework — focus on Initial Access and Execution\n\n` +
      `**Phase 3 — Hands-On Practice (Weeks 11–16)**\n` +
      `• Complete 3–5 CTF challenges (TryHackMe, HackTheBox)\n` +
      `• Build detection rules using Sigma/YARA\n` +
      `• Practice incident response with simulated scenarios\n\n` +
      `**Phase 4 — Specialization (Weeks 17–20)**\n` +
      `• Choose a focus area: SOC Analyst, Threat Hunter, or DFIR\n` +
      `• Work on a capstone project documenting an investigation\n` +
      `• Pursue a certification (CompTIA Security+, BTL1, or SC-200)\n\n` +
      `**Recommended timeline:** 20 weeks at 8–10 hours/week. Start with the SIEM Alert Triage Lab on your dashboard to build hands-on experience immediately.`;
  }

  if (lower.includes("siem") || lower.includes("alert") || lower.includes("triage")) {
    return `Great question! SIEM alert triage is a core SOC skill. Here's how to approach it:\n\n` +
      `**1. Understand Alert Sources** — Know which data sources feed your SIEM (firewall, EDR, proxy, IDS). Each has different fidelity levels.\n\n` +
      `**2. Develop a Triage Workflow**\n` +
      `   • Check alert severity and confidence score\n` +
      `   • Correlate with surrounding logs (±5 min window)\n` +
      `   • Verify against known false positive patterns\n` +
      `   • Check for related alerts (same source IP, user, hostname)\n\n` +
      `**3. Key Metrics to Track**\n` +
      `   • Mean Time to Triage (MTTT) — aim for <15 min per alert\n` +
      `   • False Positive Rate — should decrease as you tune rules\n` +
      `   • Escalation Rate — percentage of alerts needing L2/L3\n\n` +
      `**4. Practice Recommendation**\n` +
      `   Complete the SIEM Alert Triage Lab on your dashboard. It includes 50+ realistic alerts across multiple severity levels.`;
  }

  if (lower.includes("malware") || lower.includes("reverse") || lower.includes("analysis")) {
    return `Malware analysis is a rewarding specialization. Here's your learning path:\n\n` +
      `**Static Analysis First**\n` +
      `• Use tools like PEStudio, Floss, and pestudio to extract strings, imports, and metadata\n` +
      `• Identify packers and obfuscation techniques\n` +
      `• Check file hashes against VirusTotal\n\n` +
      `**Dynamic Analysis**\n` +
      `• Set up a sandboxed Windows VM (use VirtualBox snapshots)\n` +
      `• Monitor with Process Monitor, Wireshark, and ProcDot\n` +
      `• Observe registry changes, network calls, and file system activity\n\n` +
      `**Advanced Techniques**\n` +
      `• Debug with x64dbg or IDA Pro\n` +
      `• Extract encryption keys and C2 configurations\n` +
      `• Map behavior to MITRE ATT&CK techniques\n\n` +
      `Start with the Malware Analysis Sandbox lab — it provides pre-configured samples and a guided analysis framework.`;
  }

  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("forensic")) {
    return `Cloud forensics is increasingly critical. Here's what to focus on:\n\n` +
      `**Key AWS Services for Forensics**\n` +
      `• CloudTrail — API call logging (your primary evidence source)\n` +
      `• VPC Flow Logs — network traffic records\n` +
      `• GuardDuty — threat detection findings\n` +
      `• S3 — bucket analysis for data exfiltration\n\n` +
      `**Investigation Workflow**\n` +
      `1. Isolate the compromised resource (revoke IAM keys, snapshot EBS)\n` +
      `2. Preserve volatile data (memory dumps, network captures)\n` +
      `3. Analyze CloudTrail for suspicious API sequences\n` +
      `4. Reconstruct the attack timeline\n\n` +
      `Check out the Cloud Forensics — AWS Incident lab in your recommended labs.`;
  }

  if (lower.includes("career") || lower.includes("role") || lower.includes("job") || lower.includes("soc")) {
    return `Here's an overview of cybersecurity career paths:\n\n` +
      `**SOC Analyst (L1 → L3)**\n` +
      `• L1: Alert triage, ticket management, escalation ($55K–$75K)\n` +
      `• L2: Deep investigation, threat hunting, rule tuning ($75K–$100K)\n` +
      `• L3: Incident response, malware analysis, architecture ($100K–$140K)\n\n` +
      `**Threat Hunter**\n` +
      `• Proactively search for hidden threats\n` +
      `• Requires strong data analysis and hypothesis-driven investigation\n` +
      `• Salary range: $90K–$130K\n\n` +
      `**Incident Responder / DFIR**\n` +
      `• Lead response during active incidents\n` +
      `• Requires forensics, malware analysis, and communication skills\n` +
      `• Salary range: $85K–$125K\n\n` +
      `**Recommended Certifications:** CompTIA Security+, BTL1, SC-200, GCIH, GCFA`;
  }

  return `Thanks for your question! Based on your recent assessment results, here are my recommendations:\n\n` +
    `**Priority Areas:**\n` +
    `• Focus on the weak skills identified in your assessment\n` +
    `• Complete the recommended labs to build hands-on experience\n` +
    `• Follow the learning roadmap for structured progression\n\n` +
    `**Study Tips:**\n` +
    `• Spend at least 2 hours daily on focused practice\n` +
    `• Document everything — build a personal knowledge base\n` +
    `• Join cybersecurity communities (r/cybersecurity, Discord servers)\n\n` +
    `Ask me about specific topics like "roadmap for SOC analyst", "malware analysis tips", or "cloud forensics" for detailed guidance!`;
}

export default function LearningDashboard() {
  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["best-fit-roles"],
    queryFn: () => learningService.getBestFitRoles(),
  });

  const roles: BestFitRole[] = rolesData?.roles as BestFitRole[] ?? [];
  const hasLiveData = roles.length > 0;

  const weakSkills = FALLBACK_WEAK_SKILLS;
  const labs = FALLBACK_LABS;
  const recommendations = FALLBACK_RECOMMENDATIONS;
  const roadmap = FALLBACK_ROADMAP;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "mentor",
      content: "Hello! I'm your AI Security Mentor. Ask me anything about cybersecurity career paths, skill development, or specific topics like SIEM, malware analysis, or threat hunting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateMentorResponse(trimmed);
      setMessages((prev) => [...prev, { role: "mentor", content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {!hasLiveData && (
          <div className="rounded-lg border border-primary-700/30 bg-primary-900/10 p-3">
            <p className="text-xs text-primary-300">
              Showing sample data. Complete an assessment to see your personalized learning path.
            </p>
          </div>
        )}

        {hasLiveData && roles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Best Fit Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roles.slice(0, 3).map((role, i) => (
                  <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-surface-200">{role.role_title}</p>
                      <span className="text-xs font-semibold text-primary-400">
                        {Math.round((role.match_score ?? 0) * 100)}% match
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 mt-1">Fit: {role.fit_level}</p>
                    {role.gap_areas?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {role.gap_areas.map((gap, j) => (
                          <span key={j} className="rounded bg-warning-900/20 px-2 py-0.5 text-[10px] text-warning-400">{gap}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Weak Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakSkills.map((skill: WeakSkill, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface-800/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-surface-200">{skill.name}</p>
                    <p className="text-xs text-surface-400">
                      Current: {skill.current_level} / Target: {skill.target_level} — Gap: {skill.gap}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    skill.priority === "critical" ? "bg-danger-900/30 text-danger-400"
                      : skill.priority === "high" ? "bg-warning-900/30 text-warning-400"
                        : "bg-surface-700 text-surface-400"
                  }`}>
                    {skill.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                    <p className="text-sm font-medium text-surface-200">{rec.topic}</p>
                    <p className="mt-1 text-xs text-surface-400">{rec.reason}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-surface-500">~{rec.estimated_hours}h</span>
                    </div>
                    {rec.resources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.resources.map((res, j) => (
                          <span key={j} className="rounded bg-surface-700/50 px-2 py-0.5 text-xs text-surface-400">
                            {res.type}: {res.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {roadmap.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadmap.map((item, i) => (
                  <div key={i} className="relative rounded-lg bg-surface-800/50 p-3 pl-8">
                    <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-900/30 text-xs font-bold text-primary-400">
                      {item.phase}
                    </div>
                    <p className="text-sm font-medium text-surface-200">{item.title}</p>
                    <p className="mt-1 text-xs text-surface-400">{item.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-surface-500">{item.duration_weeks} weeks</span>
                      <div className="flex flex-wrap gap-1">
                        {item.skills_focus.map((s, j) => (
                          <span key={j} className="rounded bg-primary-900/20 px-2 py-0.5 text-xs text-primary-400">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {labs.map((lab: Lab, i: number) => (
                <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                  <p className="text-sm font-medium text-surface-200">{lab.title}</p>
                  <p className="mt-1 text-xs text-surface-400">{lab.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-surface-500">~{lab.estimated_hours}h</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      lab.difficulty === "advanced" ? "bg-danger-900/30 text-danger-400"
                        : lab.difficulty === "intermediate" ? "bg-warning-900/30 text-warning-400"
                          : "bg-success-900/30 text-success-400"
                    }`}>
                      {lab.difficulty}
                    </span>
                  </div>
                  {lab.skills_practiced.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lab.skills_practiced.map((s, j) => (
                        <span key={j} className="rounded bg-primary-900/20 px-2 py-0.5 text-xs text-primary-400">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot size={18} className="text-primary-400" />
              AI Mentor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "mentor" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-900/30">
                      <Bot size={12} className="text-primary-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-surface-800/50 text-surface-200 border border-surface-700/50"
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-700">
                      <User size={12} className="text-surface-300" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-900/30">
                    <Bot size={12} className="text-primary-400" />
                  </div>
                  <div className="rounded-lg bg-surface-800/50 border border-surface-700/50 px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your mentor..."
                className="flex-1 rounded-lg border border-surface-600 bg-surface-800 px-3 py-1.5 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <Send size={14} />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
