import { describe, expect, it } from "vitest";
import { parseBattlePlanDocument } from "@/lib/local/battle-plan";
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

describe("parseBattlePlanDocument", () => {
  it("extracts dates, projects, and time blocks from a battle plan", () => {
    const plan = parseBattlePlanDocument(`
# 路人 5 月作战清单

## 🗓️ 5 月 14 日(周四)— TradeGrail 重构 + 录播课模块二

### 🌞 9:00-12:00 TradeGrail 业务逻辑重构 1 + 新手引导关键

- [ ] 任务 8:"你想从哪里开始" 前增加 交易品种选择卡片
- [ ] 任务 9:品种字段动态显示

### 🌅 17:00-19:00 录播课模块二

- [ ] 第 2-1 节:三大模型怎么选(30 分钟)
- [x] 第 2-2 节:提示词工程(30 分钟)
`, { baseDate: new Date(2026, 4, 14) });

    expect(plan.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: '任务 8:"你想从哪里开始" 前增加 交易品种选择卡片',
          project: "TradeGrail",
          scheduledDate: "2026-05-14",
          scheduledTime: "09:00"
        }),
        expect.objectContaining({
          title: "第 2-1 节:三大模型怎么选(30 分钟)",
          project: "lurenclass 录播课",
          scheduledDate: "2026-05-14",
          scheduledTime: "17:00",
          estimatedMinutes: 30
        })
      ])
    );
    expect(plan.tasks.some((task) => task.title.includes("提示词工程"))).toBe(false);
  });
});
