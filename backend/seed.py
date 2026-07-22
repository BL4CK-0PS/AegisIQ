"""
AegisIQ Seed Script

Populates the database with a default admin user, demo user, sample assessments,
question records, and evaluation results for local dev and demo setups.

Run: python -m backend.seed
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from backend.auth import hash_password
from backend.database import async_session_factory, init_db
from backend.models import (
    UserModel,
    AssessmentModel,
    QuestionRecordModel,
    EvaluationResultModel,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger("aegisiq.seed")

ADMIN_EMAIL = "admin@aegisiq.io"
ADMIN_PASSWORD = "admin_aegisiq_2026"
ADMIN_DISPLAY_NAME = "AegisIQ Admin"

DEMO_EMAIL = "demo@aegisiq.io"
DEMO_PASSWORD = "demo_aegisiq_2026"
DEMO_DISPLAY_NAME = "Demo Analyst"


async def seed_admin_user() -> UserModel | None:
    async with async_session_factory() as session:
        result = await session.execute(
            select(UserModel).where(UserModel.email == ADMIN_EMAIL)
        )
        existing = result.scalar_one_or_none()
        if existing:
            logger.info("Admin user already exists: %s", ADMIN_EMAIL)
            return existing

        admin = UserModel(
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            display_name=ADMIN_DISPLAY_NAME,
            role="admin",
        )
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        logger.info("Created admin user: %s (role=admin)", ADMIN_EMAIL)
        return admin


async def seed_demo_user() -> UserModel | None:
    async with async_session_factory() as session:
        result = await session.execute(
            select(UserModel).where(UserModel.email == DEMO_EMAIL)
        )
        existing = result.scalar_one_or_none()
        if existing:
            logger.info("Demo user already exists: %s", DEMO_EMAIL)
            return existing

        demo = UserModel(
            email=DEMO_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
            display_name=DEMO_DISPLAY_NAME,
            role="professional",
        )
        session.add(demo)
        await session.commit()
        await session.refresh(demo)
        logger.info("Created demo user: %s (role=professional)", DEMO_EMAIL)
        return demo


async def seed_sample_assessments(user: UserModel) -> None:
    """Create sample assessments with question records and evaluation results."""
    async with async_session_factory() as session:
        result = await session.execute(
            select(AssessmentModel).where(AssessmentModel.candidate_id == user.id)
        )
        existing = result.scalars().all()
        if existing:
            logger.info("Sample assessments already exist for user %s", user.email)
            return

        now = datetime.now(timezone.utc)
        assessment = AssessmentModel(
            candidate_id=user.id,
            domain="Web Application Security",
            status="completed",
            current_difficulty="intermediate",
            started_at=now - timedelta(hours=2),
            completed_at=now - timedelta(hours=1),
            summary={
                "domain": "Web Application Security",
                "total_questions": 2,
                "average_score": 82.5,
            },
        )
        session.add(assessment)
        await session.flush()

        questions_data = [
            {
                "question_text": "Explain how SQL injection works and how to prevent it.",
                "domain": "Web Application Security",
                "skill": "SQL Injection Prevention",
                "difficulty": "intermediate",
                "score": 85.0,
                "confidence": 0.88,
                "passed": True,
                "candidate_answer": (
                    "SQL injection occurs when user input is concatenated directly into "
                    "SQL queries without sanitization. An attacker can inject malicious SQL "
                    "to extract, modify, or delete data. Prevention includes using parameterized "
                    "queries, prepared statements, ORM frameworks, and input validation."
                ),
            },
            {
                "question_text": "Describe the OWASP Top 10 vulnerability categories.",
                "domain": "Web Application Security",
                "skill": "OWASP Top 10",
                "difficulty": "intermediate",
                "score": 80.0,
                "confidence": 0.82,
                "passed": True,
                "candidate_answer": (
                    "The OWASP Top 10 includes: Broken Access Control, Cryptographic Failures, "
                    "Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, "
                    "Authentication Failures, Data Integrity Failures, Logging Failures, and "
                    "Server-Side Request Forgery."
                ),
            },
        ]

        eval_data = [
            {
                "overall_score": 85.0,
                "confidence": 0.88,
                "proficiency_level": "intermediate",
                "passed": True,
                "criteria_scores": [
                    {"name": "technical_depth", "score": 85.0, "max_score": 25.0},
                    {"name": "practical_application", "score": 82.0, "max_score": 25.0},
                    {"name": "communication", "score": 88.0, "max_score": 25.0},
                    {"name": "decision_making", "score": 80.0, "max_score": 25.0},
                ],
                "missing_concepts": ["blind SQL injection", "out-of-band extraction"],
                "demonstrated_skills": [
                    "parameterized queries",
                    "input validation",
                    "OWASP knowledge",
                ],
                "mitre_technique_ids": ["T1190"],
                "overall_justification": "Solid understanding of SQL injection prevention with good practical examples.",
            },
            {
                "overall_score": 80.0,
                "confidence": 0.82,
                "proficiency_level": "intermediate",
                "passed": True,
                "criteria_scores": [
                    {"name": "technical_depth", "score": 78.0, "max_score": 25.0},
                    {"name": "practical_application", "score": 80.0, "max_score": 25.0},
                    {"name": "communication", "score": 84.0, "max_score": 25.0},
                    {"name": "decision_making", "score": 78.0, "max_score": 25.0},
                ],
                "missing_concepts": [
                    "SSRF details",
                    "broken access control nuances",
                ],
                "demonstrated_skills": [
                    "OWASP Top 10 enumeration",
                    "vulnerability categorization",
                ],
                "mitre_technique_ids": ["T1190", "T1133"],
                "overall_justification": "Good awareness of OWASP categories with room for deeper technical detail.",
            },
        ]

        for i, qd in enumerate(questions_data):
            qr = QuestionRecordModel(
                assessment_id=assessment.id,
                question_text=qd["question_text"],
                domain=qd["domain"],
                skill=qd["skill"],
                difficulty=qd["difficulty"],
                score=qd["score"],
                confidence=qd["confidence"],
                passed=qd["passed"],
                candidate_answer=qd["candidate_answer"],
            )
            session.add(qr)
            await session.flush()

            ed = eval_data[i]
            er = EvaluationResultModel(
                question_id=qr.id,
                overall_score=ed["overall_score"],
                confidence=ed["confidence"],
                proficiency_level=ed["proficiency_level"],
                passed=ed["passed"],
                criteria_scores=ed["criteria_scores"],
                missing_concepts=ed["missing_concepts"],
                demonstrated_skills=ed["demonstrated_skills"],
                mitre_technique_ids=ed["mitre_technique_ids"],
                overall_justification=ed["overall_justification"],
            )
            session.add(er)

        await session.commit()
        logger.info(
            "Seeded 1 assessment with 2 question records and 2 evaluation results for %s",
            user.email,
        )


async def main() -> None:
    logger.info("Initialising database...")
    await init_db()

    logger.info("Seeding admin user...")
    admin = await seed_admin_user()

    logger.info("Seeding demo user...")
    demo = await seed_demo_user()

    if demo:
        logger.info("Seeding sample assessments for demo user...")
        await seed_sample_assessments(demo)

    logger.info("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
