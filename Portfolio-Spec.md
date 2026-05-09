# Murad Hasil — Professional AI Developer Portfolio
## Spec-Driven Development Document
### Build Your Portfolio Using Claude Code CLI

---

| Field | Details |
|---|---|
| **Document Type** | Project Specification & Build Guide |
| **Methodology** | Spec-Driven Development (Spec-Kit Plus) |
| **Primary Tool** | Claude Code CLI |
| **Author** | Murad Hasil |
| **Target** | International Freelancing (Upwork / Fiverr) |
| **Status** | Version 2.0 — **IN PROGRESS** (analytics dashboard) |
| **Live Frontend** | https://murad-hasil-portfolio-v2-xi.vercel.app |
| **Live Backend** | https://mb-murad-portfolio-v2.hf.space |
| **Development Environment** | WSL Ubuntu (required — see Phase 0) |
| **Last Updated** | 2026-04-24 |

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Folder Structure](#4-project-folder-structure)
5. [CLAUDE.md — Portfolio Constitution](#5-claudemd--portfolio-constitution)
6. [Context Files Specification](#6-context-files-specification)
7. [Phase 0 — WSL Ubuntu Setup](#7-phase-0--wsl-ubuntu-setup)
8. [Design System & UI/UX Agent Skill](#8-design-system--uiux-agent-skill)
9. [Phase 1 — Project Setup & Spec Discovery](#9-phase-1--project-setup--spec-discovery)
10. [Phase 2 — Backend: FastAPI](#10-phase-2--backend-fastapi)
11. [Phase 3 — Frontend: Next.js](#11-phase-3--frontend-nextjs)
12. [Phase 4 — RAG Chatbot](#12-phase-4--rag-chatbot)
13. [Phase 5 — MCP Server for Portfolio Management](#13-phase-5--mcp-server-for-portfolio-management)
14. [Phase 6 — Deployment](#14-phase-6--deployment)
15. [Phase 7 — Testing with Playwright MCP](#15-phase-7--testing-with-playwright-mcp)
16. [Update Protocol — How To Add New Projects](#16-update-protocol--how-to-add-new-projects)
17. [Sub-Agents Strategy](#17-sub-agents-strategy)
18. [Deliverables Checklist](#18-deliverables-checklist)
19. [Success Criteria](#19-success-criteria)
20. [Version History](#20-version-history)
21. [Phase 8 — Chatbot Improvements](#21-phase-8--chatbot-improvements)

---

## 1. Executive Overview

This document is the **single source of truth** for building Murad Hasil's professional portfolio. It is written as a Claude Code CLI specification — meaning Claude Code reads this document and implements the system exactly as described.

**The Portfolio Is:**
- A full-stack web application (Next.js frontend + FastAPI backend)
- Equipped with a RAG-powered AI chatbot that knows everything about Murad
- Built using the same technologies Murad sells to clients (proof of work)
- Structured with spec-driven development so future updates are systematic

**Why This Approach:**
Every project Murad has built (Hackathon 0, II, 5) used spec-driven development. This portfolio is built the same way — using Claude Code CLI as the general agent, Playwright MCP for browser testing, and a living spec document (this file) that evolves as skills grow.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                     │
│              Next.js + TypeScript + Tailwind             │
│   Hero | Projects | Skills | Services | About | Contact  │
│                  + RAG Chatbot Widget                    │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS API calls
┌─────────────────────▼───────────────────────────────────┐
│             BACKEND (Hugging Face Spaces)                │
│                FastAPI + Python + SQLModel               │
│  /chat  /contact  /projects  /skills  /analytics        │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
┌────────▼──────┐  ┌────────▼──────┐  ┌───────▼────────┐
│  Neon Postgres│  │  Qdrant Cloud │  │  OpenAI API    │
│  - contacts   │  │  - embeddings │  │  - GPT-4o-mini │
│  - analytics  │  │  - RAG chunks │  │  - embeddings  │
│  - chat_logs  │  │               │  │                │
└───────────────┘  └───────────────┘  └────────────────┘

┌─────────────────────────────────────────────────────────┐
│              CLAUDE CODE CLI TOOLCHAIN                   │
│   Playwright MCP → Browser Testing & Screenshot         │
│   Custom MCP Server → Portfolio Data Management         │
│   Sub-agents → Specialized Build Tasks                  │
│   CLAUDE.md (Constitution) → Behavior Guidelines        │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | Next.js (App Router) | SSR + SEO + App Router conventions |
| Language | TypeScript (strict mode) | Type safety, professional code |
| Styling | Tailwind CSS 4 + shadcn/ui | Rapid, consistent UI |
| Animations | Framer Motion | Smooth, professional UX |
| Backend | FastAPI (Python 3.12) | Used in Hackathon II & 5 |
| ORM | SQLModel | Clean Pydantic + SQLAlchemy |
| Database | Neon PostgreSQL | Serverless, free tier. Requires `pool_pre_ping=True` |
| Vector DB | Qdrant Cloud | RAG chatbot, collection: `portfolio-knowledge` |
| AI / LLM | Groq (Llama 3.3 70B) → OpenAI GPT-4o-mini | Groq free tier default, switchable via `LLM_PROVIDER` |
| Embeddings | fastembed (local, 384-dim) → OpenAI text-embedding-3-small | No API cost default, switchable via `EMBEDDING_PROVIDER` |
| Email | Resend HTTP API | SMTP blocked on HF Spaces. Requires `User-Agent: python-resend/1.0` header |
| Browser Testing | Playwright MCP | Claude Code watches browser |
| Deployment Frontend | Vercel | Auto-deploys on push to `main` |
| Deployment Backend | Hugging Face Spaces | Docker container, port 7860. Deploy via `git subtree push --prefix=backend hf main` |
| CI/CD | GitHub Actions | lint + test + auto HF deploy on push to `main` |
| Version Control | GitHub | Portfolio + spec history |

---

## 4. Project Folder Structure

```
portfolio-v2/
├── CLAUDE.md                          ← Constitution (Claude Code reads first)
├── README.md
├── specs/
│   ├── 01-vision.md                   ← What we are building and why
│   ├── 02-frontend-spec.md            ← Every page, component, UI detail
│   ├── 03-backend-spec.md             ← Every API endpoint, schema, logic
│   ├── 04-rag-chatbot-spec.md         ← Chatbot knowledge, tools, behavior
│   ├── 05-mcp-server-spec.md          ← MCP tools for portfolio management
│   ├── 06-deployment-spec.md          ← Deployment steps, env vars
│   └── 07-update-protocol.md         ← How to add new projects/skills
├── context/
│   ├── murad-profile.md              ← Personal info, background, goals
│   ├── skills-manifest.json          ← All skills with proficiency levels
│   ├── projects-manifest.json        ← All projects with metadata
│   ├── services-manifest.json        ← Services offered with pricing
│   ├── brand-voice.md                ← How to write copy, tone, style
│   └── rag-knowledge-base/           ← Documents fed into RAG
│       ├── about.md
│       ├── skills.md
│       ├── projects.md
│       ├── services.md
│       ├── faq.md
│       └── contact.md
├── frontend/                          ← Next.js app
├── backend/                           ← FastAPI app
├── mcp-server/                        ← Custom MCP server
├── scripts/
│   ├── seed-rag.py                   ← Load knowledge base into Qdrant
│   └── update-project.py            ← Script to add new project
└── tests/
    ├── e2e/                           ← Playwright E2E tests
    └── api/                           ← FastAPI test suite
```

---

## 5. CLAUDE.md — Portfolio Constitution

> **This file must be created first at the project root. Claude Code reads this before doing anything.**

```markdown
# Portfolio Constitution — Murad Hasil Portfolio v2

## Who I Am
I am Claude Code, the AI assistant building Murad Hasil's professional portfolio.
Murad is an AI Automation Engineer and Full-Stack Developer from Karachi, Pakistan
targeting international freelancing on Upwork and Fiverr.

## My Primary Goal
Build a production-ready, spec-driven portfolio that demonstrates Murad's skills
through the portfolio itself — using the same technologies he sells to clients.

## Mandatory Rules

### Before Writing Any Code
1. Read the relevant spec file in /specs/ first
2. Read the context file relevant to the feature (context/murad-profile.md, etc.)
3. If spec is unclear, create a discovery log in /specs/discovery-log.md and ask

### Code Quality Standards
- TypeScript strict mode: always
- No any types — use proper interfaces
- All API responses use Pydantic models (FastAPI)
- All components are responsive (mobile-first)
- WCAG 2.1 AA accessibility minimum
- No console.log in production code

### Content Rules
- All visible copy must be professional English (Murad's target is international)
- Do NOT use placeholder content — use context/ files for real data
- Testimonials section: OMIT entirely (no real testimonials yet)
- Stats: Use accurate numbers from context/murad-profile.md

### File Creation Rules
- Frontend components: /frontend/src/components/
- Backend routes: /backend/app/routers/
- Never create files outside defined structure
- Always update relevant spec after implementing

### RAG Chatbot Rules
- Chatbot answers ONLY from knowledge base (no hallucination)
- If information not in knowledge base: "I don't have that info, contact Murad directly"
- Chatbot tone: professional, helpful, concise
- Never promise availability, pricing, or timelines on behalf of Murad

### When Stuck
- Document the issue in /specs/discovery-log.md
- Try one alternative approach
- If still stuck, stop and summarize the blocker clearly

## Skills I Can Use
- Playwright MCP: browser testing, screenshots, form testing
- File system: read/write all project files
- Terminal: run dev servers, install packages, run tests
- Search: research documentation when needed
```

---

## 6. Context Files Specification

> These files are the **single source of truth**. Claude Code reads them — never hardcode data in components.

### 6.1 `context/murad-profile.md`

```markdown
# Murad Hasil — Developer Profile

## Personal Information
- Name: Murad Hasil
- Title: AI Automation Engineer & Full-Stack Developer
- Location: Karachi, Pakistan
- Email: mbmuradhasil@gmail.com
- WhatsApp: +923142241393
- GitHub: https://github.com/Murad-Hasil
- LinkedIn: [your LinkedIn URL]

## Professional Summary
AI Automation Engineer and Full-Stack Developer specializing in building autonomous
AI systems, intelligent chatbots, and scalable web applications. 2+ years building
with modern AI technologies including OpenAI Agents SDK, MCP (Model Context Protocol),
RAG systems, and cloud-native architectures.

## Education
Governor Initiative for AI, Web3 & Metaverse (GIAIC) — Karachi, Pakistan
Focus: Applied AI, Cloud-Native Development, Autonomous Agents

## Current Learning
- Enrolled: Clawdbot Crash Course (3 months — in progress)
- Completed: 4 Major Hackathons (details in projects-manifest.json)

## Stats (Accurate)
- Experience: 2+ Years
- Hackathons Completed: 5+
- Technologies Used: 20+
- Portfolio Projects: 4

## Freelancing Goals
- Platform: Upwork and Fiverr (international clients)
- Niche: AI Automation, Chatbot Development, Full-Stack Web Apps
- Availability: [your hours per week]
```

### 6.2 `context/skills-manifest.json`

```json
{
  "skills": {
    "ai_and_agents": {
      "label": "AI & Agents",
      "items": [
        { "name": "OpenAI Agents SDK", "level": "advanced" },
        { "name": "OpenAI API (GPT-4o)", "level": "advanced" },
        { "name": "Gemini API", "level": "advanced" },
        { "name": "MCP (Model Context Protocol)", "level": "advanced" },
        { "name": "RAG Systems", "level": "advanced" },
        { "name": "Qdrant Vector DB", "level": "intermediate" },
        { "name": "Prompt Engineering", "level": "advanced" },
        { "name": "Context Engineering", "level": "intermediate" },
        { "name": "Autonomous AI Agents", "level": "advanced" }
      ]
    },
    "frontend": {
      "label": "Frontend",
      "items": [
        { "name": "Next.js", "level": "advanced" },
        { "name": "React 19", "level": "advanced" },
        { "name": "TypeScript", "level": "advanced" },
        { "name": "Tailwind CSS", "level": "advanced" },
        { "name": "Framer Motion", "level": "intermediate" },
        { "name": "shadcn/ui", "level": "advanced" }
      ]
    },
    "backend": {
      "label": "Backend",
      "items": [
        { "name": "FastAPI", "level": "advanced" },
        { "name": "Python", "level": "advanced" },
        { "name": "SQLModel", "level": "intermediate" },
        { "name": "PostgreSQL", "level": "intermediate" },
        { "name": "REST APIs", "level": "advanced" },
        { "name": "Kafka / Redpanda", "level": "intermediate" }
      ]
    },
    "devops_and_cloud": {
      "label": "DevOps & Cloud",
      "items": [
        { "name": "Docker", "level": "intermediate" },
        { "name": "Kubernetes", "level": "intermediate" },
        { "name": "Helm Charts", "level": "intermediate" },
        { "name": "GitHub Actions CI/CD", "level": "intermediate" },
        { "name": "Vercel", "level": "advanced" },
        { "name": "Railway", "level": "intermediate" }
      ]
    },
    "automation": {
      "label": "Automation",
      "items": [
        { "name": "n8n", "level": "intermediate" },
        { "name": "Playwright", "level": "intermediate" },
        { "name": "Python Scripting", "level": "advanced" },
        { "name": "Webhook Integrations", "level": "advanced" }
      ]
    }
  }
}
```

### 6.3 `context/projects-manifest.json`

```json
{
  "projects": [
    {
      "id": "crm-digital-fte",
      "title": "CRM Digital FTE — Omnichannel AI Customer Success Agent",
      "slug": "crm-digital-fte",
      "status": "completed",
      "featured": true,
      "category": "AI Agents",
      "description": "Autonomous AI customer success agent handling Gmail, WhatsApp, and Web Form simultaneously. Built with OpenAI Agents SDK, FastAPI, PostgreSQL with pgvector, Kafka event streaming, and deployed on Kubernetes with auto-scaling.",
      "problem": "A SaaS company needs 24/7 customer support across 3 channels but human FTEs cost $75,000/year. This Digital FTE operates at under $1,000/year.",
      "solution": "MCP-powered agent with 5 specialized tools, cross-channel customer identity resolution, sentiment-based escalation, and production Kubernetes deployment.",
      "tech": ["OpenAI Agents SDK", "FastAPI", "PostgreSQL", "Qdrant", "Kafka", "Next.js", "Docker", "Kubernetes", "Twilio", "Gmail API"],
      "live_url": "[your deployed URL]",
      "github_url": "[your GitHub repo URL]",
      "image": "/projects/crm-digital-fte.png",
      "metrics": [
        "Handles 3 channels simultaneously",
        "P95 response time < 3 seconds",
        "Cross-channel identification > 95% accuracy",
        "24/7 uptime with Kubernetes auto-scaling"
      ],
      "highlights": [
        "Built custom PostgreSQL CRM with pgvector",
        "Kafka event streaming for decoupled channel processing",
        "MCP Server exposing 5 tools to the agent",
        "HPA auto-scaling: 3-30 pods based on load"
      ]
    },
    {
      "id": "todo-cloud-ai",
      "title": "Todo App → Cloud-Native AI Agent (Spec-Driven Evolution)",
      "slug": "todo-cloud-ai",
      "status": "completed",
      "featured": true,
      "category": "Full-Stack + AI",
      "description": "5-phase evolution from a simple Python CLI todo list to a full cloud-native AI agent on Kubernetes. Demonstrates spec-driven development methodology from first principles to production.",
      "problem": "Show a complete software evolution journey — from console CLI to AI-powered app to Kubernetes-deployed microservices.",
      "solution": "5 progressive phases: CLI → Web App → AI Chatbot Interface → Local Kubernetes + HF Spaces with Kafka and Dapr.",
      "tech": ["Python", "Next.js", "FastAPI", "SQLModel", "Neon PostgreSQL", "OpenAI Agents SDK", "MCP", "Docker", "Minikube", "Kubernetes", "Kafka", "Dapr"],
      "live_url": "[your deployed URL]",
      "github_url": "[your GitHub repo URL]",
      "image": "/projects/todo-cloud-ai.png",
      "metrics": [
        "5 complete evolution phases",
        "Natural language task management",
        "Local Kubernetes on Minikube; production backend on Hugging Face Spaces",
        "Vercel auto-deploy on push to main; backend deployed via HF Space"
      ],
      "highlights": [
        "Spec-driven development throughout all phases",
        "Natural language interface: 'Reschedule morning meetings to 2 PM'",
        "Real-time browser notifications — in-app toast + OS push on reminder tasks, powered by DB polling",
        "Dapr for service mesh abstraction",
        "Kafka for event-driven architecture"
      ]
    },
    {
      "id": "personal-ai-employee",
      "title": "Personal AI Employee — Autonomous Digital FTE",
      "slug": "personal-ai-employee",
      "status": "completed",
      "featured": true,
      "category": "AI Automation",
      "description": "A 24/7 autonomous AI agent managing personal and business affairs using Claude Code + Obsidian. Monitors Gmail and WhatsApp, processes incoming messages, generates weekly business reports, and handles routine tasks with human-in-the-loop safety.",
      "problem": "Repetitive personal and business tasks consume hours weekly. A human VA costs $4,000-$8,000/month and only works 40 hours/week.",
      "solution": "Local-first autonomous agent with Python watchers, MCP servers, HITL approval workflow, and weekly CEO briefing reports.",
      "tech": ["Claude Code", "Python", "MCP Servers", "Playwright", "Obsidian", "Gmail API", "WhatsApp API"],
      "live_url": null,
      "github_url": "[your GitHub repo URL]",
      "image": "/projects/personal-ai-employee.png",
      "demo_note": "Local deployment — GitHub repo + architecture walkthrough available",
      "metrics": [
        "Works 168 hours/week (24/7)",
        "Costs $500-$2,000/month vs $4,000-$8,000 for human",
        "85-90% cost savings per task",
        "HITL safety for sensitive operations"
      ],
      "highlights": [
        "Watchers pattern for Gmail and WhatsApp monitoring",
        "Human-in-the-Loop approval workflow",
        "Weekly 'Monday Morning CEO Briefing' reports",
        "Subscription audit for cost optimization"
      ]
    },
    {
      "id": "ai-chatbot-demo",
      "title": "AI Chatbot Demo",
      "slug": "ai-chatbot-demo",
      "status": "completed",
      "featured": false,
      "category": "AI / Frontend",
      "description": "Interactive chatbot built with Next.js and Gemini 2.0 Flash API with real-time responses, message history, and dark/light theme.",
      "tech": ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API", "Framer Motion"],
      "live_url": "https://ai-chatbot-demo-eight.vercel.app",
      "github_url": "https://github.com/Murad-Hasil/ai-chatbot-demo",
      "image": "/projects/ai-chatbot-demo.png"
    }
  ]
}
```

### 6.4 `context/brand-voice.md`

```markdown
# Murad Hasil — Brand Voice Guide

## Target Audience
International freelance clients on Upwork and Fiverr. Typically:
- Small to medium business owners needing AI automation
- Startups wanting AI chatbots or web apps
- Businesses wanting to reduce manual work through automation

## Tone
- Professional but approachable (not overly corporate)
- Direct and results-focused (clients care about outcomes, not jargon)
- Confident without being arrogant
- Technical when needed, plain English when possible

## What To Emphasize
- Business value (cost savings, time savings, automation)
- Proof of work (the portfolio is built with the same stack I sell)
- Reliability and production-readiness (not just demos)
- Clear, measurable outcomes

## What To Avoid
- Vague claims ("I am passionate about technology")
- Buzzword overload
- Incomplete placeholder content
- Fake social proof (no fake testimonials)

## Copy Examples

WRONG: "I am a passionate developer who loves solving problems."
RIGHT: "I help businesses save time and cut costs by replacing repetitive work with AI systems that run automatically—so you can stop managing manual tasks and focus on growing your business."

WRONG: "I have experience in various technologies."
RIGHT: "I've built production Kubernetes deployments, RAG chatbots, and autonomous agents across 4 featured projects — each with live infrastructure, test suites, and documented specs."
```

---

## 7. Phase 0 — WSL Ubuntu Setup

> **One-time setup. Required before starting any development.**

**Why WSL Ubuntu — Not Windows Native:**

| Requirement | Windows | WSL Ubuntu |
|---|---|---|
| FastAPI + Python | Path issues, venv problems | Native, stable |
| Docker + Kubernetes | Docker Desktop (heavy, slow) | Native Docker daemon |
| Claude Code CLI | Limited shell features | Full power, all MCPs work |
| Playwright MCP | Browser config issues | Headless stable |
| Shell scripts (seed-rag.py) | Bash emulation only | Real Bash |

**Setup Commands (run once in WSL Ubuntu):**

```bash
# Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22 && nvm use 22

# Python 3.12
sudo apt update && sudo apt install python3.12 python3.12-venv python3-pip -y

# Docker
sudo apt install docker.io -y && sudo usermod -aG docker $USER

# Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Playwright MCP
npm install -g @playwright/mcp@latest

# Project location (keep code in WSL filesystem, not /mnt/c/)
mkdir -p ~/projects && cd ~/projects
```

> **Important:** Store project files at `~/projects/portfolio-v2` — NOT in `/mnt/c/`. Windows filesystem mounts are 10x slower for Node.js and Python.

---

## 8. Design System & UI/UX Agent Skill

### 8.1 Design Philosophy

> **"Robotic but Professional"** — The aesthetic of AI infrastructure companies (Vercel, Linear, Anthropic). Dark, sharp, geometric. No toy-like gradients, no rainbow colors, no rounded-everything.

Reference aesthetic: **Vercel Dashboard + Linear App + Terminal UI**

### 8.2 Color Palette

```css
/* Dark Mode (Primary) */
--bg-primary:      #08080F   /* Near-black, slight blue tint — not pure black */
--bg-surface:      #0F0F1A   /* Card backgrounds */
--bg-elevated:     #141420   /* Elevated surfaces (modals, dropdowns) */
--border:          #1A1A2E   /* Subtle dividers */
--border-glow:     #00D4FF22 /* Glowing borders on hover (cyan, 13% opacity) */

/* Accent Colors */
--accent-cyan:     #00D4FF   /* Primary — electric cyan for CTAs, highlights */
--accent-indigo:   #6366F1   /* Secondary — electric indigo for tags, badges */
--accent-green:    #10B981   /* Live/deployed status indicators only */

/* Text */
--text-primary:    #E2E8F0   /* Main text — cool white, NOT pure #FFFFFF */
--text-secondary:  #94A3B8   /* Subtitles, metadata */
--text-muted:      #64748B   /* Placeholders, disabled */
--text-code:       #00D4FF   /* Inline code, tech pill text */

/* Light Mode */
--bg-primary-light:   #FAFAFA
--bg-surface-light:   #FFFFFF
--border-light:       #E2E8F0
--text-primary-light: #0F172A
--text-muted-light:   #64748B
/* Accent colors stay same in light mode */
```

**What NOT to use:**
- No purple-to-pink gradients (looks like a design student project)
- No `#FF6B6B` coral or warm reds (feels playful)
- No yellow accents (poor contrast on dark bg)
- No `rounded-full` on non-avatar elements (pill buttons look casual)

### 8.3 Typography

```css
/* Install these Google Fonts */
--font-heading: 'Space Grotesk', sans-serif;  /* Modern, geometric, slightly robotic */
--font-body:    'Inter', sans-serif;           /* Clean, professional, readable */
--font-mono:    'JetBrains Mono', monospace;   /* Code, tech tags, terminal elements */

/* Type Scale */
--text-hero:    clamp(2.5rem, 5vw, 4.5rem);   /* Hero headline */
--text-h1:      clamp(2rem, 4vw, 3rem);
--text-h2:      clamp(1.5rem, 3vw, 2rem);
--text-h3:      1.25rem;
--text-body:    1rem;
--text-small:   0.875rem;
--text-xs:      0.75rem;                       /* Badges, metadata */
```

### 8.4 Component Design Rules

**Cards:**
```
- Background: var(--bg-surface)
- Border: 1px solid var(--border)
- Border-radius: 8px (rounded-lg) — NOT rounded-2xl
- Hover: border-color → var(--accent-cyan), box-shadow: 0 0 20px rgba(0,212,255,0.08)
- Transition: all 200ms ease
- NO blur/frosted glass on main project cards (use only for modals)
```

**Buttons:**
```
Primary CTA:
  - Background: var(--accent-cyan)
  - Text: #08080F (dark — high contrast)
  - Border-radius: 6px (rounded-md)
  - Font: Space Grotesk, font-weight: 600
  - Hover: brightness(1.1) + slight glow

Secondary/Ghost:
  - Background: transparent
  - Border: 1px solid var(--border)
  - Text: var(--text-primary)
  - Hover: border-color → var(--accent-cyan), text → var(--accent-cyan)

NO pill buttons (rounded-full) except for tag/badge pills
```

**Skill / Tech Pills:**
```
- Font: JetBrains Mono
- Format: [Next.js] [FastAPI] [Kubernetes]
- Background: rgba(99, 102, 241, 0.1)  /* indigo tint */
- Border: 1px solid rgba(99, 102, 241, 0.3)
- Text: var(--accent-indigo)
- Border-radius: 4px (NOT rounded-full)
```

**Section Headers:**
```
- Eyebrow text (small caps above heading): font-mono, var(--accent-cyan), tracking-widest
  Example: "// PROJECTS"  or  "01. ABOUT"
- Main heading: Space Grotesk, var(--text-primary)
- Underline accent: 2px solid var(--accent-cyan), width 40px
```

**Background Patterns:**
```
Hero section only:
- Subtle dot grid: radial-gradient dots, 1px, opacity 0.15
- NO particle animations, NO flowing blobs, NO noise textures outside hero
- Optional: very subtle cyan radial gradient in far corner (opacity 0.03)
```

**Animations (Framer Motion):**
```
- Entry: fadeInUp, y: 20 → 0, opacity: 0 → 1, duration: 0.5s
- Stagger children: 0.1s delay between items
- Hover scale: 1.02 max (NOT 1.1 — too dramatic)
- Page transitions: none (single page app, scroll-based)
- Respect prefers-reduced-motion: always
- NO looping/spinning animations in main content
```

### 8.5 UI/UX Agent Skill — Claude Code Sub-Agent

This skill is invoked whenever a new UI component needs to be designed or reviewed.

**Skill Name:** `uiux-agent`
**Skill File:** `context/agent-skills/uiux-agent.md`

```markdown
# UI/UX Agent Skill

## Role
You are the UI/UX specialist for Murad Hasil's portfolio.
Your job: ensure every component matches the Design System exactly.

## Before Building Any Component
1. Read context/design-system.md (the full color/type/component spec)
2. Read context/brand-voice.md
3. Ask: "Does this look like Vercel/Linear or like a tutorial project?"

## Component Review Checklist
- [ ] Colors match Design System palette exactly (no hardcoded hex outside palette)
- [ ] Typography: Space Grotesk for headings, Inter for body, JetBrains Mono for code
- [ ] Buttons use rounded-md (NOT rounded-full unless badge/pill)
- [ ] Cards have 1px border, 8px radius, hover glow on --accent-cyan
- [ ] Tech tags use JetBrains Mono with [bracket] format
- [ ] No toy-like gradients (purple-to-pink, rainbow)
- [ ] Dark mode tested — no invisible text, no washed-out colors
- [ ] Light mode tested — all accents readable on white background
- [ ] Mobile (375px): no horizontal scroll, tap targets min 44px
- [ ] Animations: max y: 20, max scale: 1.02, all respect prefers-reduced-motion

## After Building
Use Playwright MCP to:
1. Screenshot dark mode at 1440px
2. Screenshot light mode at 1440px
3. Screenshot mobile at 375px
4. Check: does it look "Vercel-like" or "bootcamp project-like"?
Report findings before finalizing.

## Common Mistakes to Prevent
- DO NOT add gradient text (background-clip: text) on body copy
- DO NOT use emoji in section headers
- DO NOT add box shadows larger than 0 0 30px rgba(...)
- DO NOT use backdrop-filter blur outside modals/navbar
- DO NOT use font-size below 12px for any visible text
```

**How to invoke this skill:**
```
Claude Code, activate the uiux-agent skill.
Review the Hero component I just built against the design system.
Screenshot it at desktop and mobile, then give me a checklist report.
```

> **Note:** Create `context/design-system.md` containing the full Section 8 content (color palette, typography, component rules). Claude Code reads this file before building any UI component.

---

## 9. Phase 1 — Project Setup & Spec Discovery

**Estimated Time:** 2–3 hours
**Claude Code Role:** Director

### Exercise 1.1 — Initialize Project (30 min)

Give Claude Code this prompt:

```
Read CLAUDE.md first. Then:
1. Create the complete folder structure defined in the Project Folder Structure section of the spec
2. Create all context/ files with the content from the spec
3. Initialize the Next.js 15 frontend in /frontend/ with TypeScript and Tailwind
4. Initialize the FastAPI backend in /backend/ with SQLModel and uvicorn
5. Create a root package.json with scripts to run both concurrently
6. Create .env.example files for both frontend and backend with all required variables
7. Create .gitignore for the full project

Do not write any UI code yet. Only setup the structure.
```

### Exercise 1.2 — Environment Variables Discovery (30 min)

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://muradhasil.dev
```

**Backend `.env`:**
```
DATABASE_URL=postgresql://...neon.tech/portfolio
QDRANT_URL=https://...qdrant.io
QDRANT_API_KEY=...

# LLM Provider — switch between "groq" and "openai"
LLM_PROVIDER=groq

# Groq (free tier — use now)
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile

# OpenAI (paid — switch when ready)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Embeddings Provider — switch between "fastembed" and "openai"
EMBEDDING_PROVIDER=fastembed
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

ALLOWED_ORIGINS=http://localhost:3000,https://muradhasil.dev
```

### Exercise 1.3 — Database Schema (1 hour)

Give Claude Code this prompt:

```
Read specs/03-backend-spec.md. Create the SQLModel database schema in
/backend/app/models.py with these tables:
- contacts: id, name, email, subject, message, created_at, ip_address
- chat_sessions: id, session_id, created_at, messages_count
- chat_messages: id, session_id, role, content, created_at, tokens_used
- page_views: id, page, referrer, created_at, country (optional)
Run the migration using Alembic to create tables on Neon PostgreSQL.
```

---

## 10. Phase 2 — Backend: FastAPI

**Estimated Time:** 4–5 hours
**Claude Code Role:** Builder

### Exercise 2.1 — Core FastAPI App (1 hour)

**Required Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/contact` | Submit contact form |
| GET | `/projects` | Get all projects from manifest |
| GET | `/projects/{slug}` | Get single project |
| GET | `/skills` | Get skills manifest |
| POST | `/chat` | RAG chatbot message |
| GET | `/chat/{session_id}` | Get chat history |
| POST | `/analytics/pageview` | Track page view |

**Prompt for Claude Code:**
```
Read context/projects-manifest.json and context/skills-manifest.json.
Build the FastAPI app in /backend/app/main.py with:
- CORS configured for frontend URL
- All endpoints listed in the spec
- /projects and /skills endpoints READ from context/ JSON files (no hardcoding)
- /contact endpoint saves to PostgreSQL contacts table
- /analytics/pageview saves to page_views table
- Pydantic models for all request/response bodies
- Error handling with proper HTTP status codes
```

### Exercise 2.2 — Contact Form Handler (30 min)

```
Build the /contact endpoint that:
1. Validates the ContactForm (name, email, subject, message)
2. Saves to PostgreSQL contacts table
3. Returns success with ticket reference number (YYYYMMDD-XXXX format)
4. Rate limiting: max 3 submissions per IP per hour
```

### Exercise 2.3 — Analytics Endpoint (30 min)

```
Build /analytics/pageview that:
1. Accepts page name and optional referrer
2. Stores in page_views table
3. Does NOT store any personal data (no IP storage in production)
4. Returns 204 No Content
```

---

## 11. Phase 3 — Frontend: Next.js

**Estimated Time:** 6–8 hours
**Claude Code Role:** Builder with Playwright MCP watching

### Playwright MCP Setup

Before starting frontend, configure Playwright MCP:

```json
// .claude/mcp-config.json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

> After each section is built, Claude Code uses Playwright MCP to screenshot the component, check responsive behavior at 375px / 768px / 1440px, verify animations, and test form interactions.

### Exercise 3.1 — Layout & Navigation (1 hour)

**Prompt for Claude Code:**
```
Read context/murad-profile.md and context/brand-voice.md.
Build the root layout in /frontend/src/app/layout.tsx with:
- SEO metadata (title, description, OG tags, Twitter card)
- JSON-LD Person schema
- ThemeProvider (dark/light mode)
Then build Navbar component with:
- Logo: "MH" monogram + "Murad Hasil" text
- Navigation: Projects, Skills, Services, About, Contact
- Resume download button
- GitHub icon link
- Dark/Light toggle
- Mobile: hamburger menu using shadcn Sheet
- Sticky with backdrop blur on scroll
After building, use Playwright MCP to screenshot at 375px and 1440px.
```

### Exercise 3.2 — Hero Section (1 hour)

**Content Requirements:**
- Headline: "AI Automation Engineer & Full-Stack Developer"
- Subheadline with TypeAnimation rotating through 4 roles:
  - "AI Agent Developer 🤖"
  - "Full-Stack Developer 💻"
  - "Automation Engineer ⚡"
  - "RAG System Builder 🧠"
- Value proposition (1-2 sentences from brand-voice.md)
- Tech stack pills: Next.js, FastAPI, OpenAI, Kubernetes, MCP
- CTA buttons: "Hire Me on Upwork" (primary) + "See My Work" (secondary)
- Social links: GitHub, LinkedIn, WhatsApp, Email
- Animated background: subtle gradient mesh

**Prompt for Claude Code:**
```
Read context/murad-profile.md and context/brand-voice.md.
Build the Hero section using the requirements in Phase 3, Exercise 3.2.
Fetch NO data from backend — Hero uses static content from context files.
Add Framer Motion entrance animations (stagger children).
After building, use Playwright MCP to:
1. Screenshot at desktop and mobile
2. Verify TypeAnimation is working
3. Check CTA buttons are visible above fold on mobile
```

### Exercise 3.3 — Projects Section (1.5 hours)

**Prompt for Claude Code:**
```
Build the Projects section that:
1. Fetches from GET /api/projects (Next.js route handler proxying backend)
2. Shows featured projects first (featured: true in manifest)
3. Each project card shows: title, description, tech tags, category badge,
   live demo link (if available), GitHub link
4. Clicking a card navigates to /projects/[slug] for case study
5. Filter tabs: All | AI Agents | Full-Stack + AI | AI Automation | AI / Frontend
6. "Local deployment" badge for projects without live_url
After building, use Playwright MCP to test the filter tabs and card hover states.
```

**Project Case Study Page (`/projects/[slug]`):**
```
Build dynamic route /projects/[slug]/page.tsx that:
1. Fetches single project from GET /api/projects/[slug]
2. Displays: Hero image, title, problem, solution, tech stack badges,
   metrics list, highlights list, links section
3. Back button to return to main page projects section
4. SEO: unique meta title/description per project
5. generateStaticParams for all project slugs
```

### Exercise 3.4 — Skills Section (1 hour)

> **Note:** Current portfolio has NO skills section. This is a critical addition.

**Design:** Category tabs with animated skill pills showing proficiency level.

**Prompt for Claude Code:**
```
Build a Skills section that:
1. Fetches from GET /api/skills (reads context/skills-manifest.json)
2. Shows category tabs: AI & Agents | Frontend | Backend | DevOps & Cloud | Automation
3. Each skill shows name + proficiency dot indicator (advanced=3 dots, intermediate=2 dots)
4. Entrance animation: skills fade in staggered on tab switch
5. Mobile: scrollable horizontal tabs, 2-column skill grid
After building, use Playwright MCP to verify all 5 category tabs work.
```

### Exercise 3.5 — Services Section (1 hour)

**4 Services to Show:**

| Service | Target Client | Outcome |
|---|---|---|
| Customer Support Automation | Businesses tired of answering the same customer questions every day | Faster responses, lower support workload, and consistent customer experience |
| Business Process Automation | Teams spending hours on repetitive tasks like data entry, follow-ups, or reports | Save hours every week, reduce errors, and free up your team's time |
| AI Knowledge Base (answers from your data) | Businesses where people keep asking the same questions internally or externally | Faster access to information and less dependency on team members |
| Custom AI Tools for Your Business | Businesses that need something built around how they actually work | A system that works exactly the way your business operates and scales with it |

**Prompt for Claude Code:**
```
Build a Services section with 4 service cards using the table in Phase 3, Exercise 3.5.
Each card shows: icon, service name, target client type, 3 key deliverables,
"Get Quote" button linking to #contact.
Hover effect: card lifts with gradient border.
```

### Exercise 3.6 — About Section (30 min)

**Prompt for Claude Code:**
```
Read context/murad-profile.md.
Build the About section with:
- Profile photo (public/profile/murad.jpg)
- Bio paragraph (from brand-voice.md — results-focused, no fluff)
- 4 stats: 2+ Years Experience | 5+ Hackathons | 20+ Technologies | 100% Self-Taught
- Education: GIAIC badge
- Location: Karachi, Pakistan
- Buttons: Download Resume | View Projects
DO NOT add a testimonials section.
```

### Exercise 3.7 — Contact Section (30 min)

**Prompt for Claude Code:**
```
Build the Contact section with:
1. Left side: contact info (email, WhatsApp, location, GitHub, LinkedIn)
2. Right side: contact form with fields:
   - Name (required)
   - Email (required, validated)
   - Subject (required)
   - Service dropdown: AI Chatbot | Automation | Web App | RAG System | Other
   - Message (required, min 20 chars)
   - Send button with loading state
3. Form submits to POST /api/contact (Next.js route handler → FastAPI backend)
4. Success: show ticket reference number
5. Error: show friendly error message
After building, use Playwright MCP to:
1. Submit the form with valid data
2. Submit with invalid email (should show validation error)
3. Screenshot success state
```

---

## 12. Phase 4 — RAG Chatbot

**Estimated Time:** 4–5 hours
**Claude Code Role:** Builder (this is the portfolio's key differentiator)

### 12.1 LLM & Embedding Provider Abstraction

The backend uses a **provider pattern** — switch between Groq and OpenAI by changing one `.env` variable. No code changes needed.

```
LLM_PROVIDER=groq    → uses Groq API (Llama 3.3 70B) — FREE TIER
LLM_PROVIDER=openai  → uses OpenAI API (GPT-4o-mini) — PAID

EMBEDDING_PROVIDER=fastembed  → local embeddings, no API cost — DEFAULT
EMBEDDING_PROVIDER=openai     → OpenAI text-embedding-3-small — PAID
```

**LLM Provider Comparison:**

| Feature | Groq (Free) | OpenAI (Paid) |
|---|---|---|
| Model | Llama 3.3 70B | GPT-4o-mini |
| Speed | Very fast (LPU chip) | Fast |
| Cost | Free (1000 req/day) | ~$0.15/1M tokens |
| Context | 131,072 tokens | 128,000 tokens |
| Quality | Excellent | Excellent |
| Rate limit | 1000 req/day | Pay as you go |

**Embedding Provider Comparison:**

| Feature | fastembed (Free) | OpenAI (Paid) |
|---|---|---|
| Model | BAAI/bge-small-en-v1.5 | text-embedding-3-small |
| Cost | Free (runs locally) | $0.02/1M tokens |
| Speed | Fast (local) | API call latency |
| Dimensions | 384 | 1536 |
| Quality | Good for portfolio RAG | Excellent |

> **Note:** When switching from fastembed to OpenAI embeddings later, re-run `seed-rag.py` to regenerate all vectors. The Qdrant collection must be deleted and recreated because vector dimensions change (384 → 1536). The MCP tool `rebuild_rag()` handles this automatically.

**Provider abstraction code structure:**
```
/backend/app/
├── providers/
│   ├── __init__.py
│   ├── llm.py          ← get_llm_client() returns Groq or OpenAI client
│   └── embeddings.py   ← get_embedding(text) returns vector (fastembed or OpenAI)
```

### 12.2 RAG Architecture

```
User types question
       ↓
Frontend ChatWidget (floating button → slide-up panel)
       ↓
POST /chat { session_id, message }
       ↓
FastAPI /chat endpoint
       ↓
1. Save message to PostgreSQL
2. providers/embeddings.py → get_embedding(message)
   [fastembed local OR OpenAI API — set by EMBEDDING_PROVIDER]
3. Search Qdrant for top 5 relevant chunks
4. Build prompt: [System] + [Retrieved context] + [Chat history] + [User message]
5. providers/llm.py → get_llm_client()
   [Groq Llama 3.3 70B OR OpenAI GPT-4o-mini — set by LLM_PROVIDER]
6. Save response to PostgreSQL
7. Return response + sources used
       ↓
Frontend displays response with typing animation
```

### 12.3 Knowledge Base Files (`context/rag-knowledge-base/`)

| File | Contents |
|---|---|
| `about.md` | Personal background, education, goals |
| `skills.md` | All skills with descriptions and example projects |
| `projects.md` | Detailed writeup of all 4 hackathon projects |
| `services.md` | Services offered, what's included, typical deliverables |
| `faq.md` | Common client questions and answers |
| `contact.md` | How to reach Murad, response times, availability |

### Exercise 4.1 — Knowledge Base Content

Fill each knowledge base file with real, detailed information. Example for `faq.md`:

```markdown
# Frequently Asked Questions

Q: Can you build a chatbot that handles customer support?
A: Yes. My most recent project (CRM Digital FTE) is exactly this — an autonomous
AI agent handling customer queries across Gmail, WhatsApp, and a web form 24/7,
deployed on Kubernetes.

Q: Do you work with international clients?
A: Yes, I work with clients on Upwork and Fiverr. I communicate in English and
am available for video calls (UTC+5 timezone).

Q: What is your typical project timeline?
A: Simple chatbots: 1-2 weeks. Full-stack web apps: 2-4 weeks. AI automation
systems: 3-6 weeks. Exact timeline depends on requirements.

Q: Do you provide ongoing support?
A: Yes. All projects come with 1 week of post-delivery support. Extended support
plans available.

Q: What makes you different from other developers?
A: I build the exact systems I sell — this portfolio itself uses a RAG chatbot,
FastAPI backend, and PostgreSQL database. I specialize in AI automation, not
just basic web development.

Q: Can you work with an existing codebase?
A: Yes. I've worked on projects spanning from legacy codebases to fresh
cloud-native architectures.
```

### Exercise 4.2 — RAG Ingestion Script (1 hour)

**Prompt for Claude Code:**
```
Read context/rag-knowledge-base/ folder and build scripts/seed-rag.py that:
1. Reads all .md files from context/rag-knowledge-base/
2. Splits each file into chunks (max 500 tokens, 50 token overlap)
3. Generates embeddings using providers/embeddings.py → get_embedding()
   - EMBEDDING_PROVIDER=fastembed → BAAI/bge-small-en-v1.5 (dims: 384) — DEFAULT
   - EMBEDDING_PROVIDER=openai   → text-embedding-3-small (dims: 1536)
4. Creates Qdrant collection with correct vector size for active provider
5. Upserts all chunks to Qdrant collection "portfolio-knowledge"
6. Each point stores: chunk text, source filename, chunk index, embedding_provider
7. Prints progress and final count of vectors stored

Install required packages first:
pip install fastembed groq openai qdrant-client python-dotenv
Then run the script with EMBEDDING_PROVIDER=fastembed (default).
```

> **Provider Switch Note:** If you change `EMBEDDING_PROVIDER` from fastembed to openai, you **must** re-run `seed-rag.py`. The Qdrant collection must be deleted and recreated because vector dimensions change (384 → 1536). The MCP tool `rebuild_rag()` handles this automatically.

### Exercise 4.3 — Chat Backend Endpoint (1.5 hours)

**Prompt for Claude Code:**
```
Build POST /chat endpoint in FastAPI that:
1. Accepts: { session_id: str, message: str }
2. Validates session_id (UUID format)
3. Saves user message to chat_messages table
4. Generates embedding for user message
5. Searches Qdrant for top 5 relevant chunks (cosine similarity)
6. Fetches last 10 messages from this session for chat history
7. Builds prompt with:
   - System message: "You are Murad Hasil's portfolio assistant. Answer ONLY
     from the provided context. If you cannot find the answer, say: 'I don't
     have that information. Please contact Murad directly at mbmuradhasil@gmail.com'"
   - Retrieved context chunks
   - Chat history
   - User message
8. Calls LLM via provider abstraction (max 300 tokens response)
9. Saves response to chat_messages with tokens_used
10. Returns: { message: str, session_id: str, sources: str[] }
```

### Exercise 4.4 — Chat Widget Frontend (1 hour)

**Prompt for Claude Code:**
```
Build the ChatWidget component:
1. Floating button (bottom-right corner): chat bubble icon with "Ask me anything" tooltip
2. Click opens slide-up panel (400px wide, 500px tall on desktop; fullscreen on mobile)
3. Panel header: "Ask about Murad" + close button
4. Message list: user messages right-aligned, bot messages left-aligned with avatar
5. Typing indicator: 3 animated dots while waiting for response
6. Input: text field + send button
7. Suggested questions (shown when chat is empty):
   - "What projects have you built?"
   - "Can you build a chatbot for my business?"
   - "What are your skills?"
   - "How do I hire you?"
8. On first load: generate UUID session_id, store in sessionStorage
After building, use Playwright MCP to:
1. Click the chat button and verify it opens
2. Type a test message and verify response appears
3. Test on mobile viewport
```

---

## 13. Phase 5 — MCP Server for Portfolio Management

**Estimated Time:** 2–3 hours
**Purpose:** Future-proof. Use Claude Code CLI to manage portfolio content without touching code.

### Exercise 5.1 — Custom MCP Server (1.5 hours)

Build `/mcp-server/` so you can run Claude Code CLI and say:
- "Add a new project to the portfolio"
- "Update my skills list"
- "Show me the contact form submissions from this week"

**Tools to expose:**

| Tool | Description |
|---|---|
| `add_project(project_data)` | Adds new project to projects-manifest.json |
| `update_skills(category, skills)` | Updates a skill category |
| `get_contact_submissions(days)` | Fetches recent contact form submissions |
| `get_chat_analytics()` | Shows most asked questions from chatbot |
| `update_profile(field, value)` | Updates a field in murad-profile.md |
| `rebuild_rag()` | Re-runs seed-rag.py to update chatbot knowledge |

**Prompt for Claude Code:**
```
Build a custom MCP server in /mcp-server/ using Python MCP SDK that exposes
the 6 tools listed in Phase 5, Exercise 5.1.
Each tool should:
- Have proper type annotations and docstrings
- Handle errors gracefully
- Return structured JSON responses
Also create mcp-server/README.md explaining how to connect this server to Claude Code.
```

---

## 14. Phase 6 — Deployment

**Estimated Time:** 2–3 hours

### Exercise 6.1 — Backend Deployment (Hugging Face Spaces)

> **⚠️ IMPORTANT UPDATE**: Backend is deployed to **Hugging Face Spaces**, NOT Railway.
> Railway references in older prompts are outdated.

**Actual deployment setup (already complete):**
```
Backend: https://mb-murad-portfolio-v2.hf.space
Space:   https://huggingface.co/spaces/Mb-Murad/portfolio-v2
Runtime: Docker container (/backend/Dockerfile), port 7860
```

**Deploy command:**
```bash
git subtree push --prefix=backend hf main
```

**First-time HF remote setup:**
```bash
git remote add hf https://Mb-Murad:<HUGGINGFACE_TOKEN>@huggingface.co/spaces/Mb-Murad/portfolio-v2
```

**Auto-deploy via CI (GitHub Actions):**
- Add `HUGGINGFACE_TOKEN` to GitHub repo → Settings → Secrets → Actions
- Token: huggingface.co → Settings → Access Tokens → New **Write** token
- CI job `deploy-backend` runs automatically on push to `main` after lint + test pass

**Keep-alive:** `.github/workflows/keep-alive.yml` pings `/health` every 8 minutes to prevent HF Space sleep (sleeps after ~15 min idle).

### Exercise 6.2 — Frontend Deployment (Vercel)

**Prompt for Claude Code:**
```
Prepare frontend for Vercel deployment:
1. Update next.config.ts with proper production settings
2. Create /frontend/next-sitemap.config.js
3. Add API route handlers in /frontend/src/app/api/ that proxy to FastAPI backend
   (so frontend env var NEXT_PUBLIC_API_URL stays private)
4. Verify all image domains are whitelisted
5. Test production build locally: next build
```

### Exercise 6.3 — GitHub Actions CI/CD

**Actual CI/CD (already complete in `.github/workflows/deploy.yml`):**

Three jobs run on every push to `main`:
1. `Lint Frontend` — ESLint on Next.js code
2. `Test Backend` — pytest on FastAPI (needs DATABASE_URL, QDRANT_URL, GROQ_API_KEY secrets)
3. `Deploy Backend to HF Spaces` — git subtree push to HF (needs HUGGINGFACE_TOKEN secret)

Vercel auto-deploys frontend on every push (no GitHub Actions step needed).

**Required GitHub Secrets:**
| Secret | Used By |
|--------|---------|
| `DATABASE_URL` | pytest (backend tests) |
| `QDRANT_URL` | pytest (backend tests) |
| `QDRANT_API_KEY` | pytest (backend tests) |
| `GROQ_API_KEY` | pytest (backend tests) |
| `HUGGINGFACE_TOKEN` | deploy-backend job |

---

## 15. Phase 7 — Testing with Playwright MCP

**Estimated Time:** 2 hours

### Exercise 7.1 — E2E Test Suite

**Prompt for Claude Code:**
```
Use Playwright MCP to run these tests and screenshot each result:
1. Homepage loads and Hero is visible within 2 seconds
2. Navigation links scroll to correct sections
3. Projects filter tabs all work
4. Skills section all 5 tabs work
5. Contact form: submit with valid data → see success message
6. Contact form: submit with invalid email → see validation error
7. Chat widget: open → type "What projects have you built?" → see response
8. Mobile (375px): all sections render correctly, no horizontal scroll
9. Dark mode: toggle works, all text remains readable
10. Resume download button works
Document test results in tests/e2e/results.md
```

---

## 16. Update Protocol — How To Add New Projects

> **This is the most important section for long-term portfolio maintenance.**

When a new project is completed (e.g., Clawdbot course project), follow these 3 steps:

### Step 1 — Update Context Files

```
Give Claude Code this prompt:
"I have completed a new project: [PROJECT NAME].
Update context/projects-manifest.json with:
- title: [title]
- category: [category]
- description: [description]
- tech: [list of technologies used]
- live_url: [if deployed]
- github_url: [GitHub link]
- metrics: [key achievements]
Set featured: true if it should be shown prominently."
```

### Step 2 — Update RAG Knowledge Base

```
"Update context/rag-knowledge-base/projects.md with a detailed writeup of
the new [PROJECT NAME] project. Then run: python scripts/seed-rag.py
to update the chatbot's knowledge."
```

### Step 3 — Verify

```
"Use Playwright MCP to:
1. Open the portfolio
2. Verify the new project appears in the Projects section
3. Navigate to its case study page
4. Ask the chatbot: 'Tell me about your [PROJECT NAME] project'
5. Verify the chatbot responds with accurate information
Screenshot all 4 steps."
```

---

## 17. Sub-Agents Strategy

Claude Code sub-agents can be used for parallel or specialized tasks:

| Task | Sub-Agent Prompt Prefix |
|---|---|
| Content Writing | "You are a technical copywriter for developer portfolios..." |
| SEO Optimization | "You are an SEO specialist reviewing a developer portfolio..." |
| Code Review | "You are a senior developer reviewing this code for production quality..." |
| Accessibility Audit | "You are an accessibility expert auditing this website..." |
| Performance Audit | "You are a performance engineer reviewing this Next.js app..." |

**Usage Example:**
```
Claude Code, spin up a sub-agent with the content writing role.
Have it review all visible copy in the Hero and About sections
against context/brand-voice.md and suggest improvements.
Then implement the approved suggestions.
```

---

## 18. Deliverables Checklist

### Phase 1 — Setup
- [ ] Complete folder structure created
- [ ] All context/ files filled with real data
- [ ] CLAUDE.md constitution in place
- [ ] Environment variables configured
- [ ] Database schema migrated

### Phase 2 — Backend
- [ ] FastAPI app running locally
- [ ] All 8 endpoints working
- [ ] Contact form saves to PostgreSQL
- [ ] Projects and skills served from context/ JSON files
- [ ] Tests passing: `pytest backend/tests/`

### Phase 3 — Frontend
- [ ] Layout + Navbar built and responsive
- [ ] Hero section with TypeAnimation
- [ ] Projects section with filter tabs + case study pages
- [ ] Skills section with all 5 categories
- [ ] Services section (4 services)
- [ ] About section (accurate stats, no testimonials)
- [ ] Contact form with backend integration
- [ ] Playwright MCP screenshots at desktop + mobile for each section

### Phase 4 — RAG Chatbot
- [ ] Knowledge base .md files filled with real content
- [ ] Qdrant collection populated (`seed-rag.py` successful)
- [ ] /chat endpoint working end-to-end
- [ ] Chat widget built and tested
- [ ] Chatbot correctly answers: projects, skills, services, contact questions

### Phase 5 — MCP Server
- [ ] Custom MCP server with 6 tools built
- [ ] MCP server connected to Claude Code CLI
- [ ] Tested: `add_project` tool works
- [ ] Tested: `rebuild_rag` tool runs seed script

### Phase 6 — Deployment
- [x] Backend deployed to Hugging Face Spaces (NOT Railway)
- [x] Frontend deployed to Vercel (auto-deploy on push)
- [x] GitHub Actions CI/CD: lint + test + HF deploy
- [x] All environment variables set in HF Spaces + Vercel
- [x] Keep-alive cron active (8-min ping to /health)

### Phase 7 — Testing
- [x] All 10 Playwright E2E tests pass
- [x] Results documented with screenshots (`tests/e2e/screenshots/`)
- [x] Mobile view verified (375px)
- [x] Performance: Lighthouse score ≥ 90

### Production Hardening (Post-Launch)
- [x] error.tsx global error boundary
- [x] not-found.tsx 404 page
- [x] Projects + Skills sections show error state on fetch failure
- [x] Chat endpoint rate limited: 20/hour
- [x] Contact endpoint rate limited: 3/hour
- [x] Sitemap slug corrected (physical-ai-textbook)

---

## 19. Success Criteria

This portfolio is **complete** when:

**1. First Impression (30-second rule)**
A potential Upwork/Fiverr client lands on the site and within 30 seconds understands:
- What Murad builds
- What technologies he uses
- What results he delivers

**2. RAG Chatbot Accuracy**
The chatbot can accurately answer:
- "What AI projects have you built?"
- "Can you build a customer support chatbot?"
- "What is your experience with Kubernetes?"
- "How do I contact you?"

**3. Portfolio as Proof of Skill**
The portfolio itself demonstrates competency:
- It has a FastAPI backend → shows backend skills
- It has a RAG chatbot → shows AI skills
- It is deployed on cloud → shows DevOps skills
- It is built spec-first → shows professional methodology

---

## 20. Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-20 | Initial spec — 4 projects, 5 phases |
| 1.1 | 2026-03-20 | Added UI/UX Design System (Section 8) |
| 1.2 | 2026-03-31 | **SHIPPED** — Corrected backend platform (HF Spaces, not Railway), Next.js 16.2.1, added email (Resend), platform constraints, CI/CD auto-deploy, production hardening (error pages, rate limits, error states) |
| 1.3 | 2026-04-01 | **SHIPPED** — Phase 8: chatbot streaming SSE + FAQ expansion. Constitution v1.2.0. Spec: `specs/002-chatbot-rag/` |
| 1.4 | 2026-04-02 | **SHIPPED** — Phase 9: availability badge (FR-014) ✅ + Phase 10: dynamic OG image (FR-015). Specs: `specs/003-availability-badge/`, `specs/004-og-image/` |
| 1.5 | 2026-04-16 | **SHIPPED** — About bio rewrite (GIAIC origin, spec-driven, production-focused). Badge: "AI Engineer". Stats: 5+ Hackathons / 4 Projects. Skills: LangChain removed, Prompt Engineering + Context Engineering added. Next.js version-agnostic. Spec: `specs/005-about-bio-skills-update/`. Root cause fix: `frontend/context/` manifests must stay in sync with `context/` — Vercel reads from `frontend/`. |
| 1.6 | 2026-04-16 | **SHIPPED** — Static load fix: `outputFileTracingRoot` + `outputFileTracingIncludes` so Vercel bundles `context/` into serverless functions. Availability badge reads `murad-profile.md` at build time. Spec: `specs/006-fix-static-load/`. |
| 1.7 | 2026-04-21 | **SHIPPED** — Content copy update (007): hero subtext → human-centric value prop, About bio → 4 paragraphs (spec-driven narrative), 4th stat → 100% Self-Taught, OG/Twitter metadata + siteUrl fallback updated. Spec: `specs/007-content-copy-update/`. |
| 1.8 | 2026-04-23 | **SHIPPED** — Portfolio copy conversion (008): Services cards redesigned (description + outcome format), About stats replaced with 4 outcome phrases, About bio para 3 rewritten to client-friendly voice. Spec: `specs/008-portfolio-copy-conversion/`. |
| 1.9 | 2026-04-24 | **SHIPPED** — Services & CTA update (009): Hero primary CTA → WhatsApp, Fiverr CTA block added to Contact left panel, Fiverr link added to Footer, Services full card redesign (new names + descriptions + outcomes), RAG context files synced. Spec: `specs/009-services-cta-update/`. |
| 1.9.1 | 2026-05-09 | **SHIPPED** — Morent car rental project added (5th project): case study, 5 screenshots, RAG re-embedded (23 vectors). Show More button on projects grid (4 initial + 4/click). About stat updated 4→5 projects. |
| 2.0 | 2026-05-09 | **IN PROGRESS** — Analytics Dashboard (011): password-protected /admin page, GET /analytics/summary backend endpoint, daily chart, top pages + referrers. Spec: `specs/011-analytics-dashboard/`. |

---

## 21. Known Platform Constraints & Hard-Won Lessons

> Read this before debugging. These issues took real production hours to solve.

### HF Spaces — SMTP Blocked
- Outbound ports **587 and 465 are blocked** on HF Spaces (and most cloud platforms)
- Gmail SMTP, any SMTP-based email = WILL FAIL with connection refused
- **Solution**: Use HTTP-based email APIs only (Resend, SendGrid, Mailgun)

### Resend API — Cloudflare WAF Blocks urllib
- Python's `urllib.request` sends no User-Agent by default
- Cloudflare (in front of api.resend.com) returns **error code 1010** — request banned
- **Solution**: Add `"User-Agent": "python-resend/1.0"` to every request header
- This is in `backend/app/routers/contact.py` — do NOT remove it

### Resend — No Custom Domain Restriction
- `onboarding@resend.dev` can only send TO the Resend account's registered email
- Sending to any other address = **403 Forbidden**
- **Current setup**: `NOTIFY_EMAIL` must equal the Resend account email
- **Upgrade**: Verify custom domain on Resend → change `from` to `noreply@yourdomain.com`

### Neon PostgreSQL — Idle Connection Timeout
- Neon closes idle connections after ~5 minutes (serverless behavior)
- Without fix: `SSL connection has been closed unexpectedly` on next query
- **Solution**: Engine must have `pool_pre_ping=True, pool_recycle=300` — already in `backend/app/database.py`
- Use `DATABASE_URL` (pooled) for app. Use `DATABASE_DIRECT_URL` for Alembic migrations

### RAG Knowledge Base — Partial Update Trap
- Updating only `projects.md` leaves stale references in `faq.md`, `skills.md`, `about.md`
- **Rule**: When replacing a project or technology, grep ALL files in `context/rag-knowledge-base/`
- After ANY update to KB files, re-run `scripts/seed-rag.py`

---

## 22. Environment Variables

### Hugging Face Spaces (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon pooled URL |
| `DATABASE_DIRECT_URL` | ✅ | Neon direct URL (Alembic only) |
| `QDRANT_URL` | ✅ | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | ✅ | Qdrant API key |
| `GROQ_API_KEY` | ✅ | Groq API key (default LLM) |
| `RESEND_API_KEY` | ✅ | Resend email API key |
| `NOTIFY_EMAIL` | ✅ | Email to receive contact form alerts (must = Resend account email) |
| `ALLOWED_ORIGINS` | ✅ | CORS origins (Vercel URL) |
| `LLM_PROVIDER` | optional | `groq` (default) or `openai` |
| `OPENAI_API_KEY` | optional | Only if LLM_PROVIDER=openai |
| `EMBEDDING_PROVIDER` | optional | `fastembed` (default) or `openai` |

### Vercel (Frontend)
| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_URL` | ✅ | `https://mb-murad-portfolio-v2.hf.space` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL for OG tags |

### Removed (no longer used)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — removed when migrating to Resend

---

## 23. Troubleshooting Common Issues

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Contact form email not arriving | Wrong API key / Cloudflare block | Check `RESEND_API_KEY` in HF Spaces; verify `User-Agent` header in contact.py |
| `HTTP Error 403 — error code: 1010` | Cloudflare blocking urllib | Add `"User-Agent": "python-resend/1.0"` header |
| `SSL connection closed unexpectedly` | Neon idle timeout | Verify `pool_pre_ping=True, pool_recycle=300` in database.py |
| Chatbot giving wrong/outdated answers | Stale RAG vectors | Update ALL kb files, re-run `scripts/seed-rag.py` |
| Backend not updating after push | Pushed to GitHub only | Run `git subtree push --prefix=backend hf main` |
| Rate limited during local testing | 3/hour on contact, 20/hour on chat | Restart backend to reset in-memory rate limits |
| `/resume.pdf` returns 404 | File not uploaded | Add PDF to `frontend/public/resume.pdf` |

---

---

## 21. Phase 8 — Chatbot Improvements

**Status**: In Progress (v1.3) | **Spec**: `specs/002-chatbot-rag/`
**Estimated Time:** 2–3 hours
**Claude Code Role:** Builder

### Background
The RAG chatbot was shipped in v1.2 as a stateless, batch-response system. Two
improvements have been approved for v1.3 based on real UX impact:

1. **Streaming responses** — tokens stream to the user as they are generated
   instead of waiting for the full response. Highest UX impact, lowest complexity.
2. **FAQ knowledge base expansion** — recruiter and client Q&As added to
   `faq.md` so the chatbot can answer common portfolio questions accurately.

Deferred for a future version: conversation memory, hybrid search, reranking.
See `specs/002-chatbot-rag/spec.md` for full rationale.

### 21.1 FAQ Knowledge Base Update

**What to add to `context/rag-knowledge-base/faq.md`:**
Comprehensive Q&As covering:
- All 4 projects (hackathon context, tech stack, live URLs)
- Tech stack questions (Kubernetes, RAG, agents, full-stack)
- Availability, timezone, pricing range
- Spec-driven development methodology
- Freelancing platforms and collaboration style

**After updating:**
```bash
EMBEDDING_PROVIDER=fastembed python scripts/seed-rag.py
```

### 21.2 Streaming — Backend (FastAPI)

Change `POST /chat` to return a `StreamingResponse` using Server-Sent Events:

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

Each SSE event carries one token chunk:
```
data: {"token": "Hello", "done": false}\n\n
data: {"token": " world", "done": false}\n\n
data: {"token": "", "done": true, "session_id": "...", "sources": [...]}\n\n
```

The final event (`done: true`) carries `session_id` and `sources`.
PostgreSQL save (tokens_used) happens after stream completes.

**Provider support:**
- Groq: `client.chat.completions.create(..., stream=True)` — yields `chunk.choices[0].delta.content`
- OpenAI: same pattern — `client.chat.completions.create(..., stream=True)`

### 21.3 Streaming — Frontend (Next.js)

**API Route** (`/frontend/src/app/api/chat/route.ts`):
- Forward SSE stream from FastAPI to browser — pass through `ReadableStream`
- Set `Content-Type: text/event-stream` on response

**ChatWidget** (`/frontend/src/components/chat/ChatWidget.tsx`):
- Replace `fetch().then(r => r.json())` with `fetch()` + `ReadableStream` reader
- Append tokens to message as they arrive (React state update per chunk)
- Show typing indicator until first token arrives, then hide it
- On `done: true` event: finalise message, save sources

### 21.4 Deliverables Checklist — Phase 8

- [x] `faq.md` updated with 15+ recruiter/client Q&As
- [x] `scripts/seed-rag.py` re-run successfully after FAQ update
- [x] `POST /chat` returns `StreamingResponse` (SSE)
- [x] Groq provider streams tokens correctly
- [x] `/api/chat` route handler proxies stream to browser
- [x] `ChatWidget` renders tokens as they arrive
- [x] Typing indicator shows until first token, then disappears
- [x] Message saves to PostgreSQL after stream completes
- [x] Fallback message streamed when LLM returns empty response

**Status: ✅ SHIPPED 2026-04-01**

---

## 22. Phase 9 — Availability Badge + Dynamic OG Image

**Status**: In Progress (v1.4) | **Spec**: `specs/003-availability-badge/`
**Estimated Time:** 1–2 hours
**Claude Code Role:** Builder

### FR-014 — Availability Status Badge

**Requirement**: The Hero section MUST display the developer's current availability
status as a visual badge so clients can immediately see whether Murad is open to
new projects — without scrolling or reading body text.

**Behaviour rules**:
- Badge reads `Status` from `context/murad-profile.md` → `## Availability` section.
- Three possible status values and their visual treatment:

| Status value | Badge colour | Dot colour | Label shown |
|---|---|---|---|
| `available` | green tint bg | `#10b981` pulsing green | Label from `murad-profile.md` |
| `busy` | amber tint bg | `#f59e0b` amber | Label from `murad-profile.md` |
| `unavailable` | red tint bg | `#ef4444` red (static) | Label from `murad-profile.md` |

- Badge is read from the `/api/about` endpoint (or derived from `/api/profile`).
  If no endpoint exists, the backend exposes a lightweight `GET /profile` route
  that returns the parsed availability block.
- Badge must NOT be hardcoded in any component. Status and label come from
  `context/murad-profile.md` → served via backend → consumed by `Hero.tsx`.
- The pulsing dot animation uses Tailwind `animate-pulse` and MUST respect
  `prefers-reduced-motion` (stop animation if reduced motion is preferred).
- Badge placement: immediately below the name/headline, above the role
  TypeAnimation line — the first thing a scanning eye hits after the name.

**Acceptance criteria**:
- [ ] `context/murad-profile.md` contains `## Availability` section with `Status`,
  `Label`, `Note`, `Hours per week` fields.
- [ ] Backend exposes `GET /profile` returning `{ availability: { status, label, note } }`.
- [ ] `Hero.tsx` fetches availability on mount; renders correct colour + label.
- [ ] Changing `Status: available` → `Status: busy` in `murad-profile.md` and
  restarting backend changes badge without any frontend code change.
- [ ] Badge is visible at 375px, 768px, and 1440px viewports.
- [ ] `prefers-reduced-motion` stops the pulse animation.

### 22.1 Backend — GET /profile

Add `backend/app/routers/profile.py`:

```
GET /profile
Response: {
  "name": "Murad Hasil",
  "title": "AI Automation Engineer & Full-Stack Developer",
  "availability": {
    "status": "available",       // available | busy | unavailable
    "label": "Available for Freelance Work",
    "note": "Open to AI automation, chatbot, and full-stack projects",
    "hours_per_week": 40
  }
}
```

Reads `context/murad-profile.md` at startup (same pattern as projects/skills routers).
Register router in `backend/app/main.py`.
Add Next.js proxy at `frontend/src/app/api/profile/route.ts`.

### 22.2 Frontend — Hero.tsx Badge

Badge component (inline, no separate file — one small addition to Hero.tsx):

```tsx
{/* Availability badge — reads from /api/profile */}
<div className="availability-badge">
  <span className="pulse-dot" />          {/* pulsing colour dot */}
  <span>{availability.label}</span>        {/* "Available for Freelance Work" */}
</div>
```

Position: between the name `<h1>` and the `<TypeAnimation>` role line.
Tailwind classes: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border`
with colour variants per status (green/amber/red).

### 22.3 Deliverables Checklist — Phase 9

- [ ] `context/murad-profile.md` — `## Availability` section present and correct
- [ ] `backend/app/routers/profile.py` — `GET /profile` reads murad-profile.md
- [ ] `backend/app/main.py` — profile router registered
- [ ] `frontend/src/app/api/profile/route.ts` — Next.js proxy
- [ ] `Hero.tsx` — badge renders with correct colour + pulsing dot + label
- [ ] `prefers-reduced-motion` respected (Tailwind `motion-safe:animate-pulse`)
- [ ] Responsive at 375px / 768px / 1440px
- [x] `context/murad-profile.md` — `## Availability` section present and correct
- [x] `backend/app/routers/profile.py` — `GET /profile` reads murad-profile.md
- [x] `backend/app/main.py` — profile router registered
- [x] `frontend/src/app/api/profile/route.ts` — Next.js proxy via fs.readFileSync
- [x] `Hero.tsx` — badge renders with correct colour + pulsing dot + label
- [x] `prefers-reduced-motion` respected (`motion-safe:animate-pulse`)
- [x] Responsive at 375px / 768px / 1440px — verified via Playwright MCP
- [x] Status change in murad-profile.md → reflected in UI without code change

**Status: ✅ SHIPPED 2026-04-02**

---

## 23. Phase 10 — Dynamic OG Image

**Status**: In Progress (v1.4) | **Spec**: `specs/004-og-image/`
**Estimated Time:** 1–2 hours
**Claude Code Role:** Builder

### Background

The portfolio already has an `opengraph-image.tsx` file but it is **fully
hardcoded** — tech tags, name, subtitle, and URL are all static strings. This
means when `context/skills-manifest.json` or `context/projects-manifest.json`
change, the OG image shown when the link is shared on LinkedIn, Twitter, or
WhatsApp does NOT update.

Two OG images are needed:

1. **Homepage OG** — shows Murad's name, title, top skills from
   `skills-manifest.json`, email, and site URL. One image for the root `/` route.
2. **Per-project OG** — each project case study page (`/projects/[slug]`) gets
   its own OG image: project title, category badge, top 4 tech tags, and the
   first metric from `projects-manifest.json`.

Both images use the portfolio design system (dark `#08080F` background,
`#00D4FF` cyan, `#6366F1` indigo, JetBrains Mono for code elements).

### FR-015 — Dynamic OG Image

**Requirement**: The portfolio MUST generate dynamic Open Graph images that
reflect actual content from `context/` files — not hardcoded strings. Every
public-facing page MUST have a unique, visually branded OG image.

**Acceptance criteria**:
- [ ] `GET /opengraph-image` returns a 1200×630 PNG with top skills sourced
  from `context/skills-manifest.json` (all `"level": "advanced"` skills,
  max 6 displayed).
- [ ] `GET /projects/[slug]/opengraph-image` returns a unique 1200×630 PNG per
  project with title, category, tech tags, and metric from
  `context/projects-manifest.json`.
- [ ] Both images use only portfolio design tokens (no new colours introduced).
- [ ] No skill name, project title, or tech tag is hardcoded in any OG file.
- [ ] `next build` completes with zero errors after changes.
- [ ] `next.config.ts` includes `outputFileTracingRoot` pointing to repo root
  so Vercel includes `context/` files in the serverless bundle.

### 23.1 Homepage OG — Dynamic Skills

Switch `runtime` from `"edge"` to `"nodejs"`. Read skills at request time:

```ts
import fs from "fs"
import path from "path"

const raw = fs.readFileSync(
  path.resolve(process.cwd(), "..", "context", "skills-manifest.json"),
  "utf-8"
)
const manifest = JSON.parse(raw)

// Extract all "advanced" skills across categories, limit to 6
const topSkills = Object.values(manifest.skills)
  .flatMap((cat: any) => cat.items.filter((s: any) => s.level === "advanced"))
  .slice(0, 6)
  .map((s: any) => s.name)
```

Display as cyan/indigo alternating tag pills — same visual style as Hero.tsx.

### 23.2 Per-Project OG — One Image Per Slug

New file: `frontend/src/app/projects/[slug]/opengraph-image.tsx`

```ts
export async function generateImageMetadata({ params }) {
  return [{ id: params.slug, alt: `${project.title} — Murad Hasil` }]
}
```

Layout (1200×630):
```
┌──────────────────────────────────────────────────────────────────┐
│▓ top accent bar (cyan → indigo gradient)                         │
│                                                                  │
│  [AI Agents]                    ← category badge (indigo)        │
│                                                                  │
│  CRM Digital FTE                ← project title (large, white)   │
│  Omnichannel AI Customer Success Agent                           │
│                                                                  │
│  [OpenAI Agents SDK]  [FastAPI]  [Kubernetes]  [Kafka]          │
│                                                                  │
│  ✦ Handles 3 channels simultaneously   ← first metric (cyan)    │
│                                                                  │
│  mbmuradhasil@gmail.com          muradhasil.vercel.app/projects/ │
└──────────────────────────────────────────────────────────────────┘
```

### 23.3 Deliverables Checklist — Phase 10

- [x] `frontend/next.config.ts` — `outputFileTracingRoot` added
- [x] `frontend/src/app/opengraph-image.tsx` — nodejs runtime, top 6 advanced skills from manifest
- [x] `frontend/src/app/projects/[slug]/opengraph-image.tsx` — new file, per-project dynamic
- [x] `next build` clean (zero TypeScript/lint errors)
- [x] Homepage OG screenshot — skills from `skills-manifest.json` verified
- [x] Per-project OG: crm-digital-fte ✅, todo-cloud-ai ✅

**Status: ✅ SHIPPED 2026-04-02**

---

---

## 24. Phase 11 — Analytics Dashboard

**Status**: In Progress (v2.0) | **Spec**: `specs/011-analytics-dashboard/`  
**Estimated Time**: 4–6 hours  

### Background

Page views are already tracked in Neon PostgreSQL (`page_views` table) via `POST /analytics/pageview`. There is no way to view this data. This phase adds a private `/admin` dashboard — password-protected, no third-party analytics, uses only existing infrastructure.

### Architecture

```
Browser /admin
    │
    ├── Not authed → Login form
    │       └── POST /api/admin/verify  ← compares vs ADMIN_PASSWORD (server-side)
    │               └── returns { token } on success (token = ADMIN_SECRET)
    │
    └── Authed (token in sessionStorage)
            └── GET /api/admin/analytics  ← proxies to FastAPI
                    └── GET /analytics/summary (FastAPI, Bearer ADMIN_SECRET)
                            └── aggregates page_views table
```

### New Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `ADMIN_PASSWORD` | Vercel (server-side only) | Dashboard login password |
| `ADMIN_SECRET` | Vercel + HF Spaces | Shared secret for backend auth |

### FR-016 — Admin Login Gate
- Route `/admin` shows password form before any data
- Password validated server-side only — never exposed to browser
- Token stored in `sessionStorage` (clears on tab close)

### FR-017 — GET /analytics/summary (Backend)
- New endpoint in `backend/app/routers/analytics.py`
- Auth: `Authorization: Bearer <ADMIN_SECRET>`
- Returns: `total_views`, `views_today`, `views_7d`, `views_30d`, `top_pages[10]`, `top_referrers[10]`, `views_by_day[30]`

### FR-018 — Dashboard UI
- 4 stat cards: Total / Today / 7 Days / 30 Days
- Custom SVG bar chart: last 30 days daily views (no chart library)
- Top Pages table (sorted by count)
- Top Referrers table (`null` referrer shown as "Direct")
- Refresh + Logout buttons
- Mobile-responsive (2×2 card grid at 375px)

### Deliverables Checklist

- [ ] `backend/app/routers/analytics.py` — `GET /analytics/summary` added + ADMIN_SECRET auth
- [ ] `backend/.env.example` — `ADMIN_SECRET` documented
- [ ] `frontend/src/app/api/admin/verify/route.ts` — password gate (server-side)
- [ ] `frontend/src/app/api/admin/analytics/route.ts` — analytics proxy
- [ ] `frontend/src/app/admin/page.tsx` — login form + full dashboard
- [ ] ADMIN_PASSWORD set in Vercel env
- [ ] ADMIN_SECRET set in Vercel env + HF Spaces env
- [ ] Playwright MCP verification at desktop + mobile
- [ ] Wrong password → 401, no data leaked
- [ ] Correct password → dashboard with real DB data

---

*Built using Claude Code CLI + Spec-Kit Plus methodology*
*This document is the living spec — update it when deployment or architecture changes*
