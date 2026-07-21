import logging
import os
from pathlib import Path
from typing import Any, Optional

import yaml

logger = logging.getLogger(__name__)


class PromptLoadError(Exception):
    """Raised when a prompt template cannot be located or parsed."""


class PromptValidationError(PromptLoadError):
    """Raised when required variables are missing from the render context."""


class PromptLoader:
    """Reads YAML prompt templates and renders them with variable injection."""

    def __init__(self, prompts_dir: str | os.PathLike[str]) -> None:
        self._prompts_dir = Path(prompts_dir).resolve()
        if not self._prompts_dir.is_dir():
            raise PromptLoadError(f"Prompts directory not found: {self._prompts_dir}")

    def load(self, template_name: str) -> dict[str, Any]:
        """Locate and parse a YAML template by name (accepts .yml, .yaml, or bare name)."""
        resolved: Optional[Path] = None
        if "." in template_name:
            candidate = self._prompts_dir / template_name
            if candidate.is_file():
                resolved = candidate
        else:
            for ext in (".yml", ".yaml"):
                candidate = self._prompts_dir / f"{template_name}{ext}"
                if candidate.is_file():
                    resolved = candidate
                    break

        if resolved is None:
            raise PromptLoadError(
                f"Prompt template '{template_name}' not found in {self._prompts_dir}"
            )

        with open(resolved, "r", encoding="utf-8") as fh:
            data: Any = yaml.safe_load(fh)

        if not isinstance(data, dict):
            raise PromptLoadError(
                f"Prompt template '{template_name}' must contain a YAML mapping, got {type(data).__name__}"
            )

        return data

    def render(
        self,
        template_name: str,
        variables: Optional[dict[str, Any]] = None,
    ) -> str:
        """Load a template and inject variables into the system and user sections."""
        template: dict[str, Any] = self.load(template_name)
        context: dict[str, Any] = variables if variables is not None else {}

        required: list[str] = template.get("required_variables", [])
        missing: list[str] = [var for var in required if var not in context]
        if missing:
            raise PromptValidationError(
                f"Prompt '{template_name}' is missing required variable(s): {missing}"
            )

        system_prompt: str = template.get("system", "")
        user_prompt: str = template.get("user", "")

        try:
            rendered_system: str = system_prompt.format(**context)
            rendered_user: str = user_prompt.format(**context)
        except KeyError as exc:
            raise PromptValidationError(
                f"Prompt '{template_name}' references undefined variable '{exc.args[0]}'"
            ) from exc

        parts: list[str] = []
        if rendered_system:
            parts.append(rendered_system)
        if rendered_user:
            parts.append(rendered_user)

        return "\n\n".join(parts)

    def load_system_prompt(self, template_name: str) -> str:
        """Return only the system section of a template."""
        template: dict[str, Any] = self.load(template_name)
        return template.get("system", "")

    def list_templates(self) -> list[str]:
        """Return the stem names of all available YAML templates."""
        names: list[str] = []
        for ext in (".yml", ".yaml"):
            for path in sorted(self._prompts_dir.glob(f"*{ext}")):
                names.append(path.stem)
        return names
