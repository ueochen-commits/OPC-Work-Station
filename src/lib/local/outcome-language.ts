export interface ParsedOutcomeMetric {
  platform: string;
  metricKey: string;
  metricValue: number;
}

const knownPlatforms = ["抖音", "小红书", "公众号", "B站", "B 站", "视频号", "微博"];
const metricWords = ["播放", "播放量", "阅读", "阅读量", "点赞", "赞", "涨粉", "粉丝", "关注", "在看", "收藏", "评论", "转发"];

export function parseLocalOutcomeReport(input: string) {
  const normalized = input.trim().replace(/，/g, ",").replace(/、/g, ",").replace(/\s+/g, " ");
  const metricDate = parseMetricDate(normalized);
  const metrics: ParsedOutcomeMetric[] = [];
  let currentPlatform = findFirstPlatform(normalized) || "默认平台";

  for (const chunk of normalized.split(/[,;；。]/).map((item) => item.trim()).filter(Boolean)) {
    const platform = findFirstPlatform(chunk);
    if (platform) currentPlatform = platform;

    const chunkMetrics = extractMetrics(chunk, currentPlatform);
    metrics.push(...chunkMetrics);
  }

  return {
    metricDate,
    metrics: mergeDuplicateMetrics(metrics),
    confidence: metrics.length > 0 ? 0.78 : 0.25,
    reasoning: metrics.length > 0 ? `识别到 ${metrics.length} 条运营指标` : "没有识别到明确指标"
  };
}

function extractMetrics(chunk: string, platform: string): ParsedOutcomeMetric[] {
  const results: ParsedOutcomeMetric[] = [];

  for (const metricKey of metricWords) {
    const escaped = metricKey.replace(/\s+/g, "\\s*");
    const after = new RegExp(`${escaped}\\s*([+\\-]?\\d+(?:\\.\\d+)?\\s*(?:万|千|w|k)?)`, "i").exec(chunk);
    const before = new RegExp(`([+\\-]?\\d+(?:\\.\\d+)?\\s*(?:万|千|w|k)?)\\s*${escaped}`, "i").exec(chunk);
    const match = after || before;

    if (match) {
      results.push({
        platform: normalizePlatform(platform),
        metricKey: normalizeMetricKey(metricKey),
        metricValue: parseChineseNumber(match[1])
      });
    }
  }

  return results;
}

function parseMetricDate(input: string) {
  const now = new Date();
  if (/昨天/.test(input)) {
    now.setDate(now.getDate() - 1);
  } else if (/前天/.test(input)) {
    now.setDate(now.getDate() - 2);
  }
  return toDateInput(now);
}

function findFirstPlatform(input: string) {
  return knownPlatforms.find((platform) => input.includes(platform));
}

function parseChineseNumber(input: string) {
  const compact = input.replace(/\s+/g, "").toLowerCase();
  const number = Number.parseFloat(compact);
  if (!Number.isFinite(number)) return 0;
  if (compact.includes("万") || compact.includes("w")) return Math.round(number * 10000);
  if (compact.includes("千") || compact.includes("k")) return Math.round(number * 1000);
  return number;
}

function normalizePlatform(platform: string) {
  if (platform === "B 站") return "B站";
  return platform;
}

function normalizeMetricKey(metricKey: string) {
  if (metricKey === "播放量") return "播放";
  if (metricKey === "阅读量") return "阅读";
  if (metricKey === "赞") return "点赞";
  if (metricKey === "粉丝") return "涨粉";
  return metricKey;
}

function mergeDuplicateMetrics(metrics: ParsedOutcomeMetric[]) {
  const map = new Map<string, ParsedOutcomeMetric>();
  for (const metric of metrics) {
    map.set(`${metric.platform}:${metric.metricKey}`, metric);
  }
  return Array.from(map.values());
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
