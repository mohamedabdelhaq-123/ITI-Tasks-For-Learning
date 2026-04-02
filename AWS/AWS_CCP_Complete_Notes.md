# ☁️ AWS Certified Cloud Practitioner – Complete Study Notes (CLF-C02)

---

# Section 1: What is Cloud Computing?

## Traditional IT vs Cloud
- Old way: own physical servers, pay rent, power, cooling, maintenance → slow, expensive, limited
- New way: rent resources on demand, pay only for what you use

## What is Cloud Computing?
- On-demand delivery of compute, storage, databases, and other IT resources
- Pay-as-you-go pricing — no upfront hardware costs
- Scale up/down instantly based on demand

## Cloud Deployment Models
| Model | Description |
|---|---|
| **Public Cloud** | Resources owned by AWS/Azure/GCP, delivered over internet |
| **Private Cloud** | Dedicated to one organization, full control |
| **Hybrid Cloud** | Mix — some on-premises, some in the cloud |

## 5 Characteristics of Cloud Computing
1. **On-demand self service** — provision resources without contacting AWS
2. **Broad network access** — accessible from anywhere, any device
3. **Multi-tenancy & resource pooling** — multiple customers share same hardware securely
4. **Rapid elasticity** — scale up or down quickly
5. **Measured service** — pay exactly for what you use

## 6 Advantages of Cloud Computing
- Trade CAPEX (buy hardware) for OPEX (pay as you go)
- Benefit from massive economies of scale (AWS buys in bulk → cheaper for you)
- Stop guessing capacity — scale to actual usage
- Increase speed and agility
- Stop spending money maintaining data centers
- Go global in minutes using AWS's global infrastructure

## Types of Cloud Services
| Type | You Manage | AWS Manages | Example |
|---|---|---|---|
| **IaaS** | App, OS, data | Hardware, network | EC2 |
| **PaaS** | App, data | Everything else | Elastic Beanstalk |
| **SaaS** | Nothing | Everything | Gmail, Zoom, Rekognition |

## AWS Pricing Fundamentals (3 pillars)
- **Compute** → pay for compute time used
- **Storage** → pay for data stored
- **Data transfer OUT** → data IN is free

## AWS Global Infrastructure
- **Regions** → cluster of data centers in a geographic area (e.g. `us-east-1`)
- **Availability Zones (AZs)** → 2–6 data centers per region, isolated from each other
- **Edge Locations / Points of Presence** → 400+ locations for content delivery (CloudFront)

## How to Choose a Region?
- **Compliance** — data must stay in certain countries
- **Proximity** — deploy closer to your users for lower latency
- **Available services** — not all services are in every region
- **Pricing** — varies by region

## Shared Responsibility Model
- **AWS** → responsible for security **OF** the cloud (hardware, facilities, infrastructure)
- **YOU** → responsible for security **IN** the cloud (your data, configs, access)

> ✅ **Exam tip:** "Security OF the cloud" = AWS. "Security IN the cloud" = Customer.

---

# Section 2: IAM – Identity & Access Management

## Core Concepts
- **IAM** = Identity and Access Management — **Global service** (not region-specific)
- **Root account** → created when you open AWS — don't use it for daily tasks, don't share it
- **Users** → represent real people or apps within your organization
- **Groups** → collections of users (groups cannot contain other groups)
- A user can belong to multiple groups, or no group at all

## IAM Permissions (Policies)
- Policies = JSON documents that define what actions are allowed or denied
- Attached to users or groups
- **Principle of Least Privilege** → only give users the permissions they actually need

### Policy Structure
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "ec2:Describe*",
    "Resource": "*"
  }]
}
```
- **Version** → always `"2012-10-17"`
- **Effect** → `Allow` or `Deny`
- **Action** → what API calls are allowed/denied
- **Principal** → who the policy applies to
- **Resource** → which AWS resource
- **Condition** → optional, when the rule applies

## Password Policy
- Require minimum length, uppercase, lowercase, numbers, symbols
- Allow users to change their own password
- Require password rotation every X days
- Prevent re-use of old passwords

## MFA – Multi-Factor Authentication
- MFA = password you know + physical device you own
- If password is stolen → account is still safe without the MFA device
- MFA Device Options:
  - **Virtual MFA** → Google Authenticator, Authy (phone)
  - **U2F Security Key** → YubiKey (physical USB)
  - **Hardware Key Fob** → Gemalto, SurePassID

## How to Access AWS
| Method | Protected By |
|---|---|
| **Management Console** | Password + MFA |
| **CLI** | Access Keys |
| **SDK** | Access Keys |

- **Access Key ID** ≈ username
- **Secret Access Key** ≈ password
- Never share access keys — treat like a password

## IAM Roles
- Used to give **AWS services** (not users) permissions to act on your behalf
- Common roles: EC2 Instance Role, Lambda Role, CloudFormation Role
- Example: EC2 needs to access S3 → assign it an IAM Role with S3 permissions

## IAM Security Tools
- **IAM Credentials Report** (account-level) → lists all users and credential status
- **IAM Access Advisor** (user-level) → shows which services a user last accessed → helps reduce unused permissions

## IAM Best Practices
- Never use root account for daily work
- One physical person = one IAM user
- Assign users to groups, attach policies to groups
- Enforce MFA on all accounts
- Use Roles for AWS services, never embed credentials in code
- Use Access Keys only for CLI/SDK
- Rotate credentials regularly
- Audit using Credentials Report + Access Advisor

> ✅ **Exam tip:** Root account = only for account setup. Everything else = use IAM users with least privilege.

---

# Section 3: Amazon EC2

## What is EC2?
- **Elastic Compute Cloud** — rent virtual machines in the cloud (IaaS)
- Fully configurable: choose OS, CPU, RAM, storage, network, firewall

## EC2 Configuration Options
- **OS**: Linux, Windows, macOS
- **CPU**: vCPUs (virtual cores)
- **RAM**: memory
- **Storage**: EBS (network) or Instance Store (local)
- **Security Groups**: firewall rules
- **User Data Script**: runs once on first launch to bootstrap (install software, updates, etc.)

## EC2 Instance Types
| Type | Use Case |
|---|---|
| **General Purpose** (t, m) | Web servers, code repos — balanced CPU/RAM/network |
| **Compute Optimized** (c) | Batch jobs, HPC, ML, gaming servers |
| **Memory Optimized** (r, x) | Large in-memory databases, real-time big data |
| **Storage Optimized** (i, d) | High-frequency OLTP, large local datasets |

- Naming: `m5.2xlarge` → m=class, 5=generation, 2xlarge=size

## Security Groups
- Act as a **virtual firewall** around EC2 instances
- Control **inbound** (into instance) and **outbound** (from instance) traffic
- Rules reference IP ranges or other security groups
- **All inbound blocked by default** → you must explicitly allow
- **All outbound allowed by default**
- Can be attached to multiple instances
- Locked to a region/VPC
- **Timeout error** → security group issue | **Connection refused** → app not running

## Classic Ports to Know
| Port | Protocol |
|---|---|
| 22 | SSH (Linux login) |
| 21 | FTP |
| 80 | HTTP |
| 443 | HTTPS |
| 3389 | RDP (Windows login) |

## EC2 Purchasing Options
| Option | Description | Best For |
|---|---|---|
| **On-Demand** | Pay per second/hour, no commitment | Short-term, unpredictable |
| **Reserved (1 or 3 yr)** | Up to 72% discount, commit to instance type | Steady-state (e.g., databases) |
| **Convertible Reserved** | Up to 66% discount, can change instance type | Flexible long-term |
| **Savings Plans (1 or 3 yr)** | Commit to $ amount/hr, flexible instance type | Long-term flexible compute |
| **Spot** | Up to 90% discount, can be interrupted | Fault-tolerant batch jobs |
| **Dedicated Host** | Physical server for you alone, bring your own license | Compliance, BYOL |
| **Dedicated Instance** | Hardware dedicated to you, may share with same-account | Compliance |
| **Capacity Reservation** | Reserve capacity in AZ, On-Demand price | Short-term guaranteed capacity |

> ✅ **Hotel analogy:** On-Demand = walk-in, Reserved = pre-booked discount, Spot = last-minute bidding, Dedicated Host = rent entire building

---

# Section 4: EC2 Instance Storage

## EBS – Elastic Block Store
- **Network drive** (not physical) attached to an EC2 instance
- Think of it as a "network USB stick" — can detach and reattach
- **Bound to one AZ** — cannot attach an EBS in us-east-1a to an instance in us-east-1b
- To move across AZs: create a **snapshot** → restore in new AZ
- **Delete on Termination**: root EBS is deleted by default when instance terminates; extra volumes are NOT

## EBS Snapshots
- Point-in-time backup of an EBS volume
- Can copy across AZs or regions
- **Snapshot Archive** → move to 75% cheaper archive tier (restore takes 24–72 hours)
- **Recycle Bin** → recover accidentally deleted snapshots (retain 1 day to 1 year)

## AMI – Amazon Machine Image
- Pre-configured template to launch EC2 instances
- Types:
  - **Public AMI** → provided by AWS (e.g., Amazon Linux)
  - **Your own AMI** → custom image you create and maintain
  - **Marketplace AMI** → third-party (may cost extra)
- AMIs are region-specific (can be copied across regions)

### AMI Creation Process
1. Launch EC2 → customize it
2. Stop the instance (for data integrity)
3. Build AMI (creates EBS snapshots automatically)
4. Launch new instances from the AMI

## EC2 Image Builder
- Automates the creation, maintenance, and testing of AMIs
- Runs on a schedule (e.g., weekly or on package update)
- Free service — only pay for underlying resources

## EC2 Instance Store
- **Physical disk** directly attached to the host server
- Much faster I/O than EBS
- **Ephemeral** — data is lost when instance stops/terminates
- Good for: buffers, caches, scratch data, temporary content
- You are responsible for backups

## EFS – Elastic File System
- Managed NFS (Network File System)
- Can be mounted on **hundreds of EC2 instances simultaneously** (across multiple AZs)
- Linux only, auto-scales, pay per use
- ~3x more expensive than EBS but shared across instances
- **EFS-IA (Infrequent Access)** → up to 92% cheaper for files not accessed every day; automatic tiering via Lifecycle Policy

## EBS vs EFS vs Instance Store
| | EBS | EFS | Instance Store |
|---|---|---|---|
| Type | Network drive | Network file system | Local physical disk |
| Attach to | One instance | Hundreds of instances | One instance |
| AZ scope | Single AZ | Multi-AZ | N/A |
| Persistence | Yes | Yes | No (ephemeral) |
| Speed | Good | Good | Best |

## Amazon FSx
- Launch third-party high-performance file systems on AWS
- **FSx for Windows File Server** → Windows-native, SMB protocol, Active Directory integration
- **FSx for Lustre** → High-performance for HPC, ML, video processing (hundreds of GB/s, sub-ms latency)

> ✅ **Exam tip:** Need shared file storage across many instances = EFS. Need ultra-fast local temp storage = Instance Store. Need Windows file sharing = FSx for Windows.

---

# Section 5: Elastic Load Balancing & Auto Scaling Groups

## Key Concepts
- **Scalability** → ability to handle more load
  - **Vertical** → make the server bigger (scale up/down) — has hardware limits
  - **Horizontal** → add more servers (scale out/in) — no real limits, used in modern apps
- **High Availability** → run in at least 2 AZs so one can survive if the other fails
- **Elasticity** → auto-scale up/down based on actual demand (cloud concept)
- **Agility** → provision new IT resources in minutes (cloud concept, not scalability)

## Elastic Load Balancer (ELB)
- Distributes incoming traffic across multiple EC2 instances
- Managed by AWS — no maintenance, guaranteed availability
- Provides a single DNS entry point for your app
- Performs health checks on instances — removes unhealthy ones automatically

### 4 Types of Load Balancers
| Type | Layer | Protocol | Use Case |
|---|---|---|---|
| **Application LB (ALB)** | 7 (HTTP) | HTTP/HTTPS/gRPC | Web apps, microservices |
| **Network LB (NLB)** | 4 (TCP) | TCP/UDP | Ultra-high performance |
| **Gateway LB (GWLB)** | 3 (IP) | GENEVE | Security appliances (firewalls) |
| **Classic LB** | 4 & 7 | — | Retired 2023 |

## Auto Scaling Group (ASG)
- Automatically adds/removes EC2 instances based on load
- Set **minimum**, **desired**, and **maximum** number of instances
- Automatically registers new instances with the load balancer
- Replaces unhealthy instances
- Cost-efficient — only run what you need

### ASG Scaling Strategies
| Strategy | How It Works |
|---|---|
| **Manual** | You manually change desired capacity |
| **Simple/Step** | CloudWatch alarm triggers → add/remove X instances |
| **Target Tracking** | Keep a metric at a target (e.g., CPU = 40%) |
| **Scheduled** | Scale at specific times (e.g., add more at 5 PM Fridays) |
| **Predictive** | ML-based, forecasts future traffic and scales proactively |

> ✅ **Exam tip:** ELB = distribute traffic. ASG = automatically add/remove servers. Together = high availability + elasticity.

---

# Section 6: Amazon S3

## What is S3?
- **Object storage** service — infinitely scalable, no storage limits
- Used by most AWS services as backbone storage

## Buckets & Objects
- **Bucket** = container for files — must be **globally unique name**, **region-specific**
- **Object** = file stored in bucket — has a Key (full path), max size **5 TB**
- Files > 5 GB require **multi-part upload**
- S3 has **no real folders** — just keys with slashes in the name

## S3 Security
- **IAM Policies** → user-based, controls what API calls a user can make
- **Bucket Policies** → resource-based JSON rules on the bucket, most common
- **ACLs** → fine-grained per object/bucket, rarely used
- **Block Public Access** → enabled by default — overrides any policy trying to make bucket public — set at account level for all buckets

### Access Rule
- User can access object if **IAM OR bucket policy allows** AND **no explicit Deny**

## Common Access Scenarios
- Public access → bucket policy with `Principal: "*"`
- IAM user → attach IAM policy to user
- EC2 → use IAM Role
- Cross-account → bucket policy allowing other account

## S3 Static Website Hosting
- Host static websites accessible on the internet
- Use `index.html` as entry point
- **403 error** = missing public read bucket policy
- Bucket must be public (disable Block Public Access + add bucket policy)

## S3 Versioning
- Enabled at bucket level — each upload creates new version (v1, v2, v3)
- Delete without showing versions = adds delete marker (recoverable)
- Delete specific version ID = permanent delete
- Files before versioning enabled get version `null`
- Suspending versioning preserves existing versions

> ✅ Best practice: Enable versioning on all buckets

## S3 Replication
- **CRR** (Cross-Region Replication) → different regions — compliance, lower latency
- **SRR** (Same-Region Replication) → same region — log aggregation, prod/test sync
- Versioning must be enabled on both buckets
- Only **new objects** after setup are replicated (existing = S3 Batch Operations)

## S3 Storage Classes
| Class | Use | Retrieval | Min Storage |
|---|---|---|---|
| Standard | Frequently accessed | Instant | None |
| Standard-IA | Infrequent, quick retrieval | Instant (fee) | None |
| One Zone-IA | Infrequent, 1 AZ only | Instant (fee) | None |
| Glacier Instant | Quarterly access | Milliseconds | 90 days |
| Glacier Flexible | Archival | 1-5min/3-5hr/5-12hr | 90 days |
| Glacier Deep Archive | Long-term cheapest | 12hr/48hr | 180 days |
| Intelligent-Tiering | Unknown pattern | Instant | None (monitoring fee) |

- Durability = **11 nines (99.999999999%)** for ALL classes
- Availability varies by class

> ✅ Accessed often = Standard | Rarely = IA | Archive = Glacier | Unsure = Intelligent-Tiering

## S3 Encryption
- **Server-side** → S3 encrypts after upload — **on by default**
- **Client-side** → you encrypt before uploading

## AWS Snowball
- Physical device shipped to transfer large data when network is too slow
- **Storage Optimized** → 210 TB | **Compute Optimized** → 28 TB
- Data INTO S3 = **free** | Data OUT = you pay

> ✅ Network too slow + huge data = Snowball

## AWS Storage Gateway
- Bridges **on-premises storage** to AWS — used in **hybrid cloud**

---

# Section 7: Databases & Analytics

## Amazon RDS
- Managed relational database (SQL)
- Engines: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, IBM DB2, Aurora
- AWS handles patching, backups, scaling, Multi-AZ
- Cannot SSH into RDS

## Amazon Aurora
- AWS cloud-native relational DB — PostgreSQL & MySQL only
- 5x faster than MySQL, 3x faster than PostgreSQL on RDS
- Storage auto-grows up to 256 TB

## Aurora Serverless
- No capacity planning, pay per second — for unpredictable workloads

## RDS Deployment Options
| Option | Purpose |
|---|---|
| Read Replicas (up to 15) | Scale reads — writes go to main DB |
| Multi-AZ | High availability — passive standby DB |
| Multi-Region | Disaster recovery + low global latency |

## Amazon ElastiCache
- Managed in-memory DB (Redis or Memcached) — caches frequent DB queries

> ✅ In-memory cache = ElastiCache

## Amazon DynamoDB
- Serverless NoSQL database — no servers to provision
- 3 AZs, single-digit ms latency, auto-scaling
- **DAX** → in-memory cache for DynamoDB → microsecond latency
- **Global Tables** → multi-region active-active replication

> ✅ Serverless NoSQL = DynamoDB | DynamoDB caching = DAX

## Amazon Redshift
- OLAP data warehouse (not OLTP) — for analytics
- Columnar storage, SQL interface, integrates with QuickSight
- **Redshift Serverless** → no provisioning needed

> ✅ Analytics warehouse = Redshift

## Amazon EMR
- Hadoop clusters for big data on EC2 — Spark, HBase, Presto, Flink

## Amazon Athena
- Serverless SQL queries directly on S3 data — no loading needed, ~$5/TB scanned

> ✅ Serverless SQL on S3 = Athena

## Amazon QuickSight
- Serverless BI dashboards & visualizations

## Other Databases
| Service | Type | Key Feature |
|---|---|---|
| DocumentDB | NoSQL | MongoDB-compatible |
| Neptune | Graph | Billions of relationships |
| Timestream | Time series | IoT & metrics data |
| Managed Blockchain | Blockchain | Hyperledger Fabric + Ethereum |

## AWS Glue
- Serverless **ETL** service (Extract, Transform, Load)
- **Glue Data Catalog** → metadata store used by Athena, Redshift, EMR

## AWS DMS (Database Migration Service)
- Migrate databases to AWS with **zero downtime**
- Source stays online during migration
- Homogeneous (same engine) or Heterogeneous (different engines)

## DB Cheat Sheet
| Service | Best For |
|---|---|
| RDS/Aurora | SQL, OLTP, relational |
| ElastiCache | In-memory caching |
| DynamoDB | Serverless NoSQL |
| Redshift | Analytics, OLAP warehouse |
| Athena | Serverless SQL on S3 |
| QuickSight | BI dashboards |
| EMR | Hadoop big data clusters |
| DMS | Database migration |

---

# Section 8: Other Compute Services

## Docker
- Package apps into **containers** that run anywhere, any OS
- **Docker Hub** → public image registry | **Amazon ECR** → AWS private registry

## ECS, Fargate & ECR
| Service | What It Does |
|---|---|
| **ECS** | Run Docker containers — you manage EC2 instances |
| **Fargate** | Run Docker containers — serverless, no EC2 to manage |
| **ECR** | Store Docker images |

## Amazon EKS
- Managed **Kubernetes** on AWS
- Docker = run a container | Kubernetes = manage many containers at scale

## AWS Lambda
- Serverless functions — event-driven, auto-scaling, max **15 min** per execution
- Supports many languages, up to 10 GB RAM
- **Pricing**: per invocation + per duration (very cheap, generous free tier)

> ✅ Short event-driven task, no server = Lambda

## Amazon API Gateway
- Expose Lambda (or other services) as a **REST or WebSocket API**
- Serverless, includes auth, throttling, API keys

## AWS Batch
- Managed batch processing — no time limit, uses Docker/ECS
- Lambda = short tasks | Batch = long jobs

## Amazon Lightsail
- Simple, low-cost VPS for beginners — no auto-scaling, limited AWS integration

## Compute Cheat Sheet
| Service | Use Case |
|---|---|
| ECS | Docker + manage EC2 |
| Fargate | Docker, serverless |
| EKS | Kubernetes on AWS |
| Lambda | Serverless functions, max 15 min |
| API Gateway | HTTP/WebSocket API for Lambda |
| Batch | Long batch jobs, Docker, no time limit |
| Lightsail | Simple apps for beginners |

---


# Section 9: Deploying & Managing Infrastructure at Scale

## AWS CloudFormation
- **Infrastructure as Code (IaC)** — define all AWS resources in a template file
- CloudFormation creates everything in the right order automatically
- Benefits:
  - **Control** → code reviews before changes
  - **Cost** → resources are tagged, easy to estimate costs; automate deletion at 5PM and recreation at 8AM
  - **Productivity** → destroy and recreate environments on demand
  - **Reusable** → leverage existing templates from the web
- **Infrastructure Composer** → visualizes your CloudFormation template as an architecture diagram

> ✅ Infrastructure as Code on AWS = CloudFormation | Repeat infrastructure across regions = CloudFormation

## AWS CDK (Cloud Development Kit)
- Write cloud infrastructure using a **real programming language** (Python, JS, TypeScript, Java, .NET)
- CDK compiles your code → generates a **CloudFormation template** → deploys it
- Great for Lambda and ECS/EKS where app code and infrastructure are together

> ✅ IaC using a programming language = CDK | CDK always compiles into CloudFormation under the hood

## AWS Elastic Beanstalk
- **PaaS** — you upload your code, Beanstalk handles everything else
- AWS manages: EC2, OS, load balancer, auto-scaling, health monitoring
- Free to use — you pay for the underlying resources only
- Uses CloudFormation in the background

### Deployment Models
| Model | Use Case |
|---|---|
| Single Instance | Dev environment |
| LB + ASG | Production web apps |
| ASG only | Background worker apps (non-web) |

- Supports: Python, Node.js, Java, PHP, Ruby, Docker, .NET, Go

> ✅ Developer uploads code, AWS handles infrastructure = Elastic Beanstalk | PaaS = Beanstalk

## AWS CodeDeploy

- Automatically deploys your app from **v1 → v2**
- Works on both **EC2 instances** and **on-premises servers** → **hybrid service**
- Servers must have the **CodeDeploy agent** installed

> ✅ Auto-deploy updates to EC2 or on-prem servers = CodeDeploy

## AWS CodeCommit
- AWS's private **Git repository** — like GitHub inside AWS
- Fully managed, scalable, secure

> ✅ Private Git repo on AWS = CodeCommit

## AWS CodeBuild
- **Compiles code, runs tests, produces deployment-ready packages**
- Fully managed & serverless — pay only for build time

> ✅ Build & test code serverlessly = CodeBuild

## AWS CodePipeline
- **Orchestrates the full CI/CD pipeline**: code → build → test → deploy
- Connects CodeCommit, CodeBuild, CodeDeploy, and Beanstalk
- Example: `CodeCommit → CodeBuild → CodeDeploy → Elastic Beanstalk`

> ✅ CI/CD on AWS = CodePipeline | Automate code from push to production = CodePipeline

## AWS CodeArtifact
- Managed repository to **store & retrieve code dependencies** (npm, pip, Maven, NuGet…)
- CodeBuild can pull dependencies directly from CodeArtifact

> ✅ Store code dependencies on AWS = CodeArtifact

## AWS Systems Manager (SSM)
- Manage **EC2 + on-premises servers** from one place — **hybrid service**
- Needs **SSM Agent** installed (pre-installed on Amazon Linux & some Ubuntu AMIs)
- Key features:
  - **Auto patching** → patch entire fleet at once
  - **Run commands** → run commands across all servers at once
  - **Session Manager** → secure shell without SSH (port 22 closed)
  - **Parameter Store** → store configs, API keys, secrets securely

### Session Manager
- Access EC2 instances from AWS console — no SSH keys, no port 22 needed
- EC2 needs an IAM Role to connect to SSM
- Sessions logged to S3 or CloudWatch

### Parameter Store
- Secure storage for passwords, API keys, configs
- Serverless, IAM-controlled, supports encryption via KMS, version tracking

> ✅ Manage/patch fleet = SSM | Secure shell without SSH = Session Manager | Store secrets = Parameter Store

## Deployment Services – Cheat Sheet
| Service | Type | Purpose |
|---|---|---|
| CloudFormation | AWS only | Infrastructure as Code |
| Elastic Beanstalk | AWS only | PaaS — deploy code easily |
| CodeDeploy | Hybrid | Auto-deploy app to EC2/on-prem |
| SSM | Hybrid | Patch, configure, run commands |
| CodeCommit | Developer | Private Git repo |
| CodeBuild | Developer | Build & test code |
| CodePipeline | Developer | Full CI/CD orchestration |
| CodeArtifact | Developer | Store code dependencies |
| CDK | Developer | IaC using programming language |

---

# Section 10: Global Infrastructure

## Why Go Global?
- **Lower latency** → deploy closer to users
- **Disaster recovery** → if a region fails, another takes over
- **Attack protection** → distributed infrastructure is harder to attack

## AWS Infrastructure Recap
- **Regions** → deploy apps (e.g., Paris, N. Virginia)
- **Availability Zones** → multiple data centers inside each region
- **Edge Locations** → for content delivery, not app deployment

## Amazon Route 53
- Managed **DNS** service — maps domain names to IP addresses
- **Record Types**:
  - `A` → domain → IPv4
  - `AAAA` → domain → IPv6
  - `CNAME` → domain → another domain
  - `Alias` → domain → AWS resource (ELB, CloudFront, S3, etc.)

### Routing Policies
| Policy | How It Works | Health Check |
|---|---|---|
| Simple | Basic routing | No |
| Weighted | Split traffic by % (e.g., 70/20/10) | Yes |
| Latency | Routes to nearest/fastest server | Yes |
| Failover | Routes to backup if primary fails | Yes |

> ✅ Managed DNS = Route 53 | Route to nearest server = Latency | Backup if primary fails = Failover

## Amazon CloudFront
- **CDN (Content Delivery Network)** — caches content at 400+ edge locations globally
- Reduces latency and improves user experience
- **DDoS protection** via Shield + WAF integration
- Origins: S3 bucket, VPC (private ALB/NLB), Custom HTTP

### CloudFront vs S3 Cross-Region Replication
| | CloudFront | S3 CRR |
|---|---|---|
| Content | Cached at edge (TTL, e.g., 1 day) | Updated near real-time |
| Scope | All edge locations worldwide | Specific regions |
| Best for | Static content globally | Dynamic content in few regions |

## S3 Transfer Acceleration
- Speeds up uploads/downloads to S3 by routing through **AWS edge locations** first
- The edge location then forwards to S3 over AWS private network

## AWS Global Accelerator
- Improves app speed & availability using **AWS's private global network**
- Creates 2 **static Anycast IPs** — traffic enters nearest edge location and travels via AWS backbone
- 60% improvement; good for TCP/UDP apps (non-cacheable)

### CloudFront vs Global Accelerator
| | CloudFront | Global Accelerator |
|---|---|---|
| Caching | Yes | No |
| Best for | Static/cacheable content | TCP/UDP app performance globally |
| IPs | Dynamic DNS | Static IPs |

## AWS Outposts
- AWS ships **physical server racks** to your on-premises data center
- Run AWS services (EC2, S3, RDS, EKS, ECS, EMR) on-prem
- You are responsible for physical security of Outpost racks

> ✅ AWS on-premises = Outposts | Extend AWS into your data center = Outposts

## AWS WaveLength
- Deploys AWS services at the edge of **5G networks** (inside telecom carrier data centers)
- Ultra-low latency for 5G mobile users
- Use cases: smart cities, connected vehicles, AR/VR, real-time gaming

## AWS Local Zones
- Extension of an AWS region placed closer to end users
- Reduces latency for latency-sensitive applications
- Example: AWS region in N. Virginia + Local Zone in Dallas

## Global Infrastructure – Cheat Sheet
| Service | Purpose |
|---|---|
| Route 53 | DNS with routing policies |
| CloudFront | CDN, cache at edge globally |
| S3 Transfer Acceleration | Faster uploads to S3 globally |
| Global Accelerator | App performance via AWS private network, static IPs |
| Outposts | AWS rack in your on-prem DC |
| WaveLength | AWS at 5G network edge |
| Local Zones | AWS extended closer to users |

---

# Section 11: Cloud Integration (Messaging)

## Why Decouple Applications?
- Direct (synchronous) communication can fail under high loads
- **Asynchronous** = app sends to a queue, other app reads from queue independently
- Services can scale independently

## Amazon SQS – Simple Queue Service
- **Oldest AWS service** — fully managed serverless queue
- Producers send messages → consumers read and delete messages
- Message retention: default 4 days, max 14 days
- No limit on number of messages in queue
- Messages deleted after being read by consumers
- Consumers share the work and can scale horizontally

### SQS FIFO Queue
- **First In, First Out** — guarantees order of processing
- Messages processed in the exact order they were sent

> ✅ Decouple applications = SQS | Ordered messages = SQS FIFO

## Amazon SNS – Simple Notification Service
- **Pub/Sub model** — one message sent to many subscribers at once
- Publisher sends to an **SNS topic** → all subscribers receive the message
- Up to **12.5 million subscriptions** per topic, 100,000 topic limit
- Subscribers can be: SQS, Lambda, HTTP(S), Email, SMS, Mobile push

> ✅ One message to many receivers = SNS | Fan-out pattern = SNS

## Amazon Kinesis
- **Real-time big data streaming** service
- Collect, process, analyze streaming data at scale
- **Kinesis Data Streams** → ingest data from many sources (low latency)
- **Kinesis Data Firehose** → load streams into S3, Redshift, OpenSearch

> ✅ Real-time data streaming = Kinesis

## Amazon MQ
- Managed message broker for **ActiveMQ** and **RabbitMQ**
- Used when migrating legacy on-premises apps that use standard protocols (MQTT, AMQP, STOMP)
- Unlike SQS/SNS, runs on servers (not serverless), Multi-AZ with failover

> ✅ Existing app using MQTT/AMQP + migrating to cloud = Amazon MQ

## Integration – Cheat Sheet
| Service | Pattern | Key Feature |
|---|---|---|
| SQS | Queue | Decouple apps, messages deleted after read |
| SNS | Pub/Sub | One message → many subscribers |
| Kinesis | Streaming | Real-time data at scale |
| Amazon MQ | Message broker | Legacy protocol support (AMQP, MQTT) |

---


# Section 12: Cloud Monitoring

## Amazon CloudWatch
- Monitors **metrics** for every AWS service (CPU, network, disk, etc.)
- Metrics have timestamps; view in **CloudWatch Dashboards**

### Important Default Metrics
- **EC2**: CPU Utilization, Network, Status Checks — every **5 minutes** (paid: 1 min)
- **EBS**: Disk Read/Writes
- **S3**: BucketSizeBytes, NumberOfObjects
- **Billing**: Total Estimated Charge (us-east-1 only)
- Note: RAM is **NOT** a default EC2 metric — needs custom metric

### CloudWatch Alarms
- Trigger notifications based on any metric
- Actions: Auto Scaling, EC2 action (stop/terminate/reboot), SNS notification
- Alarm states: **OK**, **ALARM**, **INSUFFICIENT_DATA**

### CloudWatch Logs
- Collects logs from: Elastic Beanstalk, ECS, Lambda, CloudTrail, Route 53, EC2 (via agent)
- EC2 needs a **CloudWatch Agent** installed to push logs
- Adjustable retention period

## AWS CloudTrail >camera mor2ba
- Records all **API calls** made in your AWS account — **enabled by default**
- Sources: Console, SDK, CLI, AWS services
- Store logs in CloudWatch Logs or S3
- Can apply to all regions (default) or single region
- **If a resource was deleted mysteriously → check CloudTrail first**

> ✅ Audit who did what in your account = CloudTrail 
>> cloudWatch for perfomance & cloudTrail for actions.


## Amazon EventBridge (formerly CloudWatch Events)
- **Schedule**: run scripts on a schedule (CRON jobs) → triggers Lambda
- **Event Pattern**: react to events in AWS (e.g., root user login → send SNS alert)
- Connects services: Lambda, Batch, ECS, SQS, SNS, Step Functions

> ✅ Schedule Lambda executions = EventBridge | React to AWS events = EventBridge


## AWS X-Ray
- Distributed **tracing** service for applications
- Visualizes the full request path across microservices
- Helps identify bottlenecks, errors, and latency issues

> ✅ Debug/trace distributed app performance = X-Ray

## Amazon CodeGuru
- ML-powered service for **automated code reviews** and performance recommendations
- **CodeGuru Reviewer** → static analysis during development (security, best practices, resource leaks)
- **CodeGuru Profiler** → runtime performance insights in production (expensive code lines)
- Supports Java and Python

## AWS Health Dashboard
- **Service Health Dashboard** → shows all region/service health status, historical data, RSS feed
- **Account Health Dashboard** → personalized view showing events that impact **your** resources
  - Proactive notifications for scheduled maintenance
  - Can aggregate across AWS Organization

## Monitoring – Cheat Sheet
| Service | Purpose |
|---|---|
| CloudWatch Metrics | Monitor AWS service performance metrics |
| CloudWatch Alarms | Alert + automate action on metrics |
| CloudWatch Logs | Collect logs from services/instances |
| EventBridge | Schedule tasks, react to events |
| CloudTrail | Audit API call history |
| X-Ray | Trace distributed app requests |
| CodeGuru | Automated code reviews + profiling |
| Health Dashboard | AWS service/account health status |

---

# Section 13: Amazon VPC

> 💡 VPC appears 1-2 times on the exam at a high level

## Core Concepts
- **VPC (Virtual Private Cloud)** → private network for your resources — **Regional** resource
- **Subnets** → divide VPC into segments — **AZ-level** resource
  - **Public subnet** → accessible from the internet
  - **Private subnet** → not accessible from the internet
- **Route Tables** → control traffic routing between subnets and internet

## Key Components
| Component | Purpose |
|---|---|
| **Internet Gateway** | Connects VPC to the internet (public subnets) |
| **NAT Gateway** | Lets private subnet instances access internet but stay private |
| **NACL** | Stateless subnet-level firewall — Allow AND Deny rules, IP-based only |
| **Security Groups** | Stateful instance-level firewall — Allow rules only (IP or SG-based) |
| **VPC Flow Logs** | Capture IP traffic logs — troubleshoot connectivity, goes to S3/CloudWatch |
| **VPC Peering** | Connect 2 VPCs privately — non-transitive, no overlapping IPs |
| **VPC Endpoints** | Access AWS services via private network (not public internet) |
| **PrivateLink** | Privately expose a service to 1000s of VPCs — most secure |

## NACL vs Security Groups
| | NACL | Security Group |
|---|---|---|
| Level | Subnet | EC2 Instance |
| Rules | Allow + Deny | Allow only |
| State | Stateless | Stateful |
| Rule type | IP addresses only | IP + Security Groups |

## IP Addresses
- **Public IPv4** → changes every stop/start (default)
- **Private IPv4** → stays fixed even after stop/start
- **Elastic IP** → fixed public IPv4 — cost $0.005/hr even when not in use
- **IPv6** → all public, free in AWS

## Connectivity Options
| Option | Description |
|---|---|
| **Site-to-Site VPN** | Encrypted tunnel over public internet to on-premises |
| **Direct Connect (DX)** | Private physical connection to AWS — setup takes 1+ month |
| **Client VPN** | Connect your computer to AWS VPC using OpenVPN |
| **Transit Gateway** | Hub that connects 1000s of VPCs and on-prem networks together |

> ✅ On-prem to AWS fast & private = Direct Connect | On-prem to AWS over internet = Site-to-Site VPN | Connect many VPCs = Transit Gateway

## VPC Endpoints
- Access AWS services privately without going through internet
- **Gateway Endpoint** → S3 and DynamoDB
- **Interface Endpoint** → most other services

## VPC – Quick Summary
| | |
|---|---|
| VPC | Private cloud network |
| Subnets | AZ-level partitions (public/private) |
| Internet Gateway | Internet access for public subnets |
| NAT Gateway | Internet for private subnets (outbound only) |
| NACL | Subnet-level stateless firewall |
| Security Groups | Instance-level stateful firewall |
| VPC Peering | Connect 2 VPCs |
| VPC Endpoints | Private access to AWS services |
| Flow Logs | Network traffic logging |
| Site-to-Site VPN | On-prem to AWS over internet |
| Direct Connect | On-prem to AWS over private line |
| Transit Gateway | Hub for many VPCs + on-prem |

---

# Section 14: Security & Compliance

## Shared Responsibility Model
- **AWS** → Security **OF** the cloud (hardware, infrastructure, managed services)
- **YOU** → Security **IN** the cloud (data, OS patches, firewall configs, IAM)
- **Shared** → Patch management, configuration management, training

### Examples
| Service | AWS Responsible For | You Responsible For |
|---|---|---|
| EC2 | Physical host, hypervisor | OS patching, firewall rules, IAM |
| RDS | DB engine patching, hardware | DB users, encryption settings |
| S3 | Infrastructure, encryption capability | Bucket policies, IAM, encryption enabling |

## DDoS Protection
- **AWS Shield Standard** → free, automatic protection for all customers (Layer 3/4 attacks)
- **AWS Shield Advanced** → $3,000/month, 24/7 DDoS response team, protects EC2/ELB/CloudFront/Route53
- **AWS WAF** → Layer 7 (HTTP) application firewall — filters based on IP, headers, geo, SQL injection, XSS
  - Deployed on: ALB, API Gateway, CloudFront
- **AWS Network Firewall** → protect entire VPC (Layer 3-7)
- **AWS Firewall Manager** → manage WAF, Shield, and Security Groups across an **AWS Organization**

## Encryption
- **Data at rest** → stored on disk — encrypt with KMS, CloudHSM
- **Data in transit** → moving over network — encrypt with TLS/SSL

## AWS KMS (Key Management Service)
- When you hear "encryption" on AWS → it's almost always KMS
- AWS manages the software for encryption keys
- **KMS Key Types**:
  - **Customer Managed Key** → you create, manage, rotate (bring your own key)
  - **AWS Managed Key** → AWS creates and manages (e.g., aws/s3, aws/ebs)
  - **AWS Owned Key** → AWS owns, used across multiple accounts, you don't see them

## CloudHSM
- AWS provisions dedicated **Hardware Security Module** for your keys
- **You manage** the encryption keys entirely (AWS cannot access them)
- FIPS 140-2 Level 3 compliance

> ✅ KMS = AWS manages software for keys | CloudHSM = you manage hardware keys

## AWS Certificate Manager (ACM)
- Provision, manage, and deploy **SSL/TLS certificates**
- Free for public TLS certificates, auto-renews
- Integrates with ELB, CloudFront, API Gateway

## AWS Secrets Manager
- Store and **auto-rotate** secrets (DB passwords, API keys)
- Integrates with RDS, Aurora — uses Lambda to auto-generate new secrets
- Secrets encrypted via KMS

> ✅ Auto-rotate secrets = Secrets Manager | Store static configs = SSM Parameter Store

## AWS Artifact
- **Not a service** — a portal for on-demand access to AWS compliance documents
- **Artifact Reports** → download ISO, PCI, SOC reports from third-party auditors
- **Artifact Agreements** → review and accept BAA, HIPAA agreements

> ✅ Compliance documentation = Artifact

## Amazon GuardDuty
- **Intelligent threat detection** using ML — one-click to enable, 30-day trial
- Analyzes: CloudTrail events, VPC Flow Logs, DNS logs
- Can protect against cryptocurrency mining attacks
- Setup EventBridge → notify Lambda or SNS when finding detected

> ✅ Detect malicious behavior in your account = GuardDuty

## Amazon Inspector
- Automated **security assessments** for:
  - **EC2 instances** → check OS vulnerabilities (via SSM agent)
  - **ECR container images** → assess when pushed
  - **Lambda functions** → check code vulnerabilities when deployed
- Reports to Security Hub and EventBridge

> ✅ Find software vulnerabilities in EC2/containers/Lambda = Inspector

## AWS Config
- Records **configuration history** of your AWS resources
- Flags compliance violations (e.g., unrestricted SSH, public S3 buckets)
- Per-region service (can aggregate across regions/accounts)
- Send alerts via SNS on configuration changes

> ✅ Track resource config changes over time = AWS Config | Compliance auditing = Config

## Amazon Macie
- Managed data security service using ML to find **Personally Identifiable Information (PII)** in S3

> ✅ Find sensitive/PII data in S3 = Macie

## AWS Security Hub
- **Central dashboard** to aggregate security findings from GuardDuty, Inspector, Macie, Config, IAM Access Analyzer
- Requires AWS Config to be enabled first

## Amazon Detective
- Investigates and finds **root cause** of security findings
- Uses ML and graphs on VPC Flow Logs, CloudTrail, GuardDuty data

## Root User Privileges (only root can do these)
- Change account settings (name, email, root password)
- Close the AWS account
- Change/cancel AWS Support plan
- Register as a seller in Reserved Instance Marketplace
- Configure S3 bucket with MFA Delete

## IAM Access Analyzer
- Finds resources **shared externally** (outside your account or org)
- Covers: S3, IAM Roles, KMS, Lambda, SQS, Secrets Manager

## Security – Cheat Sheet
| Service | Purpose |
|---|---|
| Shield Standard | Free DDoS protection (L3/L4) |
| Shield Advanced | Premium DDoS 24/7 response |
| WAF | L7 HTTP application firewall |
| Network Firewall | VPC-level L3–L7 protection |
| Firewall Manager | Manage WAF/Shield across org |
| KMS | AWS-managed encryption keys |
| CloudHSM | Hardware encryption keys (you manage) |
| ACM | TLS/SSL certificates |
| Secrets Manager | Rotate & store secrets |
| Artifact | Compliance documents |
| GuardDuty | Threat detection (ML on logs) |
| Inspector | Vulnerability scanning (EC2/ECR/Lambda) |
| Config | Resource config history + compliance |
| Macie | PII detection in S3 |
| Security Hub | Centralized security findings |
| Detective | Root cause investigation |

---


# Section 15: Machine Learning

## Amazon Rekognition
- Find **objects, people, text, scenes** in images and videos using ML
- Facial analysis, face search & comparison, celebrity recognition
- Use cases: content moderation, labeling, face detection, sports analysis

> ✅ Analyze images/videos with AI = Rekognition

## Amazon Transcribe
- **Speech to text** using deep learning (ASR — Automatic Speech Recognition)
- Removes PII automatically, supports multiple languages
- Use cases: subtitles, call transcription, search archives

> ✅ Audio/speech → text = Transcribe

## Amazon Polly
- **Text to speech** — makes your apps talk
- Opposite of Transcribe

> ✅ Text → audio = Polly

## Amazon Translate
- **Natural language translation** — localize websites & apps for international users

## Amazon Lex
- Powers **Amazon Alexa** — ASR + Natural Language Understanding
- Build **chatbots** and call center bots
- Amazon Connect: cloud-based **contact center** service (80% cheaper than traditional)

> ✅ Build chatbot = Lex | Cloud call center = Connect

## Amazon Comprehend
- NLP (Natural Language Processing) — fully managed, serverless
- Extracts: key phrases, entities, sentiment, language, topics
- Use cases: analyze customer emails, group articles by topic

> ✅ Understand & analyze text = Comprehend

## Amazon SageMaker AI
- Fully managed service for **building, training, and deploying ML models**
- For developers and data scientists

## Amazon Kendra
- ML-powered **document search** service
- Extracts answers from PDFs, Word docs, HTML, FAQs using natural language

> ✅ Intelligent document search = Kendra

## Amazon Personalize
- Fully managed ML service for **real-time personalized recommendations**
- Same tech as Amazon.com's recommendation engine
- Use cases: retail, media & entertainment

## Amazon Textract
- Automatically extracts **text, handwriting, and data** from scanned documents
- Use cases: invoices, medical records, tax forms, ID documents

> ✅ Extract text from scanned documents = Textract

## ML – Cheat Sheet
| Service | Does What |
|---|---|
| Rekognition | Image/video analysis (faces, objects, labels) |
| Transcribe | Speech → text |
| Polly | Text → speech |
| Translate | Language translation |
| Lex | Chatbots (Alexa tech) |
| Connect | Cloud contact center |
| Comprehend | NLP — extract insights from text |
| SageMaker | Build & train ML models |
| Kendra | ML-powered document search |
| Personalize | Personalized recommendations |
| Textract | Extract text from documents |

---

# Section 16: Account Management, Billing & Support

## AWS Organizations
- **Global service** — manage multiple AWS accounts from one master account
- **Consolidated Billing** → single bill for all accounts + volume discounts
- Pooling of Reserved EC2 Instances across accounts for optimal savings
- **SCP (Service Control Policies)** → restrict what accounts can do

### SCP Key Facts
- Applied at **OU or Account** level
- Does NOT apply to master account
- Applies to all users and roles including Root user
- Must have explicit **Allow** (denies everything by default)

## AWS Control Tower
- Easy way to set up and govern a **secure multi-account environment**
- Automates setup using guardrails (preventive and detective)
- Runs on top of AWS Organizations (sets up SCPs automatically)

## AWS RAM (Resource Access Manager)
- **Share AWS resources** with other accounts or within Organization
- Avoids duplication — e.g., share VPC subnets, Transit Gateways, Route 53

## AWS Service Catalog
- Admins create a catalog of **pre-approved products** (CloudFormation stacks)
- Users can self-service launch only authorized configs
- Ensures compliance and consistency

## AWS Pricing Models
1. **Pay as you go** — pay for what you use
2. **Save when you reserve** — 1 or 3 year reservations for EC2, RDS, ElastiCache, Redshift
3. **Pay less by using more** — volume discounts
4. **Pay less as AWS grows** — economies of scale

## Savings Plans
| Type | Discount | Flexibility |
|---|---|---|
| EC2 Savings Plan | Up to 72% | Specific instance family + region |
| Compute Savings Plan | Up to 66% | Any instance family, region, EC2/Fargate/Lambda |
| ML Savings Plan | Varies | SageMaker |

## AWS Compute Optimizer
- Recommends optimal AWS resources using ML + CloudWatch metrics
- Reduces costs by up to 25%
- Covers: EC2 instances, EBS volumes, Auto Scaling Groups, Lambda functions

## Billing & Cost Tools
| Tool | Purpose |
|---|---|
| **Pricing Calculator** | Estimate cost before creating resources |
| **Billing Dashboard** | High-level overview of current spend |
| **Cost Allocation Tags** | Tag resources to track costs by project/team |
| **Cost & Usage Reports** | Most detailed billing data, integrates with Athena/Redshift |
| **Cost Explorer** | Visualize costs, forecast up to 12 months, find Savings Plans |
| **Billing Alarms** | CloudWatch alarm on billing metric (us-east-1, actual cost) |
| **Budgets** | Advanced, alert on cost/usage/RI/Savings Plans |
| **Cost Anomaly Detection** | ML-based detection of unusual spending |
| **Service Quotas** | Alert when close to service limits |

## AWS Trusted Advisor
- Automated account assessment — no install needed
- 6 categories: **Cost Optimization, Performance, Security, Fault Tolerance, Service Limits, Operational Excellence**
- Basic & Developer plans → 7 core checks
- Business & Enterprise → full checks + API access

## AWS Support Plans

| Plan | Cost | Response Times |
|---|---|---|
| **Basic** | Free | Documentation, forums, 7 core Trusted Advisor checks |
| **Developer** | Paid | Email business hours, <24 hr general, <12 hr system impaired |
| **Business** | Paid | 24/7 phone/email/chat, full Trusted Advisor, <4 hr prod impaired, <1 hr prod down |
| **Enterprise On-Ramp** | Paid | Pool of TAMs, <30 min business-critical down |
| **Enterprise** | Paid | Dedicated TAM, <15 min business-critical down |

- **TAM** = Technical Account Manager (Enterprise plans)
- **Concierge Support** = billing and account best practices (Enterprise plans)

## Account Best Practices
- Use Organizations + SCPs to restrict accounts
- Use Control Tower for multi-account setup with guardrails
- Tag resources for billing visibility
- Enable CloudTrail on all accounts → S3 log centralization
- Use Trusted Advisor + appropriate Support Plan

---

# Section 17: Advanced Identity

## AWS STS (Security Token Service)
- Provides **temporary, limited-privilege credentials** to access AWS resources
- Short-term credentials with configurable expiration
- Use cases: IAM Roles for cross-account access, EC2 role credentials, identity federation

## Amazon Cognito
- Identity management for **web & mobile apps** (millions of users)
- Instead of creating an IAM user, create a Cognito user
- Supports social logins (Google, Facebook, Apple)

> ✅ App users needing to log in = Cognito (not IAM)

## AWS Directory Services
- **AWS Managed Microsoft AD** → create AD in AWS, trust connection with on-prem AD
- **AD Connector** → proxy to redirect to on-prem AD
- **Simple AD** → standalone AD-compatible directory, no on-prem connection

## AWS IAM Identity Center (successor to AWS SSO)
- **Single Sign-On (SSO)** for all your AWS accounts in an Organization
- One login → access multiple AWS accounts, business apps (Salesforce, Office 365), SAML apps
- Identity providers: built-in store, Active Directory, Okta, OneLogin

> ✅ One login for multiple AWS accounts = IAM Identity Center

## Advanced Identity – Cheat Sheet
| Service | Purpose |
|---|---|
| IAM | Manage access within your AWS account |
| STS | Temporary credentials for roles/federation |
| Cognito | User identity for web/mobile apps |
| Directory Services | Microsoft AD on AWS or proxy to on-prem |
| IAM Identity Center | SSO across multiple AWS accounts |

---

# Section 18: Other AWS Services

## Amazon WorkSpaces
- Managed **Desktop as a Service (DaaS)** — provision Windows or Linux desktops in cloud
- Replaces on-prem VDI (Virtual Desktop Infrastructure)
- Pay per user per month or per hour

## Amazon AppStream 2.0
- Stream desktop **applications** from AWS to any web browser
- No VDI needed — works with any device with a browser

> ✅ Full cloud desktop = WorkSpaces | Stream a single app via browser = AppStream 2.0

## AWS IoT Core
- Connect billions of **IoT devices** to the AWS cloud — serverless, secure, scalable
- Devices can communicate with AWS even when offline
- Integrates with Lambda, S3, SageMaker

## AWS AppSync
- Store and sync data across **mobile & web apps** in real-time using **GraphQL**
- Integrates with DynamoDB and Lambda

## AWS Amplify
- Framework & tools to build and deploy **full-stack web & mobile apps**
- Handles: auth, storage, APIs, CI/CD, analytics

## AWS Device Farm
- Test web and mobile apps on **real physical devices** in the cloud
- Run concurrent tests on multiple devices

## AWS Backup
- Centrally manage and automate backups across many AWS services
- Supports PITR, cross-region, cross-account backups, retention policies

## Disaster Recovery Strategies (cheapest to most expensive)
1. **Backup & Restore** → backup data, restore on disaster (slowest RTO)
2. **Pilot Light** → minimal core running in cloud, scale up on disaster
3. **Warm Standby** → small but functional copy running, scale up fast
4. **Multi-Site / Hot Standby** → full production in multiple places (fastest, most expensive)

## AWS Elastic Disaster Recovery (DRS)
- Continuous block-level replication of your servers into AWS
- Quickly recover physical, virtual, and cloud-based servers

## AWS DataSync
- Move large amounts of data from **on-prem to AWS** (or between AWS storage)
- Destinations: S3 (any class), EFS, FSx for Windows
- Scheduled (hourly, daily, weekly), incremental after first load

## Cloud Migration – The 7 Rs
| Strategy | Description |
|---|---|
| **Retire** | Shut down apps you no longer need |
| **Retain** | Keep as-is for now |
| **Relocate** | Move to cloud equivalent (e.g., VMware to VMware Cloud on AWS) |
| **Rehost** (lift & shift) | Migrate as-is to AWS EC2, no optimization |
| **Replatform** (lift & reshape) | Minor optimization (e.g., move to RDS or Beanstalk) |
| **Repurchase** (drop & shop) | Move to SaaS (e.g., CRM → Salesforce) |
| **Refactor** (re-architect) | Redesign using cloud-native features (e.g., serverless) |

## AWS Application Discovery Service
- Collect data about on-prem servers before migration (CPU, memory, dependencies)
- **Agentless** → VM inventory | **Agent-based** → system performance + network connections

## AWS Migration Hub
- Central place to track migrations from Application Migration Service (MGN) and DMS

## AWS Application Migration Service (MGN)
- Lift-and-shift (rehost) tool — converts physical/virtual/cloud servers to run on AWS natively

## AWS Step Functions
- Build **serverless visual workflows** to orchestrate Lambda functions
- Supports sequences, parallel execution, conditions, timeouts, error handling

## AWS Fault Injection Simulator (FIS)
- Run **chaos engineering** experiments — inject faults (CPU spike, AZ failure) to test resilience
- Supports EC2, ECS, EKS, RDS

## Amazon Pinpoint
- Scalable marketing communications — email, SMS, push, voice
- Segment & personalize messages for campaigns
- Differs from SNS: Pinpoint manages full campaigns; SNS/SES is per-message

## AWS Ground Station
- Manage satellite communications and download satellite data to AWS

---

# Section 19: AWS Architecting & Ecosystem

## Well-Architected Framework – 6 Pillars
> These pillars are not trade-offs — they work together as a **synergy**

### 1. Operational Excellence
- Run and monitor systems, continually improve
- Key principles: IaC, frequent small changes, anticipate failure, learn from failures
- AWS Services: CloudFormation, Config, CloudTrail, CloudWatch, X-Ray, CodePipeline

### 2. Security
- Protect information, systems, and assets
- Key principles: least privilege IAM, enable traceability, apply security at all layers, encrypt data in transit and at rest, prepare for incidents
- AWS Services: IAM, KMS, Shield, WAF, CloudTrail, GuardDuty, Inspector, Config

### 3. Reliability
- Recover from failures and dynamically acquire compute resources
- Key principles: test recovery procedures, auto-recover from failure, scale horizontally, stop guessing capacity (use Auto Scaling), manage change via automation
- AWS Services: IAM, VPC, Route 53, CloudWatch, CloudFormation, S3, Backups

### 4. Performance Efficiency
- Use resources efficiently as demand changes
- Key principles: go global in minutes, use serverless, experiment often, use managed services
- AWS Services: Auto Scaling, Lambda, CloudFront, ElastiCache, RDS

### 5. Cost Optimization
- Run at lowest price point that delivers value
- Key principles: pay only for what you use, measure efficiency (CloudWatch), use tags for attribution, use managed services
- AWS Services: Budgets, Cost Explorer, Spot Instances, Reserved Instances, Auto Scaling, Trusted Advisor

### 6. Sustainability
- Minimize environmental impact
- Key principles: understand your impact, maximize utilization, use efficient hardware (Graviton), use serverless, manage data lifecycle
- AWS Services: Auto Scaling, Lambda, Fargate, Graviton EC2, EFS-IA, S3 Glacier, Intelligent-Tiering

## AWS Well-Architected Tool
- Free tool in AWS console to review your architectures against all 6 pillars
- Answer questions → get advice, videos, docs, generate report

## AWS Cloud Adoption Framework (AWS CAF)
- Framework to help plan your **digital transformation** using AWS
- **6 Perspectives**: Business, People, Governance (Business-focused) + Platform, Security, Operations (Technical-focused)

### CAF Transformation Phases
1. **Envision** → identify transformation opportunities
2. **Align** → identify gaps across all 6 perspectives
3. **Launch** → build and deliver pilot initiatives
4. **Scale** → expand pilot to full scale

## AWS Right Sizing
- Match instance types/sizes to actual workload needs — start small and scale
- Use CloudWatch, Cost Explorer, Trusted Advisor to find over-provisioned resources
- Right-size **before migration** and **continuously afterward**

## AWS Ecosystem – Resources
- **AWS Blogs** → aws.amazon.com/blogs/aws
- **AWS re:Post** → community Q&A replacing AWS Forums, expert-reviewed answers
- **AWS Whitepapers & Guides** → technical reference docs
- **AWS Solutions Library** → vetted architecture implementations
- **AWS Marketplace** → 3rd-party software catalog (AMIs, SaaS, containers) — billed through AWS

## AWS Support & Partner Ecosystem
- **APN (AWS Partner Network)**:
  - Technology Partners → hardware, connectivity, software
  - Consulting Partners → help you build on AWS
  - Training Partners → help you learn AWS
- **AWS IQ** → find and hire AWS-certified 3rd-party experts, pay per milestone
- **AWS Managed Services (AMS)** → fully managed operations (patching, monitoring, security) 24/365
- **AWS Professional Services** → global AWS expert team for large transformations

## Architecture – Cheat Sheet
| Concept | Key Point |
|---|---|
| 6 Pillars | Ops Excellence, Security, Reliability, Performance, Cost, Sustainability |
| Well-Architected Tool | Free review tool in console |
| CAF | 6 perspectives for transformation planning |
| Right Sizing | Match resources to actual needs, start small |
| AWS Marketplace | Buy/sell 3rd-party software via AWS |
| APN | AWS partner ecosystem |
| re:Post | Community Q&A |
| AMS | AWS-managed operations |

---

# 🎯 Final Exam Quick Reference

## Key Numbers to Remember
- S3 max object size = **5 TB** | Multi-part upload for > **5 GB**
- S3 durability = **11 nines (99.999999999%)**
- SQS message retention = **14 days** max
- Lambda max execution = **15 minutes**
- Lambda max RAM = **10 GB**
- EFS vs EBS: EFS = **multi-AZ shared** | EBS = **single AZ one instance**
- SNS subscriptions = **12.5 million** per topic
- Aurora storage auto-grows to **256 TB**
- CloudFront has **400+** edge locations

## Most Common Exam Traps
- **Root account** → never use for daily tasks
- **Lightsail** → almost always a wrong answer unless question says "beginner" or "simple app"
- **EC2 Instance Store** → ephemeral, not for persistent data
- **CloudFront vs S3 CRR** → CloudFront = cached static | CRR = real-time dynamic
- **ECS vs Fargate** → ECS you manage EC2 | Fargate serverless
- **CloudTrail vs CloudWatch** → CloudTrail = API audit | CloudWatch = metrics/logs/alarms
- **SQS vs SNS** → SQS = queue (one consumer reads and deletes) | SNS = fan-out (all subscribers get it)
- **Redshift vs RDS** → Redshift = analytics (OLAP) | RDS = transactions (OLTP)
- **Global Accelerator vs CloudFront** → GA = static IPs, non-cached, TCP/UDP | CF = CDN, cached content
- **Secrets Manager vs SSM Parameter Store** → Secrets Manager = auto-rotation (costs more) | Parameter Store = static config/secrets (cheaper)
- **GuardDuty vs Inspector vs Macie** → GuardDuty = threat detection | Inspector = vulnerability scan | Macie = PII in S3

