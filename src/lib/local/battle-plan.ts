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

export function parseBattlePlanDocument(
  input: string,
  options: { includeCompleted?: boolean; projectName?: string; baseDate?: Date } = {}
) {
  const now = options.baseDate || new Date();
  let currentDate = toDateInput(now);
  let hasDailyDate = false;
  const fallbackProject = options.projectName || inferProjectName(input);
  let currentBlock: { start: string; end: string; title: string; project: string; taskIndex: number } | null = null;
  const tasks: ParsedBattlePlanTask[] = [];

  for (const rawLine of input.split(/\r?\n/)) {
    const line = stripMarkdownQuote(rawLine).trim();
    if (!line) continue;

    const headingDate = parseDateHeading(line, now);
    if (headingDate) {
      currentDate = headingDate;
      hasDailyDate = true;
      currentBlock = null;
      continue;
    }

    if (!hasDailyDate) continue;

    const timeBlock = parseTimeBlockHeading(line);
    if (timeBlock) {
      currentBlock = {
        ...timeBlock,
        project: inferProjectFromText(timeBlock.title) || fallbackProject,
        taskIndex: 0
      };
      continue;
    }

    const parsedLine = normalizeTaskLine(line);
    if (!parsedLine) continue;
    if (!options.includeCompleted && parsedLine.completed) continue;
    if (isLikelyHeading(parsedLine.title)) continue;

    const scheduledTime = currentBlock
      ? addMinutesToTime(currentBlock.start, currentBlock.taskIndex * 45)
      : inferTime(parsedLine.title, tasks.filter((task) => task.scheduledDate === currentDate).length);
    const estimatedMinutes = inferMinutes(parsedLine.title, currentBlock);

    tasks.push({
      title: parsedLine.title,
      project: inferProjectFromText(parsedLine.title) || currentBlock?.project || fallbackProject,
      estimatedMinutes,
      priority: inferPriority(parsedLine.title),
      scheduledDate: currentDate,
      scheduledTime,
      completed: parsedLine.completed
    });
    if (currentBlock) currentBlock.taskIndex += 1;
  }

  return {
    project: fallbackProject,
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
  const fullDate = normalized.match(/(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?/);
  if (fullDate) return toDateInput(new Date(Number(fullDate[1]), Number(fullDate[2]) - 1, Number(fullDate[3])));

  const slashDate = normalized.match(/(20\d{2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})/);
  if (slashDate) return toDateInput(new Date(Number(slashDate[1]), Number(slashDate[2]) - 1, Number(slashDate[3])));

  const monthDay = normalized.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]/);
  if (monthDay) return toDateInput(new Date(now.getFullYear(), Number(monthDay[1]) - 1, Number(monthDay[2])));

  const slashMonthDay = normalized.match(/(?:^|[#\s🗓️📅—-])(\d{1,2})\/(\d{1,2})(?:\D|$)/);
  if (slashMonthDay) return toDateInput(new Date(now.getFullYear(), Number(slashMonthDay[1]) - 1, Number(slashMonthDay[2])));

  return null;
}

function parseTimeBlockHeading(line: string) {
  const normalized = cleanupTaskTitle(line.replace(/^#{1,6}\s*/, ""));
  const match = normalized.match(/(\d{1,2})[:：](\d{2})\s*(?:-|—|–|~|到)\s*(\d{1,2})[:：](\d{2})\s*(.*)$/);
  if (!match) return null;

  const start = `${match[1].padStart(2, "0")}:${match[2]}`;
  const end = `${match[3].padStart(2, "0")}:${match[4]}`;
  const title = cleanupTaskTitle(match[5] || "时间块");
  return { start, end, title };
}

function inferProjectFromText(text: string) {
  if (/港股|美股|早交易|盘前|挂单|自营盈利/i.test(text)) return "交易";
  if (/TradeGrail|交易日志|记录交易|交易品种|交易所|R-Multiple|心态风控|AI 智能复盘/i.test(text)) return "TradeGrail";
  if (/交易/i.test(text)) return "交易";
  if (/lurenclass|录播课|课程/i.test(text)) return "lurenclass 录播课";
  if (/社区|小程序|内测群/.test(text)) return "付费社区";
  if (/公众号|文章|W\d|深度文/.test(text)) return "公众号内容";
  if (/自媒体|视频|V\d|拍摄|剪辑|发布/.test(text)) return "自媒体视频";
  if (/BIP|朋友圈|即刻|微博|小红书|抖音|B 站|B站/.test(text)) return "内容分发";
  if (/北弧|广告|商单/.test(text)) return "品牌合作";
  if (/助理|招聘|面试/.test(text)) return "组织建设";
  if (/复盘|思考/.test(text)) return "复盘";
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

function inferMinutes(title: string, currentBlock?: { start: string; end: string } | null) {
  const hour = title.match(/(\d+(?:\.\d+)?)\s*(小时|h)/i);
  if (hour) return Math.round(Number(hour[1]) * 60);
  const minute = title.match(/(\d+)\s*(分钟|分|min)/i);
  if (minute) return Number(minute[1]);
  if (currentBlock) return Math.min(90, Math.max(30, Math.round(timeRangeMinutes(currentBlock.start, currentBlock.end) / 3)));
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

function timeRangeMinutes(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return Math.max(30, endHour * 60 + endMinute - (startHour * 60 + startMinute));
}

function addMinutesToTime(time: string, minutes: number) {
  const [hour, minute] = time.split(":").map(Number);
  const total = Math.min(23 * 60 + 30, hour * 60 + minute + minutes);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
