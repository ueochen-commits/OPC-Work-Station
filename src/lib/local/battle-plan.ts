import type { Priority } from "@/types/domain";

export interface ParsedBattlePlanTask {
  title: string;
  project?: string;
  estimatedMinutes: number;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  completed?: boolean;
}

const today = new Date().toISOString().slice(0, 10);

export function parseBattlePlanDocument(
  input: string,
  options: { includeCompleted?: boolean; projectName?: string } = {}
) {
  const now = new Date();
  let currentDate = today;
  let hasDailyDate = false;
  const project = options.projectName || inferProjectName(input);
  const tasks: ParsedBattlePlanTask[] = [];

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

  return {
    project,
    tasks: tasks.slice(0, 300)
  };
}

export function looksLikeBattlePlan(input: string) {
  return (
    input.length > 500 &&
    /-\s+\[[ xX]\]/.test(input) &&
    /(\d{1,2}\s*月\s*\d{1,2}\s*[日号]|\d{1,2}\/\d{1,2})/.test(input)
  );
}

function inferProjectName(input: string) {
  const title = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^#\s+/.test(line));
  if (!title) return "导入计划";
  return title.replace(/^#+\s*/, "").replace(/\(.+\)/, "").slice(0, 24) || "导入计划";
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

function isLikelyHeading(line: string) {
  return line.length <= 24 && /(计划|目标|阶段|复盘|安排|任务清单|核心目标|完成标志|标准节奏)$/.test(line);
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
  return "normal";
}

function inferTime(title: string, indexOfDay: number) {
  if (/晚上|复盘|记录/.test(title)) return "20:00";
  if (/下午|拍摄/.test(title)) return "14:00";
  const hour = Math.min(18, 9 + indexOfDay * 2);
  return `${String(hour).padStart(2, "0")}:00`;
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
