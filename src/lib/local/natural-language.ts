import type { Priority } from "@/types/domain";

export interface ParsedLocalTask {
  title: string;
  project?: string;
  estimatedMinutes: number;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  reasoning: string;
  confidence: number;
}

const dayMs = 24 * 60 * 60 * 1000;
const weekDayMap: Record<string, number> = {
  日: 0,
  天: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6
};

export function parseLocalNaturalTask(input: string, existingTaskCount = 0): ParsedLocalTask {
  const normalized = input.trim().replace(/\s+/g, " ");
  const estimatedMinutes = parseDuration(normalized);
  const scheduledDate = parseDate(normalized);
  const scheduledTime = parseTime(normalized, existingTaskCount);
  const priority = parsePriority(normalized);
  const project = parseProject(normalized);
  const title = parseTitle(normalized, project);
  const confidence = title.length >= 3 ? 0.72 : 0.42;

  return {
    title,
    project,
    estimatedMinutes,
    priority,
    scheduledDate,
    scheduledTime,
    reasoning: [
      `识别为快速任务`,
      `时长 ${estimatedMinutes} 分钟`,
      `排到 ${scheduledDate} ${scheduledTime}`,
      `优先级 ${priorityLabel(priority)}`
    ].join(" · "),
    confidence
  };
}

function parseDuration(input: string) {
  const hourMatch = input.match(/(\d+(?:\.\d+)?)\s*(个)?\s*(小时|h|H)/);
  if (hourMatch) return Math.round(Number(hourMatch[1]) * 60);

  const minuteMatch = input.match(/(\d+)\s*(分钟|分|min)/i);
  if (minuteMatch) return Number(minuteMatch[1]);

  if (/整理|回复|检查|确认|沟通|发(个)?/.test(input)) return 30;
  if (/写|录|剪|拍|复盘|方案|脚本/.test(input)) return 90;
  return 60;
}

function parseDate(input: string) {
  const now = new Date();
  if (/后天/.test(input)) return toDateInput(new Date(now.getTime() + 2 * dayMs));
  if (/明天|明日/.test(input)) return toDateInput(new Date(now.getTime() + dayMs));

  const nextWeekMatch = input.match(/下周([日天一二三四五六])/);
  if (nextWeekMatch) return toNextWeekday(now, weekDayMap[nextWeekMatch[1]], true);

  const weekMatch = input.match(/周([日天一二三四五六])/);
  if (weekMatch) return toNextWeekday(now, weekDayMap[weekMatch[1]], false);

  const monthDayMatch = input.match(/(\d{1,2})[月/](\d{1,2})[日号]?/);
  if (monthDayMatch) {
    const date = new Date(now.getFullYear(), Number(monthDayMatch[1]) - 1, Number(monthDayMatch[2]));
    return toDateInput(date);
  }

  return toDateInput(now);
}

function parseTime(input: string, existingTaskCount: number) {
  const exact = input.match(/(\d{1,2})[:：点](\d{1,2})?/);
  if (exact) {
    const hour = exact[1].padStart(2, "0");
    const minute = (exact[2] || "00").padStart(2, "0");
    return `${hour}:${minute}`;
  }

  if (/早上|上午/.test(input)) return "09:00";
  if (/中午/.test(input)) return "12:00";
  if (/下午/.test(input)) return "14:00";
  if (/晚上|今晚/.test(input)) return "19:30";

  const slotHour = Math.min(17, 9 + existingTaskCount);
  return `${String(slotHour).padStart(2, "0")}:00`;
}

function parsePriority(input: string): Priority {
  if (/关键|必须|一定|重要/.test(input)) return "key";
  if (/客户|合作|广告|报价|截止|之前|前|今天|明天/.test(input)) return "high";
  if (/可推迟|不急|有空/.test(input)) return "low";
  return "normal";
}

function parseProject(input: string) {
  const explicit = input.match(/(?:项目|归到|放到|属于)[:： ]?([\u4e00-\u9fa5A-Za-z0-9_-]{2,16})/);
  if (explicit) return explicit[1];

  const partner = input.match(/给([\u4e00-\u9fa5A-Za-z0-9_-]{2,12})(?:发|写|做|交|提)/);
  if (partner) return `${partner[1]}合作`;

  if (/课程|大纲|课/.test(input)) return "新课程开发";
  if (/抖音|小红书|公众号|内容|选题/.test(input)) return "内容矩阵";
  return undefined;
}

function parseTitle(input: string, project?: string) {
  let title = input
    .replace(/下周[日天一二三四五六](之前|前)?/g, "")
    .replace(/周[日天一二三四五六](之前|前)?/g, "")
    .replace(/(明天|明日|后天|今天|今晚|上午|下午|晚上|早上|中午)/g, "")
    .replace(/\d+(?:\.\d+)?\s*(个)?\s*(小时|h|H|分钟|分|min)/gi, "")
    .replace(/\d{1,2}[:：点]\d{0,2}/g, "")
    .replace(/(之前|前|要|需要|帮我|记得|安排|排一下|大概|能搞定|完成)/g, "")
    .trim();

  if (project) title = title.replace(project.replace(/合作$/, ""), "").trim();
  title = title.replace(/^给/, "").replace(/^把/, "").trim();
  if (!title) return input.slice(0, 24);
  return title.length > 24 ? `${title.slice(0, 24)}...` : title;
}

function toNextWeekday(now: Date, targetDay: number, forceNextWeek: boolean) {
  const currentDay = now.getDay();
  let days = targetDay - currentDay;
  if (forceNextWeek) days += 7;
  if (!forceNextWeek && days < 0) days += 7;
  if (!forceNextWeek && days === 0) days = 7;
  return toDateInput(new Date(now.getTime() + days * dayMs));
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function priorityLabel(priority: Priority) {
  return {
    high: "高优",
    key: "关键",
    normal: "普通",
    low: "可推迟"
  }[priority];
}
