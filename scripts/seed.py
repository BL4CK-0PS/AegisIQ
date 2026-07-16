#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Seed Script
# Populates the database with sample data
# Usage: ./seed.py (or python scripts/seed.py)
# ============================================

import json
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def seed_sample_data():
    """Seed the database with sample cybersecurity domains and skills."""
    try:
        from src.core.knowledge.seed_data import ALL_DOMAINS, SEED_SKILLS, SEED_MITRE_TECHNIQUES
        from src.core.knowledge.rubrics import RUBRIC_REGISTRY

        print("=" * 50)
        print("  AegisIQ Sample Data Seed")
        print("=" * 50)
        print()

        print(f"Domains loaded:       {len(ALL_DOMAINS)}")
        for d in ALL_DOMAINS:
            print(f"  - {d.name}: {len(d.capabilities)} capabilities")

        print(f"Skills loaded:        {len(SEED_SKILLS)}")
        for name, skill in SEED_SKILLS.items():
            print(f"  - {name} ({skill.proficiency_level.value})")

        print(f"MITRE techniques:     {len(SEED_MITRE_TECHNIQUES)}")
        for t in SEED_MITRE_TECHNIQUES:
            print(f"  - {t.id}: {t.name} ({t.tactic.value})")

        print(f"Rubrics available:    {len(RUBRIC_REGISTRY)}")
        for level, rubric in RUBRIC_REGISTRY.items():
            print(f"  - {level}: {len(rubric.criteria)} criteria")

        print()
        print("All seed data loaded successfully!")
        print("Note: Run 'alembic upgrade head' to create database tables.")

    except ImportError as e:
        print(f"Import error: {e}")
        print("Make sure all dependencies are installed: pip install -r backend/requirements.txt")
        sys.exit(1)


if __name__ == "__main__":
    seed_sample_data()
