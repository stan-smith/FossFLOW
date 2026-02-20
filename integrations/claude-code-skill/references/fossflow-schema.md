# FossFLOW Diagram JSON Schema Reference

FossFLOW supports two JSON formats: **Compact** (optimized for LLM generation) and **Full** (native editor format).

## Compact Format (Preferred for Generation)

Token-efficient format designed for AI generation. FossFLOW auto-expands it on import.

```json
{
  "t": "Diagram Title (max 40 chars)",
  "i": [
    ["Item Name (max 30)", "icon_id", "Description (max 100)"]
  ],
  "v": [
    [
      [[itemIndex, x, y], [itemIndex, x, y]],
      [[fromIndex, toIndex], [fromIndex, toIndex]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `t` | string | Diagram title, max 40 characters |
| `i` | array | Items array. Each item: `[name, icon_id, description]` |
| `v` | array | Views array. Each view: `[positions, connections]` |
| `_` | object | Metadata marker, always `{"f": "compact", "v": "1.0"}` |

### Items (`i`)

Each item is a 3-element array:
- `[0]` name: Display label (max 30 chars)
- `[1]` icon_id: Icon identifier from the catalog (e.g. `"server"`, `"aws-ec2"`)
- `[2]` description: Tooltip/description text (max 100 chars)

### Views (`v`)

Each view is a 2-element array: `[positions, connections]`

**Positions**: `[itemIndex, x, y]`
- `itemIndex`: Zero-based index into the items (`i`) array
- `x`: Grid x-coordinate (integer, negative = left, positive = right)
- `y`: Grid y-coordinate (integer, negative = up, positive = down)

**Connections**: `[fromIndex, toIndex]`
- `fromIndex`: Index of source item in items array
- `toIndex`: Index of target item in items array

### Position System

- Isometric grid with integer-based coordinates
- Each unit = one tile (~141.5 x 81.9 pixels projected)
- Typical range: -20 to +20 for both axes
- Recommended spacing: 3-5 units between connected nodes
- For readability, keep 4+ units between unconnected nodes

### Compact Format Example

```json
{
  "t": "AWS Serverless Architecture",
  "i": [
    ["CloudFront", "aws-cloudfront", "CDN and content delivery"],
    ["API Gateway", "aws-api-gateway", "REST API management"],
    ["Lambda", "aws-lambda", "Serverless compute functions"],
    ["DynamoDB", "aws-dynamodb", "NoSQL database"],
    ["S3 Bucket", "aws-s3", "Static file storage"]
  ],
  "v": [
    [
      [[0, -8, -4], [1, 0, 0], [2, 0, 4], [3, 8, 4], [4, 8, -4]],
      [[0, 1], [1, 2], [2, 3], [0, 4]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

---

## Full Format

Native editor format with UUIDs, colors, connectors with labels, rectangles, and text boxes.

### Top-Level Structure

```json
{
  "version": "1.0.0",
  "title": "string (max 100)",
  "description": "string (max 1000)",
  "icons": [],
  "colors": [],
  "items": [],
  "views": [],
  "fitToView": true
}
```

### Icons

```json
{
  "id": "server",
  "name": "Server",
  "url": "data:image/svg+xml;base64,...",
  "collection": "ISOFLOW",
  "isIsometric": true,
  "scale": 1.0
}
```

### Colors

```json
{
  "id": "blue",
  "value": "#0066cc"
}
```

### Model Items (Node Catalog)

```json
{
  "id": "uuid-string",
  "name": "Item Name (max 100)",
  "description": "Rich text (max 1000)",
  "icon": "icon-id-reference"
}
```

### Views

```json
{
  "id": "uuid",
  "name": "View Name (max 100)",
  "description": "max 1000",
  "items": [],
  "connectors": [],
  "rectangles": [],
  "textBoxes": []
}
```

### View Items (Placement)

```json
{
  "id": "references-a-model-item-id",
  "tile": { "x": 0, "y": 0 },
  "labelHeight": 80
}
```

### Connectors

```json
{
  "id": "uuid",
  "color": "color-id-reference",
  "customColor": "#rgb",
  "width": 10,
  "style": "SOLID | DOTTED | DASHED",
  "lineType": "SINGLE | DOUBLE | DOUBLE_WITH_CIRCLE",
  "showArrow": true,
  "anchors": [
    { "id": "uuid", "ref": { "item": "view-item-id" } },
    { "id": "uuid", "ref": { "item": "view-item-id" } }
  ],
  "labels": [
    { "id": "uuid", "text": "Label text", "position": 50, "height": 0 }
  ]
}
```

Anchor `ref` supports exactly one of:
- `{ "item": "view-item-id" }` — snaps to an item
- `{ "anchor": "anchor-id" }` — references another anchor
- `{ "tile": { "x": 0, "y": 0 } }` — fixed grid position

### Rectangles (Colored Regions)

```json
{
  "id": "uuid",
  "color": "color-id",
  "customColor": "#rgb",
  "from": { "x": 0, "y": 0 },
  "to": { "x": 5, "y": 3 }
}
```

### Text Boxes

```json
{
  "id": "uuid",
  "tile": { "x": 0, "y": 0 },
  "content": "Label text (max 100)",
  "fontSize": 0.6,
  "orientation": "X | Y"
}
```

### Full Format Example

```json
{
  "title": "Simple Architecture",
  "icons": [
    { "id": "server", "name": "server", "url": "data:image/svg+xml;base64,...", "isIsometric": true }
  ],
  "colors": [
    { "id": "blue", "value": "#0066cc" }
  ],
  "items": [
    { "id": "item-1", "name": "Web Server", "icon": "server" },
    { "id": "item-2", "name": "Database", "icon": "storage" }
  ],
  "views": [
    {
      "id": "view-1",
      "name": "Overview",
      "items": [
        { "id": "item-1", "tile": { "x": 0, "y": 0 }, "labelHeight": 80 },
        { "id": "item-2", "tile": { "x": 4, "y": 4 }, "labelHeight": 80 }
      ],
      "connectors": [
        {
          "id": "conn-1",
          "color": "blue",
          "anchors": [
            { "id": "a1", "ref": { "item": "item-1" } },
            { "id": "a2", "ref": { "item": "item-2" } }
          ]
        }
      ],
      "rectangles": [],
      "textBoxes": []
    }
  ],
  "fitToView": true
}
```

### Validation Rules

1. Every `ViewItem.id` must reference an existing `ModelItem.id`
2. Every `ModelItem.icon` must reference an existing `Icon.id`
3. Every `Connector.color` must reference an existing `Color.id`
4. Every `Rectangle.color` must reference an existing `Color.id`
5. `ConnectorAnchor.ref.item` must reference a `ViewItem.id` in the same view
6. Each anchor `ref` must have exactly one key (`item`, `anchor`, or `tile`)
7. Each connector must have at least 2 anchors

### Default Values

| Property | Default |
|---|---|
| `Connector.width` | `10` |
| `Connector.style` | `'SOLID'` |
| `Connector.lineType` | `'SINGLE'` |
| `Connector.showArrow` | `true` |
| `ViewItem.labelHeight` | `80` |
| `TextBox.orientation` | `'X'` |
| `TextBox.fontSize` | `0.6` |
