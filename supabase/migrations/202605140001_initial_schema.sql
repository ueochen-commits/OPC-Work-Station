create extension if not exists pgcrypto;

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  timezone text not null default 'Asia/Shanghai',
  work_hours_start time not null default '09:00',
  work_hours_end time not null default '18:00',
  daily_capacity_minutes int not null default 360 check (daily_capacity_minutes between 60 and 720),
  daily_report_time time not null default '20:00',
  completion_rate_avg numeric(3,2) not null default 0.75 check (completion_rate_avg between 0 and 1),
  voice_enabled boolean not null default true,
  show_ai_reasoning boolean not null default false,
  current_energy_mode text not null default 'normal' check (current_energy_mode in ('normal','light','paused')),
  energy_mode_set_at timestamptz,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text,
  start_date date not null default current_date,
  target_end_date date,
  actual_end_date date,
  status text not null default 'active' check (status in ('planning','active','paused','completed','cancelled')),
  color text not null default '#1F2937',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  target_date date not null,
  completed_at timestamptz,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  category text,
  priority text not null default 'normal' check (priority in ('high','key','normal','low')),
  estimated_minutes int not null default 60 check (estimated_minutes > 0),
  actual_minutes int check (actual_minutes is null or actual_minutes >= 0),
  hard_deadline timestamptz,
  recurrence_rule text,
  status text not null default 'pending' check (status in ('pending','scheduled','in_progress','completed','postponed','cancelled')),
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  completed_at timestamptz,
  completion_note text,
  lessons_learned text,
  tags text[] not null default '{}',
  source_input text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_dependencies (
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, depends_on_task_id),
  check (task_id != depends_on_task_id)
);

create table public.outcome_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  metric_date date not null,
  platform text not null,
  metric_key text not null,
  metric_value numeric not null,
  raw_input text,
  created_at timestamptz not null default now(),
  unique (user_id, metric_date, platform, metric_key)
);

create table public.platforms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  color text not null default '#1F2937',
  metric_keys text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.ai_call_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  prompt_type text not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  cost_cny numeric(8,4),
  latency_ms int,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

create table public.scheduling_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  event_type text not null check (event_type in ('initial_schedule','cascade','manual_adjust','hard_deadline_conflict','overflow')),
  affected_task_ids uuid[] not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  week_start_date date not null,
  report_data jsonb not null,
  ai_insights jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

create table public.decomposition_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  original_goal text not null,
  clarification_qa jsonb,
  decomposition_result jsonb not null,
  status text not null default 'draft' check (status in ('draft','partial_committed','fully_committed','discarded')),
  committed_task_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.undo_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  action_type text not null,
  before_state jsonb not null,
  affected_task_ids uuid[] not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  event_type text not null check (event_type in (
    'created','title_changed','rescheduled','priority_changed','postponed','completed',
    'reopened','cancelled','description_changed','link_added','link_removed','note_added'
  )),
  before_value jsonb,
  after_value jsonb,
  triggered_by text not null default 'user' check (triggered_by in ('user','system','ai_cascade')),
  created_at timestamptz not null default now()
);

create table public.task_links (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  url text not null,
  title text,
  preview_image text,
  added_at timestamptz not null default now()
);

create table public.daily_mood_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  note_date date not null,
  energy_mode text not null check (energy_mode in ('normal','light','paused')),
  mood_note text,
  created_at timestamptz not null default now(),
  unique (user_id, note_date)
);

create table public.weekly_self_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  week_start_date date not null,
  most_satisfied text,
  most_frustrated text,
  next_week_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  plan text not null check (plan in ('trial','basic','pro')),
  status text not null check (status in ('trialing','active','past_due','expired')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  renewal_reminder_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  order_id text not null unique,
  xorpay_aoid text unique,
  plan text not null check (plan in ('basic','pro')),
  billing_period text not null check (billing_period in ('monthly','yearly')),
  pay_type text not null check (pay_type in ('native','alipay','jsapi')),
  amount_cny numeric(10,2) not null,
  status text not null default 'created' check (status in ('created','pending','paid','failed','expired','refunded')),
  qr_url text,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  usage_date date not null,
  call_count int not null default 0,
  unique (user_id, usage_date)
);

create table public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  code text not null unique,
  total_invitees int not null default 0,
  total_conversions int not null default 0,
  total_months_earned int not null default 0,
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_email text not null,
  status text not null default 'signed_up' check (status in ('signed_up','trial_active','converted','failed','expired')),
  reward_granted boolean not null default false,
  created_at timestamptz not null default now(),
  converted_at timestamptz,
  unique (invitee_user_id)
);

create table public.share_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  card_type text not null check (card_type in ('weekly_data','weekly_reflection','progress')),
  week_start_date date not null,
  share_token text not null unique,
  view_count int not null default 0,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create index idx_tasks_user_status_scheduled on public.tasks (user_id, status, scheduled_start);
create index idx_tasks_user_project on public.tasks (user_id, project_id);
create index idx_tasks_user_today on public.tasks (user_id, scheduled_start) where status in ('scheduled','in_progress');
create index idx_outcome_user_date on public.outcome_metrics (user_id, metric_date desc);
create index idx_ai_logs_user_date on public.ai_call_logs (user_id, created_at desc);
create index idx_scheduling_events_user_date on public.scheduling_events (user_id, created_at desc);
create index idx_milestones_project on public.milestones (project_id, display_order);
create index idx_drafts_user on public.decomposition_drafts (user_id, created_at desc);
create index idx_undo_user_active on public.undo_snapshots (user_id, expires_at) where used = false;
create index idx_task_history_task on public.task_history (task_id, created_at desc);
create index idx_payment_orders_user_date on public.payment_orders (user_id, created_at desc);
create index idx_payment_orders_status on public.payment_orders (status);
create index idx_ai_usage_user_date on public.daily_ai_usage (user_id, usage_date desc);

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_user_profiles_updated before update on public.user_profiles for each row execute function public.set_updated_at();
create trigger trg_projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger trg_tasks_updated before update on public.tasks for each row execute function public.set_updated_at();
create trigger trg_drafts_updated before update on public.decomposition_drafts for each row execute function public.set_updated_at();
create trigger trg_weekly_self_reviews_updated before update on public.weekly_self_reviews for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger trg_payment_orders_updated before update on public.payment_orders for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.outcome_metrics enable row level security;
alter table public.platforms enable row level security;
alter table public.ai_call_logs enable row level security;
alter table public.scheduling_events enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.decomposition_drafts enable row level security;
alter table public.undo_snapshots enable row level security;
alter table public.task_history enable row level security;
alter table public.task_links enable row level security;
alter table public.daily_mood_notes enable row level security;
alter table public.weekly_self_reviews enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_orders enable row level security;
alter table public.daily_ai_usage enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.share_cards enable row level security;

create policy "Own profile" on public.user_profiles for all using (auth.uid() = id);
create policy "Own projects" on public.projects for all using (auth.uid() = user_id);
create policy "Own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Own outcomes" on public.outcome_metrics for all using (auth.uid() = user_id);
create policy "Own platforms" on public.platforms for all using (auth.uid() = user_id);
create policy "Own reports" on public.weekly_reports for all using (auth.uid() = user_id);
create policy "Own scheduling events" on public.scheduling_events for all using (auth.uid() = user_id);
create policy "Own ai logs" on public.ai_call_logs for select using (auth.uid() = user_id);
create policy "Own drafts" on public.decomposition_drafts for all using (auth.uid() = user_id);
create policy "Own undo snapshots" on public.undo_snapshots for all using (auth.uid() = user_id);
create policy "Own task history" on public.task_history for all using (auth.uid() = user_id);
create policy "Own task links" on public.task_links for all using (auth.uid() = user_id);
create policy "Own mood notes" on public.daily_mood_notes for all using (auth.uid() = user_id);
create policy "Own weekly self reviews" on public.weekly_self_reviews for all using (auth.uid() = user_id);
create policy "Own subscriptions" on public.subscriptions for all using (auth.uid() = user_id);
create policy "Own payment orders" on public.payment_orders for all using (auth.uid() = user_id);
create policy "Own ai usage" on public.daily_ai_usage for all using (auth.uid() = user_id);
create policy "Own referral code" on public.referral_codes for all using (auth.uid() = user_id);
create policy "Own share cards" on public.share_cards for all using (auth.uid() = user_id);

create policy "Milestones via project" on public.milestones for all using (
  exists (select 1 from public.projects p where p.id = milestones.project_id and p.user_id = auth.uid())
);

create policy "Task deps via task" on public.task_dependencies for all using (
  exists (select 1 from public.tasks t where t.id = task_dependencies.task_id and t.user_id = auth.uid())
);

create policy "Referral participants can read" on public.referrals for select using (
  auth.uid() = inviter_user_id or auth.uid() = invitee_user_id
);
