# AWS Cloud Practitioner — Exam Cheat Sheet

---

## 1. Trigger Word Mapping

> Grouped by category. Scan the category header first, then find your keyword.

---

### 🖥️ Compute

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Serverless functions / event-driven / runs infrequently / short bursts" | AWS Lambda |
| "Serverless containers / no EC2 to manage" | AWS Fargate |
| "Docker / **containers** / managed orchestration" | Amazon **ECS** |
| "Kubernetes workload / managed Kubernetes" | Amazon EKS |
| "Auto launch/terminate EC2 to match demand" | Amazon EC2 Auto Scaling |
| "Distribute incoming traffic across instances / AZs" | Elastic Load Balancing (ELB) |
| "Large-scale parallel batch compute jobs / simulations running hours" | AWS Batch |
| "Simplest website / WordPress / beginner / minimal cloud experience" | Amazon Lightsail |
| "Platform as a Service / upload code / AWS manages platform" | AWS Elastic Beanstalk |
| "Deploy containerized web app from source / minimal overhead" | AWS App Runner |
| "Prepackaged EC2 template / OS + software / launch template" | Amazon Machine Image (AMI) |
| "Physical isolation / BYOL per-socket or per-core licensing" | Dedicated Hosts |
| "Fault-tolerant / stateless / can be interrupted / up to 90% off" | Spot Instances |
| "Steady-state / 1-year commitment / no interruptions" | Reserved Instances |
| "Partial Upfront + 1 year + no interruption / best RI discount" | Partial Upfront Reserved Instances |
| "EC2 + Lambda long-term flexible savings" | Compute Savings Plans |
| "Billing per second / Amazon Linux exact time" | On-Demand (per-second billing) |
|"Layer 7 / URL path-based routing / HTTP & HTTPS/Least effort" |Application Load Balancer|
---

### 🗄️ Databases

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Relational DB / transactional / order system / SQL / managed" | Amazon RDS |
| "Oracle / SQL Server / MySQL / PostgreSQL / lift-and-shift DB" | Amazon RDS |
| "AWS-native relational / MySQL or PostgreSQL compatible only" | Amazon Aurora |
| "Database HA / automatic failover / standby in another AZ" | Amazon RDS Multi-AZ |
| "Scale database reads / analytics offload / read-only copy" | Amazon RDS Read Replica |
| "NoSQL / key-value / millions of req/sec / single-digit ms" | Amazon DynamoDB |
| "Active-active NoSQL across multiple AWS Regions" | Amazon DynamoDB Global Tables |
| "In-memory DynamoDB cache / microsecond latency" | Amazon DynamoDB Accelerator (DAX) |
| "OLAP / analytics / data warehouse / complex SQL on petabytes" | Amazon Redshift |
| "Serverless Redshift / no cluster to manage" | Amazon Redshift Serverless |
| "In-memory / caching / sub-millisecond reads / Redis or Memcached" | Amazon ElastiCache |
| "Graph database / relationship-heavy data / social network" | Amazon Neptune |
| "MongoDB / JSON document storage" | Amazon DocumentDB |
| "Apache Cassandra / wide-column NoSQL" | Amazon Keyspaces |
| "Automatic storage cost savings / unknown or changing access patterns" |S3 Intelligent-Tiering|
| "Time-series database / IoT telemetry / trillions of events per day" | Amazon Timestream |
| "Migrate a database to AWS with source still operational" | AWS Database Migration Service (DMS) |
|"View specific data / Keep control over full datasets / Manage access for many customers" |S3 Access Points|
- HA -> 2 + AZs
- Max. Resiliency-> 3 + AZs

---

### 🪣 Storage

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Object storage / durable / offsite backup / static website / data lake" | Amazon S3 |
| "Long-term archive / lowest cost storage / rarely accessed" | S3 Glacier Deep Archive |
| "Infrequent access / multi-AZ / immediately retrievable" | S3 Standard-IA |
| "Infrequent access / single AZ / cheapest IA / recreatable data" | S3 One Zone-IA |
| "WORM / prevent S3 object deletion / immutable objects" | Amazon S3 Object Lock |
| "Versioning / recover deleted S3 objects / previous versions" | Amazon S3 Versioning |
| "Replicate S3 to another region / cross-region DR" | S3 Cross-Region Replication (CRR) |
| "Fast long-distance S3 uploads / speed up transfers via edge" | Amazon S3 Transfer Acceleration |
| "Block storage / attached to one EC2 / persistent hard drive" | Amazon EBS |
| "Temporary local block storage / lost when instance stops" | EC2 Instance Store |
| "Shared file system / NFS / hundreds of EC2 instances concurrently" | Amazon EFS |
| "Infrequent access / multi-AZ EFS / lower cost" | EFS Standard-IA |
| "Windows file system / SMB / Active Directory integration" | Amazon FSx for Windows |
| "High-performance compute file system / HPC / Lustre" | Amazon FSx for Lustre |
| "Tape library replacement / existing backup workflow unchanged" | AWS Storage Gateway — Tape Gateway |
| "NFS or SMB access to S3 / file gateway hybrid on-premises" | AWS Storage Gateway — File Gateway |
| "Block storage backed by S3 / **iSCSI** / hybrid" | AWS Storage Gateway — **Volume** Gateway |
| "Physical offline data migration / ~80 TB per device" | AWS Snowball Edge |
| "Exabyte / 100+ petabytes offline migration / truck-sized" | AWS Snowmobile |
| "Centralized backup policy across multiple services (RDS, EFS, EBS...)" | AWS Backup |
| "Automate EBS snapshot lifecycle / EBS only" | Amazon Data Lifecycle Manager (DLM) |

---

### 🔒 Security & Identity

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "SQL injection / XSS / custom web rules / filter HTTP traffic" | AWS WAF |
| "DDoS protection / L3/L4 / always on / free" | AWS Shield Standard |
| "DDoS + response team + cost protection / advanced DDoS" | AWS Shield Advanced |
| "Centrally manage WAF + Shield across accounts" | AWS Firewall Manager |
| "Threat detection / network + account monitoring / ML-based" | Amazon GuardDuty |
| "Sensitive data / PII discovery in S3" | Amazon Macie |
| "Vulnerability scanning / EC2 software flaws / CVEs" | Amazon Inspector |
| "Root cause investigation of security incidents" | Amazon Detective |
| "Aggregate security findings / single pane of glass" | AWS Security Hub |
| "Download SOC / ISO / PCI compliance reports / audit agreements" | AWS Artifact |
| "Encryption keys/ Cryptographic / multi-tenant / integrates with all AWS services" | AWS KMS |
| "Single-tenant HSM / FIPS 140-2 Level 3 / strict compliance" | AWS CloudHSM |
| "Store and auto-rotate DB passwords / secrets" | AWS Secrets Manager |
| "Store config values / app config / no auto-rotation" | AWS Systems Manager Parameter Store |
| "Free TLS/SSL certificates for CloudFront / ALB / AWS services" | AWS Certificate Manager (ACM) |
| "S3 encryption at rest by AWS / server-side" | SSE-S3 or SSE-KMS |
| "Social login / Facebook / Google / SAML for customer-facing apps" | Amazon Cognito |
| "SSO for AWS accounts + SaaS apps / employee portal" | AWS IAM Identity Center |
| "Managed Microsoft Active Directory in the cloud" | AWS Directory Service |
| "Cross-account access / temporary permissions for EC2 / services" | IAM Role |
| "Temporary federated credentials / short-term tokens" | AWS STS |
| "Programmatic access / CLI / SDK / API authentication" | Access Keys |
| "Find overly permissive policies / unused IAM permissions" | IAM Access Analyzer |
| "Audit all IAM users / key age / MFA status in one report" | IAM Credential Report |
| "Assign permissions to multiple IAM users at once" | IAM Groups |
| "Best practice checks / unrestricted SSH / service limits/Qoutas/cost Provisioning" | AWS Trusted Advisor |
| "Resource config history / what changed on a resource" | AWS Config |
| "Who did what / API call history / console login audit" | AWS CloudTrail |
| "VPC traffic capture(RDS,Aurora,Elasticache,ELB) / network interface **IP** metadata" | VPC Flow Logs |
| "Illegal use of AWS / report abuse" | AWS Abuse Team |
- Who enable Encryption Keys? -> Customers
- What ? -> KMS
- TLS/SSL -> encrypt data in transient
- KMS -> ....... at rest

---

### 🌐 Networking

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Multiple isolated networks in same account" | Amazon VPC |
| "**Subnet**-level firewall / stateless" | Network ACLs |
| "Instance-level firewall / stateful" | Security Groups |
| "Make subnet public / route to internet" | Internet Gateway + Route Tables |
| "Private subnet internet access / outbound only" | NAT Gateway |
| "Dedicated private connection to AWS / no internet / high speed" | AWS Direct Connect |
| "Encrypted tunnel over public internet / quick setup" | AWS Site-to-Site VPN |
| "DNS / domain routing / highly available scalable DNS" | Amazon Route 53 |
| "Static files globally / CDN / cache at **edge** / low latency worldwide" | Amazon CloudFront |
| "Accelerate global traffic / non-HTTP / route via AWS private backbone" | AWS Global Accelerator |
| "Connect multiple VPCs + on-premises / hub-and-spoke" | AWS Transit Gateway |
| "Direct 1:1 private connection between two VPCs (same Region)" | VPC Peering |
| "Access S3/DynamoDB from private subnet without internet" | VPC Endpoint (Gateway) — Free |
| "Private IP access to AWS services from VPC / PrivateLink" | VPC Endpoint (Interface) |
| "5G edge latency / embedded in carrier network" | AWS Wavelength |
| "Low-latency in a specific major city / metro area" | AWS Local Zones |
| "Physical AWS hardware in YOUR data center / data residency / true hybrid" | AWS Outposts |
| "Store data in specific country / legal data residency" | AWS Regions |
| "Share AWS resources (Aurora+VPC) across Acc. " |AWS Resource Access Manager (RAM)|

---

### 💰 Cost Management

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Estimate costs BEFORE deployment / migration cost model" | AWS Pricing Calculator |
| "On-premises assessment / migration business case / cost projection" | AWS Migration Evaluator |
| "Visualize / manage EXISTING spend over time / forecasts" | AWS Cost Explorer |
| "Set alerts / budget thresholds / proactive spend notifications" | AWS Budgets |
| "Most granular billing data / raw CSV export to S3" | AWS Cost and Usage Report (CUR) |
| "Consolidated billing / multiple accounts / share RIs" | AWS Organizations |
| "Bill departments within one account / attribute costs by team / AWS Generated" | Cost Allocation Tags |
| "Rightsize EC2 / ML-based recommendations / historical usage" | AWS Compute Optimizer |
| "View and request increases for service limits" | AWS Service Quotas |
| "Warn when approaching service limits / best practice checks / Reduce costs / Identifying **underutilized** resources" | AWS Trusted Advisor |
| "Carbon emissions / environmental impact report" | AWS Customer Carbon Footprint Tool |
|"View of Estimates on metered to date"|Billing Dashboard|


---

### 📊 Analytics & AI/ML

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Serverless SQL on S3 / CSV files / query without infrastructure" | Amazon Athena |
| "Business intelligence / dashboards / charts / visualizations" | Amazon QuickSight |
| "ETL / extract transform load / data catalog / serverless" | AWS Glue |
| "Big data cluster / Hadoop / Spark / managed EMR" | Amazon EMR |
| "Real-time **data streaming** / ingest high-volume events / replay" | Amazon **Kinesis** Data Streams |
| "Build and train custom ML models / requires ML expertise" | Amazon SageMaker |
| "Enterprise ML-powered document / content search / no ML expertise" | Amazon Kendra |
| "Image / video analysis / content moderation / no ML expertise" | Amazon Rekognition |
| "Extract text from documents / invoices / scanned forms" | Amazon Textract |
| "Speech to text / transcribe call recording" | Amazon Transcribe |
| "Text to speech / lifelike audio from text" | Amazon Polly |
| "Chatbot / conversational interface / voice + text / Alexa engine" | Amazon Lex |
| "Text sentiment / NLP / entity detection / language analysis" | Amazon Comprehend |
| "Product recommendations / personalization / real-time" | Amazon Personalize |
| "Forecasting / time-series business predictions" | Amazon Forecast |
| "Human review for low-confidence ML predictions" | Amazon Augmented AI (A2I) |

---

### 📨 Messaging & Integration

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Pub/sub / SMS + email + Lambda simultaneously / fan-out" | Amazon SNS |
| "Decouple / queue / async messaging / one consumer per message" | Amazon SQS |
| "Email delivery only / transactional / bulk email / no SMS" | Amazon Simple Email Service (SES) |
| "Schedule a Lambda / CRON job / event bus / no custom code" | Amazon EventBridge |
| "Orchestrate Lambda functions / multi-step visual workflow" | AWS Step Functions |
| "Real-time data streaming / replay / multiple consumers" | Amazon Kinesis Data Streams |
| "Legacy message broker / ActiveMQ or RabbitMQ migration" | Amazon MQ |
| "Managed GraphQL API / connect multiple backends" | AWS AppSync |
| "Fully managed virtual desktop / complete cloud computer for employees" | Amazon WorkSpaces/AppStream |

---

### 🛠️ Developer & Infrastructure Tools

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Infrastructure as Code / YAML templates / repeatable stacks" | AWS CloudFormation |
| "CloudFormation across multiple accounts and regions" | AWS CloudFormation StackSets |
| "Define IaC with Python / Java / TypeScript" | AWS Cloud Development Kit (CDK) |
| "Cloud-based IDE / write run debug in browser" | AWS Cloud9 |
| "Browser-based shell / CLI without local install / zero setup" | AWS CloudShell |
| "CI/CD pipeline / full build-test-deploy orchestration" | AWS CodePipeline |
| "Compile and test code / managed build service" | AWS CodeBuild |
| "Automate code deployment to EC2 / Lambda / on-premises" | AWS CodeDeploy |
| "Private Git repository on AWS" | AWS CodeCommit |
|"Centralize operational data / Automate tasks across EC2"|AWS Systems Manager|
| "Automate OS **patching EC2** + on-premises servers" | AWS Systems Manager Patch Manager |
| "Browser-based SSH / no SSH keys / run commands remotely" | AWS Systems Manager Session Manager |
| "Centralized parameter storage / store config values" | AWS Systems Manager Parameter Store |

---

### 🏢 Governance, Migration & Support

| If you see this keyword... | ...the AWS service is this |
|---|---|
| "Consolidated billing / central policy / **SCPs** across accounts/ aggregate usages/RIs discount" | AWS Organizations |
| "Multi-account landing zone / guardrails / governance setup" | AWS Control Tower |
| "Lift-and-shift server migration to EC2 / physical VM to cloud" | AWS Application Migration Service (MGN) |
| "Track migration progress centrally / multiple migration tools" | AWS Migration Hub |
| "Identify capability gaps / cloud readiness evaluation" | AWS Cloud Adoption Framework (CAF) |
| "Evaluate a specific workload against AWS best practices" | AWS Well-Architected Tool |
| "Concierge + TAM + 24/7 + architecture guidance" | AWS Enterprise Support |
| "TAM only / designated technical account manager" | AWS Enterprise Support |
| "Health API / full Trusted Advisor checks / 24/7 phone support" | AWS Business Support |
| "Concierge answers billing inquiries / NOT technical support" | AWS Enterprise Support Concierge |
| "Global AWS service status / outage RSS feed" | AWS Health Dashboard — Service Health |
| "Personalized health alerts for YOUR specific resources" | AWS Health Dashboard — Your Account Health |
| "Buy / sell third-party software / AMIs / SaaS on AWS" | AWS Marketplace |
| "Paid consulting / cloud adoption outcomes / AWS own team" | AWS Professional Services |
| "Third-party implementation / build migrate manage workloads" | APN Consulting Partners |
| "Software vendor / ISV / technology product partner" | APN Technology Partners |

---

## 2. Common Distractors

> Ordered by exam frequency. Top ones appear most often.

---

**CloudTrail vs. Config vs. CloudWatch**
- CloudTrail = WHO did WHAT — API calls, console logins, who deleted a resource, when.
- Config = WHAT CHANGED — resource configuration history, compliance rules, detect drift.
- CloudWatch = PERFORMANCE — metrics, alarms, CPU spikes, logs, auto-scaling triggers.
- Trap: "who terminated the EC2?" → CloudTrail. "When was the EBS volume removed?" → Config. "CPU over 80% alert" → CloudWatch.

**WAF vs. Shield Standard vs. Shield Advanced**
- WAF = L7 application layer; blocks SQL injection, XSS, custom IP/geo rules; you write the rules.
- Shield Standard = L3/L4 network layer; automatic DDoS protection; free for all customers; always on.
- Shield Advanced = paid; adds 24/7 DDoS response team (DRT) + cost protection + app-layer monitoring.
- Trap: "SQL injection" → WAF. "DDoS" → Shield. "SQL injection AND DDoS" → WAF + Shield Advanced.

**Security Groups vs. Network ACLs**
- Security Groups = EC2 instance level; stateful (return traffic automatic); allow rules only (by default all blocked).
- Network ACLs = subnet level; stateless (must allow both directions); allow AND deny rules.
- Trap: "VPC subnet firewall" → ACL. "EC2 instance firewall / specific instance rules" → Security Group.

**Spot vs. On-Demand vs. Reserved vs. Savings Plans vs. Dedicated**
- Spot = up to 90% off; CAN be interrupted; fault-tolerant / stateless / batch workloads only.
- On-Demand = no commitment; highest hourly rate; for unpredictable or short-term workloads.
- Reserved = 1–3 year commitment; up to 72% off; for steady, predictable production workloads.
- Savings Plans = flexible commitment on EC2 + Lambda + Fargate; more flexible than Reserved.
- Dedicated Instances = dedicated hardware per account; does NOT support BYOL per-socket/core licensing.
- Dedicated Hosts = full physical server; supports BYOL per-socket/per-core; most expensive.
- Trap: "fault-tolerant batch" → Spot. "1-year stable production" → Reserved. "BYOL Windows Server" → Dedicated Hosts (not Dedicated Instances).
- DISASTER RECOVERY FOR EC2 (AMIs & EBS snapshots)


**RDS Multi-AZ vs. RDS Read Replica**
- Multi-AZ = synchronous Replication in another AZ; automatic failover; HIGH AVAILABILITY only; does NOT improve read performance.
- Read Replica = asynchronous read-only copy; READ SCALABILITY and reporting; NOT an HA failover target.
- Trap: "disaster recovery / failover" → Multi-AZ. "Scale reads / offload analytics" → Read Replica.

**Pricing Calculator vs. Cost Explorer vs. Budgets vs. Migration Evaluator**
- Pricing Calculator = estimate costs BEFORE you build; model hypothetical workloads.
- Migration Evaluator = analyze on-premises usage to produce a migration cost estimate.
- Cost Explorer = visualize and forecast costs you are ALREADY spending; historical + 12-month forecast.
- Budgets = set thresholds; receive alerts when actual or forecasted spend crosses the limit.
- Trap: "before migration / pre-deployment estimate" → Pricing Calculator or Migration Evaluator. "Already on AWS / visualize spend" → Cost Explorer. "Alert me when I exceed $X" → Budgets.

**GuardDuty vs. Macie vs. Inspector vs. Security Hub vs. Detective**
- GuardDuty = THREATS — ML detects malicious behavior in CloudTrail, VPC Flow Logs, DNS.
- Macie = PII DATA — discovers and classifies sensitive data in S3.
- Inspector = VULNERABILITIES — scans EC2, Lambda, and containers for CVEs and software flaws.
- Security Hub = AGGREGATOR — single dashboard for findings from GuardDuty, Inspector, Macie, etc.
- Detective = ROOT CAUSE — investigates HOW a threat happened using graph analytics.
- Trap: "continuously scan EC2 for software vulnerabilities" → Inspector. "Detect malicious account activity" → GuardDuty. "Find PII in S3" → Macie. "All security findings in one place" → Security Hub.

**Cognito vs. IAM Identity Center vs. IAM**
- Cognito = CUSTOMERS — external app users; social login (Facebook, Google, Amazon).
- IAM Identity Center = EMPLOYEES — workforce SSO for AWS accounts and enterprise SaaS apps.
- IAM = INTERNAL — manages users, roles, and permissions within an AWS account.
- Trap: "social media login for app users" → Cognito. "Employee AWS Console SSO" → IAM Identity Center. "Grant EC2 access to S3" → IAM Role.

**Outposts vs. Local Zones vs. Wavelength**
- Outposts = physical AWS rack INSIDE YOUR data center; for data residency, legal obligations, on-site processing.
- Local Zones = AWS-managed infrastructure in a major city; extends a Region; for latency-sensitive urban apps.
- Wavelength = embedded INSIDE 5G carrier networks; for ultra-low-latency mobile apps.
- Trap: "slow internet / must stay on-premises / data residency" → Outposts. "Near large city" → Local Zones. "5G mobile edge" → Wavelength.

**Snowball vs. Snowmobile**
- Snowball Edge = physical device ~80 TB per unit; for typical offline data migration; Remote + Processing (Ship in sea)
- Snowmobile = ruggedized shipping container truck; for 100+ petabytes / exabyte-scale migrations.
- Trap: "50 petabytes" → Snowmobile. "10 TB–few PB" → Snowball Edge.

**SNS vs. SQS vs. SES vs. EventBridge vs. Kinesis**
- SNS = push / pub-sub / fan-out ONE message to MANY protocols simultaneously (email, SMS, Lambda, SQS).
- SQS = pull / queue / ONE consumer per message; for decoupling microservices.
- SES = email ONLY; for transactional, marketing, and bulk email delivery to end users.
- EventBridge = event BUS; routes events between services; runs scheduled CRON jobs; no custom code.
- Kinesis = real-time high-throughput DATA STREAMING; multiple consumers; data is replayable.
- Trap: "SMS + email fan-out" → SNS. "Decouple services async" → SQS. "Email only" → SES. "Schedule Lambda daily" → EventBridge. "Real-time streaming" → Kinesis.

**Step Functions vs. CodePipeline vs. EventBridge**
- Step Functions = orchestrates Lambda functions into a sequenced multi-step serverless workflow.
- CodePipeline = CI/CD pipeline for code releases: Source → Build → Test → Deploy.
- EventBridge = event bus or scheduler; routes events or runs CRON jobs; no orchestration logic.

**CloudFront vs. Global Accelerator**
- CloudFront = CDN; caches CONTENT (HTML, images, video) at edge; for static/dynamic content delivery.
- Global Accelerator = network-layer; NO caching; routes TCP/UDP traffic to nearest healthy Region over AWS private backbone.
- Trap: "cache static files globally" → CloudFront. "Improve TCP app performance globally / non-HTTP" → Global Accelerator.

**Secrets Manager vs. Parameter Store vs. KMS**
- Secrets Manager = stores + auto-rotates credentials (DB passwords, API keys); integrates with RDS; has a cost.
- Parameter Store = stores configuration values; no native auto-rotation; free tier available.
- KMS = manages ENCRYPTION KEYS; not a secrets store; used BY Secrets Manager to encrypt secrets.

**ECS vs. EKS vs. Fargate vs. ECR vs. App Runner**
- ECR = container image REGISTRY; stores Docker images only.
- ECS = container ORCHESTRATION; AWS-native; simpler than Kubernetes.
- EKS = managed Kubernetes; for teams already using Kubernetes.
- Fargate = serverless COMPUTE ENGINE for ECS or EKS; no EC2 to manage.
- App Runner = simplest; source code or container image → running HTTPS web app automatically.
- Trap: "store Docker images" → ECR. "Run containers, no servers" → Fargate. "Kubernetes" → EKS. "Simplest container deploy" → App Runner.

**DynamoDB Global Tables vs. DynamoDB DAX**
- Global Tables = active-active multi-region replication; low-latency reads AND writes from any region.
- DAX = in-memory microsecond cache in front of DynamoDB; single-region; read-only acceleration.
- Trap: "write from multiple regions" → Global Tables. "Faster reads same region" → DAX.

**Control Tower vs. Organizations**
- Control Tower = automated landing zone for NEW multi-account environments; uses SCPs + Config rules as guardrails.
- Organizations = consolidated billing + SCP management for EXISTING accounts; no automated setup.

**Transit Gateway vs. VPC Peering**
- Transit Gateway = hub-and-spoke; connects MANY VPCs + on-premises; supports transitive routing.
- VPC Peering = direct 1:1 private connection between exactly two VPCs; non-transitive.

**SageMaker vs. Pre-trained AI Services**
- SageMaker = build + train CUSTOM ML models; requires ML expertise.
- Pre-trained (Rekognition, Textract, Transcribe, Polly, Lex, Comprehend, Personalize, Forecast, Kendra) = no ML expertise needed.
- Trap: "no ML expertise" → always pick a pre-trained service, never SageMaker.

**Direct Connect vs. Site-to-Site VPN**
- Direct Connect = dedicated PRIVATE physical line; no internet; consistent bandwidth; for compliance or high-throughput.
- Site-to-Site VPN = encrypted tunnel OVER the public internet; quick setup; variable latency; lower cost.
- Trap: "must NOT go over internet" → Direct Connect. "Quick encrypted connection" → VPN.

**Multi-AZ vs. Multi-Region**
- Multi-AZ = within ONE Region; protects against AZ failure; HIGH AVAILABILITY.
- Multi-Region = across 2+ Regions; protects against full Region failure; DISASTER RECOVERY + global users.

**VPC Endpoint (Gateway) vs. NAT Gateway**
- VPC Endpoint Gateway = FREE; connects private subnet to S3 or DynamoDB without internet.
- NAT Gateway = allows private subnet instances to reach the internet outbound; NOT for private AWS service access.

**Health Dashboard: Service Health vs. Your Account Health**
- Service Health = global status of ALL AWS services; RSS feed; widespread outages.
- Your Account Health = personalized alerts for events impacting YOUR specific running resources.

**AWS Batch vs. Lambda**
- Batch = LONG-RUNNING parallel batch jobs (minutes to hours); manages compute fleet automatically.
- Lambda = SHORT event-driven functions (max 15 minutes); serverless; triggered by events.
- Trap: "simulations running up to 3 hours" → Batch. "Process S3 upload event" → Lambda.

**DLM vs. AWS Backup**
- DLM = automates EBS snapshot lifecycle ONLY.
- AWS Backup = centralized policy-driven backup for MULTIPLE services (RDS, EFS, DynamoDB, S3, EBS, EC2).

**CodeBuild vs. CodeDeploy vs. CodePipeline**
- CodeBuild = BUILD stage; compiles code and runs tests.
- CodeDeploy = DEPLOY stage; deploys code to EC2, Lambda, on-premises.
- CodePipeline = ORCHESTRATES the full pipeline: Source → Build → Test → Deploy.

---

## 3. Shared Responsibility Matrix

| Responsibility Area | AWS ✅ | Customer ✅ |
|---|---|---|
| Physical hardware & data centers | ✅ | |
| Network infrastructure & virtualization layer | ✅ | |
| Hypervisor patching | ✅ | |
| Decommissioning end-of-life storage devices | ✅ | |
| Availability Zone & Region availability | ✅ | |
| Managed service OS patching (RDS, Aurora, Lambda, DynamoDB) | ✅ | |
| Aurora / RDS database engine patching | ✅ | |
| Lambda OS, runtime, and underlying infrastructure | ✅ | |
| Patch management — host OS & hypervisor | ✅ | |
| Configuration management — AWS infrastructure layer | ✅ | |
| Security awareness & training (AWS staff) | ✅ | |
| EC2 guest OS patching & updates | | ✅ |
| Application code security | | ✅ |
| IAM users, roles, policies, and MFA enablement | | ✅ |
| Data encryption — configuring and enabling it | | ✅ |
|Managing the encryption process for clusters and snapshots|✅||
| EBS volume backups | | ✅ |
| Security group & network ACL configuration | | ✅ |
| Database encryption settings (enabling on Aurora/RDS) | | ✅ |
| S3 bucket ACLs, bucket policies, and permissions | | ✅ |
| Lambda: writing the code + security inside the code | | ✅ |
| DynamoDB access permissions (IAM policies) | | ✅ |
| Patch management — guest OS (EC2) & customer applications | | ✅ |
| Configuration management — customer apps & data | | ✅ |
| Choice of AWS Region where data is stored | | ✅ |
| Security awareness & training (customer staff) | | ✅ |

**Shared Controls — both AWS AND customer manage their own layer**
- Patch Management = AWS patches the host; customer patches the guest OS and apps.
- Configuration Management = AWS manages the infrastructure layer; customer manages their app and data configs.
- Awareness & Training = AWS trains its staff; customer trains their own staff.

**Root User Tasks — Customer only, never delegate**
- Change or cancel the AWS Support plan
- Close the AWS account
- Create an AWS Organization
- Enable MFA on the root account
- Restore IAM user permissions after accidental lockout
- No need for explicit permission
- Trap: everything else should be done with IAM users or roles, NEVER root for daily tasks.
- Trap: AWS Organization Admin can limit priviliges of root user

**Shared Responsibility by Service Type**
- IaaS (EC2) = Customer manages most: OS patching, middleware, app, data, firewall config.
- PaaS (RDS, Elastic Beanstalk) = AWS manages OS and runtime; customer manages data, app, and access.
- SaaS (DynamoDB, S3, Lambda) = AWS manages everything infrastructure; customer manages data, access, and code logic only.

---

## 4. Service Comparisons

**Compute Decision Tree**
- Full OS control / lift-and-shift → EC2
- Short event-driven function / max 15 min / no servers → Lambda
- Containers without managing servers → Fargate
- Containers with OS-level access → ECS on EC2
- Kubernetes workload → EKS
- Simplest website / beginner / WordPress → Lightsail
- Upload code, AWS manages platform → Elastic Beanstalk
- Source code → HTTPS app, fully managed → App Runner
- Long batch jobs / parallel simulations → AWS Batch
- like App store for users -> service catalog

**Database Decision Tree**
- SQL / relational / transactional → RDS
- Fastest relational / Most Scalable DB / MySQL or PostgreSQL only → Aurora
- NoSQL / key-value / massive scale → DynamoDB
- Analytics / OLAP / complex SQL on large datasets / Columnar Storage / Auto. backups → Redshift
- In-memory caching / sub-millisecond → ElastiCache
- Graph / relationships → Neptune
- MongoDB / JSON documents → DocumentDB
- Cassandra / wide-column → Keyspaces
- Time-series / IoT / high-volume events → Timestream
- RDS High Availability / failover → Multi-AZ
- RDS Read Scaling / analytics offload → Read Replica
- DynamoDB global reads and writes → Global Tables
- DynamoDB faster reads same region → DAX

**Storage Decision Tree**
- Unstructured objects / backups / data lake → S3
- Persistent block storage / single EC2 → EBS
- Temporary local storage / high I/O → EC2 Instance Store
- Shared file system / multiple EC2 → EFS
- Windows file system / Active Directory → FSx for Windows
- HPC / Lustre → FSx for Lustre
- Archive / long-term / rarely accessed → S3 Glacier Deep Archive
- Infrequent access / multi-AZ → S3 Standard-IA
- SCT convert DB schemas & Code Objects

**Support Plans**
- Basic = free; documentation, forums, 7 core Trusted Advisor checks; NO human support.
- Developer = adds email support during business hours; 1 primary contact.
- Business = adds 24/7 phone/chat/email; ALL Trusted Advisor checks; AWS Health API; 1 hour prod. down
- Enterprise On-Ramp = adds pool of TAMs; Concierge; 30-min critical response.
- Enterprise = adds designated TAM; Concierge; 15-min critical response; architecture reviews.
- Concierge team = answers BILLING and ACCOUNT inquiries ONLY; NOT technical support.

**Well-Architected Framework — 6 Pillars**

| Pillar | One-Line Focus | Key Design Principles |
|---|---|---|
| Operational Excellence | Run and improve workloads | Make small reversible changes; perform ops as code |
| Security | Protect data and systems | Enable traceability; least privilege; encrypt everything |
| Reliability | Recover from failure | Function correctly & consistently;Auto-recover; test recovery; multiple AZs; stop guessing capacity |
| Performance Efficiency | Use resources efficiently | Quickly Adv.;Go global in minutes; use serverless; use advanced tech as a service |
| Cost Optimization | Deliver value at lowest price | Measure efficiency; rightsize; use Spot for batch |
| Sustainability | Minimize environmental impact | Maximize utilization; use managed services; eliminate idle resources |

**AWS CAF — 6 Perspectives**

| Perspective | Primary Stakeholders | Core Focus |
|---|---|---|
| Business | CFOs, CEOs, Business Analysts | Align cloud investments with business goals |
| People | (Tech + People ) HR, Staffing, Change Managers | Org change management; culture and skills |
| Governance | CIOs, Portfolio Managers | Risk management; align cloud with business strategy |
| Platform | CTOs, IT Architects, Engineers | Design and deliver cloud infrastructure |
| Security | CISOs, Security Analysts | Data protection, compliance, incident response |
| Operations | IT Operations, SREs | Day-to-day cloud service delivery and monitoring |

- CAF Phases: Envision → **Align** (identify capability gaps) → Launch → Scale

**Global Infrastructure**
- Region = geographic cluster of 2+ AZs; data does not leave a Region unless you explicitly move it.
- Availability Zone (AZ) = one or more discrete data centers in a single location; own power and networking; interconnected with other AZs via private low-latency links; do NOT share power with other AZs.
- Edge Locations = Points of Presence (PoPs) used by CloudFront and Global Accelerator; far more numerous than Regions.

**S3 Quick Facts**
- Total capacity = unlimited; maximum single object size = 5 TB.
- Durability = 99.999999999% (11 nines) across all classes except One Zone-IA.
- S3 Standard 99.99%
- S3 One Zone-IA = only class that does NOT replicate across multiple AZs.
- Lose 1 Obj. every 10K years if store 10M obj.

**EC2 Billing Facts**
- Amazon Linux / Windows On-Demand = billed per second; 60-second minimum.
- Convertible Reserved Instances = can exchange for other Convertible RIs of a different family/size/OS; CANNOT be sold on Marketplace.
- Standard Reserved Instances = CAN be sold on the Reserved Instance Marketplace; cannot change instance family.
- Dedicated Instances = dedicated hardware per account; does NOT support BYOL per-socket/core.
- Dedicated Hosts = full physical server; supports BYOL per-socket, per-core, or per-VM licensing.

**Key Cloud Benefits**

| Exam Phrase | What It Means |
|---|---|
| Trade fixed for variable expense | Pay-as-you-go; OpEx instead of CapEx |
| Economies of scale | AWS buying power lowers prices for everyone |
| Stop guessing capacity | Elasticity; scale up/down on demand |
| Increase speed and agility | Provision in minutes, not weeks |
| Go global in minutes | Deploy to any Region instantly |
| Stop spending on data centers | AWS manages physical infrastructure |
| Elasticity | Scale to exact demand; eliminate idle capacity |
| High Availability | Multiple AZs; automatic failover; no single point of failure |
| Fault Tolerance | System continues despite component failure |
| Durability | Long-term data protection (S3 = 11 nines) |
| Reliability | System performs its function and recovers from failure |

**IAM Security Best Practices**
- Enable MFA for root account and ALL IAM users.
- Never use root account for daily tasks; create individual IAM users.
- Apply least privilege — grant only the permissions needed.
- Use IAM Roles for EC2 instances and cross-account access, not Access Keys.
- Rotate Access Keys regularly; delete unused keys.
- Use IAM Groups to assign permissions to multiple users at once.
- Use IAM Credential Report to audit key age and MFA status.
- Use IAM Access Analyzer to find overly permissive or unused policies.
- Store secrets in Secrets Manager — never hard-code credentials in code.

**Common Exam Traps — Quick Reference**

| Trap Pattern | Correct Answer |
|---|---|
| "No infrastructure to manage" | Serverless: Lambda, Fargate, Athena, DynamoDB |
| "No ML expertise required" | Pre-trained: Rekognition, Textract, Transcribe, Polly, Lex, Comprehend, Kendra |
| "Least operational overhead" | Fully managed / serverless over IaaS |
| "Fault-tolerant batch / stateless / can be interrupted" | Spot Instances |
| "Consistent, stable, 1+ year production" | Reserved Instances |
| "Temporary / unpredictable / dev environment" | On-Demand Instances |
| "Physical server + BYOL per-socket licensing" | Dedicated Hosts (NOT Dedicated Instances) |
| "Migrate 100+ PB data offline" | Snowmobile (NOT Snowball) |
| "Access S3 from EC2, no public internet" | VPC Endpoint Gateway (free) |
| "Database HA / automatic failover" | RDS Multi-AZ (NOT Read Replica) |
| "Scale database reads / analytics offload" | RDS Read Replica (NOT Multi-AZ) |
| "CloudTrail vs CloudWatch" | CloudTrail = WHO (audit). CloudWatch = WHAT (performance) |
| "Inspector vs GuardDuty" | Inspector = software vulnerabilities. GuardDuty = active threats |
| "Pricing Calculator vs Cost Explorer" | Calculator = FUTURE estimate. Explorer = PAST analysis |
| "Download compliance documents" | AWS Artifact |
| "IAM Role vs IAM User" | Role = temporary/cross-account/services. User = permanent/human |
| "Concierge team" | Billing and account inquiries ONLY — not technical support |
| "Control Tower vs Organizations" | Control Tower = new automated landing zone. Organizations = existing accounts |
| "Aurora vs RDS" | Aurora = MySQL or PostgreSQL ONLY. RDS = also Oracle, SQL Server, MariaDB |
| "Multi-AZ vs Multi-Region" | Multi-AZ = high availability. Multi-Region = disaster recovery |
| "Convertible vs Standard RI" | Convertible = exchange family. Standard = sell on Marketplace |
| "EC2 OS patching" | Always customer responsibility on EC2 |
