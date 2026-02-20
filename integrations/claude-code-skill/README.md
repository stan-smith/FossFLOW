# FossFLOW Diagram Generator — Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates valid FossFLOW isometric diagrams from natural language descriptions.

## What It Does

- Generates FossFLOW-compatible JSON diagrams (compact format)
- Knows all 1,062 available icons (ISOFLOW, AWS, Azure, GCP, Kubernetes)
- Applies layout best practices for readable isometric diagrams
- Can analyze codebases to generate architecture diagrams automatically

## Installation

Copy the skill into your project's `.claude/skills/` directory:

```bash
# From the FossFLOW repo root
mkdir -p your-project/.claude/skills/fossflow
cp -r integrations/claude-code-skill/* your-project/.claude/skills/fossflow/
```

Or copy it to your global Claude Code skills:

```bash
mkdir -p ~/.claude/skills/fossflow
cp -r integrations/claude-code-skill/* ~/.claude/skills/fossflow/
```

## Usage

Once installed, use the `/fossflow` command in Claude Code:

```
/fossflow architecture diagram for my project
/fossflow AWS infrastructure with Lambda, API Gateway and DynamoDB
/fossflow data flow from database to frontend
/fossflow Kubernetes deployment with ingress, services and pods
```

## Skill Structure

```
claude-code-skill/
├── SKILL.md                        # Main skill instructions
└── references/
    ├── fossflow-schema.md          # Complete JSON schema (compact + full format)
    └── icon-catalog.md             # All 1,062 icons with usage guide
```

## Output

The skill generates a `.json` file importable directly into FossFLOW via **Import** in the app menu.
