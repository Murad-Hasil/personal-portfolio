---
id: 031
title: Morent Project Case Study Added
stage: general
date: 2026-05-08
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad-Hasil
command: portfolio analysis + new project add
labels: ["portfolio", "case-study", "manifest", "rag", "morent", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - context/projects-manifest.json
  - backend/context/projects-manifest.json
  - frontend/context/projects-manifest.json
  - context/rag-knowledge-base/projects.md
  - frontend/public/projects/morent-home.png
  - frontend/public/projects/morent-car-detail.png
  - frontend/public/projects/morent-cars-filter.png
  - frontend/public/projects/morent-checkout.png
  - frontend/public/projects/morent-dashboard.png
tests:
  - N/A — manifest-driven static content, no tests required
---

## Prompt

Mere portfolio ko complete analysis karo dekho konse files kaha kaha hai, hume ek project add karna ha portfolio main aur uska case study banana ha jis tarha pehle ke projects ke case studies bane hai, humre rag ko bhi complete information mile taake, context folder ke files frontend and backend dono main hai.

(Follow-up): project folder ka name morent, is folder main ja ke full project ko analysis karo, abhi wo project hum ne banai ha aur waha se maine logout kia yaha claude cli ko run kia, us project ko analysis karo ya maybe saved momories ya kuch tumhe mil jaye and project ke root main 8 screenshots hai liken unme se choosen 5 screenshots hai jinko rename kia ha case study ke liye.

## Response snapshot

Performed full portfolio architecture analysis, then analyzed /home/muradhasil/projects/morent/ via PROJECT.md, README.md, package.json, and .vercel/project.json.

Identified 5 renamed case study screenshots: morent-home.png, morent-car-detail.png, morent-cars-filter.png, morent-checkout.png, morent-dashboard.png.

Extracted: Live URL (https://morent-olive.vercel.app), GitHub (https://github.com/Murad-Hasil/morent), full tech stack (Next.js 16.2.4, React 19, TypeScript 5, Tailwind CSS v4, Zustand 5, RHF+Zod, next-pwa, Playwright), 8 pages, 12 production phases completed.

Actions taken:
1. Copied 5 screenshots to frontend/public/projects/
2. Added complete morent project entry to context/projects-manifest.json (root)
3. Added detailed Project 2 entry to context/rag-knowledge-base/projects.md
4. Synced manifest to backend/context/ and frontend/context/

## Outcome

- ✅ Impact: Morent is now the 2nd project in the portfolio (after CRM Digital FTE). Category: AI / Frontend. Full case study with problem, solution, 4 gallery screenshots, 5 metrics, and 6 engineering highlights. RAG chatbot has complete detailed content about the project.
- 🧪 Tests: N/A — manifest-driven static content
- 📁 Files: 5 image files + 3 manifest files + 1 RAG file updated
- 🔁 Next prompts: Deploy to Vercel to see live case study; re-embed RAG knowledge base to include new project content
- 🧠 Reflection: Manifest-driven architecture made this trivial — one source of truth synced to 3 locations. The morent project fills an important gap by demonstrating pure frontend engineering skill alongside the AI/backend-heavy projects.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Re-embed RAG knowledge base to include morent content in Qdrant
