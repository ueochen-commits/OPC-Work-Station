# OPC Work Station

One-person company task workstation. The app turns natural-language plans into scheduled tasks, project progress, and weekly review loops.

## Current Status

This repository has the initial offline scaffold:

- Next.js App Router project files
- Tailwind design tokens based on the PRD
- First-pass today workspace UI
- XORPAY signing and order client helpers
- Supabase migration for the v1 domain model

Dependencies are declared in `package.json`, but they are not installed yet because network access was unavailable during scaffolding.

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill Supabase, DeepSeek, and XORPAY values before calling backend integrations.
