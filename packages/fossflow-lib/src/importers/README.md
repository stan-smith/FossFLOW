# Mermaid Importer (Experimental)

This module provides experimental support for importing a limited subset of Mermaid diagrams into FossFLOW.

## Supported Mermaid Syntax

### Diagram Types
- `graph`
- `flowchart`

### Directions
- `TD` / `TB` (Top Down)
- `LR` (Left to Right)
- `BT` (Bottom Up)
- `RL` (Right to Left)

### Nodes
- **Square**: `A[Label]`
- **Round**: `A(Label)`
- **Diamond**: `A{Label}`
- **Circle**: `A((Label))`
- **Hexagon**: `A{{Label}}`

### Edges
- **Solid**: `A --> B`
- **Dotted**: `A -.-> B`
- **Bold/Thick**: `A ==> B`
- **Labels**: `A -->|label| B`

## Limitations
- **No subgraphs**: Nested structures are not supported.
- **No advanced styles**: Custom CSS, classes, or individual node styling are ignored.
- **Heuristic Layout**: Nodes are positioned using a basic layering algorithm. While functional, it is not as optimized as native Mermaid or Dagre layouts.
- **Simple Regex Parsing**: The parser uses regular expressions and may not handle extremely complex or nested valid Mermaid syntax.

## Purpose
This importer is intended as a quick bridge for text-based diagram ingestion, primarily for infrastructure and flow logic diagrams. It allows users to bootstrap FossFLOW diagrams using a human-readable text format.


**This importer is not enabled by default in the UI.**
