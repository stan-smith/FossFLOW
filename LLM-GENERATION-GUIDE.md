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

### Basic Icons (ISOFLOW Collection — 37 icons)
Common isometric icons for general use. For the complete list, see `icon-list-generation-guide.md`.
- `server` - Generic server
- `storage` - Database/storage
- `cache` - Caching system
- `cloud` - Cloud services, external APIs
- `cube` - Generic service, application
- `block` - Generic component, module
- `desktop` - Client, browser, workstation
- `laptop` - Client device, developer
- `mobiledevice` - Mobile device
- `diamond` - Decision point, router, gateway
- `firewall` - Firewall, security, validation
- `lock` - Authentication, encryption
- `function-module` - Function, Lambda, API handler
- `package-module` - Package, library, dependency
- `switch-module` - Switch, toggle, routing
- `loadbalancer` - Load balancer, traffic distribution
- `queue` - Message queue (SQS, RabbitMQ)
- `router` - Network router, API router
- `dns` - DNS, domain resolution, search
- `user` - User, person, identity
- `mail` - Email, notifications
- `mailmultiple` - Batch email, message queue
- `document` - File, document, config
- `sphere` - Global, CDN, distribution
- `vm` - Virtual machine, container
- `cronjob` - Scheduled tasks, background jobs
- `speech` - Chat, webhook, communication
- `tower` - Infrastructure, broadcast
- `truck` - CI/CD, delivery pipeline
- `pyramid` - Hierarchy, aggregation
- `image` - Media, image processing
- `office` - Organization, company
- `printer` - Output, reporting
- `cardterminal` - Payment processing
- `paymentcard` - Payment, billing
- `plane` - Deployment, delivery

### AWS Icons (320 available)
Use `aws-` prefix for AWS services. For the full list, see `icon-list-generation-guide.md`.
- `aws-ec2` - EC2 instances
- `aws-simple-storage-service` - S3 storage
- `aws-rds` - RDS database
- `aws-lambda` - Lambda functions
- `aws-api-gateway` - API Gateway
- `aws-cloudfront` - CloudFront CDN
- `aws-route-53` - Route 53 DNS
- `aws-elastic-load-balancing` - Load balancer
- `aws-identity-and-access-management` - IAM
- `aws-cloudwatch` - Monitoring
- `aws-simple-notification-service` - SNS notifications
- `aws-simple-queue-service` - SQS queues
- `aws-dynamodb` - DynamoDB database
- `aws-opensearch-service` - OpenSearch (Elasticsearch)
- `aws-redshift` - Data warehouse
- `aws-kinesis` - Data streaming
- `aws-elastic-kubernetes-service` - EKS
- `aws-fargate` - Container service
- `aws-cognito` - User authentication
- `aws-elasticache` - ElastiCache
- `aws-aurora` - Aurora database
- `aws-step-functions` - Step Functions
- `aws-secrets-manager` - Secrets Manager

### Azure Icons (369 available)
Use `azure-` prefix for Azure services. For the full list, see `icon-list-generation-guide.md`.
- `azure-virtual-machine` - Virtual machines
- `azure-storage-accounts` - Storage
- `azure-sql-database` - SQL database
- `azure-app-services` - Web apps
- `azure-function-apps` - Functions
- `azure-api-management-services` - API management
- `azure-cdn-profiles` - Content delivery
- `azure-dns-zones` - DNS service
- `azure-load-balancers` - Load balancer
- `azure-active-directory` - Identity
- `azure-monitor` - Monitoring
- `azure-service-bus` - Message bus
- `azure-cosmos-db` - NoSQL database
- `azure-cache-redis` - Redis cache
- `azure-kubernetes-services` - Kubernetes
- `azure-container-instances` - Containers
- `azure-logic-apps` - Logic apps
- `azure-data-factory` - Data pipeline
- `azure-key-vaults` - Key management
- `azure-cognitive-services` - AI services

### GCP Icons (280 available)
Use `gcp-` prefix for Google Cloud services. For the full list, see `icon-list-generation-guide.md`.
- `gcp-compute-engine` - Virtual machines
- `gcp-cloud-storage` - Storage
- `gcp-cloud-sql` - SQL database
- `gcp-app-engine` - Web apps
- `gcp-cloud-functions` - Functions
- `gcp-cloud-api-gateway` - API gateway
- `gcp-cloud-cdn` - Content delivery
- `gcp-cloud-dns` - DNS service
- `gcp-cloud-load-balancing` - Load balancer
- `gcp-identity-and-access-management` - IAM
- `gcp-cloud-monitoring` - Monitoring
- `gcp-pubsub` - Message queue (Pub/Sub)
- `gcp-firestore` - NoSQL database
- `gcp-memorystore` - Redis cache
- `gcp-google-kubernetes-engine` - GKE
- `gcp-cloud-run` - Container service
- `gcp-workflows` - Workflows
- `gcp-dataflow` - Data pipeline
- `gcp-secret-manager` - Secret management
- `gcp-ai-platform` - AI/ML platform

### Kubernetes Icons (56 available)
Use `k8s-` prefix for Kubernetes resources. For the full list, see `icon-list-generation-guide.md`.
- `k8s-pod` - Pods
- `k8s-svc` - Services
- `k8s-deploy` - Deployments
- `k8s-cm` - ConfigMaps
- `k8s-secret` - Secrets
- `k8s-ing` - Ingress
- `k8s-ns` - Namespaces
- `k8s-node` - Nodes
- `k8s-pv` - Persistent Volumes
- `k8s-pvc` - Persistent Volume Claims
- `k8s-ds` - DaemonSets
- `k8s-sts` - StatefulSets
- `k8s-job` - Jobs
- `k8s-cronjob` - CronJobs
- `k8s-hpa` - Horizontal Pod Autoscaler
- `k8s-role` - Roles
- `k8s-sa` - Service Accounts

## Positioning System

The positioning system uses a grid-based coordinate system:
- **X-axis**: Horizontal position (negative = left, positive = right)
- **Y-axis**: Vertical position (negative = up, positive = down)
- **Grid spacing**: Each unit represents one grid cell
- **Typical range**: -20 to +20 for both axes

### Positioning Guidelines:
- Start with main components around (0, 0)
- Place related components close together
- Use consistent spacing (3-5 units between connected nodes, 5+ between parallel branches)
- Arrange in logical flow (top to bottom for pipelines, left to right for horizontal architectures)
- Avoid placing two items at the same coordinates

### Common Layout Patterns:

**Linear Pipeline (vertical):**
```
[Source]      (0, -8)
   |
[Process]     (0, -4)
   |
[Output]      (0, 0)
```

**Fan-out (branching):**
```
           [Source]              (0, -4)
         /    |    \
[Branch A] [Branch B] [Branch C]
(-6, 0)    (0, 0)     (6, 0)
```

**Layered Architecture:**
```
[Client]              (-6, -6)  [Client 2]    (6, -6)
            \         /
          [Load Balancer]        (0, -2)
          /           \
[Service A]          [Service B]
(-4, 2)               (4, 2)
          \           /
          [Database]              (0, 6)
```

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
    ["Web App", "desktop", "Frontend application"],
    ["API Gateway", "diamond", "API management layer"],
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
    ["S3", "aws-simple-storage-service", "Static file storage"]
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
    ["Ingress", "k8s-ing", "Traffic routing"],
    ["Frontend", "k8s-pod", "React application"],
    ["API Service", "k8s-svc", "Backend API"],
    ["Database", "k8s-pod", "PostgreSQL database"],
    ["ConfigMap", "k8s-cm", "Configuration data"]
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