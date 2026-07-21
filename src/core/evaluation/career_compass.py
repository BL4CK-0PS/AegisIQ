from __future__ import annotations

import logging
from typing import Any, Optional, Union

from pydantic import BaseModel, Field

from src.core.evaluation.dna_engine import CyberTwinModel
from src.core.knowledge.seed_data import ALL_DOMAINS
from src.core.knowledge.taxonomy import ProficiencyLevel, SkillDnaProfile

logger = logging.getLogger(__name__)


class RoleDomainRequirement(BaseModel):
    domain_name: str
    minimum_proficiency: ProficiencyLevel
    weight: float = Field(ge=0.0, le=1.0)

    model_config = {"frozen": True}


class CareerRoleDefinition(BaseModel):
    title: str
    description: str
    domain_requirements: list[RoleDomainRequirement] = Field(default_factory=list)
    typical_experience_years: int = 3
    progression_from: list[str] = Field(default_factory=list)

    model_config = {"frozen": True}


class SkillGapDetail(BaseModel):
    skill_name: str
    current_proficiency: ProficiencyLevel
    required_proficiency: ProficiencyLevel
    gap_severity: str  # "critical", "moderate", "none"
    recommendation: str

    model_config = {"frozen": True}


class DomainGapResult(BaseModel):
    domain_name: str
    current_level: ProficiencyLevel
    required_level: ProficiencyLevel
    status: str  # "met", "partial", "not_met"
    gap_details: list[SkillGapDetail] = Field(default_factory=list)

    model_config = {"frozen": True}


class RoleGapAnalysis(BaseModel):
    target_role: str
    overall_match_percentage: float = 0.0
    domain_results: list[DomainGapResult] = Field(default_factory=list)
    critical_gaps: list[SkillGapDetail] = Field(default_factory=list)
    progression_steps: list[str] = Field(default_factory=list)

    model_config = {"frozen": True}


class CareerCompassEngineError(Exception):
    """Raised when career compass operations fail."""


# ---------------------------------------------------------------------------
# Role definitions — mapped against the 4 taxonomy domains from seed_data
# ---------------------------------------------------------------------------

ROLE_SOC_ANALYST = CareerRoleDefinition(
    title="SOC Analyst",
    description="Monitors security alerts, triages incidents, and escalates threats. "
    "Operates SIEM platforms and follows established playbooks.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.40,
        ),
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.15,
        ),
    ],
    typical_experience_years=1,
    progression_from=[],
)

ROLE_PENETRATION_TESTER = CareerRoleDefinition(
    title="Penetration Tester",
    description="Conducts authorised offensive security assessments including web, "
    "network, and application penetration testing with detailed reporting.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.40,
        ),
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.30,
        ),
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.15,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.15,
        ),
    ],
    typical_experience_years=3,
    progression_from=["SOC Analyst"],
)

ROLE_INCIDENT_RESPONDER = CareerRoleDefinition(
    title="Incident Responder",
    description="Leads incident response engagements, performs forensic analysis, "
    "contains and eradicates threats, and produces post-incident reports.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.45,
        ),
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.15,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.15,
        ),
    ],
    typical_experience_years=4,
    progression_from=["SOC Analyst"],
)

ROLE_CLOUD_SECURITY_ENGINEER = CareerRoleDefinition(
    title="Cloud Security Engineer",
    description="Designs and implements security controls for cloud infrastructure, "
    "manages IAM policies, monitors cloud workloads, and responds to cloud incidents.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.45,
        ),
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.BEGINNER,
            weight=0.15,
        ),
    ],
    typical_experience_years=4,
    progression_from=["Security Engineer"],
)

ROLE_SECURITY_ARCHITECT = CareerRoleDefinition(
    title="Security Architect",
    description="Designs enterprise security architectures, defines security standards, "
    "evaluates security technologies, and guides security strategy.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.30,
        ),
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
    ],
    typical_experience_years=8,
    progression_from=["Security Engineer", "Cloud Security Engineer"],
)

ROLE_SECURITY_ENGINEER = CareerRoleDefinition(
    title="Security Engineer",
    description="Builds and maintains security tooling, automates security processes, "
    "performs security reviews, and supports incident response operations.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.25,
        ),
    ],
    typical_experience_years=3,
    progression_from=["SOC Analyst"],
)

ROLE_SOC_MANAGER = CareerRoleDefinition(
    title="SOC Manager",
    description="Oversees SOC operations, manages analyst teams, develops runbooks, "
    "reports to leadership, and drives continuous improvement.",
    domain_requirements=[
        RoleDomainRequirement(
            domain_name="Incident Response and Forensics",
            minimum_proficiency=ProficiencyLevel.ADVANCED,
            weight=0.30,
        ),
        RoleDomainRequirement(
            domain_name="Network Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Web Application Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.20,
        ),
        RoleDomainRequirement(
            domain_name="Cloud Security",
            minimum_proficiency=ProficiencyLevel.INTERMEDIATE,
            weight=0.30,
        ),
    ],
    typical_experience_years=6,
    progression_from=["SOC Analyst", "Incident Responder"],
)

ROLE_REGISTRY: dict[str, CareerRoleDefinition] = {
    r.title: r
    for r in [
        ROLE_SOC_ANALYST,
        ROLE_PENETRATION_TESTER,
        ROLE_INCIDENT_RESPONDER,
        ROLE_CLOUD_SECURITY_ENGINEER,
        ROLE_SECURITY_ARCHITECT,
        ROLE_SECURITY_ENGINEER,
        ROLE_SOC_MANAGER,
    ]
}


class CareerCompassEngine:
    """Performs gap analysis between a candidate profile and target cyber roles.

    Accepts SkillDnaProfile or CyberTwinModel, maps demonstrated skills
    to taxonomy domains, computes proficiency levels per domain, and
    returns structured gap analyses with progression recommendations.
    """

    @staticmethod
    def list_roles() -> list[str]:
        return list(ROLE_REGISTRY.keys())

    @staticmethod
    def get_role_definition(title: str) -> CareerRoleDefinition:
        role = ROLE_REGISTRY.get(title)
        if role is None:
            raise CareerCompassEngineError(
                f"Unknown role '{title}'. Available: {list(ROLE_REGISTRY.keys())}"
            )
        return role

    @staticmethod
    def analyze_against_role(
        profile: Union[SkillDnaProfile, CyberTwinModel],
        target_role_title: str,
    ) -> RoleGapAnalysis:
        target = CareerCompassEngine.get_role_definition(target_role_title)
        domain_scores: dict[str, float] = CareerCompassEngine._extract_domain_scores(
            profile
        )
        domain_profs: dict[str, ProficiencyLevel] = (
            CareerCompassEngine._compute_domain_proficiencies(domain_scores)
        )
        skill_map: dict[str, SkillGapDetail] = CareerCompassEngine._build_skill_gap_map(
            profile, target
        )

        domain_results: list[DomainGapResult] = []
        total_weight: float = 0.0
        weighted_score: float = 0.0
        all_critical: list[SkillGapDetail] = []

        for req in target.domain_requirements:
            current_lev: ProficiencyLevel = domain_profs.get(
                req.domain_name, ProficiencyLevel.BEGINNER
            )
            required_lev: ProficiencyLevel = req.minimum_proficiency
            status: str = CareerCompassEngine._domain_status(current_lev, required_lev)

            domain_gaps: list[SkillGapDetail] = [
                v
                for k, v in skill_map.items()
                if k in _domain_skill_names(req.domain_name)
            ]

            domain_results.append(
                DomainGapResult(
                    domain_name=req.domain_name,
                    current_level=current_lev,
                    required_level=required_lev,
                    status=status,
                    gap_details=domain_gaps,
                )
            )

            domain_match: float = CareerCompassEngine._domain_match_fraction(
                current_lev, required_lev
            )
            weighted_score += domain_match * req.weight
            total_weight += req.weight

            for g in domain_gaps:
                if g.gap_severity == "critical":
                    all_critical.append(g)

        overall_pct: float = (
            round(weighted_score / total_weight * 100, 1) if total_weight else 0.0
        )
        steps: list[str] = CareerCompassEngine._build_progression_steps(
            all_critical, target
        )

        return RoleGapAnalysis(
            target_role=target_role_title,
            overall_match_percentage=overall_pct,
            domain_results=domain_results,
            critical_gaps=all_critical[:10],
            progression_steps=steps,
        )

    @staticmethod
    def find_best_fit_roles(
        profile: Union[SkillDnaProfile, CyberTwinModel],
        top_n: int = 3,
    ) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        for title in ROLE_REGISTRY:
            analysis = CareerCompassEngine.analyze_against_role(profile, title)
            results.append(
                {
                    "role": title,
                    "match_percentage": analysis.overall_match_percentage,
                    "critical_gap_count": len(analysis.critical_gaps),
                    "domains_met": sum(
                        1 for d in analysis.domain_results if d.status == "met"
                    ),
                }
            )
        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return results[:top_n]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_domain_scores(
        profile: Union[SkillDnaProfile, CyberTwinModel],
    ) -> dict[str, float]:
        scores: dict[str, list[float]] = {d.name: [] for d in ALL_DOMAINS}

        if isinstance(profile, SkillDnaProfile):
            for cap in profile.capabilities:
                matched_domains = [
                    d
                    for d in ALL_DOMAINS
                    if any(c.name == cap.name for c in d.capabilities)
                ]
                for d in matched_domains:
                    base_score: float = _proficiency_to_score(cap.proficiency_level)
                    scores[d.name].append(base_score)

                    for skill in cap.skills:
                        skill_score: float = _proficiency_to_score(
                            skill.proficiency_level
                        )
                        scores[d.name].append(skill_score)

        elif isinstance(profile, CyberTwinModel):
            for entry in profile.verified_skills:
                for d in ALL_DOMAINS:
                    for cap in d.capabilities:
                        if any(s.name == entry.skill_name for s in cap.skills):
                            skill_score = _level_to_score(entry.verified_level)
                            scores[d.name].append(skill_score)

            cap_profile: dict[str, Any] = profile.capability_profile
            overall = cap_profile.get("overall_score", profile.overall_score)
            if overall > 0:
                for d_name in scores:
                    if not scores[d_name]:
                        scores[d_name].append(overall)

        else:
            raise CareerCompassEngineError(
                f"Unsupported profile type: {type(profile).__name__}"
            )

        for d in ALL_DOMAINS:
            if not scores[d.name]:
                scores[d.name].append(0.0)

        return {d: round(sum(v) / len(v), 2) for d, v in scores.items()}

    @staticmethod
    def _compute_domain_proficiencies(
        domain_scores: dict[str, float],
    ) -> dict[str, ProficiencyLevel]:
        return {
            d_name: _score_to_proficiency(score)
            for d_name, score in domain_scores.items()
        }

    @staticmethod
    def _build_skill_gap_map(
        profile: Union[SkillDnaProfile, CyberTwinModel],
        target: CareerRoleDefinition,
    ) -> dict[str, SkillGapDetail]:
        skill_map: dict[str, SkillGapDetail] = {}

        candidate_skills: dict[str, ProficiencyLevel] = {}
        if isinstance(profile, SkillDnaProfile):
            for cap in profile.capabilities:
                for skill in cap.skills:
                    current = candidate_skills.get(skill.name)
                    new_lvl = skill.proficiency_level
                    if current is None or _proficiency_to_score(
                        new_lvl
                    ) > _proficiency_to_score(current):
                        candidate_skills[skill.name] = new_lvl

        elif isinstance(profile, CyberTwinModel):
            for entry in profile.verified_skills:
                candidate_skills[entry.skill_name] = entry.verified_level

        req_domain_names: set[str] = {r.domain_name for r in target.domain_requirements}
        relevant_domains = [d for d in ALL_DOMAINS if d.name in req_domain_names]
        relevant_skills: set[str] = set()
        for d in relevant_domains:
            for cap in d.capabilities:
                for s in cap.skills:
                    relevant_skills.add(s.name)

        for skill_name in sorted(relevant_skills):
            current_prof = candidate_skills.get(skill_name, ProficiencyLevel.BEGINNER)
            required_prof = _infer_required_proficiency(skill_name, target)
            severity, rec = _assess_gap(current_prof, required_prof, skill_name)
            skill_map[skill_name] = SkillGapDetail(
                skill_name=skill_name,
                current_proficiency=current_prof,
                required_proficiency=required_prof,
                gap_severity=severity,
                recommendation=rec,
            )

        return skill_map

    @staticmethod
    def _domain_status(
        current: ProficiencyLevel,
        required: ProficiencyLevel,
    ) -> str:
        if _proficiency_to_score(current) >= _proficiency_to_score(required):
            return "met"
        if current == ProficiencyLevel.BEGINNER and required in (
            ProficiencyLevel.ADVANCED,
            ProficiencyLevel.EXPERT,
        ):
            return "not_met"
        return "partial"

    @staticmethod
    def _domain_match_fraction(
        current: ProficiencyLevel,
        required: ProficiencyLevel,
    ) -> float:
        current_score = _proficiency_to_score(current)
        required_score = _proficiency_to_score(required)
        if required_score == 0:
            return 1.0
        return min(current_score / required_score, 1.0)

    @staticmethod
    def _build_progression_steps(
        critical_gaps: list[SkillGapDetail],
        target: CareerRoleDefinition,
    ) -> list[str]:
        steps: list[str] = []

        if target.progression_from:
            steps.append(
                f"Typical prior roles: {', '.join(target.progression_from)}. "
                f"Ensure you have demonstrated competency at those levels first."
            )

        if critical_gaps:
            steps.append(
                f"Address {len(critical_gaps)} critical skill gap(s) to qualify "
                f"for {target.title}."
            )
            for g in critical_gaps[:5]:
                steps.append(f"  - {g.skill_name}: {g.recommendation}")

        target_domains = [r.domain_name for r in target.domain_requirements]
        steps.append(
            f"Focus on building proficiency across: {', '.join(target_domains)}."
        )
        steps.append(
            f"Target experience level: {target.typical_experience_years}+ years."
        )

        return steps


# ---------------------------------------------------------------------------
# Module-level helpers
# ---------------------------------------------------------------------------

_PROFICIENCY_SCORE_MAP: dict[ProficiencyLevel, float] = {
    ProficiencyLevel.BEGINNER: 25.0,
    ProficiencyLevel.INTERMEDIATE: 50.0,
    ProficiencyLevel.ADVANCED: 75.0,
    ProficiencyLevel.EXPERT: 100.0,
}

_SCORE_LEVEL_MAP: list[tuple[float, ProficiencyLevel]] = [
    (80.0, ProficiencyLevel.EXPERT),
    (65.0, ProficiencyLevel.ADVANCED),
    (45.0, ProficiencyLevel.INTERMEDIATE),
    (0.0, ProficiencyLevel.BEGINNER),
]


def _proficiency_to_score(level: ProficiencyLevel) -> float:
    return _PROFICIENCY_SCORE_MAP.get(level, 0.0)


def _score_to_proficiency(score: float) -> ProficiencyLevel:
    for threshold, level in _SCORE_LEVEL_MAP:
        if score >= threshold:
            return level
    return ProficiencyLevel.BEGINNER


def _level_to_score(level: ProficiencyLevel) -> float:
    return _proficiency_to_score(level)


def _infer_required_proficiency(
    skill_name: str,
    role: CareerRoleDefinition,
) -> ProficiencyLevel:
    domain_of_skill: Optional[str] = None
    for d in ALL_DOMAINS:
        for cap in d.capabilities:
            if any(s.name == skill_name for s in cap.skills):
                domain_of_skill = d.name
                break
        if domain_of_skill:
            break

    if domain_of_skill is None:
        return ProficiencyLevel.INTERMEDIATE

    for req in role.domain_requirements:
        if req.domain_name == domain_of_skill:
            return req.minimum_proficiency

    return ProficiencyLevel.INTERMEDIATE


def _domain_skill_names(domain_name: str) -> set[str]:
    names: set[str] = set()
    for d in ALL_DOMAINS:
        if d.name == domain_name:
            for cap in d.capabilities:
                for s in cap.skills:
                    names.add(s.name)
    return names


def _assess_gap(
    current: ProficiencyLevel,
    required: ProficiencyLevel,
    skill_name: str,
) -> tuple[str, str]:
    current_score = _proficiency_to_score(current)
    required_score = _proficiency_to_score(required)

    if current_score >= required_score:
        return (
            "none",
            f"Proficiency at {current.value} meets the {required.value} requirement.",
        )

    diff = required_score - current_score
    if diff >= 50:
        severity = "critical"
        advice = (
            f"Major gap: currently at {current.value} but needs {required.value}. "
            f"Prioritise structured learning and hands-on labs for {skill_name}."
        )
    elif diff >= 25:
        severity = "moderate"
        advice = (
            f"Moderate gap: currently at {current.value}, needs {required.value}. "
            f"Focus on advanced scenarios and practical challenges for {skill_name}."
        )
    else:
        severity = "minor"
        advice = (
            f"Small gap: near {required.value} proficiency. "
            f"Refine {skill_name} through targeted practice."
        )

    return severity, advice
