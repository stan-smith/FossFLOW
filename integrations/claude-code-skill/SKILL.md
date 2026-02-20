---
name: fossflow
description: Generate isometric infrastructure and architecture diagrams in FossFLOW JSON format. This skill should be used when users want to create architecture diagrams, data flow diagrams, infrastructure visualizations, or system design diagrams that can be imported into the FossFLOW editor (https://github.com/stan-smith/FossFLOW). Triggers on requests like "create a diagram", "generate an architecture diagram", "make a FossFLOW diagram", or any /fossflow command.
---

# FossFLOW Diagram Generator

## Overview

Generate valid FossFLOW JSON diagrams — isometric architecture, data flow, and infrastructure visualizations. Output files are importable directly into the FossFLOW PWA editor.

## Workflow

### 1. Analyze the Request

Determine the diagram type from the user's request:

| Request Pattern | Diagram Type | Approach |
|---|---|---|
| "architecture diagram for this project" | **Codebase Architecture** | Read key files (entry points, router, main components) to map structure |
| "data flow diagram" | **Data Pipeline** | Trace data from source through transformations to UI |
| "infrastructure diagram" | **Cloud Infrastructure** | Map cloud services, networking, and connections |
| "system design for X" | **System Design** | Design services, databases, queues, and their interactions |
| "diagram of X" | **Custom** | Analyze what X is and create appropriate visualization |

For codebase-related diagrams, read the relevant source files to understand the actual architecture before generating. Never guess structure — always verify by reading code.

### 2. Choose the Format

**Always prefer the Compact format** unless the user explicitly needs:
- Custom connector labels, styles, or colors → use Full format
- Colored rectangular regions or text boxes → use Full format
- Fine-grained control over connector routing → use Full format

### 3. Select Icons

Load `references/icon-catalog.md` to select appropriate icons. Follow these guidelines:

- For **generic architecture**: use ISOFLOW icons (`server`, `storage`, `cache`, `cube`, etc.)
- For **AWS infrastructure**: use `aws-*` prefixed icons
- For **Azure infrastructure**: use `azure-*` prefixed icons
- For **GCP infrastructure**: use `gcp-*` prefixed icons
- For **Kubernetes**: use `k8s-*` prefixed icons
- **Mix collections** when the architecture spans multiple providers

Icon selection priorities:
1. Use the most specific icon available (e.g. `aws-lambda` over `function-module` for Lambda)
2. Use `cube` or `block` as fallback for components without a clear match
3. Use `diamond` for decision points, routers, or branching logic
4. Use `firewall` for validation, security, or schema enforcement layers

### 4. Design the Layout

Plan node positions on the isometric grid before writing JSON:

**Layout principles:**
- **Flow direction**: Top-to-bottom (decreasing to increasing Y) for data pipelines, left-to-right (decreasing to increasing X) for horizontal architectures
- **Spacing**: 3-4 units between directly connected nodes, 5+ units between parallel branches
- **Grouping**: Place related nodes close together (e.g. API + Database, Frontend components)
- **Symmetry**: Center the main pipeline, branch secondary items left/right
- **Grid range**: Stay within -15 to +15 on both axes for readability

**Common layout patterns:**

```
Linear Pipeline (vertical):
  [Source]     (0, -8)
     |
  [Process]    (0, -4)
     |
  [Output]     (0, 0)

Branching (fan-out):
              [Source]           (0, -4)
            /    |    \
  [Branch A] [Branch B] [Branch C]
  (-6, 0)    (0, 0)     (6, 0)

Bidirectional (feedback loops):
  [UI] ←→ [State] ←→ [API]
  (-6, 0)  (0, 0)    (6, 0)
```

### 5. Generate the JSON

Load `references/fossflow-schema.md` for the complete schema reference.

**Compact format template:**

```json
{
  "t": "Title (max 40 chars)",
  "i": [
    ["Node Name", "icon_id", "Short description"]
  ],
  "v": [
    [
      [[itemIndex, x, y]],
      [[fromIndex, toIndex]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

**Generation rules:**
- Every item in `i` must appear exactly once in the positions array
- Connection indices are zero-based references into the `i` array
- Connections represent data flow direction (from → to)
- Avoid crossing connections where possible by adjusting positions
- Keep descriptions concise — they appear as tooltips in the editor

### 6. Write and Explain

1. Write the JSON file using the Write tool (default filename: `architecture-diagram.json` or a descriptive name)
2. Provide a clear explanation of the diagram with:
   - A summary of what the diagram shows
   - Description of each layer/group of nodes
   - Explanation of the data flow through connections
   - Any feedback loops or bidirectional relationships

## Diagram Quality Checklist

Before writing the final file, verify:

- [ ] All items have valid icon IDs from the catalog
- [ ] All items appear in the positions array
- [ ] All connection indices are within bounds of the items array
- [ ] No duplicate positions (two items at the same tile)
- [ ] Spacing between connected nodes is 3-4 units
- [ ] Title is under 40 characters
- [ ] Item names are under 30 characters
- [ ] Descriptions are under 100 characters
- [ ] The layout reads naturally in the flow direction

## Examples

### Web Application Architecture

```json
{
  "t": "Web App Architecture",
  "i": [
    ["Browser", "desktop", "Client-side SPA"],
    ["CDN", "sphere", "Static asset delivery"],
    ["API Gateway", "diamond", "Request routing and auth"],
    ["Auth Service", "lock", "JWT token validation"],
    ["App Server", "server", "Business logic"],
    ["Cache", "cache", "Redis session store"],
    ["Database", "storage", "PostgreSQL primary"],
    ["Queue", "queue", "Async job processing"],
    ["Worker", "function-module", "Background tasks"]
  ],
  "v": [
    [
      [[0, -8, -4], [1, -4, -8], [2, 0, 0], [3, -6, 2], [4, 0, 4], [5, 6, 2], [6, 0, 8], [7, 6, 6], [8, 6, 10]],
      [[0, 2], [1, 0], [2, 3], [2, 4], [2, 5], [4, 6], [4, 7], [7, 8], [5, 4]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Data Pipeline

```json
{
  "t": "ETL Data Pipeline",
  "i": [
    ["Raw Data Lake", "storage", "S3 raw data bucket"],
    ["Schema Validator", "firewall", "Validates incoming data format"],
    ["Transform", "function-module", "Clean + normalize records"],
    ["Enrichment", "package-module", "Add derived fields"],
    ["Data Warehouse", "storage", "Analytics-ready tables"],
    ["Dashboard", "desktop", "BI reporting interface"],
    ["Alert System", "mail", "Anomaly notifications"]
  ],
  "v": [
    [
      [[0, 0, -10], [1, 0, -6], [2, 0, -2], [3, 0, 2], [4, 0, 6], [5, -5, 10], [6, 5, 10]],
      [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

## Resources

- `references/fossflow-schema.md` — Complete JSON schema for both compact and full formats
- `references/icon-catalog.md` — All 1,062 available icons across 5 collections (ISOFLOW, AWS, Azure, GCP, K8s)
