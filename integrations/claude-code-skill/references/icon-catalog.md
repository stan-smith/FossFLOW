# FossFLOW Icon Catalog

1,062 total icons across 5 collections. Use the `id` value when referencing icons in diagrams.

## ISOFLOW Collection (37 icons)

General-purpose isometric icons. Best for generic architecture diagrams.

| ID | Name | Best For |
|----|------|----------|
| `block` | Block | Generic component, module |
| `cache` | Cache | Caching layer, Redis, Memcached |
| `cardterminal` | Card Terminal | Payment processing |
| `cloud` | Cloud | Cloud service, external API, SaaS |
| `cronjob` | Cron Job | Scheduled tasks, background jobs |
| `cube` | Cube | Generic service, application |
| `desktop` | Desktop | Client, browser, workstation |
| `diamond` | Diamond | Decision point, router, gateway |
| `dns` | DNS | DNS, domain resolution, search |
| `document` | Document | File, document, config |
| `firewall` | Firewall | Security, WAF, validation |
| `function-module` | Function Module | Function, Lambda, serverless |
| `image` | Image | Media, image processing |
| `laptop` | Laptop | Client device, developer |
| `loadbalancer` | Load Balancer | Load balancing, traffic distribution |
| `lock` | Lock | Authentication, encryption, security |
| `mail` | Mail | Email, notifications |
| `mailmultiple` | Mail Multiple | Batch email, message queue |
| `mobiledevice` | Mobile Device | Mobile app, responsive |
| `office` | Office | Organization, company |
| `package-module` | Package Module | Package, library, dependency |
| `paymentcard` | Payment Card | Payment, billing |
| `plane` | Plane | Deployment, delivery |
| `printer` | Printer | Output, reporting |
| `pyramid` | Pyramid | Hierarchy, aggregation |
| `queue` | Queue | Message queue, SQS, RabbitMQ |
| `router` | Router | Network router, API router |
| `server` | Server | Server, backend, API |
| `speech` | Speech | Chat, communication, webhook |
| `sphere` | Sphere | Global, CDN, distribution |
| `storage` | Storage | Database, storage, S3 |
| `switch-module` | Switch Module | Switch, toggle, feature flag |
| `tower` | Tower | Infrastructure, broadcast |
| `truck` | Truck | CI/CD, delivery pipeline |
| `truck-2` | Truck 2 | Alternative delivery icon |
| `user` | User | User, person, identity |
| `vm` | VM | Virtual machine, container |

## AWS Collection (320 icons)

Prefix: `aws-`. Common icons:

| ID | Best For |
|----|----------|
| `aws-ec2` | EC2 instances |
| `aws-simple-storage-service` | S3 storage |
| `aws-lambda` | Lambda functions |
| `aws-rds` | RDS databases |
| `aws-dynamodb` | DynamoDB |
| `aws-api-gateway` | API Gateway |
| `aws-cloudfront` | CloudFront CDN |
| `aws-simple-queue-service` | SQS queues |
| `aws-simple-notification-service` | SNS notifications |
| `aws-elastic-container-service` | ECS containers |
| `aws-elastic-kubernetes-service` | EKS Kubernetes |
| `aws-elasticache` | ElastiCache |
| `aws-route-53` | Route 53 DNS |
| `aws-cognito` | Cognito auth |
| `aws-identity-and-access-management` | IAM permissions |
| `aws-cloudwatch` | CloudWatch monitoring |
| `aws-kinesis` | Kinesis streaming |
| `aws-step-functions` | Step Functions |
| `aws-secrets-manager` | Secrets Manager |
| `aws-elastic-load-balancing` | Elastic Load Balancer |
| `aws-fargate` | Fargate serverless containers |
| `aws-aurora` | Aurora database |
| `aws-redshift` | Redshift data warehouse |
| `aws-athena` | Athena queries |

## Azure Collection (369 icons)

Prefix: `azure-`. Common icons:

| ID | Best For |
|----|----------|
| `azure-virtual-machine` | Virtual Machines |
| `azure-sql-database` | SQL Database |
| `azure-app-services` | App Services |
| `azure-function-apps` | Azure Functions |
| `azure-blob-block` | Blob Storage |
| `azure-cosmos-db` | Cosmos DB |
| `azure-active-directory` | Active Directory |
| `azure-api-management-services` | API Management |
| `azure-kubernetes-services` | AKS |
| `azure-cache-redis` | Redis Cache |
| `azure-cdn-profiles` | Azure CDN |
| `azure-event-hubs` | Event Hubs |
| `azure-service-bus` | Service Bus |
| `azure-key-vaults` | Key Vault |
| `azure-monitor` | Azure Monitor |
| `azure-load-balancers` | Load Balancer |
| `azure-front-doors` | Front Door |
| `azure-container-instances` | Container Instances |

## GCP Collection (280 icons)

Prefix: `gcp-`. Common icons:

| ID | Best For |
|----|----------|
| `gcp-compute-engine` | Compute Engine |
| `gcp-cloud-storage` | Cloud Storage |
| `gcp-cloud-sql` | Cloud SQL |
| `gcp-cloud-functions` | Cloud Functions |
| `gcp-cloud-run` | Cloud Run |
| `gcp-bigquery` | BigQuery |
| `gcp-pubsub` | Pub/Sub |
| `gcp-cloud-cdn` | Cloud CDN |
| `gcp-cloud-load-balancing` | Load Balancing |
| `gcp-cloud-armor` | Cloud Armor |
| `gcp-cloud-dns` | Cloud DNS |
| `gcp-firestore` | Firestore |
| `gcp-memorystore` | Memorystore |
| `gcp-google-kubernetes-engine` | GKE |
| `gcp-cloud-tasks` | Cloud Tasks |
| `gcp-identity-platform` | Identity Platform |

## Kubernetes Collection (56 icons)

Prefix: `k8s-`. Common icons:

| ID | Best For |
|----|----------|
| `k8s-pod` | Pod |
| `k8s-svc` | Service |
| `k8s-deploy` | Deployment |
| `k8s-ing` | Ingress |
| `k8s-ns` | Namespace |
| `k8s-cm` | ConfigMap |
| `k8s-secret` | Secret |
| `k8s-pv` | Persistent Volume |
| `k8s-pvc` | Persistent Volume Claim |
| `k8s-ds` | DaemonSet |
| `k8s-sts` | StatefulSet |
| `k8s-job` | Job |
| `k8s-cronjob` | CronJob |
| `k8s-hpa` | Horizontal Pod Autoscaler |
| `k8s-sa` | Service Account |
| `k8s-role` | Role |

## Icon Selection Guide

| Diagram Type | Recommended Icons |
|---|---|
| **Web App Architecture** | `desktop`, `server`, `storage`, `cache`, `cloud`, `cube` |
| **Data Pipeline** | `storage`, `queue`, `function-module`, `diamond`, `document` |
| **Microservices** | `cube`, `server`, `loadbalancer`, `queue`, `cache`, `storage` |
| **CI/CD Pipeline** | `truck`, `package-module`, `server`, `cloud`, `firewall` |
| **Auth/Security** | `lock`, `firewall`, `user`, `cloud`, `server` |
| **AWS Architecture** | Use `aws-*` prefixed icons |
| **Azure Architecture** | Use `azure-*` prefixed icons |
| **GCP Architecture** | Use `gcp-*` prefixed icons |
| **Kubernetes** | Use `k8s-*` prefixed icons |
