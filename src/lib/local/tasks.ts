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

export interface LocalSettings {
  dailyCapacityMinutes: number;
  energyMode: EnergyMode;
  dailyReportTime: string;
  showAiReasoning: boolean;
}

const TASKS_KEY = "opc.local.tasks";
const SETTINGS_KEY = "opc.local.settings";

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
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const sessionResult = await supabase.auth.getSession();
      const user = sessionResult.data.session?.user;

      if (!user) {
        loadLocalTasks();
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
        return;
      }

      setUserId(user.id);
      setStorageMode("supabase");
      setTasks((data || []).map(taskRowToLocalTask));
      setReady(true);
    }

    function loadLocalTasks() {
      const storedTasks = window.localStorage.getItem(TASKS_KEY);
      setStorageMode("local");
      setTasks(storedTasks ? (JSON.parse(storedTasks) as LocalTask[]) : starterTasks);
      setReady(true);
    }

    loadWorkspace().catch((error) => {
      setSyncError(error instanceof Error ? error.message : "Workspace load failed");
      const storedTasks = window.localStorage.getItem(TASKS_KEY);
      setTasks(storedTasks ? (JSON.parse(storedTasks) as LocalTask[]) : starterTasks);
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

  async function addTask(input: {
    title: string;
    project?: string;
    estimatedMinutes: number;
    priority: Priority;
    scheduledDate: string;
    scheduledTime: string;
  }) {
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

  async function updateTaskDescription(taskId: string, description: string) {
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
    todayTasks,
    settings,
    scheduledMinutes,
    storageMode,
    syncError,
    setSettings,
    addTask,
    toggleTask,
    postponeTask,
    cancelTask,
    updateTaskDescription
  };
}
