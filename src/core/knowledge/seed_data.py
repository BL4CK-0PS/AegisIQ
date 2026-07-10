from __future__ import annotations

import uuid
from typing import Any

from src.core.knowledge.taxonomy import (
    Capability,
    CyberDomain,
    KnowledgeArea,
    LearningObjective,
    MitreMapping,
    MitreTactic,
    MitreTechnique,
    ProficiencyLevel,
    Skill,
    Technology,
)


def _id() -> str:
    return uuid.uuid4().hex[:12]


# ---------------------------------------------------------------------------
# MITRE ATT&CK Tactics
# ---------------------------------------------------------------------------

T_INITIAL_ACCESS = MitreTactic(
    id="TA0001", name="Initial Access", description="The adversary is trying to get into your network."
)
T_EXECUTION = MitreTactic(
    id="TA0002", name="Execution", description="The adversary is trying to run malicious code."
)
T_PERSISTENCE = MitreTactic(
    id="TA0003", name="Persistence", description="The adversary is trying to maintain their foothold."
)
T_PRIV_ESC = MitreTactic(
    id="TA0004", name="Privilege Escalation",
    description="The adversary is trying to gain higher-level permissions.",
)
T_DEFENSE_EVASION = MitreTactic(
    id="TA0005", name="Defense Evasion",
    description="The adversary is trying to avoid being detected.",
)
T_CREDENTIAL_ACCESS = MitreTactic(
    id="TA0006", name="Credential Access",
    description="The adversary is trying to steal account names and passwords.",
)
T_DISCOVERY = MitreTactic(
    id="TA0007", name="Discovery", description="The adversary is trying to figure out your environment."
)
T_LATERAL_MOVEMENT = MitreTactic(
    id="TA0008", name="Lateral Movement",
    description="The adversary is trying to move through your environment.",
)
T_COLLECTION = MitreTactic(
    id="TA0009", name="Collection", description="The adversary is trying to gather data of interest."
)
T_EXFILTRATION = MitreTactic(
    id="TA0010", name="Exfiltration", description="The adversary is trying to steal data."
)
T_IMPACT = MitreTactic(
    id="TA0040", name="Impact", description="The adversary is trying to manipulate, interrupt, or destroy systems."
)

# ---------------------------------------------------------------------------
# MITRE ATT&CK Techniques
# ---------------------------------------------------------------------------

T1566_PHISHING = MitreTechnique(
    id="T1566",
    name="Phishing",
    description="Adversaries may send phishing messages to gain access to victim systems.",
    tactic=T_INITIAL_ACCESS,
    sub_techniques=[
        MitreTechnique(
            id="T1566.001",
            name="Spearphishing Attachment",
            description="A targeted phishing email with a malicious attachment.",
            tactic=T_INITIAL_ACCESS,
        ),
        MitreTechnique(
            id="T1566.002",
            name="Spearphishing Link",
            description="A targeted phishing email containing a malicious link.",
            tactic=T_INITIAL_ACCESS,
        ),
    ],
)

T1190_EXPLOIT_PUBLIC = MitreTechnique(
    id="T1190",
    name="Exploit Public-Facing Application",
    description="Adversaries may exploit a software vulnerability in a public-facing application.",
    tactic=T_INITIAL_ACCESS,
)

T1078_VALID_ACCOUNTS = MitreTechnique(
    id="T1078",
    name="Valid Accounts",
    description="Adversaries may use valid credentials to access systems.",
    tactic=T_INITIAL_ACCESS,
)

T1059_COMMAND_SCRIPT = MitreTechnique(
    id="T1059",
    name="Command and Scripting Interpreter",
    description="Adversaries may abuse command interpreters to execute commands.",
    tactic=T_EXECUTION,
    sub_techniques=[
        MitreTechnique(id="T1059.001", name="PowerShell", tactic=T_EXECUTION,
                       description="Adversaries may abuse PowerShell for execution."),
        MitreTechnique(id="T1059.004", name="Unix Shell", tactic=T_EXECUTION,
                       description="Adversaries may abuse Unix shells for execution."),
    ],
)

T1204_USER_EXECUTION = MitreTechnique(
    id="T1204",
    name="User Execution",
    description="An adversary relies on a user to execute a payload.",
    tactic=T_EXECUTION,
)

T1505_SERVER_SOFTWARE = MitreTechnique(
    id="T1505",
    name="Server Software Component",
    description="Adversaries may abuse legitimate server software components to establish persistence.",
    tactic=T_PERSISTENCE,
)

T1133_EXTERNAL_REMOTE = MitreTechnique(
    id="T1133",
    name="External Remote Services",
    description="Adversaries may use external remote services for initial access or persistence.",
    tactic=T_PERSISTENCE,
)

T1078_PRIV_ESC = MitreTechnique(
    id="T1078",
    name="Valid Accounts",
    description="Adversaries may use credentials to escalate privileges.",
    tactic=T_PRIV_ESC,
)

T1055_PROCESS_INJECTION = MitreTechnique(
    id="T1055",
    name="Process Injection",
    description="Adversaries may inject code into processes to evade defenses and escalate privileges.",
    tactic=T_PRIV_ESC,
)

T1562_IMPAIR_DEFENSES = MitreTechnique(
    id="T1562",
    name="Impair Defenses",
    description="Adversaries may disable or impair security tools.",
    tactic=T_DEFENSE_EVASION,
    sub_techniques=[
        MitreTechnique(id="T1562.001", name="Disable or Modify Tools", tactic=T_DEFENSE_EVASION,
                       description="Adversaries may disable security tools."),
        MitreTechnique(id="T1562.004", name="Disable or Modify System Firewall", tactic=T_DEFENSE_EVASION,
                       description="Adversaries may disable the system firewall."),
    ],
)

T1110_BRUTE_FORCE = MitreTechnique(
    id="T1110",
    name="Brute Force",
    description="Adversaries may use brute force to gain access to accounts.",
    tactic=T_CREDENTIAL_ACCESS,
)

T1552_UNSEC_CREDS = MitreTechnique(
    id="T1552",
    name="Unsecured Credentials",
    description="Adversaries may search for credentials in files and configuration stores.",
    tactic=T_CREDENTIAL_ACCESS,
)

T1087_ACCOUNT_DISCOVERY = MitreTechnique(
    id="T1087",
    name="Account Discovery",
    description="Adversaries may enumerate accounts to identify user and system accounts.",
    tactic=T_DISCOVERY,
)

T1046_NETWORK_SERVICE_SCAN = MitreTechnique(
    id="T1046",
    name="Network Service Discovery",
    description="Adversaries may scan for open ports and running services.",
    tactic=T_DISCOVERY,
)

T1021_REMOTE_SERVICES = MitreTechnique(
    id="T1021",
    name="Remote Services",
    description="Adversaries may use remote services to move laterally.",
    tactic=T_LATERAL_MOVEMENT,
    sub_techniques=[
        MitreTechnique(id="T1021.001", name="Remote Desktop Protocol", tactic=T_LATERAL_MOVEMENT,
                       description="Adversaries may use RDP to move laterally."),
        MitreTechnique(id="T1021.004", name="SSH", tactic=T_LATERAL_MOVEMENT,
                       description="Adversaries may use SSH to move laterally."),
    ],
)

T1119_AUTOMATED_COLLECTION = MitreTechnique(
    id="T1119",
    name="Automated Collection",
    description="Adversaries may collect data automatically using tools or scripts.",
    tactic=T_COLLECTION,
)

T1041_EXFIL_OVER_C2 = MitreTechnique(
    id="T1041",
    name="Exfiltration Over C2 Channel",
    description="Adversaries may exfiltrate data over the command and control channel.",
    tactic=T_EXFILTRATION,
)

T1485_DATA_DESTRUCTION = MitreTechnique(
    id="T1485",
    name="Data Destruction",
    description="Adversaries may destroy data on target systems.",
    tactic=T_IMPACT,
)

T1486_RANSOMWARE = MitreTechnique(
    id="T1486",
    name="Data Encrypted for Impact",
    description="Adversaries may encrypt data to disrupt availability (ransomware).",
    tactic=T_IMPACT,
)

# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------

SKILL_WEB_VULN_SCAN = Skill(
    id=_id(), name="Web Vulnerability Scanning",
    description="Operate automated scanners and interpret results for web application vulnerabilities.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["web scanning", "vulnerability assessment"],
)

SKILL_SQL_INJECTION = Skill(
    id=_id(), name="SQL Injection Analysis",
    description="Identify, test, and exploit SQL injection vulnerabilities in web applications.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["sqli", "sql injection testing"],
)

SKILL_XSS_ANALYSIS = Skill(
    id=_id(), name="Cross-Site Scripting Analysis",
    description="Detect and analyse reflected, stored, and DOM-based XSS vulnerabilities.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["xss", "cross-site scripting"],
)

SKILL_AUTH_BYPASS = Skill(
    id=_id(), name="Authentication Bypass Testing",
    description="Identify weaknesses in authentication mechanisms including session flaws and broken access controls.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["auth bypass", "access control testing"],
)

SKILL_API_SECURITY = Skill(
    id=_id(), name="API Security Testing",
    description="Assess REST and GraphQL API endpoints for injection, broken auth, and rate-limiting issues.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["api hacking", "api assessment"],
)

SKILL_PACKET_ANALYSIS = Skill(
    id=_id(), name="Packet Analysis",
    description="Capture and analyse network traffic using tools like Wireshark and tcpdump.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["traffic analysis", "pcap analysis", "wireshark"],
)

SKILL_NETWORK_MONITORING = Skill(
    id=_id(), name="Network Monitoring",
    description="Deploy and maintain network monitoring solutions to detect anomalous traffic patterns.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["netmon", "network detection"],
)

SKILL_FIREWALL_MGMT = Skill(
    id=_id(), name="Firewall Management",
    description="Configure and maintain network firewall rules to enforce security policies.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["firewall config", "acl management"],
)

SKILL_IDS_IPS = Skill(
    id=_id(), name="Intrusion Detection and Prevention",
    description="Deploy, tune, and analyse alerts from IDS/IPS systems such as Snort or Suricata.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["ids/ips", "snort", "suricata"],
)

SKILL_NETWORK_SEGMENTATION = Skill(
    id=_id(), name="Network Segmentation",
    description="Design and implement network segmentation to isolate critical assets and limit lateral movement.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["vlan design", "micro-segmentation"],
)

SKILL_IAM = Skill(
    id=_id(), name="Identity and Access Management",
    description="Manage user identities, roles, and access policies across cloud and on-prem environments.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["iam", "access management"],
)

SKILL_CSPM = Skill(
    id=_id(), name="Cloud Security Posture Management",
    description="Assess and remediate cloud security misconfigurations using CSPM tools.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["cspm", "cloud posture"],
)

SKILL_CLOUD_LOG_ANALYSIS = Skill(
    id=_id(), name="Cloud Log Analysis",
    description="Analyse CloudTrail, CloudWatch, and other cloud-native logs for security incidents.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["cloud logging", "cloud trail analysis"],
)

SKILL_INCIDENT_TRIAGE = Skill(
    id=_id(), name="Incident Triage",
    description="Prioritise and categorise security alerts based on severity, impact, and confidence.",
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
    alternative_labels=["alert triage", "incident prioritisation"],
)

SKILL_FORENSIC_ACQUISITION = Skill(
    id=_id(), name="Forensic Acquisition",
    description="Acquire disk, memory, and log artifacts forensically while maintaining chain of custody.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["forensics", "disk acquisition", "memory capture"],
)

SKILL_THREAT_HUNTING = Skill(
    id=_id(), name="Threat Hunting",
    description="Proactively search for advanced threats using hypothesis-driven methodologies.",
    proficiency_level=ProficiencyLevel.ADVANCED,
    alternative_labels=["hunt", "proactive detection"],
)

# ---------------------------------------------------------------------------
# Knowledge Areas
# ---------------------------------------------------------------------------

KA_WEB_ATTACK_SURFACE = KnowledgeArea(
    id=_id(), name="Web Attack Surface",
    description="Understanding of common web application attack vectors including injection, XSS, and SSRF.",
    learning_objectives=[
        LearningObjective(
            description="Identify and classify OWASP Top 10 vulnerabilities in a web application.",
            assessment_criteria=["Correctly identifies vulnerability class", "Describes exploitation impact"],
        ),
        LearningObjective(
            description="Explain how input validation failures lead to injection attacks.",
            assessment_criteria=["Describes injection mechanics", "Provides remediation examples"],
        ),
    ],
)

KA_NETWORK_PROTOCOLS = KnowledgeArea(
    id=_id(), name="Network Protocols",
    description="Deep knowledge of TCP/IP, DNS, HTTP, and other network protocols.",
    learning_objectives=[
        LearningObjective(
            description="Analyse packet captures to identify anomalous protocol behaviour.",
            assessment_criteria=["Identifies abnormal traffic patterns", "Correlates with attack techniques"],
        ),
        LearningObjective(
            description="Explain how DNS exfiltration techniques operate at the protocol level.",
            assessment_criteria=["Describes DNS tunnelling", "Identifies indicators of exfiltration"],
        ),
    ],
)

KA_CLOUD_ARCHITECTURE = KnowledgeArea(
    id=_id(), name="Cloud Security Architecture",
    description="Understanding of shared responsibility model, cloud network security, and IAM best practices.",
    learning_objectives=[
        LearningObjective(
            description="Design a secure multi-account AWS or Azure landing zone.",
            assessment_criteria=["Applies least privilege", "Implements network segmentation"],
        ),
        LearningObjective(
            description="Identify and remediate common cloud misconfigurations.",
            assessment_criteria=["Lists CIS benchmark failures", "Provides remediation steps"],
        ),
    ],
)

KA_INCIDENT_RESPONSE_PROCESS = KnowledgeArea(
    id=_id(), name="Incident Response Process",
    description="Knowledge of the NIST incident response lifecycle: preparation, detection, analysis, containment, eradication, recovery.",
    learning_objectives=[
        LearningObjective(
            description="Apply the NIST IR lifecycle to a simulated ransomware incident.",
            assessment_criteria=["Follows lifecycle phases", "Documents decisions at each phase"],
        ),
        LearningObjective(
            description="Prioritise containment actions based on impact and dwell time.",
            assessment_criteria=["Selects appropriate containment strategy", "Justifies prioritisation"],
        ),
    ],
)

# ---------------------------------------------------------------------------
# Technologies
# ---------------------------------------------------------------------------

TECH_BURPSUITE = Technology(
    id=_id(), name="Burp Suite",
    category="tool",
    description="Web application security testing platform for intercepting and modifying HTTP traffic.",
    skill_ids=[SKILL_WEB_VULN_SCAN.id, SKILL_SQL_INJECTION.id, SKILL_XSS_ANALYSIS.id],
)

TECH_WIRESHARK = Technology(
    id=_id(), name="Wireshark",
    category="tool",
    description="Network protocol analyser for packet capture and traffic inspection.",
    skill_ids=[SKILL_PACKET_ANALYSIS.id],
)

TECH_SNORT = Technology(
    id=_id(), name="Snort",
    category="tool",
    description="Open-source network intrusion detection and prevention system.",
    skill_ids=[SKILL_IDS_IPS.id, SKILL_NETWORK_MONITORING.id],
)

TECH_AWS_CLOUDTRAIL = Technology(
    id=_id(), name="AWS CloudTrail",
    category="service",
    description="AWS API activity logging service for governance and security auditing.",
    skill_ids=[SKILL_CLOUD_LOG_ANALYSIS.id, SKILL_CSPM.id],
)

TECH_AZURE_SENTINEL = Technology(
    id=_id(), name="Microsoft Sentinel",
    category="service",
    description="Cloud-native SIEM and SOAR platform for security analytics.",
    skill_ids=[SKILL_CLOUD_LOG_ANALYSIS.id, SKILL_INCIDENT_TRIAGE.id],
)

# ---------------------------------------------------------------------------
# Capabilities
# ---------------------------------------------------------------------------

CAP_WEB_APP_SEC = Capability(
    id=_id(), name="Web Application Security Testing",
    description="Assess web applications for vulnerabilities using manual and automated techniques.",
    skills=[SKILL_WEB_VULN_SCAN, SKILL_SQL_INJECTION, SKILL_XSS_ANALYSIS, SKILL_AUTH_BYPASS, SKILL_API_SECURITY],
    mitre_mappings=[
        MitreMapping(
            technique=T1190_EXPLOIT_PUBLIC,
            skill_ids=[SKILL_WEB_VULN_SCAN.id, SKILL_SQL_INJECTION.id],
            detection_methods=["WAF alert review", "Web server log analysis"],
            mitigation_references=["OWASP ASVS", "CWE-89", "CWE-79"],
        ),
        MitreMapping(
            technique=T1566_PHISHING,
            skill_ids=[SKILL_AUTH_BYPASS.id],
            detection_methods=["Email gateway logs", "User reporting"],
            mitigation_references=["DMARC", "SPF", "DKIM"],
        ),
    ],
    technologies=[TECH_BURPSUITE],
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
)

CAP_NETWORK_SEC = Capability(
    id=_id(), name="Network Security Monitoring and Defense",
    description="Monitor, detect, and respond to network-level threats using analysis tools and defensive controls.",
    skills=[SKILL_PACKET_ANALYSIS, SKILL_NETWORK_MONITORING, SKILL_FIREWALL_MGMT, SKILL_IDS_IPS, SKILL_NETWORK_SEGMENTATION],
    mitre_mappings=[
        MitreMapping(
            technique=T1046_NETWORK_SERVICE_SCAN,
            skill_ids=[SKILL_PACKET_ANALYSIS.id],
            detection_methods=["IDS alert correlation", "Netflow analysis"],
            mitigation_references=["CIS Control 4", "Network segmentation"],
        ),
        MitreMapping(
            technique=T1021_REMOTE_SERVICES,
            skill_ids=[SKILL_NETWORK_MONITORING.id, SKILL_FIREWALL_MGMT.id],
            detection_methods=["RDP/SSH log monitoring", "Anomalous lateral movement detection"],
            mitigation_references=["Network segmentation", "Just-In-Time access"],
        ),
    ],
    technologies=[TECH_WIRESHARK, TECH_SNORT],
    proficiency_level=ProficiencyLevel.INTERMEDIATE,
)

CAP_CLOUD_SEC = Capability(
    id=_id(), name="Cloud Security",
    description="Secure cloud infrastructure across AWS, Azure, and GCP using IAM, monitoring, and posture management.",
    skills=[SKILL_IAM, SKILL_CSPM, SKILL_CLOUD_LOG_ANALYSIS],
    mitre_mappings=[
        MitreMapping(
            technique=T1078_VALID_ACCOUNTS,
            skill_ids=[SKILL_IAM.id],
            detection_methods=["CloudTrail IAM events", "Anomalous login detection"],
            mitigation_references=["CIS AWS Foundations", "IAM least privilege"],
        ),
    ],
    technologies=[TECH_AWS_CLOUDTRAIL, TECH_AZURE_SENTINEL],
    proficiency_level=ProficiencyLevel.ADVANCED,
)

CAP_INCIDENT_RESPONSE = Capability(
    id=_id(), name="Incident Response and Forensics",
    description="Detect, triage, contain, investigate, and remediate security incidents.",
    skills=[SKILL_INCIDENT_TRIAGE, SKILL_FORENSIC_ACQUISITION, SKILL_THREAT_HUNTING],
    mitre_mappings=[
        MitreMapping(
            technique=T1486_RANSOMWARE,
            skill_ids=[SKILL_INCIDENT_TRIAGE.id, SKILL_FORENSIC_ACQUISITION.id],
            detection_methods=["Ransomware alert signatures", "File system monitoring"],
            mitigation_references=["NIST SP 800-61", "Offline backups", "IR playbook"],
        ),
        MitreMapping(
            technique=T1562_IMPAIR_DEFENSES,
            skill_ids=[SKILL_THREAT_HUNTING.id],
            detection_methods=["EDR telemetry gaps", "Service disabling events"],
            mitigation_references=["Tamper protection", "Integrity monitoring"],
        ),
    ],
    proficiency_level=ProficiencyLevel.ADVANCED,
)

# ---------------------------------------------------------------------------
# Domains
# ---------------------------------------------------------------------------

DOMAIN_WEB_SECURITY: CyberDomain = CyberDomain(
    name="Web Application Security",
    description="Assesses the security of web applications including vulnerability identification, "
    "exploitation understanding, and remediation of OWASP Top 10 and API security risks.",
    capabilities=[CAP_WEB_APP_SEC],
    technologies=[TECH_BURPSUITE],
    mitre_mappings=CAP_WEB_APP_SEC.mitre_mappings,
)

DOMAIN_NETWORK_SECURITY: CyberDomain = CyberDomain(
    name="Network Security",
    description="Covers network defence including traffic analysis, intrusion detection, firewall management, "
    "segmentation, and lateral movement prevention.",
    capabilities=[CAP_NETWORK_SEC],
    technologies=[TECH_WIRESHARK, TECH_SNORT],
    mitre_mappings=CAP_NETWORK_SEC.mitre_mappings,
)

DOMAIN_CLOUD_SECURITY: CyberDomain = CyberDomain(
    name="Cloud Security",
    description="Covers securing cloud infrastructure including IAM, logging, posture management, "
    "and incident detection in AWS, Azure, and GCP environments.",
    capabilities=[CAP_CLOUD_SEC],
    technologies=[TECH_AWS_CLOUDTRAIL, TECH_AZURE_SENTINEL],
    mitre_mappings=CAP_CLOUD_SEC.mitre_mappings,
)

DOMAIN_INCIDENT_RESPONSE: CyberDomain = CyberDomain(
    name="Incident Response and Forensics",
    description="Covers the full incident response lifecycle including triage, containment, "
    "forensic acquisition, threat hunting, and recovery planning.",
    capabilities=[CAP_INCIDENT_RESPONSE],
    mitre_mappings=CAP_INCIDENT_RESPONSE.mitre_mappings,
)

# ---------------------------------------------------------------------------
# Aggregated exports
# ---------------------------------------------------------------------------

ALL_DOMAINS: list[CyberDomain] = [
    DOMAIN_WEB_SECURITY,
    DOMAIN_NETWORK_SECURITY,
    DOMAIN_CLOUD_SECURITY,
    DOMAIN_INCIDENT_RESPONSE,
]

SEED_SKILLS: dict[str, Skill] = {
    s.name: s
    for domain in ALL_DOMAINS
    for cap in domain.capabilities
    for s in cap.skills
}

SEED_MITRE_TECHNIQUES: dict[str, MitreTechnique] = {
    mapping.technique.id: mapping.technique
    for domain in ALL_DOMAINS
    for mapping in domain.mitre_mappings
}

SEED_TECHNOLOGIES: dict[str, Technology] = {
    t.name: t
    for domain in ALL_DOMAINS
    for t in domain.technologies
}


def get_domain_by_name(name: str) -> CyberDomain:
    for domain in ALL_DOMAINS:
        if domain.name.lower() == name.lower():
            return domain
    raise KeyError(f"Domain not found: {name}")


Capability.model_rebuild()
CyberDomain.model_rebuild()
