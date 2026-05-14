"use client";

import { useLocalWorkspace } from "@/lib/local/tasks";

export default function SettingsPage() {
  const { settings, setSettings } = useLocalWorkspace();

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">个人工作偏好</p>
        <h1 className="text-[28px] font-semibold leading-tight">设置</h1>
      </header>

      <section className="max-w-[640px] space-y-4 rounded-lg border border-border-default p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-text-muted">每日产能</span>
          <select
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) =>
              setSettings((current) => ({ ...current, dailyCapacityMinutes: Number(event.target.value) }))
            }
            value={settings.dailyCapacityMinutes}
          >
            <option value={180}>3 小时</option>
            <option value={240}>4 小时</option>
            <option value={360}>6 小时</option>
            <option value={480}>8 小时</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-text-muted">每日回报时间</span>
          <input
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setSettings((current) => ({ ...current, dailyReportTime: event.target.value }))}
            type="time"
            value={settings.dailyReportTime}
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-md border border-border-default px-3 py-2">
          <span>
            <span className="block text-sm font-medium">显示 AI 解析过程</span>
            <span className="text-xs text-text-muted">用于调试输入习惯，默认关闭。</span>
          </span>
          <input
            checked={settings.showAiReasoning}
            onChange={(event) =>
              setSettings((current) => ({ ...current, showAiReasoning: event.target.checked }))
            }
            type="checkbox"
          />
        </label>
      </section>

      <section className="mt-5 max-w-[640px] rounded-lg border border-border-default bg-bg-subtle p-4">
        <h2 className="mb-1 text-sm font-medium">订阅</h2>
        <p className="text-sm text-text-muted">
          XORPAY 接入后，这里会展示 14 天试用、基础版 / 专业版、续费提醒和支付订单状态。
        </p>
      </section>
    </div>
  );
}
