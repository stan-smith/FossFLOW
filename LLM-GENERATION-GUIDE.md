# LLM Generation Guide for Isoflow Compact Format

## Overview
This guide explains how to generate JSON files in the Isoflow compact format that can be successfully imported into the application. The compact format is designed for LLM generation with minimal token usage while preserving all essential diagram information.

## Format Structure

The compact format uses this JSON structure:

```json
{
  "t": "Diagram Title (max 40 chars)",
  "i": [
    ["Item Name (max 30 chars)", "icon_name", "Description (max 100 chars)"],
    ["Another Item", "storage", "Database server for user data"]
  ],
  "v": [
    [
      [[0, 2, 4], [1, -2, 6]],
      [[0, 1], [1, 0]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

## Structure Explanation

### Root Level
- `t`: **Title** - Short diagram title (max 40 characters)
- `i`: **Items** - Array of diagram elements
- `v`: **Views** - Array of views (usually just one)
- `_`: **Metadata** - Format identifier (always `{"f": "compact", "v": "1.0"}`)

### Items Array (`i`)
Each item is an array with 3 elements:
1. **Name** (string, max 30 chars): Display name of the item
2. **Icon** (string): Icon identifier from available icons
3. **Description** (string, max 100 chars): Brief description

### Views Array (`v`)
Each view contains:
1. **Positions Array**: `[[itemIndex, x, y], ...]` - Position of each item
2. **Connections Array**: `[[fromIndex, toIndex], ...]` - Connections between items

## Available Icons

### Basic Icons (ISOFLOW Collection)
Common icons for general use:
- `storage` - Database/storage
- `server` - Generic server
- `user` - User/person
- `cloud` - Cloud services
- `network` - Network component
- `security` - Security/firewall
- `api` - API/interface
- `queue` - Message queue
- `cache` - Caching system
- `function` - Function/lambda
- `mobile` - Mobile device
- `web` - Web application
- `email` - Email service
- `analytics` - Analytics/monitoring
- `backup` - Backup system
- `load-balancer` - Load balancer
- `cdn` - Content delivery network
- `vpn` - VPN connection
- `firewall` - Firewall/security
- `monitor` - Monitoring system

### AWS Icons (320 available)
Use `aws-` prefix for AWS services:
- `aws-ec2` - EC2 instances
- `aws-s3` - S3 storage
- `aws-rds` - RDS database
- `aws-lambda` - Lambda functions
- `aws-api-gateway` - API Gateway
- `aws-cloudfront` - CloudFront CDN
- `aws-route-53` - Route 53 DNS
- `aws-vpc` - Virtual Private Cloud
- `aws-elb` - Load balancer
- `aws-iam` - Identity management
- `aws-cloudwatch` - Monitoring
- `aws-sns` - Simple notification
- `aws-sqs` - Simple queue
- `aws-dynamodb` - DynamoDB database
- `aws-elasticsearch` - Elasticsearch
- `aws-redshift` - Data warehouse
- `aws-kinesis` - Data streaming
- `aws-eks` - Kubernetes service
- `aws-fargate` - Container service
- `aws-cognito` - User authentication

### Azure Icons (369 available)
Use `azure-` prefix for Azure services:
- `azure-virtual-machine` - Virtual machines
- `azure-storage-account` - Storage
- `azure-sql-database` - SQL database
- `azure-app-service` - Web apps
- `azure-function-app` - Functions
- `azure-api-management` - API management
- `azure-cdn` - Content delivery
- `azure-dns` - DNS service
- `azure-load-balancer` - Load balancer
- `azure-active-directory` - Identity
- `azure-monitor` - Monitoring
- `azure-service-bus` - Message bus
- `azure-cosmos-db` - NoSQL database
- `azure-redis-cache` - Redis cache
- `azure-kubernetes-service` - Kubernetes
- `azure-container-instances` - Containers
- `azure-logic-apps` - Logic apps
- `azure-data-factory` - Data pipeline
- `azure-key-vault` - Key management
- `azure-cognitive-services` - AI services

### GCP Icons (280 available)
Use `gcp-` prefix for Google Cloud services:
- `gcp-compute-engine` - Virtual machines
- `gcp-cloud-storage` - Storage
- `gcp-cloud-sql` - SQL database
- `gcp-app-engine` - Web apps
- `gcp-cloud-functions` - Functions
- `gcp-api-gateway` - API gateway
- `gcp-cloud-cdn` - Content delivery
- `gcp-cloud-dns` - DNS service
- `gcp-cloud-load-balancing` - Load balancer
- `gcp-identity-access-management` - IAM
- `gcp-cloud-monitoring` - Monitoring
- `gcp-cloud-pub-sub` - Message queue
- `gcp-cloud-firestore` - NoSQL database
- `gcp-memorystore` - Redis cache
- `gcp-kubernetes-engine` - Kubernetes
- `gcp-cloud-run` - Container service
- `gcp-cloud-workflows` - Workflows
- `gcp-cloud-dataflow` - Data pipeline
- `gcp-secret-manager` - Secret management
- `gcp-ai-platform` - AI/ML platform

### Kubernetes Icons (56 available)
Use `k8s-` prefix for Kubernetes resources:
- `k8s-pod` - Pods
- `k8s-service` - Services
- `k8s-deployment` - Deployments
- `k8s-configmap` - ConfigMaps
- `k8s-secret` - Secrets
- `k8s-ingress` - Ingress
- `k8s-namespace` - Namespaces
- `k8s-node` - Nodes
- `k8s-persistent-volume` - Storage
- `k8s-daemonset` - DaemonSets
- `k8s-statefulset` - StatefulSets
- `k8s-job` - Jobs
- `k8s-cronjob` - CronJobs
- `k8s-hpa` - Auto-scaling
- `k8s-rbac` - Role-based access

## Positioning System

The positioning system uses a grid-based coordinate system:
- **X-axis**: Horizontal position (negative = left, positive = right)
- **Y-axis**: Vertical position (negative = up, positive = down)
- **Grid spacing**: Each unit represents one grid cell
- **Typical range**: -20 to +20 for both axes

### Positioning Guidelines:
- Start with main components around (0, 0)
- Place related components close together
- Use consistent spacing (3-5 units between components)
- Arrange in logical flow (left to right, top to bottom)

## Connection Guidelines

Connections are defined as `[fromIndex, toIndex]` pairs:
- **fromIndex**: Index of source item in items array
- **toIndex**: Index of destination item in items array
- **Direction**: Connections are directional (from → to)

### Common Connection Patterns:
- **Linear flow**: [0,1], [1,2], [2,3]
- **Hub and spoke**: [0,1], [0,2], [0,3]
- **Mesh**: Multiple bidirectional connections
- **Layered**: Connections between architectural layers

## Generation Examples

### Example 1: Simple Web Application

```json
{
  "t": "Simple Web App Architecture",
  "i": [
    ["Web App", "web", "Frontend application"],
    ["API Gateway", "api", "API management layer"],
    ["Database", "storage", "User data storage"],
    ["Cache", "cache", "Redis caching layer"]
  ],
  "v": [
    [
      [[0, -6, 0], [1, 0, 0], [2, 6, 0], [3, 0, -4]],
      [[0, 1], [1, 2], [1, 3]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

### Example 2: AWS Architecture

```json
{
  "t": "AWS Serverless Architecture",
  "i": [
    ["CloudFront", "aws-cloudfront", "Content delivery network"],
    ["API Gateway", "aws-api-gateway", "API management"],
    ["Lambda", "aws-lambda", "Serverless functions"],
    ["DynamoDB", "aws-dynamodb", "NoSQL database"],
    ["S3", "aws-s3", "Static file storage"]
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

### Example 3: Kubernetes Architecture

```json
{
  "t": "Kubernetes Application",
  "i": [
    ["Ingress", "k8s-ingress", "Traffic routing"],
    ["Frontend", "k8s-pod", "React application"],
    ["API Service", "k8s-service", "Backend API"],
    ["Database", "k8s-pod", "PostgreSQL database"],
    ["ConfigMap", "k8s-configmap", "Configuration data"]
  ],
  "v": [
    [
      [[0, 0, -6], [1, -4, 0], [2, 4, 0], [3, 4, 6], [4, -4, 6]],
      [[0, 1], [0, 2], [2, 3], [4, 1], [4, 2]]
    ]
  ],
  "_": { "f": "compact", "v": "1.0" }
}
```

## Best Practices for LLM Generation

### 1. Icon Selection
- Use specific cloud provider icons when targeting that platform
- Use generic icons for platform-agnostic diagrams
- Match icon semantics to component function
- Prefer well-known service icons over generic ones

### 2. Naming
- Keep names concise but descriptive
- Use standard terminology for components
- Include version/type info when relevant
- Avoid special characters in names

### 3. Descriptions
- Provide context about component purpose
- Include key technologies/versions
- Mention important configurations
- Keep under 100 characters

### 4. Layout
- Group related components together
- Use consistent spacing between layers
- Consider data flow direction
- Leave space for connection lines

### 5. Connections
- Model actual data/control flow
- Avoid crossing connections when possible
- Use consistent connection semantics
- Consider bidirectional vs unidirectional flows

## Validation Checklist

Before generating, ensure:
- [ ] All icon names exist in available icons list
- [ ] Item names are ≤ 30 characters
- [ ] Descriptions are ≤ 100 characters
- [ ] Title is ≤ 40 characters
- [ ] Position coordinates are reasonable (-20 to +20)
- [ ] Connection indices reference valid items
- [ ] Metadata format is exactly `{"f": "compact", "v": "1.0"}`
- [ ] JSON structure matches the required format
- [ ] All required fields are present

## Common Pitfalls to Avoid

1. **Invalid icon names**: Always use exact icon IDs from the available list
2. **Missing descriptions**: Always provide the third element in item arrays
3. **Incorrect metadata**: Use exact format `{"f": "compact", "v": "1.0"}`
4. **Invalid connections**: Ensure indices refer to existing items
5. **Extreme coordinates**: Keep positions within reasonable bounds
6. **Missing views**: Always include at least one view with positions
7. **Inconsistent arrays**: Ensure positions and items arrays align

## Token Optimization Tips

- Use shorter but meaningful names
- Truncate descriptions to essential info
- Use efficient coordinate values
- Minimize redundant connections
- Group related components to reduce positioning complexity

This format typically uses 70-90% fewer tokens than the full JSON format while maintaining complete functionality and visual fidelity when imported into the Isoflow application.