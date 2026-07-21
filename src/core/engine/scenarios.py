from __future__ import annotations

import logging
import uuid
from typing import Any, Optional

from pydantic import BaseModel, Field

from src.core.knowledge.seed_data import SEED_MITRE_TECHNIQUES
from src.core.knowledge.taxonomy import (
    MitreTechnique,
    ProficiencyLevel,
)

logger = logging.getLogger(__name__)


class IncidentDetails(BaseModel):
    initial_access_vector: str
    indicators: list[str] = Field(default_factory=list)
    affected_systems: list[str] = Field(default_factory=list)
    timeline_estimate: str = "30-60 minutes"


class IncidentScenario(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str
    summary: str
    mitre_technique_id: str
    mitre_technique_name: str
    tactic_name: str = ""
    difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    incident_details: IncidentDetails = Field(default_factory=IncidentDetails)
    candidate_tasks: list[str] = Field(default_factory=list)
    evaluation_criteria: list[str] = Field(default_factory=list)


class ThreatHuntingScenario(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str
    hypothesis: str
    mitre_technique_ids: list[str] = Field(default_factory=list)
    data_sources: list[str] = Field(default_factory=list)
    hunting_steps: list[str] = Field(default_factory=list)
    expected_findings: list[str] = Field(default_factory=list)
    difficulty: ProficiencyLevel = ProficiencyLevel.ADVANCED


class ScenarioGeneratorError(Exception):
    """Raised when scenario generation fails."""


TEMPLATE_POOL: dict[str, dict[str, Any]] = {
    "T1190": {
        "title": "Web Application Exploitation Incident",
        "summary": (
            "A critical vulnerability (CVE-2024-XXXX) has been identified in the "
            "externally facing web application server. Indicators suggest an attacker "
            "has exploited an unpatched remote code execution vulnerability to gain "
            "initial access to the corporate web server. The WAF logged anomalous "
            "POST requests to the file upload endpoint, and a reverse shell was "
            "established from the web server to an external IP address."
        ),
        "initial_access": (
            "Exploitation of an unpatched RCE vulnerability in the public-facing "
            "web application via crafted HTTP POST request"
        ),
        "indicators": [
            "Anomalous POST requests to /upload endpoint with encoded payloads",
            "Outbound connection from web server to 203.0.113.45:4443",
            "New system account created on the web server",
            "Web server process spawning cmd.exe / powershell.exe",
            "Base64-encoded commands in web access logs",
        ],
        "affected_systems": [
            "Public-facing web server (DMZ)",
            "Internal Active Directory",
        ],
        "tasks": [
            "Describe your immediate triage steps upon receiving the alert",
            "Explain how you would contain the compromised web server without losing forensic evidence",
            "Detail the forensic artifacts you would collect from the web server",
            "Describe how you would determine if lateral movement occurred",
            "Outline the remediation steps to prevent a recurrence",
        ],
        "criteria": [
            "Correctly identifies the initial access vector (exploit of public-facing app)",
            "Describes network containment isolating the DMZ segment",
            "Lists relevant forensic artifacts (memory dump, web logs, process history)",
            "Articulates a clear containment-eradication-recovery sequence",
            "References relevant MITRE mappings",
        ],
    },
    "T1486": {
        "title": "Ransomware Outbreak Response",
        "summary": (
            "Multiple employees report that their files have been renamed with a "
            ".encrypted extension and ransom notes have appeared on their desktops. "
            "The ransom note demands payment in Bitcoin and threatens to publish "
            "exfiltrated data. Initial analysis indicates the encryption started on "
            "a single workstation and propagated to network shares within minutes. "
            "Critical business databases and file servers are affected."
        ),
        "initial_access": (
            "Likely phishing email delivering a malicious macro or exploit kit, "
            "or exploitation of an unpatched vulnerability"
        ),
        "indicators": [
            "Mass file rename events (.encrypted extension)",
            "Ransom note files (README_TO_DECRYPT.txt) on multiple systems",
            "Process tree showing encryptor binary execution",
            "SMB connections from patient-zero to file servers",
            "Shadow copy deletion events (vssadmin.exe)",
        ],
        "affected_systems": [
            "End-user workstations",
            "File servers (multiple shared drives)",
            "Database servers",
            "Backup infrastructure",
        ],
        "tasks": [
            "Describe your immediate triage and severity assessment process",
            "Explain your containment strategy to stop the encryption spread",
            "Detail how you would determine the initial infection vector",
            "Describe your approach to recovery and restoration",
            "Explain what forensic evidence you would preserve for law enforcement",
        ],
        "criteria": [
            "Demonstrates awareness of ransomware kill-chain",
            "Prioritises containment over eradication",
            "Identifies the need to preserve forensic evidence before recovery",
            "Articulates backup restoration procedures",
            "References NIST IR lifecycle phases",
        ],
    },
    "T1566": {
        "title": "Spear-Phishing Campaign Investigation",
        "summary": (
            "The SOC has detected a targeted spear-phishing campaign against the "
            "finance department. Multiple executives received emails appearing to "
            "be from the CFO requesting urgent wire transfers. The emails contain "
            "a malicious attachment disguised as an invoice PDF that executes a "
            "DLL side-loading attack to establish C2 communication."
        ),
        "initial_access": (
            "Spear-phishing email with malicious attachment sent to targeted "
            "executives in the finance department"
        ),
        "indicators": [
            "Emails with spoofed CFO display name and lookalike domain",
            "Attachment named 'Invoice_AP_July2024.pdf.exe'",
            "DNS queries to suspicious domains from finance workstations",
            "DLL side-loading via legitimate signed binary",
            "Beaconing traffic to 198.51.100.23 on TCP 8443",
        ],
        "affected_systems": ["Finance department workstations", "Email gateway"],
        "tasks": [
            "Describe how you would investigate the email gateway logs",
            "Explain your approach to identifying all affected users",
            "Detail the steps to remove the threat from compromised workstations",
            "Describe how you would search for additional C2 infrastructure",
            "Outline the user awareness and prevention measures to implement",
        ],
        "criteria": [
            "Articulates email header analysis techniques",
            "Describes endpoint detection and response procedures",
            "Demonstrates understanding of DLL side-loading mechanism",
            "Includes user notification and awareness steps",
            "References MITRE T1566 mapping",
        ],
    },
    "T1059": {
        "title": "Living-off-the-Land: PowerShell Abuse",
        "summary": (
            "Endpoint detection alerts on multiple workstations show powershell.exe "
            "spawning from Microsoft Office applications with encoded command-line "
            "arguments. The encoded commands are downloading additional payloads from "
            "a file-sharing service and executing reflective PE loading to bypass "
            "application whitelisting controls."
        ),
        "initial_access": (
            "Macro-enabled Office document delivered via email or web download, "
            "executing PowerShell to download and run payload in memory"
        ),
        "indicators": [
            "Office processes spawning powershell.exe with -EncodedCommand flag",
            "PowerShell making web requests to file-sharing domains",
            "Reflective DLL loading via System.Reflection.Assembly.Load()",
            "PowerShell script blocks with obfuscated variable names",
            "Suspicious outbound connections from powershell.exe",
        ],
        "affected_systems": ["End-user workstations", "File server (staging location)"],
        "tasks": [
            "Describe how you would analyse the encoded PowerShell command",
            "Explain how to detect and block similar LOLBAS techniques",
            "Detail the forensic artifacts left by PowerShell script execution",
            "Describe your approach to hunting for PowerShell abuse across the environment",
            "Outline preventative controls to restrict PowerShell usage",
        ],
        "criteria": [
            "Demonstrates ability to decode and analyse PowerShell commands",
            "Understands PowerShell logging (ScriptBlock, Module, Transcription)",
            "Describes application whitelisting and Constrained Language Mode",
            "References MITRE T1059.001 mapping",
            "Articulates detection via AMSI and event IDs 4103/4104",
        ],
    },
}


class ScenarioGenerator:
    """Builds incident response and threat-hunting scenarios from MITRE techniques."""

    @staticmethod
    def create_incident_scenario(
        technique: MitreTechnique,
        difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE,
        override_template: Optional[dict[str, Any]] = None,
    ) -> IncidentScenario:
        template: dict[str, Any] = override_template or TEMPLATE_POOL.get(
            technique.id, ScenarioGenerator._fallback_template(technique)
        )

        tactic_name: str = technique.tactic.name if technique.tactic else "General"

        return IncidentScenario(
            title=template["title"],
            summary=template["summary"],
            mitre_technique_id=technique.id,
            mitre_technique_name=technique.name,
            tactic_name=tactic_name,
            difficulty=difficulty,
            incident_details=IncidentDetails(
                initial_access_vector=template.get("initial_access", ""),
                indicators=template.get("indicators", []),
                affected_systems=template.get("affected_systems", []),
                timeline_estimate=_estimate_timeline(difficulty),
            ),
            candidate_tasks=template.get("tasks", []),
            evaluation_criteria=template.get("criteria", []),
        )

    @staticmethod
    def create_threat_hunting_scenario(
        techniques: list[MitreTechnique],
        difficulty: ProficiencyLevel = ProficiencyLevel.ADVANCED,
    ) -> ThreatHuntingScenario:
        technique_names: list[str] = [t.name for t in techniques]
        technique_ids: list[str] = [t.id for t in techniques]
        tactic_names: set[str] = {
            t.tactic.name for t in techniques if t.tactic and t.tactic.name
        }

        hypothesis: str = _build_hypothesis(technique_names, tactic_names)

        data_sources: list[str] = _collect_data_sources(techniques)
        hunting_steps: list[str] = _build_hunting_steps(techniques, difficulty)
        expected_findings: list[str] = _build_expected_findings(techniques)

        title: str = f"Threat Hunt: {' + '.join(technique_names[:2])}"

        return ThreatHuntingScenario(
            title=title,
            hypothesis=hypothesis,
            mitre_technique_ids=technique_ids,
            data_sources=data_sources,
            hunting_steps=hunting_steps,
            expected_findings=expected_findings,
            difficulty=difficulty,
        )

    @staticmethod
    def lookup_technique(technique_id: str) -> MitreTechnique:
        technique: Optional[MitreTechnique] = SEED_MITRE_TECHNIQUES.get(technique_id)
        if technique is None:
            raise ScenarioGeneratorError(
                f"MITRE technique not found in seed data: {technique_id}. "
                f"Available: {list(SEED_MITRE_TECHNIQUES.keys())}"
            )
        return technique

    @staticmethod
    def _fallback_template(technique: MitreTechnique) -> dict[str, Any]:
        tactic_name: str = technique.tactic.name if technique.tactic else "General"
        return {
            "title": f"{technique.name} Incident",
            "summary": (
                f"A security incident involving {technique.name} ({technique.id}) "
                f"has been detected. This technique falls under the {tactic_name} "
                f"tactic. {technique.description} The SOC requires immediate "
                f"investigation and response."
            ),
            "initial_access": technique.description,
            "indicators": [
                f"Alert correlated to {technique.name}",
                f"Relevant log sources indicating {technique.id} behaviour",
            ],
            "affected_systems": ["Under investigation"],
            "tasks": [
                f"Describe your triage process for a {technique.name} alert",
                "Explain how you would validate the alert as a true positive",
                "Detail your containment strategy for this scenario",
                "Describe the forensic evidence you would collect",
                "Outline remediation steps to prevent recurrence",
            ],
            "criteria": [
                f"Correctly identifies {technique.name} characteristics",
                "Demonstrates proper triage methodology",
                "Articulates containment procedures",
                f"References {technique.id} MITRE mapping",
                "Provides clear remediation recommendations",
            ],
        }


def _estimate_timeline(difficulty: ProficiencyLevel) -> str:
    mapping: dict[ProficiencyLevel, str] = {
        ProficiencyLevel.BEGINNER: "45-60 minutes",
        ProficiencyLevel.INTERMEDIATE: "30-45 minutes",
        ProficiencyLevel.ADVANCED: "20-30 minutes",
        ProficiencyLevel.EXPERT: "15-20 minutes",
    }
    return mapping.get(difficulty, "30-60 minutes")


def _build_hypothesis(
    technique_names: list[str],
    tactic_names: set[str],
) -> str:
    techniques_str: str = ", ".join(technique_names)
    tactics_str: str = ", ".join(sorted(tactic_names)) if tactic_names else "various"

    return (
        f"An adversary may be employing {techniques_str} techniques "
        f"as part of {tactics_str} operations within the environment. "
        f"We hypothesise that indicators of these techniques are present "
        f"in our telemetry but have evaded automated detection."
    )


def _collect_data_sources(techniques: list[MitreTechnique]) -> list[str]:
    base_sources: list[str] = [
        "Endpoint detection and response (EDR) telemetry",
        "Windows Event Logs (Security, Sysmon, PowerShell)",
        "DNS query logs",
        "Network flow logs (NetFlow / IPFIX)",
    ]

    technique_specific: list[str] = []
    for t in techniques:
        tactic_lower: str = t.tactic.name.lower() if t.tactic else ""
        if "initial" in tactic_lower or "execution" in tactic_lower:
            technique_specific.append("Web proxy / WAF logs")
        if "lateral" in tactic_lower:
            technique_specific.append("Windows RDP / SMB logs")
        if "credential" in tactic_lower:
            technique_specific.append("Authentication server logs (DC / RADIUS)")
        if "exfil" in tactic_lower or "collection" in tactic_lower:
            technique_specific.append("Data loss prevention (DLP) alerts")
        if "impact" in tactic_lower:
            technique_specific.append("File integrity monitoring (FIM) alerts")

    seen: set[str] = set()
    combined: list[str] = base_sources + technique_specific
    result: list[str] = []
    for item in combined:
        if item.lower() not in seen:
            result.append(item)
            seen.add(item.lower())
    return result


def _build_hunting_steps(
    techniques: list[MitreTechnique],
    difficulty: ProficiencyLevel,
) -> list[str]:
    steps: list[str] = [
        "Search for known IOCs related to the techniques across endpoint telemetry",
        "Analyse authentication logs for anomalous access patterns",
        "Correlate network flows with known C2 infrastructure patterns",
    ]

    for t in techniques:
        steps.append(
            f"Develop and execute a detection query for {t.name} ({t.id}) "
            f"using available EDR or SIM query languages"
        )

    if difficulty in (ProficiencyLevel.ADVANCED, ProficiencyLevel.EXPERT):
        steps.extend(
            [
                "Create a behavioural baseline for affected systems and identify deviations",
                "Perform timeline reconstruction of the attack chain using multiple log sources",
                "Develop YARA or Sigma rules for retrospective detection across the environment",
            ]
        )

    return steps


def _build_expected_findings(techniques: list[MitreTechnique]) -> list[str]:
    findings: list[str] = []
    for t in techniques:
        findings.append(f"Evidence of {t.name} ({t.id}) activity in log sources")
        if t.sub_techniques:
            for sub in t.sub_techniques:
                findings.append(
                    f"Specific sub-technique {sub.name} ({sub.id}) indicators identified"
                )
    findings.append("Timeline of attacker activity reconstructed")
    findings.append("Affected systems and accounts documented")
    findings.append("Detection gaps and tuning recommendations identified")
    return findings
