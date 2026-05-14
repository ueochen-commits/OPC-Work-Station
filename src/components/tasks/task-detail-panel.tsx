"use client";

import { ExternalLink, Link2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { LocalTask, LocalTaskLink } from "@/lib/local/tasks";

const priorityLabel = {
  high: "高优",
  key: "关键",
  normal: "普通",
  low: "可推迟"
};

const statusLabel = {
  pending: "待排程",
  scheduled: "已排程",
  in_progress: "进行中",
  completed: "已完成",
  postponed: "已顺延",
  cancelled: "已取消"
};

export function TaskDetailPanel({
  task,
  links,
  canWrite,
  onClose,
  onSaveDescription,
  onAddLink,
  onDeleteLink
}: {
  task: LocalTask | null;
  links: LocalTaskLink[];
  canWrite: boolean;
  onClose: () => void;
  onSaveDescription: (taskId: string, description: string) => void;
  onAddLink: (taskId: string, url: string, title?: string) => void;
  onDeleteLink: (linkId: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  useEffect(() => {
    setDescription(task?.description ?? "");
    setLinkUrl("");
    setLinkTitle("");
  }, [task]);

  if (!task) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-20 w-full border-l border-border-default bg-bg-default shadow-none md:w-[420px]">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <p className="text-xs text-text-muted">任务详情</p>
            <h2 className="mt-1 max-w-[320px] truncate text-lg font-semibold">{task.title}</h2>
          </div>
          <button className="rounded-md p-1 text-text-muted hover:bg-bg-hover" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section className="grid grid-cols-2 gap-3 text-sm">
            <Field label="状态" value={statusLabel[task.status]} />
            <Field label="优先级" value={priorityLabel[task.priority]} />
            <Field label="计划时间" value={`${task.scheduledDate} ${task.scheduledTime}`} />
            <Field label="预估时长" value={`${task.estimatedMinutes} 分钟`} />
            <Field label="项目" value={task.project || "未归属"} />
            <Field label="分类" value={task.category} />
          </section>

          <section>
            <label className="mb-2 block text-sm font-medium" htmlFor="task-description">
              描述 / 备注
            </label>
            <textarea
              className="min-h-[132px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
              disabled={!canWrite}
              id="task-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="补充任务背景、链接、临时想法..."
              value={description}
            />
            <div className="mt-2 flex justify-end">
              <button
                className="h-8 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse hover:bg-accent-hover disabled:opacity-50"
                disabled={!canWrite}
                onClick={() => onSaveDescription(task.id, description)}
              >
                保存描述
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-medium">链接附件</h3>
            <form
              className="mb-3 grid gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canWrite || !linkUrl.trim()) return;
                onAddLink(task.id, linkUrl, linkTitle);
                setLinkUrl("");
                setLinkTitle("");
              }}
            >
              <input
                className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 text-sm outline-none focus:border-border-focus"
                disabled={!canWrite}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://..."
                value={linkUrl}
              />
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <input
                  className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 text-sm outline-none focus:border-border-focus"
                  disabled={!canWrite}
                  onChange={(event) => setLinkTitle(event.target.value)}
                  placeholder="链接标题，可选"
                  value={linkTitle}
                />
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse disabled:opacity-50"
                  disabled={!canWrite || !linkUrl.trim()}
                >
                  <Link2 size={15} />
                  添加
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {links.length === 0 ? (
                <p className="rounded-md bg-bg-subtle px-3 py-2 text-sm text-text-muted">还没有链接。</p>
              ) : null}
              {links.map((link) => (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-border-default px-3 py-2"
                  key={link.id}
                >
                  <a
                    className="min-w-0 text-sm hover:underline"
                    href={link.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="block truncate">{link.title || link.url}</span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-muted">
                      <ExternalLink size={12} />
                      {link.url}
                    </span>
                  </a>
                  <button
                    aria-label={`删除链接 ${link.title || link.url}`}
                    className="rounded-md p-1 text-text-muted hover:bg-bg-hover disabled:opacity-50"
                    disabled={!canWrite}
                    onClick={() => onDeleteLink(link.id)}
                    type="button"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-medium">任务历史</h3>
            <div className="space-y-2 text-sm text-text-muted">
              <HistoryLine label="创建任务" value={new Date(task.createdAt).toLocaleString("zh-CN")} />
              {task.completedAt ? (
                <HistoryLine label="完成任务" value={new Date(task.completedAt).toLocaleString("zh-CN")} />
              ) : null}
              {task.status === "postponed" ? <HistoryLine label="顺延任务" value="已移动到后续日期" /> : null}
              {task.status === "cancelled" ? <HistoryLine label="取消任务" value="任务已取消" /> : null}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-default px-3 py-2">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-text-default">{value}</dd>
    </div>
  );
}

function HistoryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-bg-subtle px-3 py-2">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
