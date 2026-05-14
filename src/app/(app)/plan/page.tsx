"use client";

import { useMemo, useState } from "react";
import { Check, FileText, Wand2 } from "lucide-react";
import { useLocalWorkspace } from "@/lib/local/tasks";
import type { Priority } from "@/types/domain";

type PlanMode = "import" | "adjust" | "decompose";
type GoalType = "video" | "course" | "sales" | "custom";

interface DraftTask {
  title: string;
  project?: string;
  estimatedMinutes: number;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  completed?: boolean;
}

const today = new Date().toISOString().slice(0, 10);

const sampleMonthlyPlan = `# 2026 年 6 月内容计划

## 6/1 周一
- [ ] 写第 1 条视频脚本 2 小时
- [ ] 整理本周选题库

## 6/3 周三
- [ ] 拍摄第 1 条视频

## 6/5 周五
- [ ] 剪辑第 1 条视频 3 小时

## 6/7 周日
- [ ] 发布第 1 条视频并记录数据
`;

export default function PlanPage() {
  const { addTask, canWrite, readOnlyReason, storageMode, syncError } = useLocalWorkspace();
  const [mode, setMode] = useState<PlanMode>("import");
  const [projectName, setProjectName] = useState("月度任务计划");
  const [documentText, setDocumentText] = useState(sampleMonthlyPlan);
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const importedTasks = useMemo(
    () => parseMonthlyPlan(documentText, projectName || "月度任务计划", { includeCompleted }),
    [documentText, includeCompleted, projectName]
  );

  const [changeText, setChangeText] = useState("把新学到的商业模式整合进当前产品和内容体系");
  const [changeStart, setChangeStart] = useState(today);
  const [changeEnd, setChangeEnd] = useState(addDays(today, 7));
  const [changeProject, setChangeProject] = useState("商业模式升级");
  const [adjustMessage, setAdjustMessage] = useState<string | null>(null);
  const adjustmentTasks = useMemo(
    () =>
      buildAdjustmentTasks({
        changeText,
        startDate: changeStart,
        endDate: changeEnd,
        project: changeProject || "计划调整"
      }),
    [changeEnd, changeProject, changeStart, changeText]
  );

  const [goal, setGoal] = useState("一个月更新 4 条视频，带动账号涨粉");
  const [goalType, setGoalType] = useState<GoalType>("video");
  const [decomposeMessage, setDecomposeMessage] = useState<string | null>(null);
  const decomposedTasks = useMemo(() => buildGoalTasks(goal, goalType), [goal, goalType]);

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">Plan Mode</p>
        <h1 className="text-[28px] font-semibold leading-tight">把整月计划变成可维护的任务系统</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="rounded-sm bg-bg-muted px-2 py-0.5">
            {storageMode === "supabase" ? "已连接 Supabase" : "本地演示模式"}
          </span>
          {syncError ? (
            <span className="rounded-sm bg-[var(--warning-bg)] px-2 py-0.5 text-[var(--warning-fg)]">
              {syncError}
            </span>
          ) : null}
        </div>
      </header>

      {!canWrite && readOnlyReason ? (
        <div className="mb-5 rounded-lg border border-border-default bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning-fg)]">
          {readOnlyReason}
        </div>
      ) : null}

      <section className="mb-5 grid gap-2 md:grid-cols-3">
        <ModeButton active={mode === "import"} icon={<FileText size={15} />} label="导入整月计划" onClick={() => setMode("import")} />
        <ModeButton active={mode === "adjust"} icon={<Wand2 size={15} />} label="插入计划变更" onClick={() => setMode("adjust")} />
        <ModeButton active={mode === "decompose"} icon={<Check size={15} />} label="从目标拆解" onClick={() => setMode("decompose")} />
      </section>

      {mode === "import" ? (
        <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-lg border border-border-default p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">粘贴 Claude 生成的月度任务文档</h2>
                <p className="mt-1 text-xs text-text-muted">
                  支持「5 月 6 日」日期标题、嵌套 checkbox、普通列表。默认只导入每日清单里的未完成任务。
                </p>
              </div>
              {importMessage ? <span className="text-xs text-text-muted">{importMessage}</span> : null}
            </div>
            <Field label="项目名">
              <input
                className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 text-sm"
                onChange={(event) => setProjectName(event.target.value)}
                value={projectName}
              />
            </Field>
            <label className="mt-3 flex items-center justify-between gap-3 rounded-md border border-border-default px-3 py-2">
              <span>
                <span className="block text-sm font-medium">包含已完成任务</span>
                <span className="text-xs text-text-muted">关闭时会跳过 - [x]，适合继续执行剩余计划。</span>
              </span>
              <input
                checked={includeCompleted}
                onChange={(event) => setIncludeCompleted(event.target.checked)}
                type="checkbox"
              />
            </label>
            <textarea
              className="mt-3 min-h-[420px] w-full resize-y rounded-md border border-border-default bg-bg-default px-3 py-2 font-mono text-sm outline-none focus:border-border-focus"
              onChange={(event) => {
                setDocumentText(event.target.value);
                setImportMessage(null);
              }}
              value={documentText}
            />
            <div className="mt-3 flex justify-end">
              <button
                className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
                disabled={!canWrite || importedTasks.length === 0}
                onClick={async () => {
                  for (const task of importedTasks) {
                    await addTask(task);
                  }
                  setImportMessage(`已导入 ${importedTasks.length} 个任务`);
                }}
              >
                导入任务
              </button>
            </div>
          </div>
          <DraftPreview
            emptyText="还没有识别到任务。请确认文档里有日期标题和任务列表。"
            tasks={importedTasks}
            title={`识别到 ${importedTasks.length} 个任务`}
          />
        </section>
      ) : null}

      {mode === "adjust" ? (
        <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-lg border border-border-default p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">把新变化插进某一段时间</h2>
                <p className="mt-1 text-xs text-text-muted">
                  适合突然学到新商业模式、临时加项目、要把一组新工作均匀分配到接下来几天。
                </p>
              </div>
              {adjustMessage ? <span className="text-xs text-text-muted">{adjustMessage}</span> : null}
            </div>
            <textarea
              className="min-h-[130px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
              onChange={(event) => setChangeText(event.target.value)}
              value={changeText}
            />
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Field label="开始">
                <input className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm" onChange={(event) => setChangeStart(event.target.value)} type="date" value={changeStart} />
              </Field>
              <Field label="结束">
                <input className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm" onChange={(event) => setChangeEnd(event.target.value)} type="date" value={changeEnd} />
              </Field>
              <Field label="项目名">
                <input className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 text-sm" onChange={(event) => setChangeProject(event.target.value)} value={changeProject} />
              </Field>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
                disabled={!canWrite || adjustmentTasks.length === 0}
                onClick={async () => {
                  for (const task of adjustmentTasks) {
                    await addTask(task);
                  }
                  setAdjustMessage(`已插入 ${adjustmentTasks.length} 个任务`);
                }}
              >
                插入到排期
              </button>
            </div>
          </div>
          <DraftPreview
            emptyText="请选择有效日期范围。"
            tasks={adjustmentTasks}
            title={`将插入 ${adjustmentTasks.length} 个任务`}
          />
        </section>
      ) : null}

      {mode === "decompose" ? (
        <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-lg border border-border-default p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">从目标生成第一版计划</h2>
                <p className="mt-1 text-xs text-text-muted">这是轻量拆解，适合没有现成 Claude 文档时先起草。</p>
              </div>
              {decomposeMessage ? <span className="text-xs text-text-muted">{decomposeMessage}</span> : null}
            </div>
            <textarea
              className="min-h-[150px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
              onChange={(event) => setGoal(event.target.value)}
              value={goal}
            />
            <Field label="目标类型">
              <select
                className="mt-3 h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm"
                onChange={(event) => setGoalType(event.target.value as GoalType)}
                value={goalType}
              >
                <option value="video">视频/内容增长</option>
                <option value="course">课程/产品交付</option>
                <option value="sales">销售/收入目标</option>
                <option value="custom">通用目标</option>
              </select>
            </Field>
            <div className="mt-3 flex justify-end">
              <button
                className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
                disabled={!canWrite}
                onClick={async () => {
                  for (const task of decomposedTasks) {
                    await addTask(task);
                  }
                  setDecomposeMessage(`已创建 ${decomposedTasks.length} 个任务`);
                }}
              >
                创建任务
              </button>
            </div>
          </div>
          <DraftPreview emptyText="写下目标后会生成任务。" tasks={decomposedTasks} title="任务草案" />
        </section>
      ) : null}
    </div>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "flex h-10 items-center gap-2 rounded-md border px-3 text-sm",
        active ? "border-border-strong bg-bg-active" : "border-border-default text-text-muted hover:bg-bg-hover"
      ].join(" ")}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function DraftPreview({ title, tasks, emptyText }: { title: string; tasks: DraftTask[]; emptyText: string }) {
  return (
    <aside className="rounded-lg border border-border-default bg-bg-subtle p-4">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="mt-3 max-h-[620px] space-y-2 overflow-y-auto pr-1">
        {tasks.length === 0 ? <p className="text-sm text-text-muted">{emptyText}</p> : null}
        {tasks.map((task, index) => (
          <article className="rounded-md border border-border-default bg-bg-default px-3 py-2" key={`${task.scheduledDate}-${task.title}-${index}`}>
            <h3 className="line-clamp-2 text-sm font-medium">{task.title}</h3>
            <p className="mt-1 text-xs text-text-muted">
              {task.scheduledDate} {task.scheduledTime} · {task.project || "未归属"} · {task.estimatedMinutes} 分钟
              {task.completed ? " · 已完成" : ""}
            </p>
          </article>
        ))}
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}

function parseMonthlyPlan(input: string, project: string, options: { includeCompleted: boolean }): DraftTask[] {
  const now = new Date();
  let currentDate = today;
  let hasDailyDate = false;
  const tasks: DraftTask[] = [];

  for (const rawLine of input.split(/\r?\n/)) {
    const line = stripMarkdownQuote(rawLine).trim();
    if (!line) continue;

    const headingDate = parseDateHeading(line, now);
    if (headingDate) {
      currentDate = headingDate;
      hasDailyDate = true;
      continue;
    }

    if (!hasDailyDate) continue;

    const parsedLine = normalizeTaskLine(line);
    if (!parsedLine) continue;
    if (!options.includeCompleted && parsedLine.completed) continue;
    if (isLikelyHeading(parsedLine.title)) continue;

    tasks.push({
      title: parsedLine.title,
      project,
      estimatedMinutes: inferMinutes(parsedLine.title),
      priority: inferPriority(parsedLine.title),
      scheduledDate: currentDate,
      scheduledTime: inferTime(parsedLine.title, tasks.filter((task) => task.scheduledDate === currentDate).length),
      completed: parsedLine.completed
    });
  }

  return tasks.slice(0, 300);
}

function buildAdjustmentTasks(input: { changeText: string; startDate: string; endDate: string; project: string }): DraftTask[] {
  const days = enumerateDays(input.startDate, input.endDate).slice(0, 31);
  const themes = ["理解与整理", "映射到现有业务", "改造任务与素材", "执行一个小实验", "记录反馈"];
  const normalized = input.changeText.trim() || "计划变更";

  return days.map((date, index) => ({
    title: `${themes[index % themes.length]}：${normalized.slice(0, 24)}`,
    project: input.project,
    estimatedMinutes: 60,
    priority: index < 2 ? "high" : "normal",
    scheduledDate: date,
    scheduledTime: "10:00"
  }));
}

function buildGoalTasks(goal: string, goalType: GoalType): DraftTask[] {
  const project = deriveProjectName(goal, goalType);
  if (goalType === "video") {
    return Array.from({ length: 4 }, (_, index) => {
      const base = addDays(today, index * 7);
      const label = `第 ${index + 1} 条视频`;
      return [
        task(`${label}：选题与脚本`, project, 120, "key", base, "09:00"),
        task(`${label}：拍摄`, project, 120, "high", addDays(base, 2), "14:00"),
        task(`${label}：剪辑`, project, 180, "high", addDays(base, 4), "09:00"),
        task(`${label}：发布与数据复盘`, project, 45, "normal", addDays(base, 6), "20:00")
      ];
    }).flat();
  }

  if (goalType === "sales") {
    return [
      task("列出 20 个潜在客户", project, 90, "key", today, "09:00"),
      task("写出一版销售私信", project, 60, "high", addDays(today, 1), "10:00"),
      task("完成第一轮 10 个触达", project, 120, "high", addDays(today, 3), "14:00"),
      task("复盘转化并调整报价", project, 90, "key", addDays(today, 7), "09:00")
    ];
  }

  if (goalType === "course") {
    return [
      task("确定课程承诺与大纲", project, 120, "key", today, "09:00"),
      task("完成第一版课件", project, 180, "high", addDays(today, 3), "09:00"),
      task("招募 5 位内测用户", project, 90, "high", addDays(today, 7), "10:00"),
      task("根据内测反馈修订交付", project, 120, "key", addDays(today, 14), "09:00")
    ];
  }

  return [
    task("定义成功标准", project, 60, "key", today, "09:00"),
    task("拆出第一周任务清单", project, 90, "high", addDays(today, 1), "09:00"),
    task("完成第一轮执行", project, 120, "high", addDays(today, 3), "14:00"),
    task("复盘并调整下一步", project, 60, "normal", addDays(today, 7), "09:00")
  ];
}

function parseDateHeading(line: string, now: Date) {
  const normalized = line.replace(/\s+/g, " ");
  const fullDate = normalized.match(/(20\d{2})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})/);
  if (fullDate) return toDateInput(new Date(Number(fullDate[1]), Number(fullDate[2]) - 1, Number(fullDate[3])));

  const monthDay = normalized.match(/(?:^|[#\s🗓️📅—-])(\d{1,2})\s*(?:月|\/)\s*(\d{1,2})\s*[日号]?/);
  if (monthDay) return toDateInput(new Date(now.getFullYear(), Number(monthDay[1]) - 1, Number(monthDay[2])));

  return null;
}

function normalizeTaskLine(line: string) {
  const checkbox = line.match(/^\s*[-*+]\s+\[([ xX])\]\s*(.+)$/);
  if (checkbox) {
    const title = cleanupTaskTitle(checkbox[2]);
    if (!title) return null;
    return { title, completed: checkbox[1].toLowerCase() === "x" };
  }

  const normalized = line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+[.)、]\s*/, "")
    .trim();

  if (!normalized) return null;
  if (/^(周[一二三四五六日天]|星期[一二三四五六日天])$/.test(normalized)) return null;
  if (!/^[-*+\d]/.test(line.trim()) && normalized.length > 40) return null;
  const title = cleanupTaskTitle(normalized);
  if (!title) return null;
  return { title, completed: false };
}

function stripMarkdownQuote(line: string) {
  return line.replace(/^\s*>\s?/, "");
}

function cleanupTaskTitle(title: string) {
  return title
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/[✅⭐⚠️🆕🎯🌅🌞🌤️🌆🌃🌙🌌🛌]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyHeading(line: string) {
  return line.length <= 24 && /(计划|目标|阶段|复盘|安排|任务清单|核心目标|完成标志|标准节奏)$/.test(line);
}

function inferMinutes(title: string) {
  const hour = title.match(/(\d+(?:\.\d+)?)\s*(小时|h)/i);
  if (hour) return Math.round(Number(hour[1]) * 60);
  const minute = title.match(/(\d+)\s*(分钟|分|min)/i);
  if (minute) return Number(minute[1]);
  if (/剪辑|课件|方案|脚本/.test(title)) return 120;
  if (/拍摄|录制/.test(title)) return 90;
  if (/发布|回复|检查|记录/.test(title)) return 30;
  return 60;
}

function inferPriority(title: string): Priority {
  if (/关键|必须|交付|发布|客户|广告|成交/.test(title)) return "high";
  if (/复盘|记录|整理|检查/.test(title)) return "normal";
  return "normal";
}

function inferTime(title: string, indexOfDay: number) {
  if (/晚上|复盘|记录/.test(title)) return "20:00";
  if (/下午|拍摄/.test(title)) return "14:00";
  const hour = Math.min(18, 9 + indexOfDay * 2);
  return `${String(hour).padStart(2, "0")}:00`;
}

function enumerateDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return [];
  const days: string[] = [];
  for (let date = start; date <= end; date = new Date(date.getTime() + 24 * 60 * 60 * 1000)) {
    days.push(toDateInput(date));
  }
  return days;
}

function task(title: string, project: string, estimatedMinutes: number, priority: Priority, scheduledDate: string, scheduledTime: string): DraftTask {
  return { title, project, estimatedMinutes, priority, scheduledDate, scheduledTime };
}

function deriveProjectName(goal: string, goalType: string) {
  const trimmed = goal.trim();
  if (trimmed.length > 0) return trimmed.slice(0, 18);
  return goalType === "video" ? "内容增长计划" : "目标推进计划";
}

function addDays(dateInput: string, days: number) {
  const date = new Date(`${dateInput}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
