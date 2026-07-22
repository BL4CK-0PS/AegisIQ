"""
AegisIQ Job Description Routes

Parses job descriptions, extracts Skill DNA profiles, and maps to MITRE.
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user
from backend.database import get_session
from backend.models import UserModel
from backend.schemas import ParseJDRequest, ParseJDResponse

from src.core.knowledge.taxonomy import SkillDnaProfile, ProficiencyLevel
from src.core.knowledge.seed_data import ALL_DOMAINS, SEED_SKILLS, SEED_MITRE_TECHNIQUES

logger = logging.getLogger(__name__)
router = APIRouter()


class SkillDNARequest(BaseModel):
    profile_id: str


@router.post("/parse", response_model=ParseJDResponse)
async def parse_jd(
    payload: ParseJDRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        text_lower = payload.jd_text.lower()

        matched_domains = [
            d
            for d in ALL_DOMAINS
            if any(
                keyword in text_lower
                for keyword in d.name.lower().split()
                for cap in d.capabilities
                for s in cap.skills
                for keyword in s.name.lower().split() + s.alternative_labels
            )
        ]

        profile_domain = matched_domains[0] if matched_domains else ALL_DOMAINS[0]

        matched_skills = [
            s
            for s in SEED_SKILLS.values()
            if s.name.lower() in text_lower
            or any(label.lower() in text_lower for label in s.alternative_labels)
        ]

        responsibilities = [
            line.strip() for line in payload.jd_text.split("\n") if line.strip()
        ]

        difficulty = ProficiencyLevel.INTERMEDIATE
        if "senior" in text_lower or "advanced" in text_lower or "lead" in text_lower:
            difficulty = ProficiencyLevel.ADVANCED
        if (
            "expert" in text_lower
            or "architect" in text_lower
            or "principal" in text_lower
        ):
            difficulty = ProficiencyLevel.EXPERT
        if "junior" in text_lower or "entry" in text_lower or "tier 1" in text_lower:
            difficulty = ProficiencyLevel.BEGINNER

        mitre_ids = []
        for mapping in profile_domain.mitre_mappings:
            mitre_ids.append(mapping.technique.id)

        profile = SkillDnaProfile(
            title=payload.title,
            capabilities=profile_domain.capabilities,
            knowledge_areas=[
                ka
                for cap in profile_domain.capabilities
                for skill in cap.skills
                for ka in skill.knowledge_areas
            ],
            responsibilities=responsibilities[:20],
            assessment_objectives=[
                f"Assess {s.name} capability" for s in matched_skills[:10]
            ],
            difficulty=difficulty,
            recommended_rubric=difficulty.value,
        )

        logger.info(
            "JD parsed: %s — matched %d skills, difficulty=%s",
            payload.title,
            len(matched_skills),
            difficulty.value,
        )

        return {
            "status": "success",
            "profile_id": profile.id,
            "title": profile.title,
            "difficulty": profile.difficulty.value,
            "capabilities": [c.model_dump() for c in profile.capabilities],
            "knowledge_areas": [k.model_dump() for k in profile.knowledge_areas],
            "responsibilities": profile.responsibilities,
            "assessment_objectives": profile.assessment_objectives,
            "estimated_duration_minutes": profile.estimated_duration_minutes,
            "recommended_rubric": profile.recommended_rubric,
            "mitre_technique_ids": mitre_ids,
        }

    except Exception as exc:
        logger.error("JD parsing failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/skills", summary="List all available skills")
async def list_skills(
    limit: int = Query(50, ge=1, le=200, description="Max results"),
    offset: int = Query(0, ge=0, description="Results to skip"),
) -> dict[str, Any]:
    all_skills = [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "proficiency_level": s.proficiency_level.value,
            "alternative_labels": s.alternative_labels,
        }
        for s in SEED_SKILLS.values()
    ]
    return {
        "skills": all_skills[offset : offset + limit],
        "total": len(all_skills),
        "limit": limit,
        "offset": offset,
    }


@router.get("/techniques", summary="List all MITRE ATT&CK techniques")
async def list_techniques(
    limit: int = Query(50, ge=1, le=200, description="Max results"),
    offset: int = Query(0, ge=0, description="Results to skip"),
) -> dict[str, Any]:
    seen: set[str] = set()
    all_techniques: list[dict[str, Any]] = []
    for t in SEED_MITRE_TECHNIQUES.values():
        if t.id not in seen:
            seen.add(t.id)
            all_techniques.append(
                {
                    "id": t.id,
                    "name": t.name,
                    "description": t.description,
                    "tactic_name": t.tactic.name if t.tactic else "General",
                    "sub_techniques": [st.id for st in t.sub_techniques],
                }
            )
    return {
        "techniques": all_techniques[offset : offset + limit],
        "total": len(all_techniques),
        "limit": limit,
        "offset": offset,
    }


@router.get("/domains", summary="List all cybersecurity domains")
async def list_domains(
    limit: int = Query(20, ge=1, le=100, description="Max results"),
    offset: int = Query(0, ge=0, description="Results to skip"),
) -> dict[str, Any]:
    all_domains = [
        {
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "capability_names": [c.name for c in d.capabilities],
            "technologies": [t.name for t in d.technologies],
        }
        for d in ALL_DOMAINS
    ]
    return {
        "domains": all_domains[offset : offset + limit],
        "total": len(all_domains),
        "limit": limit,
        "offset": offset,
    }
