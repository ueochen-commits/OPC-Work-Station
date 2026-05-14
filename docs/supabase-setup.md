# Supabase Setup

## Project

Use the Supabase project created for OPC Work Station.

## Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are exposed to the browser. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.

## Auth URLs

Supabase Dashboard -> Authentication -> URL Configuration:

```bash
Site URL:
https://opc-work-station.vercel.app

Redirect URLs:
https://opc-work-station.vercel.app/**
http://localhost:3000/**
```

## Migrations

Run these files in order through the Supabase SQL Editor if the Supabase CLI is not linked yet:

1. `supabase/migrations/202605140001_initial_schema.sql`
2. `supabase/migrations/202605140002_auth_profile_bootstrap.sql`

The second migration creates an auth trigger that automatically inserts:

- `user_profiles`
- `subscriptions` with a 14-day trial

This trigger is required before real users create tasks, because `tasks.user_id` references `user_profiles(id)`.

## Security

- Keep RLS enabled for all tables.
- Keep automatic table exposure disabled unless a table is intentionally exposed through Data API.
- Rotate the `service_role` key before public launch if it was ever pasted into an unsafe place.
