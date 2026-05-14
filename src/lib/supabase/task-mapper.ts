import type { LocalTask } from "@/lib/local/tasks";
import type { Priority, TaskStatus } from "@/types/domain";

interface TaskRow {
  id: string;
  title: string;
  project_id: string | null;
  description: string | null;
  category: string | null;
  priority: Priority;
  estimated_minutes: number;
  status: TaskStatus;
  scheduled_start: string | null;
  completed_at: string | null;
  created_at: string;
}

export function taskRowToLocalTask(row: TaskRow): LocalTask {
  const scheduled = row.scheduled_start ? new Date(row.scheduled_start) : new Date(row.created_at);
  return {
    id: row.id,
    title: row.title,
    project: row.category,
    category: row.category || "日常运营",
    priority: row.priority,
    estimatedMinutes: row.estimated_minutes,
    scheduledDate: toDateInput(scheduled),
    scheduledTime: toTimeInput(scheduled),
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}

export function scheduledDateTimeToIso(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function scheduledEndToIso(date: string, time: string, estimatedMinutes: number) {
  const start = new Date(`${date}T${time}:00`);
  start.setMinutes(start.getMinutes() + estimatedMinutes);
  return start.toISOString();
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInput(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}
