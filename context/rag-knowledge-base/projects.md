# Murad Hasil — Projects

## Project 1: CRM Digital FTE — Omnichannel AI Customer Success Agent

**Category**: AI Agents | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://web-form-rouge.vercel.app/
**Backend API**: https://mb-murad-crm-digital-fte-api.hf.space
**GitHub**: https://github.com/Murad-Hasil/crm-digital-fte

### What It Does
A production-grade AI employee that handles 24/7 customer support across Gmail, WhatsApp, and a Web Support Form — simultaneously, without human intervention. A customer can submit a ticket via the web form, send an email to the Gmail inbox, or message on WhatsApp; the AI agent receives it within seconds, searches the knowledge base, creates a ticket, and sends a channel-appropriate reply. The same customer is recognized across all 3 channels via cross-channel identity resolution.

### The Business Problem
A growing SaaS company drowning in customer inquiries needs 24/7 support across Email, WhatsApp, and a Web Form — but a human FTE costs $75,000/year plus benefits, training, and management overhead. Every unanswered message after hours is a lost customer. This Digital FTE operates at under $1,000/year with zero sick days and no downtime.

### How It Was Built — Agent Maturity Model
Built in 48-72 development hours across two phases:

**Phase 1 — Incubation (Hours 1-16):** Used Claude Code as the Agent Factory to explore the problem space, prototype the core customer interaction loop, and crystallize requirements. Built a working MCP (Model Context Protocol) server exposing 5 tools, defined agent skills (Knowledge Retrieval, Escalation Decision, Channel Adaptation, Customer Identification), and documented 10+ edge cases in a discovery log. Wrote transition checklist before moving to production.

**Phase 2 — Specialization (Hours 17-72):** Transformed the prototype into a production Custom Agent. MCP server tools were promoted to OpenAI Agents SDK @function_tool with Pydantic input validation and try/catch error handling. In-memory state became PostgreSQL tables. Print statements became structured logging + Kafka events. Manual testing became a 45-test pytest suite.

### Technical Solution
The agent uses OpenAI Agents SDK configured for Groq LLaMA 3.3 70B via base_url override (OpenAI-compatible API). AIOKafka event streaming (topic: fte.tickets.incoming, acks=all, idempotent producer) decouples the 3 input channels — webhooks return in under 200ms while AI processing happens asynchronously (5-20 seconds). Without Kafka, Twilio and Gmail would timeout waiting for the LLM response. Deployed on Kubernetes with dual HPA.

### Technologies Used
OpenAI Agents SDK, Groq LLaMA 3.3 70B (with GPT-4o-mini fallback when Groq quota hit), FastAPI, Neon PostgreSQL + pgvector, AIOKafka, Next.js 15, Docker, Kubernetes, Twilio WhatsApp Sandbox, Gmail API + Google Pub/Sub, MCP Server, sentence-transformers (all-MiniLM-L6-v2)

### The 5 Agent Tools (Always in This Order)
1. **create_ticket** — always called FIRST; creates ticket in PostgreSQL linked to customer and conversation
2. **get_customer_history** — fetches last 20 messages across ALL channels for the same customer (cross-channel context)
3. **search_knowledge_base** — pgvector cosine similarity search over product docs with ILIKE keyword fallback
4. **escalate_to_human** — triggers on pricing inquiry, aggressive language, or legal threats; updates ticket status to 'escalated'
5. **send_response** — always called LAST; channel-aware: email gets formal greeting + 500-word limit, WhatsApp capped at 300 chars, web form sends email notification to customer

### Channel Flow Details
- **Gmail**: Email received → Gmail API → Google Pub/Sub notification → FastAPI webhook → Kafka → Worker → Groq AI Agent → Gmail API reply
- **WhatsApp**: WhatsApp message → Twilio → FastAPI webhook → Kafka → Worker → Groq AI Agent → Twilio reply
- **Web Form**: User submits Next.js form → FastAPI webhook → Kafka → Worker → Groq AI Agent → ticket stored + email notification sent

### Database Schema — 8 Neon PostgreSQL Tables
customers, customer_identifiers (cross-channel matching by email/phone/whatsapp), conversations, messages, tickets (full lifecycle), knowledge_base (384-dim pgvector embeddings), channel_configs, agent_metrics (response latency tracking)

### Real Engineering Challenges Solved
- **Groq tool_use_failed**: LLaMA 3.3 70B generated malformed XML tool calls. Fixed with Literal types on all enum parameters and a 3-attempt retry loop with exponential backoff.
- **Groq 429 rate limiting**: Instead of a fixed backoff, the worker parses "try again in Xm Ys" from the error message body and sleeps the exact reset duration.
- **Duplicate emails**: Agent was calling send_response twice in some flows. Fixed with a response_sent flag stored in Python contextvars ProcessingContext — no matter how many times the agent calls send_response, only the first call delivers the email.
- **asyncpg Python 3.14 bug**: search_path setting was not applying. Fixed by using fully qualified public.tablename in all queries.
- **Groq role mapping**: Groq rejects 'customer' and 'agent' roles. Mapped to 'user' and 'assistant' in the history loader.
- **HF Spaces deployment**: Kafka cannot run in Hugging Face free tier (no Java). Added USE_LOCAL_QUEUE=true env var — asyncio.Queue replaces Kafka at runtime, same worker code.
- **Ticket ID mismatch**: DB was generating a new UUID ignoring the web form's ticket ID. Fixed by pre-seeding the ticket UUID from channel_message_id.

### Key Highlights
- Agent Maturity Model: Incubation prototype (MCP + Claude Code) → Production Custom Agent (OpenAI Agents SDK + Kafka + K8s) in one continuous build
- Pre-LLM guardrails: keyword check for pricing_inquiry, aggressive_language, legal_threat — agent never sees escalation-worthy messages
- Cross-channel identity resolution: same customer on WhatsApp and Email recognized as one record via customer_identifiers table
- contextvars processing context: customer_id, conversation_id, channel set once per Kafka message — no parameter threading needed
- asyncio.Queue fallback for Hugging Face Spaces — no Java/Kafka required in cloud demo; same code path
- MCP Server (mcp_server.py) exposes the same 5 tools for Claude Desktop / Cursor integration (incubation phase artifact kept)

### Test Suite — 45 Tests
- test_agent.py: 18 tests covering guardrail logic and edge cases (empty message, pricing inquiry, legal threat, profanity, angry customer)
- test_channels.py: 21 tests covering channel formatters (email formal tone, WhatsApp 300-char limit, web form email trigger)
- test_e2e.py: 6 full pipeline tests (mocked DB + Runner — no live DB, Kafka, or LLM required)

### Measurable Outcomes
- $75,000/year human FTE → under $1,000/year AI FTE — 98% cost reduction with true 24/7 uptime
- 3 channels live end-to-end: Gmail (Google Pub/Sub push), WhatsApp (Twilio Sandbox), Web Form (Next.js + Vercel)
- Kafka webhooks return in under 200ms — AI processes async in 5-20 seconds, no channel timeout
- Dual HPA: API pods 3→20, Worker pods 3→30 (70% CPU trigger)
- Idempotent Kafka producer (acks=all) — zero duplicate ticket processing
- 45 tests pass with no live infrastructure required

---

## Project 2: Morent — Production-Ready Car Rental Platform

**Category**: AI / Frontend | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://morent-olive.vercel.app
**GitHub**: https://github.com/Murad-Hasil/morent

### What It Does
A pixel-perfect, production-ready car rental web application built from a Figma design template. 8 fully functional pages: Home (hero banners, search, popular & recommendation cars), Browse Cars (filter sidebar, search, 3-column grid), Car Detail (gallery, specs, reviews, related cars), 4-step Checkout (form validation, promo codes, live pricing), Favorites, Settings, Admin Dashboard, and custom 404. Full dark mode, PWA installable on mobile/desktop, Playwright E2E tests, and CI/CD.

### The Problem Solved
Figma design templates demonstrate visual polish but rarely translate to production-quality code — most implementations skip accessibility, skip testing, and cut corners on state management. Building a portfolio-grade frontend means matching pixel-for-pixel fidelity while hitting senior developer expectations: TypeScript strict mode, form validation, keyboard navigation, and a full CI/CD pipeline.

### How It Was Built
Built across 12 progressive phases: Phase 1 added CSS animations (page transitions, card hover effects, staggered reveals) without Framer Motion — pure Tailwind globals. Phase 2 implemented dark mode with a custom ThemeProvider that reads localStorage before first paint, eliminating white flash on reload. Phase 3 added React Hook Form + Zod validation for the 4-step checkout. Phase 4 wired Zustand for favorites persistence (localStorage-synced). Phase 5 built a custom lightweight toast system without third-party libraries. Phase 6 made the filter sidebar functional (type, capacity, max daily price). Phases 7–9 covered SEO (per-page metadata, JSON-LD, OG images), PWA (manifest + service worker), and accessibility (ARIA labels, keyboard navigation). Phase 10 added Playwright E2E tests on desktop + mobile-chrome. Phases 11–12 set up GitHub Actions CI/CD and final polish.

### Pages & Routes
- `/` — Home: Hero banners with Pick-Up/Drop-Off search form, Popular Cars grid, Recommendation Cars grid
- `/cars` — Browse: Filter sidebar (type, capacity, price), search query via URL param, 3-column car grid
- `/cars/detail?id=N` — Car Detail: Image gallery, full specs, star reviews, JSON-LD structured data
- `/checkout?id=N` — 4-step form: Billing Info → Rental Info → Payment → Confirmation; car passed via URL param
- `/favorites` — Saved cars from Zustand + localStorage; empty state with CTA
- `/settings` — Profile editing, language selector, notification toggles — all persisted to localStorage
- `/dashboard` — Rental stats, Top-5 donut chart (SVG), Recent transactions
- `/*` — Custom branded 404 page

### Technologies Used
Next.js 16.2.4 (App Router), React 19, TypeScript 5 (strict), Tailwind CSS v4, Zustand 5 (favorites + notifications), React Hook Form 7 + Zod 4 (checkout validation), next/image + sharp, @ducanh2912/next-pwa (service worker + manifest), Playwright (E2E tests), GitHub Actions (CI: lint → type-check → build), Vercel (deployment + preview URLs)

### Key Engineering Decisions
- **Flash-free dark mode**: Custom ThemeProvider reads localStorage before first paint and applies class to `<html>` in the server layout. No white flash even on hard reload.
- **Zustand hydration safety**: Custom storage adapter syncs to localStorage without triggering Next.js App Router hydration mismatches (common pain point with SSR + client stores).
- **Custom toast system**: Built without react-hot-toast or Sonner. Pure CSS animation + singleton event emitter so any component can trigger toasts without prop drilling.
- **next/image priority heuristic**: priority={true} set only on the first 6 SSR-rendered car cards. Client-paginated cards excluded to avoid false LCP signals.
- **APP_SECRET proxy guard**: All internal API routes validated against APP_SECRET env var via Next.js 16 proxy.ts — prevents direct endpoint enumeration.
- **Zero animation library**: All transitions (page fade, card slide-up, staggered list) built with Tailwind CSS globals. No Framer Motion or GSAP runtime cost.

### Measurable Outcomes
- 8 fully implemented pages matching the Figma design pixel-for-pixel
- PWA installable on mobile and desktop — Web App Manifest + workbox service worker, offline fallback at /offline
- Playwright E2E suite — 7 test scenarios on chromium + mobile-chrome viewports
- GitHub Actions CI/CD — lint → type-check → build on every push; Vercel auto-deploys on merge to main
- Lighthouse-ready: semantic HTML, ARIA labels, alt text, focus-visible rings, keyboard navigation

### What This Demonstrates
This project demonstrates Murad's ability to translate a professional Figma design into production-quality frontend code — handling the details that separate junior implementations from senior-grade work: dark mode without flash, form validation with proper error UX, accessible interactive components, PWA capability, and a tested, deployed CI/CD pipeline. It proves frontend engineering depth alongside the AI/backend projects in his portfolio.

---

## Project 3: Todo App → Cloud-Native AI Agent (Spec-Driven Evolution)

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://murad-hasil-todo-ai.vercel.app
**GitHub**: https://github.com/Murad-Hasil/Todo-AI-Assistant

### Hackathon Context
Panaversity Hackathon II submission. The goal was to master spec-driven development by evolving a simple CLI app into a fully distributed, event-driven, Kubernetes-deployed AI agent. Every phase has its own spec, plan, tasks, and PHR history record.

### What It Does
A 5-phase demonstration of how a software system evolves from a basic Python CLI to a fully cloud-native AI agent deployed on Kubernetes. Users manage tasks with natural language ("Add a high priority task: finish the project report by Friday", "Electric bill wali task complete kar do") via an AI chatbot with full multi-user JWT authentication and Roman Urdu support.

### Technical Solution
Agent: OpenAI Agents SDK on Groq LLaMA 3.3 70B. Tools exposed via FastMCP server (MCPServerStdio). Singleton MCPServerStdio pattern — the MCP subprocess is connected once at first request and reused across all subsequent requests, avoiding the 20-second Python subprocess startup overhead per chat request. parallel_tool_calls=False required for Groq llama-3.3-70b tool call stability. max_turns=5 per chat cycle. Backend rate limiting via slowapi (chat: 10/min, tasks: 30/min).

Reminder scheduling: Dapr Jobs API + dateparser converts natural language times to UTC datetime → Dapr one-shot job fires callback → DB polling delivers OS-level browser notification.

Kafka event streaming via publish_task_event() on every CRUD operation decouples the notification service.

### Technologies Used
Python 3.12, Next.js 15, FastAPI, SQLModel, Neon PostgreSQL, OpenAI Agents SDK, FastMCP (MCPServerStdio), Groq LLaMA 3.3 70B, Alembic, Docker, Minikube, Kubernetes, Kafka, Dapr Jobs API, slowapi

### The 6 MCP Tools
1. **add_task** — create task with title, priority (low/medium/high), tags, due_date
2. **list_tasks** — list tasks with status filter, sorted by priority and due date
3. **complete_task** — mark a task as done by ID or title match
4. **delete_task** — delete a task by ID or title
5. **update_task** — update any field on an existing task
6. **schedule_reminder** — schedule a Dapr Jobs one-shot reminder for a task

### Database Models
5 SQLModel tables: Task, Conversation, Message (MessageRole enum), UserNotification, (Conversation for chat history)

### Key Highlights
- Singleton MCPServerStdio pattern — avoids 20-second subprocess startup per chat request; health-checked and auto-reconnects on failure
- Dapr Jobs API for reminder scheduling: dateparser converts natural language times to UTC → Dapr fires callback → browser notification delivered via DB polling
- Roman Urdu support — agent detects Roman Urdu input and responds in-kind ('Electric bill wali task complete kar do')
- parallel_tool_calls=False for Groq stability; 3-attempt retry loop on tool_use_failed errors
- Kafka event streaming via publish_task_event() on every CRUD operation
- Alembic migrations for production schema evolution

### Measurable Outcomes
- 5 complete evolution phases with individual spec, plan, tasks, and PHR history records
- 6 FastMCP tools via MCPServerStdio singleton
- Natural language task management in English and Roman Urdu
- Vercel auto-deploy on push to main; backend deployed via HF Space

---

## Project 3: Personal AI Employee — Autonomous Digital FTE

**Category**: AI Automation | **Status**: Completed | **Featured**: Yes

**GitHub**: https://github.com/Murad-Hasil/personal-ai-employee

### What It Does
A production-grade, local-first autonomous AI system built in 4 progressive tiers. Handles email triage, Odoo invoicing, social media drafting, and CEO briefings. Two agents coordinate via atomic os.rename() filesystem claims — no message broker, no database needed for coordination. Every irreversible action requires explicit human approval.

### The Business Problem
Small business owners spend 15-20 hours/week on repetitive administrative tasks — email triage, invoice entry, social media, financial reporting. A human VA costs $4,000–$8,000/month and works 40 hrs/week. Autonomous AI tools either lack safety controls or require expensive cloud infrastructure.

### Technical Solution
4-tier architecture: Lightweight Groq cloud agent handles high-frequency triage 24/7 via PM2 on a cloud VM; local Claude Sonnet 4.6 agent executes sensitive operations (Odoo XML-RPC, Gmail API) that require local credentials. Two agents coordinate via atomic os.rename() — when an agent claims a task file, it renames it atomically; the OS guarantees only one agent can rename a file, preventing double-processing across 2 agents with zero broker or database.

A heartbeat TTL thread writes a Unix timestamp every 30 seconds; if an agent crashes, stale claims are auto-reclaimed after 30 minutes. The Brain class accepts LLM_PROVIDER env var to switch between Anthropic/Groq/OpenRouter with zero code changes.

### Technologies Used
Python 3.12, Claude Sonnet 4.6, Groq Llama-3, OpenRouter, Anthropic SDK, Playwright, Obsidian Vault (9 canonical folders), Gmail API, Odoo XML-RPC, PM2, uv, pytest, Git

### The 4 Tiers
- **T1 Bronze** — Obsidian vault with 9 canonical folders (Needs_Action, In_Progress, Pending_Approval, Done, Logs, Plans, Briefings, Approved, Rejected). File watcher detects new tasks, parses YAML front-matter, routes to skill handlers.
- **T2 Silver** — Gmail via MCP server. Emails polled every 60s, triaged by Claude (urgent/routine/ignore), draft replies written to Pending_Approval. No email sent without human approval.
- **T3 Gold** — Odoo invoice processing (NLP extraction → draft creation → HITL → confirm), social media automation via Playwright (LinkedIn, Instagram, X), weekly CEO briefing generator, financial BI dashboard, JSON Lines audit trail with 100MB auto-rotation.
- **T4 Platinum** — Distributed dual-agent: cloud Groq for triage, local Claude for sensitive execution. Atomic os.rename() coordination. Heartbeat TTL reclaims stale tasks. LLM_PROVIDER env var switches providers.

### Key Highlights
- Atomic multi-agent coordination via os.rename() — no database, no message broker, pure filesystem; OS guarantees only one agent claims each task
- Provider-agnostic Brain class: swap Claude ↔ Groq ↔ OpenRouter via single LLM_PROVIDER env var
- Domain-based security routing: cloud VM holds only Groq key — Odoo and Gmail credentials never leave local machine
- Human-in-the-Loop as architectural guarantee: no code path bypasses the Pending_Approval gate
- Heartbeat TTL thread: background thread writes Unix timestamp every 30s; stale claims auto-reclaimed after 30 min
- Structured JSON Lines audit trail: every external action logged with timestamp, actor, target, and outcome

### Measurable Outcomes
- 168 hours/week autonomous operation vs 40 hrs/week for a human VA
- ~90% cost reduction: $50–200/month LLM costs vs $4,000–8,000/month human VA
- End-to-end email triage under 2 seconds via Groq Llama-3
- 13/13 unit tests pass — Brain routing, atomic claim, domain handoff, vault sync
- Zero double-processing across 2 agents — guaranteed by os.rename() atomicity
- Stale task auto-reclaim in 30 minutes via heartbeat TTL thread

---

## Project 4: Physical AI & Humanoid Robotics Textbook

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://Murad-Hasil.github.io/physical-ai-humanoid-robotics-textbook/
**GitHub**: https://github.com/Murad-Hasil/physical-ai-humanoid-robotics-textbook
**Backend**: https://huggingface.co/spaces/Mb-Murad/physical-ai-backend

### Hackathon Context
Panaversity Hackathon I submission. All 3 bonus deliverables completed: JWT Auth with hardware profiling, hardware-aware content personalization, and Roman Urdu translation.

### What It Does
A full-stack AI-native textbook platform teaching Physical AI and Humanoid Robotics across 13 weeks. Features a RAG chatbot (highlight any text → Ask AI for instant clarification from Groq LLaMA 3.3 70B), hardware-aware personalization across 3 rig profiles, and one-click Roman Urdu chapter translation for Pakistani learners. Backend deployed on Hugging Face Spaces.

### Technical Solution
RAG pipeline: FastEmbed (BAAI/bge-small-en-v1.5, 384-dim vectors) embeds queries → Qdrant Cloud cosine search on collection 'physical-ai-docusaurus-textbook' → Groq LLaMA 3.3 70B generates contextual answer.

GrokClient auto-detects provider from API key prefix: gsk_ routes to Groq API (maps grok-beta → llama-3.3-70b-versatile), xai- routes to xAI Grok API — same code, zero configuration change needed.

Hardware-aware personalization: At signup, students select their rig (RTX Sim Workstation, Jetson Edge Kit, or Unitree G1 Robot). StudentProfile and HardwareConfig records store preferences; every chapter and exercise adapts content to the selected hardware profile.

### Technologies Used
Docusaurus v3, React 19, TypeScript, Tailwind CSS, FastAPI, Python 3.12, FastEmbed (BAAI/bge-small-en-v1.5), Qdrant Cloud, Groq LLaMA 3.3 70B, SQLAlchemy, Alembic, PyJWT, GitHub Actions, GitHub Pages, Docker, Hugging Face Spaces

### Database Models
9 SQLAlchemy models: User, StudentProfile, HardwareConfig, CurriculumProgress, ChatSession, ChatMessage, CurriculumWeek, IngestionLog, ReindexJob

### API Routes
auth, hardware, chat, admin, user_profiles, personalization, translations, curriculum

### 13-Week Curriculum Modules
- **Module 1 — ROS 2** (Weeks 1–5): nodes, topics, services, URDF, Python-ROS controllers
- **Module 2 — Gazebo & Unity** (Weeks 6–7): physics simulation, LiDAR, depth cameras, IMUs
- **Module 3 — NVIDIA Isaac** (Weeks 8–10): photorealistic sim, Isaac ROS, hardware-accelerated VSLAM, Nav2, sim-to-real RL
- **Module 4 — Conversational Humanoid capstone** (Weeks 11–13): LLMs for natural language robot interaction

### Key Highlights
- RAG pipeline: FastEmbed (BAAI/bge-small-en-v1.5) → Qdrant cosine search → Groq LLaMA 3.3 70B; highlight any text → Ask AI
- GrokClient auto-detects provider from API key prefix (gsk_ → Groq, xai- → xAI) — zero config change to switch
- Hardware-aware onboarding: StudentProfile + HardwareConfig records drive content personalization per rig
- One-click Roman Urdu translation via translations API endpoint backed by Groq
- Admin dashboard with curriculum ingestion pipeline and Qdrant reindexing endpoint
- Full CI/CD: GitHub Actions auto-deploys Docusaurus to GitHub Pages; backend on HF Spaces

### Measurable Outcomes
- 13-week curriculum across 4 modules (ROS 2 → Gazebo → Isaac → Conversational Humanoid)
- Qdrant Cloud collection with BAAI/bge-small-en-v1.5 384-dim vectors
- 9 SQLAlchemy models for user management, curriculum tracking, and chat history
- 3 hardware profiles with fully personalized content paths
- All Hackathon I bonus deliverables completed: Auth + Personalization + Urdu Translation
