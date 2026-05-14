"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnergyMode, Priority, TaskStatus } from "@/types/domain";

export interface LocalTask {
  id: string;
  title: string;
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

  useEffect(() => {
    const storedTasks = window.localStorage.getItem(TASKS_KEY);
    const storedSettings = window.localStorage.getItem(SETTINGS_KEY);

    setTasks(storedTasks ? (JSON.parse(storedTasks) as LocalTask[]) : starterTasks);
    setSettings(storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [ready, tasks]);

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

  function addTask(input: {
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
  }

  function toggleTask(taskId: string) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const completed = task.status !== "completed";
        return {
          ...task,
          status: completed ? "completed" : "scheduled",
          completedAt: completed ? new Date().toISOString() : null
        };
      })
    );
  }

  function postponeTask(taskId: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDate = tomorrow.toISOString().slice(0, 10);
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, scheduledDate: nextDate, status: "postponed" } : task
      )
    );
  }

  function cancelTask(taskId: string) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: "cancelled" } : task))
    );
  }

  return {
    ready,
    tasks,
    todayTasks,
    settings,
    scheduledMinutes,
    setSettings,
    addTask,
    toggleTask,
    postponeTask,
    cancelTask
  };
}
