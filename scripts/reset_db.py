#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Database Reset Script
# Drops, recreates, migrates, and seeds the database
# Usage: ./reset_db.py (or python scripts/reset_db.py)
# ============================================

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def reset_database():
    """Reset the database completely."""
    print("=" * 50)
    print("  AegisIQ Database Reset")
    print("=" * 50)
    print()
    print("WARNING: This will destroy all data!")
    confirm = input("Continue? (yes/no): ").strip().lower()
    if confirm != "yes":
        print("Cancelled.")
        return

    try:
        # Try to use alembic for migrations
        print("\nRunning database migrations...")
        os.system("alembic downgrade base")
        os.system("alembic upgrade head")
        print("Migrations applied.")

        # Seed data
        print("\nSeeding sample data...")
        from scripts.seed import seed_sample_data
        seed_sample_data()

        print("\nDatabase reset complete!")

    except Exception as e:
        print(f"\nError during reset: {e}")
        print("Make sure PostgreSQL is running and alembic is configured.")
        sys.exit(1)


if __name__ == "__main__":
    reset_database()
