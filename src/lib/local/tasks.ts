"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";
import { scheduledDateTimeToIso, scheduledEndToIso, taskRowToLocalTask } from "@/lib/supabase/task-mapper";
import type { EnergyMode, Priority, TaskStatus } from "@/types/domain";

export interface LocalTask {
  id: string;
  title: string;
  description: string | null;
  project: string | null;
  category: string;
  priority: Priority;
  estimatedMinutes: number;
  scheduledDate: string;
  scheduledTime: string;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface LocalTaskLink {
  id: string;
  taskId: string;
  url: string;
  title: string | null;
  addedAt: string;
}

export interface LocalSettings {
  dailyCapacityMinutes: number;
  energyMode: EnergyMode;
  dailyReportTime: string;
  showAiReasoning: boolean;
}

export interface LocalOutcomeMetric {
  id: string;
  metricDate: string;
  platform: string;
  metricKey: string;
  metricValue: number;
  rawInput: string | null;
  createdAt: string;
}

export interface LocalWeeklySelfReview {
  id: string;
  weekStartDate: string;
  mostSatisfied: string | null;
  mostFrustrated: string | null;
  nextWeekFocus: string | null;
  updatedAt: string;
}

export interface LocalSubscription {
  plan: "trial" | "basic" | "pro";
  status: "trialing" | "active" | "past_due" | "expired";
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

const TASKS_KEY = "opc.local.tasks";
const TASK_LINKS_KEY = "opc.local.task-links";
const SETTINGS_KEY = "opc.local.settings";
const OUTCOMES_KEY = "opc.local.outcomes";
const WEEKLY_REVIEWS_KEY = "opc.local.weekly-reviews";

const defaultSettings: LocalSettings = {
  dailyCapacityMinutes: 360,
  energyMode: "normal",
  dailyReportTime: "20:00",
  showAiReasoning: false
};

const today = new Date().toISOString().slice(0, 10);

const starterTasks: LocalTask[] = [
  {
    id: "starter-1",
    title: "整理今天的交付清单",
    description: "把今天必须交付和可以推迟的事情分开。",
    project: "工作站内测",
    category: "日常运营",
    priority: "normal",
    estimatedMinutes: 45,
    scheduledDate: today,
    scheduledTime: "09:00",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: "starter-2",
    title: "写课程销售页大纲",
    description: null,
    project: "新课程开发",
    category: "新课程开发",
    priority: "key",
    estimatedMinutes: 120,
    scheduledDate: today,
    scheduledTime: "10:00",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: "starter-3",
    title: "复盘上周内容数据",
    description: null,
    project: "内容矩阵",
    category: "复盘",
    priority: "high",
    estimatedMinutes: 60,
    scheduledDate: today,
    scheduledTime: "14:30",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    completedAt: null
  }
];

export function useLocalWorkspace() {
  const [tasks, setTasks] = useState<LocalTask[]>([]);
  const [taskLinks, setTaskLinks] = useState<LocalTaskLink[]>([]);
  const [outcomes, setOutcomes] = useState<LocalOutcomeMetric[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<LocalWeeklySelfReview[]>([]);
  const [subscription, setSubscription] = useState<LocalSubscription | null>(null);
  const [settings, setSettings] = useState<LocalSettings>(defaultSettings);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<"local" | "supabase">("local");
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
      setSettings(storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings);

      if (!hasSupabaseBrowserConfig()) {
        loadLocalTasks();
        loadLocalTaskLinks();
        loadLocalOutcomes();
        loadLocalWeeklyReviews();
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const sessionResult = await supabase.auth.getSession();
      const user = sessionResult.data.session?.user;

      if (!user) {
        loadLocalTasks();
        loadLocalTaskLinks();
        loadLocalOutcomes();
        loadLocalWeeklyReviews();
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(
          "id,title,project_id,description,category,priority,estimated_minutes,status,scheduled_start,completed_at,created_at"
        )
        .eq("user_id", user.id)
        .order("scheduled_start", { ascending: true });

      if (cancelled) return;

      if (error) {
        setSyncError(error.message);
        loadLocalTasks();
        loadLocalTaskLinks();
        loadLocalOutcomes();
        return;
      }

      const { data: linkData, error: linkError } = await supabase
        .from("task_links")
        .select("id,task_id,url,title,added_at")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (linkError) setSyncError(linkError.message);

      const { data: outcomeData, error: outcomeError } = await supabase
        .from("outcome_metrics")
        .select("id,metric_date,platform,metric_key,metric_value,raw_input,created_at")
        .eq("user_id", user.id)
        .order("metric_date", { ascending: false });

      if (outcomeError) setSyncError(outcomeError.message);

      const { data: reviewData, error: reviewError } = await supabase
        .from("weekly_self_reviews")
        .select("id,week_start_date,most_satisfied,most_frustrated,next_week_focus,updated_at")
        .eq("user_id", user.id)
        .order("week_start_date", { ascending: false });

      if (reviewError) setSyncError(reviewError.message);

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("plan,status,trial_ends_at,current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (subscriptionError) setSyncError(subscriptionError.message);

      setUserId(user.id);
      setStorageMode("supabase");
      setTasks((data || []).map(taskRowToLocalTask));
      setTaskLinks(
        (linkData || []).map((row) => ({
          id: row.id,
          taskId: row.task_id,
          url: row.url,
          title: row.title,
          addedAt: row.added_at
        }))
      );
      setOutcomes(
        (outcomeData || []).map((row) => ({
          id: row.id,
          metricDate: row.metric_date,
          platform: row.platform,
          metricKey: row.metric_key,
          metricValue: Number(row.metric_value),
          rawInput: row.raw_input,
          createdAt: row.created_at
        }))
      );
      setWeeklyReviews(
        (reviewData || []).map((row) => ({
          id: row.id,
          weekStartDate: row.week_start_date,
          mostSatisfied: row.most_satisfied,
          mostFrustrated: row.most_frustrated,
          nextWeekFocus: row.next_week_focus,
          updatedAt: row.updated_at
        }))
      );
      setSubscription(
        subscriptionData
          ? {
              plan: subscriptionData.plan,
              status: subscriptionData.status,
              trialEndsAt: subscriptionData.trial_ends_at,
              currentPeriodEnd: subscriptionData.current_period_end
            }
          : null
      );
      setReady(true);
    }

    function loadLocalTasks() {
      const storedTasks = window.localStorage.getItem(TASKS_KEY);
      setStorageMode("local");
      setTasks(storedTasks ? (JSON.parse(storedTasks) as LocalTask[]) : starterTasks);
      setReady(true);
    }

    function loadLocalTaskLinks() {
      const storedLinks = window.localStorage.getItem(TASK_LINKS_KEY);
      setTaskLinks(storedLinks ? (JSON.parse(storedLinks) as LocalTaskLink[]) : []);
    }

    function loadLocalOutcomes() {
      const storedOutcomes = window.localStorage.getItem(OUTCOMES_KEY);
      setOutcomes(storedOutcomes ? (JSON.parse(storedOutcomes) as LocalOutcomeMetric[]) : []);
    }

    function loadLocalWeeklyReviews() {
      const storedReviews = window.localStorage.getItem(WEEKLY_REVIEWS_KEY);
      setWeeklyReviews(storedReviews ? (JSON.parse(storedReviews) as LocalWeeklySelfReview[]) : []);
    }

    loadWorkspace().catch((error) => {
      setSyncError(error instanceof Error ? error.message : "Workspace load failed");
      const storedTasks = window.localStorage.getItem(TASKS_KEY);
      const storedLinks = window.localStorage.getItem(TASK_LINKS_KEY);
      const storedOutcomes = window.localStorage.getItem(OUTCOMES_KEY);
      const storedReviews = window.localStorage.getItem(WEEKLY_REVIEWS_KEY);
      setTasks(storedTasks ? (JSON.parse(storedTasks) as LocalTask[]) : starterTasks);
      setTaskLinks(storedLinks ? (JSON.parse(storedLinks) as LocalTaskLink[]) : []);
      setOutcomes(storedOutcomes ? (JSON.parse(storedOutcomes) as LocalOutcomeMetric[]) : []);
      setWeeklyReviews(storedReviews ? (JSON.parse(storedReviews) as LocalWeeklySelfReview[]) : []);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready && storageMode === "local") window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [ready, storageMode, tasks]);

  useEffect(() => {
    if (ready && storageMode === "local") window.localStorage.setItem(TASK_LINKS_KEY, JSON.stringify(taskLinks));
  }, [ready, storageMode, taskLinks]);

  useEffect(() => {
    if (ready && storageMode === "local") window.localStorage.setItem(OUTCOMES_KEY, JSON.stringify(outcomes));
  }, [ready, storageMode, outcomes]);

  useEffect(() => {
    if (ready && storageMode === "local") window.localStorage.setItem(WEEKLY_REVIEWS_KEY, JSON.stringify(weeklyReviews));
  }, [ready, storageMode, weeklyReviews]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [ready, settings]);

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.scheduledDate === today && task.status !== "cancelled")
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)),
    [tasks]
  );

  const scheduledMinutes = todayTasks
    .filter((task) => task.status !== "completed")
    .reduce((total, task) => total + task.estimatedMinutes, 0);
  const canWrite = storageMode === "local" || hasWriteAccess(subscription);
  const readOnlyReason =
    storageMode === "supabase" && !canWrite ? "试用或订阅已到期，请在设置页订阅后继续编辑。" : null;

  function ensureWritable() {
    if (canWrite) return true;
    setSyncError(readOnlyReason || "当前账号为只读状态。");
    return false;
  }

  async function addTask(input: {
    title: string;
    project?: string;
    estimatedMinutes: number;
    priority: Priority;
    scheduledDate: string;
    scheduledTime: string;
  }) {
    if (!ensureWritable()) return;

    const task: LocalTask = {
      id: crypto.randomUUID(),
      title: input.title,
      description: null,
      project: input.project || null,
      category: input.project || "日常运营",
      priority: input.priority,
      estimatedMinutes: input.estimatedMinutes,
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTasks((current) => [task, ...current]);

    if (storageMode === "supabase" && userId) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title: input.title,
          category: input.project || "日常运营",
          priority: input.priority,
          estimated_minutes: input.estimatedMinutes,
          status: "scheduled",
          scheduled_start: scheduledDateTimeToIso(input.scheduledDate, input.scheduledTime),
          scheduled_end: scheduledEndToIso(input.scheduledDate, input.scheduledTime, input.estimatedMinutes)
        })
        .select(
          "id,title,project_id,description,category,priority,estimated_minutes,status,scheduled_start,completed_at,created_at"
        )
        .single();

      if (error) {
        setSyncError(error.message);
        return;
      }

      if (data) {
        setTasks((current) => current.map((currentTask) => (currentTask.id === task.id ? taskRowToLocalTask(data) : currentTask)));
        await recordTaskHistory(data.id, "created", null, { title: data.title });
      }
    }
  }

  async function toggleTask(taskId: string) {
    if (!ensureWritable()) return;

    const target = tasks.find((task) => task.id === taskId);
    const completed = target?.status !== "completed";
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          status: completed ? "completed" : "scheduled",
          completedAt: completed ? new Date().toISOString() : null
        };
      })
    );

    if (storageMode === "supabase") {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("tasks")
        .update({
          status: completed ? "completed" : "scheduled",
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq("id", taskId);
      if (error) setSyncError(error.message);
      else await recordTaskHistory(taskId, completed ? "completed" : "reopened", target?.status, completed ? "completed" : "scheduled");
    }
  }

  async function postponeTask(taskId: string) {
    if (!ensureWritable()) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDate = tomorrow.toISOString().slice(0, 10);
    const target = tasks.find((task) => task.id === taskId);
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, scheduledDate: nextDate, status: "postponed" } : task
      )
    );

    if (storageMode === "supabase" && target) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("tasks")
        .update({
          status: "postponed",
          scheduled_start: scheduledDateTimeToIso(nextDate, target.scheduledTime),
          scheduled_end: scheduledEndToIso(nextDate, target.scheduledTime, target.estimatedMinutes)
        })
        .eq("id", taskId);
      if (error) setSyncError(error.message);
      else await recordTaskHistory(taskId, "postponed", target?.scheduledDate, nextDate);
    }
  }

  async function cancelTask(taskId: string) {
    if (!ensureWritable()) return;

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: "cancelled" } : task))
    );

    if (storageMode === "supabase") {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("tasks").update({ status: "cancelled" }).eq("id", taskId);
      if (error) setSyncError(error.message);
      else await recordTaskHistory(taskId, "cancelled", null, "cancelled");
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    if (!ensureWritable()) return;

    const target = tasks.find((task) => task.id === taskId);
    const completedAt = status === "completed" ? new Date().toISOString() : null;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedAt
            }
          : task
      )
    );

    if (storageMode === "supabase") {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("tasks")
        .update({
          status,
          completed_at: completedAt
        })
        .eq("id", taskId);

      if (error) setSyncError(error.message);
      else await recordTaskHistory(taskId, status === "completed" ? "completed" : "rescheduled", target?.status, status);
    }
  }

  async function updateTaskDescription(taskId: string, description: string) {
    if (!ensureWritable()) return;

    const before = tasks.find((task) => task.id === taskId)?.description ?? null;
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, description: description || null } : task))
    );

    if (storageMode === "supabase") {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("tasks")
        .update({ description: description || null })
        .eq("id", taskId);
      if (error) setSyncError(error.message);
      else await recordTaskHistory(taskId, "description_changed", before, description || null);
    }
  }

  async function addTaskLink(input: { taskId: string; url: string; title?: string }) {
    if (!ensureWritable()) return;

    const normalizedUrl = normalizeUrl(input.url);
    const link: LocalTaskLink = {
      id: crypto.randomUUID(),
      taskId: input.taskId,
      url: normalizedUrl,
      title: input.title?.trim() || getUrlHost(normalizedUrl),
      addedAt: new Date().toISOString()
    };

    setTaskLinks((current) => [link, ...current]);

    if (storageMode === "supabase" && userId) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("task_links")
        .insert({
          task_id: input.taskId,
          user_id: userId,
          url: normalizedUrl,
          title: link.title
        })
        .select("id,task_id,url,title,added_at")
        .single();

      if (error) {
        setSyncError(error.message);
        return;
      }

      if (data) {
        const saved: LocalTaskLink = {
          id: data.id,
          taskId: data.task_id,
          url: data.url,
          title: data.title,
          addedAt: data.added_at
        };
        setTaskLinks((current) => [saved, ...current.filter((item) => item.id !== link.id)]);
        await recordTaskHistory(input.taskId, "link_added", null, { url: saved.url, title: saved.title });
      }
    }
  }

  async function deleteTaskLink(linkId: string) {
    if (!ensureWritable()) return;

    const target = taskLinks.find((link) => link.id === linkId);
    setTaskLinks((current) => current.filter((link) => link.id !== linkId));

    if (storageMode === "supabase" && target) {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("task_links").delete().eq("id", linkId);
      if (error) setSyncError(error.message);
      else await recordTaskHistory(target.taskId, "link_removed", { url: target.url, title: target.title }, null);
    }
  }

  async function addOutcomeMetric(input: {
    metricDate: string;
    platform: string;
    metricKey: string;
    metricValue: number;
    rawInput?: string;
  }) {
    if (!ensureWritable()) return;

    const metric: LocalOutcomeMetric = {
      id: crypto.randomUUID(),
      metricDate: input.metricDate,
      platform: input.platform,
      metricKey: input.metricKey,
      metricValue: input.metricValue,
      rawInput: input.rawInput || null,
      createdAt: new Date().toISOString()
    };

    setOutcomes((current) => [metric, ...current]);

    if (storageMode === "supabase" && userId) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("outcome_metrics")
        .upsert(
          {
            user_id: userId,
            metric_date: input.metricDate,
            platform: input.platform,
            metric_key: input.metricKey,
            metric_value: input.metricValue,
            raw_input: input.rawInput || null
          },
          { onConflict: "user_id,metric_date,platform,metric_key" }
        )
        .select("id,metric_date,platform,metric_key,metric_value,raw_input,created_at")
        .single();

      if (error) {
        setSyncError(error.message);
        return;
      }

      if (data) {
        const saved: LocalOutcomeMetric = {
          id: data.id,
          metricDate: data.metric_date,
          platform: data.platform,
          metricKey: data.metric_key,
          metricValue: Number(data.metric_value),
          rawInput: data.raw_input,
          createdAt: data.created_at
        };
        setOutcomes((current) => [
          saved,
          ...current.filter(
            (item) =>
              item.id !== metric.id &&
              !(item.metricDate === saved.metricDate && item.platform === saved.platform && item.metricKey === saved.metricKey)
          )
        ]);
      }
    }
  }

  async function addOutcomeMetrics(metrics: Array<{
    metricDate: string;
    platform: string;
    metricKey: string;
    metricValue: number;
    rawInput?: string;
  }>) {
    if (!ensureWritable()) return;

    for (const metric of metrics) {
      await addOutcomeMetric(metric);
    }
  }

  async function saveWeeklySelfReview(input: {
    weekStartDate: string;
    mostSatisfied: string;
    mostFrustrated: string;
    nextWeekFocus: string;
  }) {
    if (!ensureWritable()) return;

    const review: LocalWeeklySelfReview = {
      id: crypto.randomUUID(),
      weekStartDate: input.weekStartDate,
      mostSatisfied: input.mostSatisfied || null,
      mostFrustrated: input.mostFrustrated || null,
      nextWeekFocus: input.nextWeekFocus || null,
      updatedAt: new Date().toISOString()
    };

    setWeeklyReviews((current) => [
      review,
      ...current.filter((item) => item.weekStartDate !== input.weekStartDate)
    ]);

    if (storageMode === "supabase" && userId) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("weekly_self_reviews")
        .upsert(
          {
            user_id: userId,
            week_start_date: input.weekStartDate,
            most_satisfied: input.mostSatisfied || null,
            most_frustrated: input.mostFrustrated || null,
            next_week_focus: input.nextWeekFocus || null
          },
          { onConflict: "user_id,week_start_date" }
        )
        .select("id,week_start_date,most_satisfied,most_frustrated,next_week_focus,updated_at")
        .single();

      if (error) {
        setSyncError(error.message);
        return;
      }

      if (data) {
        const saved: LocalWeeklySelfReview = {
          id: data.id,
          weekStartDate: data.week_start_date,
          mostSatisfied: data.most_satisfied,
          mostFrustrated: data.most_frustrated,
          nextWeekFocus: data.next_week_focus,
          updatedAt: data.updated_at
        };
        setWeeklyReviews((current) => [
          saved,
          ...current.filter((item) => item.weekStartDate !== saved.weekStartDate)
        ]);
      }
    }
  }

  async function recordTaskHistory(taskId: string, eventType: string, beforeValue: unknown, afterValue: unknown) {
    if (storageMode !== "supabase" || !userId) return;

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("task_history").insert({
      task_id: taskId,
      user_id: userId,
      event_type: eventType,
      before_value: beforeValue === undefined ? null : beforeValue,
      after_value: afterValue === undefined ? null : afterValue,
      triggered_by: "user"
    });

    if (error) setSyncError(error.message);
  }

  return {
    ready,
    tasks,
    taskLinks,
    todayTasks,
    outcomes,
    weeklyReviews,
    subscription,
    canWrite,
    readOnlyReason,
    settings,
    scheduledMinutes,
    storageMode,
    syncError,
    setSettings,
    addTask,
    toggleTask,
    postponeTask,
    cancelTask,
    updateTaskStatus,
    updateTaskDescription,
    addTaskLink,
    deleteTaskLink,
    addOutcomeMetric,
    addOutcomeMetrics,
    saveWeeklySelfReview
  };
}

function hasWriteAccess(subscription: LocalSubscription | null) {
  if (!subscription) return true;
  if (subscription.status === "active") return true;
  if (subscription.status !== "trialing") return false;
  if (!subscription.trialEndsAt) return true;
  return new Date(subscription.trialEndsAt).getTime() > Date.now();
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getUrlHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "链接";
  }
}
