import { describe, expect, it } from "vitest";
import { parseLocalNaturalTask } from "@/lib/local/natural-language";
import { parseLocalOutcomeReport } from "@/lib/local/outcome-language";

describe("parseLocalNaturalTask", () => {
  it("extracts a client task with duration and priority", () => {
    const task = parseLocalNaturalTask("下周二前给小米发广告脚本 2 小时", 2);

    expect(task.title).toContain("广告脚本");
    expect(task.project).toBe("小米合作");
    expect(task.estimatedMinutes).toBe(120);
    expect(task.priority).toBe("high");
    expect(task.scheduledTime).toBe("11:00");
  });

  it("uses afternoon slot when user says 下午", () => {
    const task = parseLocalNaturalTask("今天下午整理选题库 60 分钟", 0);

    expect(task.project).toBe("内容矩阵");
    expect(task.estimatedMinutes).toBe(60);
    expect(task.scheduledTime).toBe("14:00");
  });
});

describe("parseLocalOutcomeReport", () => {
  it("extracts multiple outcome metrics from one sentence", () => {
    const report = parseLocalOutcomeReport("抖音今天播放 4.2 万，点赞 1500，涨粉 80");

    expect(report.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: "抖音", metricKey: "播放", metricValue: 42000 }),
        expect.objectContaining({ platform: "抖音", metricKey: "点赞", metricValue: 1500 }),
        expect.objectContaining({ platform: "抖音", metricKey: "涨粉", metricValue: 80 })
      ])
    );
  });
});
