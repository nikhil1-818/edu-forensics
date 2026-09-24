<div align="center">

<img width="100%" src="https://img.shields.io/badge/-%20-B91C1C?style=flat-square" height="4"/>

# EDUFORENSICS

### AI-Powered Education Intelligence & Digital Twin

<h3>Data → Forensics → Prediction → Digital Twin → Simulation → Decision</h3>

Forensically analyze the education system.

<br/>

[![Status](https://img.shields.io/badge/STATUS-ACTIVE_DEVELOPMENT-2ea44f?style=for-the-badge&labelColor=111827)](#)
[![License](https://img.shields.io/badge/LICENSE-MIT-B91C1C?style=for-the-badge&labelColor=111827)](LICENSE)
[![Category](https://img.shields.io/badge/CATEGORY-INSTITUTIONAL_SAAS-6B7280?style=for-the-badge&labelColor=111827)](#)

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-EB0028?style=flat-square&logo=xgboost&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j_Ready-008CC1?style=flat-square&logo=neo4j&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase_Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

<img width="100%" src="https://img.shields.io/badge/-%20-B91C1C?style=flat-square" height="4"/>

</div>

<br/>

<table align="center">
<tr>
<td align="center" width="20%"><h3>4</h3><sub>CORE ENGINES</sub></td>
<td align="center" width="20%"><h3>4</h3><sub>USER ROLES</sub></td>
<td align="center" width="20%"><h3>0–100</h3><sub>ACADEMIC RISK SCORE</sub></td>
<td align="center" width="20%"><h3>1</h3><sub>CURRICULUM DIGITAL TWIN</sub></td>
</tr>
</table>

<br/>

> **Not an AI tutor.** EDUFORENSICS is an institutional intelligence platform — it analyzes academic, assessment, curriculum and engagement data to discover *why* learning systems fail, predict *where* failure happens next, and simulate curriculum changes before they touch a real cohort.

<br/>

## Table of Contents

`01` [The Problem](#01--the-problem) · `02` [Core Idea](#02--core-idea--the-decision-loop) · `03` [End-to-End Workflow](#03--end-to-end-workflow) · `04` [System Architecture](#04--system-architecture) · `05` [Technology Stack](#05--technology-stack)

`06` [Learning Failure Forensics](#06--learning-failure-forensics) · `07` [Academic Risk Forecast](#07--academic-risk-forecast) · `08` [Curriculum Digital Twin](#08--curriculum-digital-twin) · `09` [What-If Education Simulator](#09--what-if-education-simulator) · `10` [Academic Data Layer](#10--academic-data-layer)

`11` [AI / ML Architecture](#11--ai--ml-architecture) · `12` [Data Model & Schema](#12--data-model--schema) · `13` [Security, Roles & Responsible AI](#13--security-roles--responsible-ai) · `14` [Reports, Alerts & Admin](#14--reports-alerts--admin) · `15` [Project Structure](#15--project-structure)

`16` [API Design](#16--api-design) · `17` [Key User Journeys](#17--key-user-journeys) · `18` [Why This Is Different](#18--why-this-is-different) · `19` [Real-World Walkthrough](#19--real-world-walkthrough) · `20` [Roadmap & Getting Started](#20--roadmap--getting-started)

<br/>

## 01 — The Problem

Universities generate enormous amounts of academic data — assessments, attendance, assignments, curriculum structure — but most institutions only find out a learning system has failed **after** the exam results come in.

<table>
<tr>
<td width="50%" valign="top">

**Today — reactive academic monitoring**

```mermaid
flowchart TD
    A[Exam Results Published] --> B[Failure Rate Observed]
    B --> C[Faculty Notices Pattern]
    C --> D[Manual Investigation]
    D --> E[Corrective Action Next Semester]
    style A fill:#450a0a,stroke:#DC2626,color:#fecaca
    style B fill:#450a0a,stroke:#DC2626,color:#fecaca
    style C fill:#3f1d1d,stroke:#B91C1C,color:#fed7aa
    style D fill:#3f1d1d,stroke:#B91C1C,color:#fed7aa
    style E fill:#111827,stroke:#6B7280,color:#F8FAFC
```

</td>
<td width="50%" valign="top">

**EDUFORENSICS — forensic & predictive**

```mermaid
flowchart TD
    A[Academic Data] --> B[Knowledge Graph + AI]
    B --> C[Root-Cause Forensics]
    C --> D[Risk Forecast]
    D --> E[Digital Twin Simulation]
    E --> F[Decision Before Failure]
    style A fill:#111827,stroke:#6B7280,color:#F8FAFC
    style B fill:#1F2937,stroke:#9CA3AF,color:#F8FAFC
    style C fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    style D fill:#450a0a,stroke:#DC2626,color:#fecaca
    style E fill:#450a0a,stroke:#DC2626,color:#fecaca
    style F fill:#052e16,stroke:#22c55e,color:#bbf7d0
```

</td>
</tr>
</table>

> Traditional systems ask **"Which students failed?"**
> EDUFORENSICS asks — **"Why is the learning system failing, where will it fail next, and what curriculum change actually fixes it?"**

<br/>

## 02 — Core Idea · The Decision Loop

```mermaid
flowchart LR
    A(("Data")) --> B(("Forensics")) --> C(("Prediction")) --> D(("Digital Twin")) --> E(("Simulation")) --> F(("Decision"))
    classDef loop fill:#111827,stroke:#B91C1C,color:#F8FAFC,stroke-width:2px
    class A,B,C,D,E,F loop
```

Academic, assessment, curriculum and engagement data are unified into a single **knowledge graph** connecting courses, units, concepts and prerequisites — the substrate every other engine operates on.

| Layer | What It Answers |
|:--|:--|
| **Forensics** | Why did this failure happen? |
| **Risk Forecast** | Where will the next failure happen? |
| **Digital Twin** | How are courses and concepts actually connected? |
| **Simulator** | What happens if we change the curriculum? |

<br/>

## 03 — End-to-End Workflow

```mermaid
flowchart TD
    A[Academic Data Ingestion] --> B[Validation & Normalization] --> C[Education Knowledge Graph]
    C --> D[Forensics Engine] --> E[Risk Forecasting Engine] --> F[Curriculum Digital Twin]
    F --> G[Counterfactual Simulator] --> H[Institutional Decision Dashboard]
    H --> I[Reports & Alerts] --> J[Faculty / Admin Action]
    J -.feeds.-> A

    classDef ingest fill:#111827,stroke:#6B7280,color:#F8FAFC
    classDef ai fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    classDef action fill:#052e16,stroke:#22c55e,color:#dcfce7
    class A,B,C ingest
    class D,E,F,G ai
    class H,I,J action
```

<br/>

## 04 — System Architecture

```mermaid
flowchart TB
    subgraph L1["Frontend"]
        A1["Next.js · TypeScript · Tailwind CSS · React Flow"]
    end
    subgraph L2["API Layer"]
        B1["FastAPI · REST · Role-Based Access Control"]
    end
    subgraph L3["Data Layer"]
        C1["PostgreSQL · Normalized Academic Schema"]
    end
    subgraph L4["Graph Layer"]
        D1["NetworkX (Neo4j-ready) · Knowledge Graph Service"]
    end
    subgraph L5["Intelligence Engines"]
        E1["Forensics · Risk Forecasting · Digital Twin · Simulator"]
    end
    subgraph L6["ML / Explanation"]
        F1["Scikit-learn · XGBoost · PyTorch · LLM Explanation Layer"]
    end
    subgraph L7["Auth"]
        G1["Supabase Auth / JWT · SUPER_ADMIN · INSTITUTION_ADMIN · FACULTY · ANALYST"]
    end
    subgraph L8["Application Layer"]
        H1["Dashboard · Forensics · Risk Forecast · Digital Twin · Simulator · Reports · Admin"]
    end

    A1 --> B1 --> C1
    B1 --> D1 --> E1
    E1 --> F1
    B1 --> G1
    E1 --> H1
    G1 --> H1

    style L1 fill:#111827,stroke:#6B7280,color:#F8FAFC
    style L2 fill:#1F2937,stroke:#9CA3AF,color:#F8FAFC
    style L3 fill:#0f2942,stroke:#0ea5e9,color:#e0f2fe
    style L4 fill:#3b1d0f,stroke:#fb923c,color:#ffedd5
    style L5 fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    style L6 fill:#450a0a,stroke:#DC2626,color:#fee2e2
    style L7 fill:#1a2e1a,stroke:#22c55e,color:#dcfce7
    style L8 fill:#083344,stroke:#22d3ee,color:#cffafe
```

The **graph layer** models `Course → Unit → Concept → Prerequisite`, giving every engine — forensics, forecasting, digital twin, simulation — a shared, queryable substrate. The **LLM layer** only explains what the models already computed; it never generates the prediction itself.

<br/>

## 05 — Technology Stack

<table>
<tr><th>Layer</th><th>Stack</th><th>Purpose</th></tr>
<tr><td><b>Frontend</b></td><td><img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/></td><td>Enterprise SaaS UI</td></tr>
<tr><td><b>Charts / Graph</b></td><td>Recharts / Plotly · React Flow</td><td>Analytics & digital-twin canvas</td></tr>
<tr><td><b>Backend</b></td><td><img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"/> <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"/></td><td>REST APIs & services</td></tr>
<tr><td><b>Database</b></td><td><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/></td><td>Normalized academic schema</td></tr>
<tr><td><b>Auth</b></td><td><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/> / secure JWT</td><td>Role-based authentication</td></tr>
<tr><td><b>ML</b></td><td><img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white"/> <img src="https://img.shields.io/badge/XGBoost-EB0028?style=flat-square&logo=xgboost&logoColor=white"/> <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white"/></td><td>Forecasting, causal & GNN-ready models</td></tr>
<tr><td><b>Graph</b></td><td>NetworkX → <img src="https://img.shields.io/badge/Neo4j-008CC1?style=flat-square&logo=neo4j&logoColor=white"/> ready</td><td>Knowledge graph & dependency tracing</td></tr>
<tr><td><b>Explanation</b></td><td>LLM Explanation Layer</td><td>Converts model output into plain language</td></tr>
</table>

> Colors follow the product's design system: deep red `#B91C1C` / `#DC2626` for risk and CTAs, charcoal `#111827` / `#1F2937` for typography, `#F8FAFC` and `#E5E7EB` for surfaces and borders — used strategically, never as a full-red interface.

<br/>

## 06 — Learning Failure Forensics

```mermaid
flowchart TD
    A[Poor Exam Performance] --> B[Differential Equations]
    B --> C[Integration]
    C --> D[Algebraic Manipulation]
    style A fill:#450a0a,stroke:#DC2626,color:#fee2e2
    style B fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    style C fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    style D fill:#111827,stroke:#6B7280,color:#F8FAFC
```

A three-step workflow: select **Course / Assessment / Cohort / Concept** → run forensic analysis → view a root-cause report with a confidence indicator, the affected concept, its prerequisite chain, and an interactive, clickable dependency graph.

**Evidence Signals panel:** assessment performance · question difficulty · attendance · assignment completion · prior prerequisite mastery.

Built on: causal inference, Bayesian networks, knowledge graphs, anomaly detection.

<br/>

## 07 — Academic Risk Forecast

```mermaid
flowchart LR
    C["Current · Risk 42"] --> F["Forecast · Risk 68"]
    F --> H["Horizon · Next Assessment"]
    style C fill:#052e16,stroke:#22c55e,color:#dcfce7
    style F fill:#450a0a,stroke:#DC2626,color:#fee2e2
    style H fill:#111827,stroke:#6B7280,color:#F8FAFC
```

Predicts academic bottlenecks **before** they surface in exam results, with a transparent "Why is risk increasing?" panel instead of a black-box number:

```
1. Prerequisite mastery decline
2. Assessment difficulty increase
3. Assignment completion decline
4. Attendance signal
```

Powered by time-series forecasting, gradient boosting, temporal models, and graph-based risk propagation.

<br/>

## 08 — Curriculum Digital Twin

The visual centerpiece: a large, interactive knowledge-graph canvas of every course, unit, concept and prerequisite.

```mermaid
flowchart LR
    ALG[Algebra] --> DIFF[Differentiation]
    DIFF --> INT[Integration]
    INT --> DE[Differential Equations]
    DE --> NUM[Numerical Methods]
    classDef risk fill:#450a0a,stroke:#DC2626,color:#fee2e2
    classDef ok fill:#111827,stroke:#6B7280,color:#F8FAFC
    class INT,DE risk
    class ALG,DIFF,NUM ok
```

Zoom, pan, search, filter by course/semester, and toggle risk or mastery overlays. Selecting a node opens a side panel:

```
Concept:                Integration
Course:                 Engineering Mathematics II
Mastery:                64%
Risk:                   High
Prerequisites:          Algebra, Differentiation
Downstream Dependencies: Differential Equations, Numerical Methods
Affected Students:       128
```

Actions: **Trace upstream** · **Trace downstream** · **Analyze concept**.

<br/>

## 09 — What-If Education Simulator

Test curriculum interventions virtually before touching a real cohort — a split-screen scenario builder (configuration on the left, predicted impact on the right).

```mermaid
flowchart LR
    A["Move Calculus II Before Diff. Eq.<br/>Assessment Weight 30% → 40%<br/>+ Prerequisite Module"] --> S(("Run Simulation"))
    S --> B["Baseline · Risk 68, Mastery 61%"]
    S --> C["Scenario · Risk 49, Mastery 73%"]
    style A fill:#111827,stroke:#6B7280,color:#F8FAFC
    style S fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    style B fill:#450a0a,stroke:#DC2626,color:#fee2e2
    style C fill:#052e16,stroke:#22c55e,color:#dcfce7
```

> "The simulated change reduces dependency pressure on Differential Equations by strengthening the prerequisite chain." — clearly labeled as a **model/prototype prediction**.

Includes Save Scenario, Duplicate Scenario, Compare Scenarios, and Export Report. Built on causal prediction, counterfactual inference, Monte Carlo simulation, and optimization.

<br/>

## 10 — Academic Data Layer

| Area | Route | Core Capability |
|:--|:--|:--|
| **Curriculum** | `/curriculum` | Course table with prerequisites, risk, status; drill into dependency graph or open in Digital Twin |
| **Students** | `/students` | Searchable, paginated roster with GPA, attendance, risk; detail view with concept-mastery timeline |
| **Assessments** | `/assessments` | Assessment metadata, concept mapping, difficulty; "Run Assessment Analysis" for weak-concept & anomaly detection |
| **Data Ingestion** | `/data` | CSV/XLSX/JSON upload for performance, results, curriculum, attendance — with row-level validation, never silent failure |

```
Assessment Results
✓ 4,820 rows validated
✓ 4,820 records imported
```

<br/>

## 11 — AI / ML Architecture

```mermaid
flowchart TD
    F[Forensics] --> F1[Causal Inference · Bayesian Reasoning · Knowledge Graph · Anomaly Detection]
    R[Risk Forecasting] --> R1[Time-Series · Gradient Boosting · Temporal Models · Graph Risk Propagation]
    D[Digital Twin] --> D1[Knowledge Graph · Graph Representation · GNN-Ready]
    S[Simulator] --> S1[Causal & Counterfactual Prediction · Monte Carlo · Optimization]

    classDef eng fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    classDef tech fill:#111827,stroke:#6B7280,color:#F8FAFC
    class F,R,D,S eng
    class F1,R1,D1,S1 tech
```

The LLM layer sits **downstream** of every engine — it only explains outputs (*"Risk is elevated primarily because prerequisite mastery declined while assessment difficulty increased"*), never generates the prediction itself. Where trained models aren't yet available, a modular, deterministic seeded demo-inference service stands in — the frontend never knows the difference, and results stay stable across refreshes.

<br/>

## 12 — Data Model & Schema

```mermaid
erDiagram
    INSTITUTIONS ||--o{ DEPARTMENTS : has
    DEPARTMENTS ||--o{ COURSES : offers
    COURSES ||--o{ COURSE_UNITS : contains
    COURSE_UNITS ||--o{ CONCEPTS : covers
    CONCEPTS ||--o{ PREREQUISITES : depends_on
    STUDENTS ||--o{ ENROLLMENTS : has
    ENROLLMENTS }o--|| COURSES : in
    ASSESSMENTS ||--o{ ASSESSMENT_QUESTIONS : contains
    ASSESSMENT_QUESTIONS ||--o{ QUESTION_CONCEPTS : maps_to
    STUDENTS ||--o{ ASSESSMENT_RESULTS : receives
    CONCEPTS ||--o{ RISK_PREDICTIONS : generates
    SIMULATION_SCENARIOS ||--o{ SIMULATION_RESULTS : produces
```

Normalized PostgreSQL schema — `users`, `institutions`, `departments`, `courses`, `course_units`, `concepts`, `prerequisites`, `students`, `enrollments`, `assessments`, `assessment_results`, `attendance_records`, `risk_predictions`, `forensic_analyses`, `knowledge_graph_nodes/edges`, `simulation_scenarios/results`, `alerts`, `reports`, `data_imports`, `audit_logs` — with UUID keys, indexes, timestamps, and `created_by` / `updated_at` on every mutable table.

<br/>

## 13 — Security, Roles & Responsible AI

| Role | Access |
|:--|:--|
| `SUPER_ADMIN` | Full platform access |
| `INSTITUTION_ADMIN` | Institution-wide analytics, users, curriculum, simulations |
| `FACULTY` | Courses, assessments, student performance, course-level analytics |
| `ANALYST` | Read access to analytics, forecasting, forensics, reports |

- Roles enforced on **both** frontend and database (row-level security)
- No hardcoded secrets — `.env.example` only, real credentials never committed
- Passwords, tokens, and service-role keys never exposed to the client

> Every AI output is labeled as a model/prototype prediction, not a real-world claim. Forensic conclusions, risk scores, and simulation outcomes are decision support for faculty and administrators — not automated academic judgments.

<br/>

## 14 — Reports, Alerts & Admin

**Reports** (`/reports`): Academic Risk, Course Health, Curriculum Bottleneck, Forensic Analysis, and Simulation reports — each with an executive summary, key findings, root causes, and recommendations. Viewable, downloadable as PDF, exportable as CSV.

**Alerts** (`/alerts`):
```
HIGH    Risk propagation detected in Mathematics dependency chain.
MEDIUM  Assessment performance declined across 3 consecutive evaluations.
LOW     Attendance signal requires monitoring.
```

**Admin** (`/admin`): user management, institution management, data-import history, model/API status, and full audit logs (user, action, timestamp, resource).

<br/>

## 15 — Project Structure

```
eduforensics/
├── frontend/            Next.js app · dashboard, forensics, digital-twin, simulator
├── backend/
│   ├── api/              auth · dashboard · students · courses · forensics · risk · simulator
│   ├── models/ schemas/  ORM models & typed request/response schemas
│   ├── services/         business logic per domain
│   ├── ml/                forecasting, causal & anomaly models
│   ├── graph/             GraphService — course/concept dependency graph
│   ├── simulation/        counterfactual & Monte Carlo engine
│   ├── auth/              JWT / Supabase auth, RBAC
│   └── database/          connection, migrations
├── docs/                 architecture · api · decisions
└── README.md
```

<br/>

## 16 — API Design

```
GET  /api/dashboard/overview          GET  /api/courses/{id}
GET  /api/students                    GET  /api/risk/forecast
POST /api/forensics/analyze           GET  /api/digital-twin/graph
POST /api/simulator/run               POST /api/data/import
```

`GraphService` methods: `get_course_graph()` · `get_concept_dependencies()` · `trace_upstream()` · `trace_downstream()` · `find_bottlenecks()` · `calculate_risk_propagation()` — designed so NetworkX can be swapped for Neo4j later without touching the frontend.

<br/>

## 17 — Key User Journeys

<table>
<tr><th>Institution Admin</th><th>Faculty</th><th>Analyst</th></tr>
<tr valign="top">
<td>Dashboard → High-Risk Course → Risk Forecast → Forensics → Digital Twin → Simulation → Report</td>
<td>Courses → Assessment Analysis → Student Risk Timeline → Concept Mastery → Alerts</td>
<td>Risk Forecast → Forensics → Reports → Export</td>
</tr>
</table>

<br/>

## 18 — Why This Is Different

| Generic Student Dashboard | EDUFORENSICS |
|:--|:--|
| Shows grades after the fact | Predicts risk before the exam |
| Flat student lists | Connected concept & prerequisite knowledge graph |
| No root-cause analysis | Forensic root-cause chains with confidence scores |
| Static curriculum tables | Living Curriculum Digital Twin |
| No scenario testing | What-if simulation before real implementation |
| LLM-as-the-product | LLM only explains — models predict |

<br/>

## 19 — Real-World Walkthrough

```mermaid
flowchart TD
    A[Dashboard] --> B[High-Risk Course Detected]
    B --> C[Open Risk Forecast]
    C --> D[Identify Contributing Concept]
    D --> E[Open Forensics]
    E --> F[Trace Prerequisite Chain]
    F --> G[Open Digital Twin]
    G --> H[Run What-If Simulation]
    H --> I[Compare Scenarios]
    I --> J[Generate Report]

    classDef s fill:#3f1d1d,stroke:#B91C1C,color:#fecaca
    class A,B,C,D,E,F,G,H,I,J s
```

One connected intelligence system: a risk signal on the dashboard leads directly to its root cause, its place in the curriculum graph, a tested fix, and a report an administrator can act on — all without leaving the platform.

<br/>

## 20 — Roadmap & Getting Started

| Phase | Focus |
|:--|:--|
| **1 · Foundations** | Auth, roles, dashboard, courses/students/assessments CRUD, data ingestion |
| **2 · Intelligence Core** | Forensics engine, risk forecasting, knowledge graph service |
| **3 · Digital Twin & Simulator** | Interactive graph canvas, what-if scenario engine, comparisons |
| **4 · Institutional Scale** | Reports, alerts, admin panel, Neo4j migration, real trained models |

**Prerequisites:** Node.js, Python 3.10+, PostgreSQL, Git

```bash
git clone https://github.com/<your-org>/eduforensics.git
cd eduforensics

# Backend
cd backend
python -m venv venv && source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

```env
DATABASE_URL=postgresql://username:password@localhost:5432/eduforensics
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
LLM_API_KEY=your_api_key
```

> Never commit real API keys or credentials to GitHub.

---

<div align="center">

<img width="100%" src="https://img.shields.io/badge/-%20-B91C1C?style=flat-square" height="4"/>

### EDUFORENSICS
**Data · Forensics · Prediction · Digital Twin · Simulation · Decision**

*Forensically analyze the education system.*

</div>
