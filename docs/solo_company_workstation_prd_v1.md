# 一人公司任务工作站 v1 · PRD

> **Version**: 1.1
> **Last updated**: 2026-05-14
> **代号**: 任务专家 (Task Specialist)
> **文档目标**: 提供完整、可执行的产品规格说明，可直接交付给 Claude Code / Cursor 进行开发，或交付给独立开发者实施。

## 变更记录

### v1.1（2026-05-14）— 基于产品评审的增强

新增内容：

1. **§3.1.6** 智能输入框首次使用引导：placeholder 轮播、快捷模板 chip、AI 解析过程开关、第三次失败的主动救援
2. **§3.1.7** AI 兜底表单：失败降级的完整表单设计
3. **§3.1.8** 目标拆解默认草稿模式：拆解结果不直接排程，先存为草稿供用户审阅
4. **§3.2.2** 级联调整重做：人在回路确认 + 24h 撤销机制 + 透明度报告
5. **§3.3.4** 轻日模式：低能量日的产能减半、暂停模式、今日心情备注
6. **§3.4.3** 项目任务多视图：列表 + 看板双视图
7. **§3.5.1.1** 漏报宽限：48h 内补报 + 周末一键补报 + 周报完整性提醒
8. **§3.5.2** 周复盘视图重组：用户自评放最前 + AI 洞察排后 + 系统调整透明度模块
9. **§3.7** 任务详情页（新增）：历史、链接附件、备注、完成回顾
10. **§3.8** 付费订阅（新增）：v1 即收费、14 天免费试用、XORPAY 集成、配额管控
11. **§3.9** 邀请推荐与对外分享（新增）：邀请码、邀请奖励、周复盘可分享卡片

相关同步更新：

- **§1.5** v1 边界更新（含新功能与对应排除项）
- **§1.6** 商业模型（新增）
- **§3.6.3** 设置页板块扩展
- **§5.2** API 端点扩充（新增订阅、邀请、分享、撤销、草稿等约 30 个端点）
- **§6.5** Goal Decomposition Phase 2 prompt 调整为草稿输出模式
- **§9.x** 开发周期从 8 周延长至 10 周

### v1.0（2026-05-14）— 初版

基础 PRD（智能输入、调度引擎、今日 / 项目 / 复盘视图、用户系统、UI 规范、技术栈、开发计划）

---

## 0. 文档使用说明

本 PRD 为产品 v1 的开发规格。文档版本号可随评审迭代递增，但产品范围以 §1.5 为准：§1.5.1 列入的能力属于 v1 必做；任何明确标注为“v1.1+ / 后续版本”的能力，v1 不实施。

### 0.1 阅读顺序建议

| 角色 | 必读章节 |
|---|---|
| 全栈开发 | 全部 |
| 前端开发 | 1, 2, 3, 7 |
| 后端开发 | 1, 3, 4, 5, 6, 8 |
| 产品/项目管理 | 1, 2, 3, 9 |

### 0.2 术语表

- **任务 (Task)**: 用户具体要做的一件事，可独立排程
- **项目 (Project)**: 多个相关任务的集合，通常持续数周到数月
- **里程碑 (Milestone)**: 项目中可衡量的关键节点
- **调度引擎 (Scheduling Engine)**: 自动将任务排入合适时间块的算法
- **级联调整 (Cascade Adjustment)**: 一个任务变动时，自动重排所有受影响的下游任务
- **产能预算 (Capacity Budget)**: 用户每日可用于工作的总时长，单位分钟

---

## 1. 产品概述

### 1.1 产品定位

一款面向一人公司主理人、自由职业者、独立创作者的智能任务管理 SaaS。

与通用待办清单工具（滴答清单、TickTick）和团队协作工具（Notion、Linear、Asana）的差异：**本产品聚焦执行层**——用户在任何 AI 工具（ChatGPT、Claude、DeepSeek 等）规划出的目标、计划、任务，都可通过自然语言、语音、粘贴文本三种方式输入本产品，由内置 AI 调度引擎自动解析、拆解、排程、追踪。

### 1.2 一句话定位

> 别的 AI 给你计划，我把计划变成今天的下一步。

### 1.3 目标用户画像

**主要用户**:
- 知识类自媒体创作者（视频博主、公众号作者、播客主）
- 独立咨询师 / 教练 / 培训师
- 副业经营者（有主业 + 第二条收入线）
- 小型工作室创始人（1-3 人）

**用户特征**:
- 跨多个业务领域同时工作（内容、销售、合作、服务等）
- 时间被严重碎片化，无固定工作时段
- 已习惯使用 AI 工具做思考与规划
- 对工具的"克制"敏感，反感堆砌功能

**典型痛点**:
- 同时管理 3-8 个长周期项目，进度不可见
- 每日 5-15 件不同领域的任务，靠脑力调度，频繁遗漏
- 任务变动时需手动调整后续日程，耗费心力
- 缺乏对账号数据、销售数据的系统性追踪与反思

### 1.4 核心价值主张

1. **零摩擦输入**：自然语言 / 语音 / 粘贴三种方式，无需思考分类
2. **智能排程**：任务自动找到合适的时间块，依赖关系自动维护
3. **级联调整**：任务变动时下游任务自动顺延，无需手动操作
4. **闭环复盘**：每日 30 秒数据回报 + 每周 AI 关联洞察

### 1.5 v1 范围边界

#### 1.5.1 v1 包含

**核心功能**：
- 智能输入框（自然语言 / 语音 / 粘贴）+ 首次使用引导 + AI 失败兜底表单
- AI 调度引擎（解析、拆解、排程、级联）
- 任务级联调整（人在回路 + 24h 撤销）
- 今日视图 + 轻日模式
- 项目视图（列表 + 看板双视图）
- 任务详情页（含历史、备注、附件链接）
- 复盘视图（每日数据 + 漏报宽限 + 用户自评 + AI 洞察）
- 用户系统（注册、登录、设置）
- 响应式 Web + PWA

**商业与增长**：
- 14 天免费试用 + 付费订阅（XORPAY，¥68-128/月）
- 邀请推荐机制（邀请奖励）
- 周复盘可分享卡片（脱敏后对外展示）

#### 1.5.2 v1 不包含

- CRM、客户管理、销售漏斗
- 营销自动化、内容资产库
- 客服系统、工单系统
- 财务、收入流水、对账
- 多人协作、团队功能
- 原生移动 App（iOS / Android）
- 第三方平台 API 集成（抖音、小红书、微信等）
- 站内消息、社区功能
- 浏览器扩展
- 任务子任务（v1.1+）
- Email-to-task（v1.1+）
- 项目甘特视图（v1.1+，v1 仅列表 + 看板）

### 1.6 商业模型

v1 即采用付费试用模式，**不做 freemium**。

**核心理由**：
- 免费用户对工具容忍度低、反馈质量差、AI 成本压力大
- 付费筛选出真实需求的用户，反馈密度高
- 避免 v1.x 切付费时用户激烈反弹
- 强迫产品从第一天就证明价值

**定价方案**：
- **基础版** ¥68/月（年付 ¥680，相当于 ¥56.7/月）
- **专业版** ¥128/月（年付 ¥1280）—— 增加：更高 AI 调用配额、优先客服、未来 B 端协作功能预留席位
- **免费试用**：14 天，无需绑卡；到期后用户需主动付费，未付费则进入只读模式

**配额设计**：
- 基础版：每日 AI 调用 50 次 / 任务总数无上限 / 项目 ≤ 10
- 专业版：每日 AI 调用 200 次 / 不限项目

详细付费流程见章节 3.9。

---

## 2. 核心用户场景

### 2.1 场景一：快速任务输入

**触发**: 用户在做其他事情时突然想起一件待办

**流程**:
1. 用户按下全局快捷键 `Cmd + K`（Mac）/ `Ctrl + K`（Win/Linux）
2. 智能输入框弹出（无遮罩、半透明背景）
3. 用户输入："下周二之前要给小米发个广告脚本，大概 2 小时能搞定"
4. AI 实时识别并显示解析结果
5. AI 显示排程建议
6. 用户按 `Enter` 确认或编辑后确认
7. 输入框关闭

**关键指标**: 全流程 ≤ 15 秒，AI 解析 ≤ 3 秒

**异常处理**:
- AI 超时（> 8 秒）：弹出"切换为表单输入"按钮
- 用户取消（Esc）：保留输入框文本到草稿箱，下次打开恢复
- 解析置信度低（< 0.6）：主动追问

### 2.2 场景二：目标拆解

**触发**: 用户输入超过 30 字、包含时间跨度（"半年内"、"年底前"）或货币 / 数量目标（"5 万"、"涨粉 1 万"）的描述

**流程**:
1. 用户输入："我想下半年月销稳定到 5 万，主要靠课程销售"
2. AI 识别为 `goal_decomposition`，启动澄清对话
3. AI 提出 3 个关键问题（不超过 3 个）
4. 用户回答
5. AI 生成三层拆解方案（阶段目标 → 支撑项目 → 本周任务）
6. 用户操作：确认排入 / 想保守一点 / 调整周节奏 / 重新拆解

**关键指标**:
- 澄清问题数 ≤ 3
- 拆解方案生成 ≤ 8 秒
- 本周任务数 4-8 个

### 2.3 场景三：粘贴外部计划

**触发**: 用户粘贴超过 200 字的多任务文本（通常来自 ChatGPT / Claude 等）

**流程**:
1. 用户在输入框粘贴文本
2. AI 识别为 `bulk_import`
3. AI 解析出 N 个任务的标题、时长、推荐排期
4. 弹出"批量确认"视图（任务列表 + 时间线预览）
5. 用户可批量编辑（删除、调整时间、合并）
6. 确认后一次性排入日程

**关键指标**: 30 个任务 ≤ 20 秒解析完成

### 2.4 场景四：任务级联调整

**触发**: 用户标记任务为"未完成-顺延"

**流程**:
1. 用户在今日视图，长按或右键任务，选择"顺延"
2. 系统：
   - 将任务移至明日同一时间段或下一个空档
   - BFS 找出所有依赖该任务的下游任务
   - 一并顺延，重新排程
   - 检查硬截止冲突
3. 顶部显示"已自动重排 N 个任务"提醒条

**关键指标**: 级联调整 ≤ 2 秒（含数据库写入）

### 2.5 场景五：每日数据回报

**触发**: 每日 20:00 系统主动推送（用户可改时间）

**流程**:
1. 用户接到 Web Push / 邮件提醒
2. 点击进入"今日复盘"页（或直接打开输入框）
3. 按住麦克风：「抖音今天播放 4 万 2 千、点赞 1500、涨粉 80，公众号阅读 3200」
4. AI 解析并按平台 / 指标分组展示
5. 用户确认提交

**关键指标**:
- 单次回报 ≤ 30 秒
- AI 解析准确率 ≥ 90%（人工抽检评估）

### 2.6 场景六：周复盘查看

**触发**: 每周一 09:00 系统自动生成上周报告

**流程**:
1. 周一早上推送"上周复盘已生成"通知
2. 用户进入复盘视图
3. 阅读：任务完成情况 + 运营数据 + AI 关联洞察
4. 可点击洞察 → 生成相关任务直接排入

**关键指标**:
- 周报生成 ≤ 15 秒
- 用户阅读完成率 ≥ 60%（Mixpanel 埋点）

---

## 3. 功能详情

### 3.1 智能输入框

#### 3.1.1 调用方式

| 方式 | 平台 |
|---|---|
| 全局快捷键 `Cmd/Ctrl + K` | 桌面端 Web / PWA |
| 底部悬浮按钮 | 移动端 |
| 各页面右下角按钮 | 全部 |

#### 3.1.2 输入模式

| 模式 | 触发 |
|---|---|
| 文字输入 | 直接键入 |
| 粘贴文本 | `Ctrl/Cmd + V` |
| 语音输入 | 按住麦克风按钮（或按住空格） |

#### 3.1.3 处理流程

```
用户输入完成
    ↓
POST /api/parse {input: "..."}
    ↓
后端调用 DeepSeek 做 intent classification
    ↓
分发到对应 parser
    ↓
返回结构化结果
    ↓
前端展示确认 UI
```

#### 3.1.4 UI 状态机

```
idle → typing → submitting → confirming → success
              ↓
            error → idle (allow retry)
```

#### 3.1.5 性能要求

- 输入框打开 ≤ 100ms
- AI 解析 ≤ 5 秒（P95）
- 解析失败时自动降级为表单输入

#### 3.1.6 首次使用引导（关键 UX）

**问题背景**：自由输入框对小白用户是 UX 灾难——用户打开后会愣住，不知道说什么、用什么语气、能力边界在哪里。这是产品最大的初次体验风险，必须用以下机制化解：

**A. Placeholder 示例轮播**

输入框为空时，placeholder 每 3 秒切换一次，循环展示典型用法：

```
试试说：明天上午写个广告脚本
试试说：下半年月销做到 5 万
试试粘贴：从 ChatGPT 复制的计划
试试说：把昨天那个任务移到周三
试试说：抖音今天播放 4 万 涨粉 80
```

切换以淡入淡出（150ms fade）方式，不要卡通弹跳。

**B. 快捷模板 Chip**

输入框聚焦但未输入时，下方显示 5 个 chip 按钮：

```
[快速任务]  [拆解目标]  [批量导入]  [记数据]  [改任务]
```

点击任一 chip 会在输入框预填一个引导句，比如点「拆解目标」预填 `我想[在某时间]达到[某目标]`，光标定位到 `[在某时间]` 让用户填空。

Chip 用 `--bg-muted` 底色，`--text-muted` 文字，无图标。点击后 chip 集体消失，输入框进入正常输入态。用户输入超过 3 个字后 chip 也自动消失。

**C. "显示 AI 理解过程"开关**

设置页提供一个开关：`显示 AI 解析过程`（默认关闭）。打开后，每次输入提交后，确认 UI 顶部会显示一段 AI 解析的思考过程（比如「我把这条理解为快速任务，因为它包含具体动词和时间词…」）。

此开关用于：
- 用户多次失败时建立对系统的信任
- 用户想学习如何更准确地表达
- 高级用户调试自己的输入习惯

**D. 第三次失败的主动救援**

如果用户在同一会话内 AI 解析失败累计 3 次（确信度 < 0.5 或用户点击"重新理解"），系统主动弹出引导：

```
看起来 AI 不太理解你的意思。试试这样表达：

→ 想加任务：「[做什么] + [什么时候] + [大概多久]」
   例：写广告脚本 + 周五前 + 2 小时

→ 想拆目标：「[在某时间] 想达到 [某数字/状态]」
   例：年底前 涨粉 1 万

→ 想记数据：「[平台] + [数字] + [指标名]」
   例：抖音 4 万 播放
```

#### 3.1.7 AI 兜底表单（失败降级）

**触发条件**（任一满足即降级）：
- DeepSeek API 调用失败且重试也失败
- AI 解析结果置信度 < 0.4
- 用户主动点击"切换为表单输入"
- 用户已连续 2 次"重新理解"仍未满意

**兜底表单设计**：

```
┌────────────────────────────────────────┐
│ AI 暂时没理解你，请手动填一下           │
│                                         │
│ 任务标题 *                              │
│ [____________________________________] │
│ ↑ 已自动填入你的原始输入                │
│                                         │
│ 所属项目                                │
│ [选择项目 ▼]    [+ 新建]               │
│                                         │
│ 预估时长                                │
│ [30][60][90][120] 分钟  自定义[__]      │
│                                         │
│ 优先级                                  │
│ ○ 高优  ● 普通  ○ 关键  ○ 可推迟       │
│                                         │
│ 截止日期（可空）                        │
│ [选择日期]                              │
│                                         │
│ 排到什么时候                            │
│ ● 让系统自动找空档                      │
│ ○ 我自己指定时间 [日期] [时段]          │
│                                         │
│ [取消]              [创建]              │
└────────────────────────────────────────┘
```

**字段映射规则**：
- 用户原始输入文本预填到「任务标题」字段，整体可编辑
- 系统在背后仍调用 AI 尝试部分提取（哪怕置信度低），把能解析的字段预填
- 用户看到的是「预填表单」而非「空白表单」，降低填写负担

**降级后的引导**：表单底部有一行小字提示：「下次试试这样表达：『[根据本次输入分类生成的最佳示例]』」，把失败转化为学习机会。

#### 3.1.8 目标拆解：默认草稿模式（重要交互修正）

**问题背景**：原设计中 AI 拆解完目标会直接把任务排进未来 12 周的日程，这个动作过重——用户可能只是想"想一下"，并未准备好 commit。

**修正后流程**：

1. AI 完成拆解后，结果默认保存为 `decomposition_drafts` 表的一条草稿，**不写入任何 task 表**
2. 拆解结果展示为可编辑文档（类似 Notion doc 的轻量编辑器），用户可以：
   - 修改任何阶段、项目、任务的描述
   - 删除不想要的任务
   - 添加补充的任务
   - 回头反复查看修改
3. 用户审阅后选择动作：
   - **全部排入日程**：所有 this_week_tasks 走调度引擎，写入 tasks 表
   - **挑选排入**：勾选要排入的任务（默认全选），仅勾中的写入
   - **仅保存为参考**：不创建任何任务，草稿可在「草稿箱」回头查看
   - **丢弃**：删除草稿

**数据模型补充**：

```sql
create table public.decomposition_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  original_goal text not null,
  clarification_qa jsonb,
  decomposition_result jsonb not null,
  status text not null default 'draft' check (status in ('draft','partial_committed','fully_committed','discarded')),
  committed_task_ids uuid[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_drafts_user on public.decomposition_drafts (user_id, created_at desc);
```

---

### 3.2 调度引擎

调度引擎是产品的核心 IP，建议抽象为独立的 Supabase Edge Function。

#### 3.2.1 排程算法

**输入**: 一个或多个待排程任务 + 当前用户的日历状态 + 用户偏好

**核心逻辑**:

```
1. 按 (硬截止升序, 优先级降序) 排序待排任务
2. 对每个任务:
   a. 确定可用日期窗口 [created_at, hard_deadline)
   b. 在日期窗口内找连续空档 ≥ estimated_minutes
   c. 偏好规则:
      - 高优 / 创造性任务 → 上午 (09:00-12:00)
      - 事务性任务 → 下午 (14:00-18:00)
      - 同 category 任务尽量聚集
   d. 检查依赖前置任务是否已排在更早时间，若否则跳过此空档
   e. 留 buffer: 实际占用时长 = estimated_minutes × completion_rate_buffer
3. 写入 scheduled_start / scheduled_end
4. 任何无法排入的任务标记为 status='pending' 并记录原因
```

**约束**:
- 每日总排程时长 ≤ `user.daily_capacity_minutes`
- 不跨越用户设置的工作时段
- 每日预留 15-20% 缓冲时间

#### 3.2.2 级联调整逻辑（人在回路 + 撤销）

**核心设计原则**：用户必须感觉自己**控制着系统**，而不是被系统不断改动日程。任何会同时影响 2 个以上任务的级联，都必须有用户确认 + 24h 撤销能力。

**触发时机**:
- 任务被标记为 `postponed`
- 用户手动改时间
- 新增高优先级任务挤压

**用户操作选项（关键）**:

当用户点击"未完成"或"顺延"时，弹出操作选择器，不直接执行：

```
┌─────────────────────────────────────┐
│ 「拍摄脚本」没完成，怎么处理？        │
│                                      │
│ ○ 推迟到明天，依赖任务不动           │
│ ○ 推迟到明天 + 顺延 3 个依赖任务     │
│   （视频剪辑、视频发布、推广）        │
│ ● 我来选具体日期    [选择日期]       │
│ ○ 这件事不做了，删除                 │
│                                      │
│ □ 同时降低本任务优先级               │
│                                      │
│ [取消]                    [确认]    │
└─────────────────────────────────────┘
```

**关键约束**：
- 选项默认不勾选"连带顺延"，因为这是破坏性更强的动作
- 显示连带任务时要列出标题，让用户知道会动哪些
- 用户确认前不写入数据库

**级联执行算法**:

```python
def cascade_reschedule(changed_task_id, mode='isolated', user_confirmed=False):
    """
    mode:
      - 'isolated'    : 只移这一个任务
      - 'cascade'     : 连带顺延所有下游
      - 'manual_date' : 用户手动指定日期
    """
    # 1. 计算将要发生的变化（dry run，不写库）
    plan = compute_changes(changed_task_id, mode)

    # 2. 检查硬截止冲突
    conflicts = [t for t in plan if t.new_end > t.hard_deadline]

    # 3. 如果未确认，返回 plan 给前端展示确认 UI
    if not user_confirmed:
        return {
            'plan': plan,
            'conflicts': conflicts,
            'requires_confirmation': len(plan) > 1 or len(conflicts) > 0
        }

    # 4. 确认后写库 + 记录撤销点
    undo_snapshot = create_undo_snapshot(plan)

    for task_change in topological_sort(plan):
        update_task(task_change.task_id, task_change.new_slot)

    log_scheduling_event('cascade', affected_ids=plan.task_ids,
                         metadata={'undo_id': undo_snapshot.id, 'mode': mode})

    return {'success': True, 'undo_id': undo_snapshot.id, 'expires_at': '+24h'}
```

**撤销机制**:

```sql
create table public.undo_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  action_type text not null,
  before_state jsonb not null,  -- 修改前所有受影响任务的完整快照
  affected_task_ids uuid[] not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_undo_user_active on public.undo_snapshots (user_id, expires_at)
  where used = false;
```

执行级联后，今日视图顶部显示 24 小时倒计时提醒条：

```
已重排 3 个任务  [查看详情]  [撤销 (23:58 内有效)]
```

**透明度报告**:

每周复盘视图增加一个"系统调整记录"模块，列出过去一周内：
- 用户主动改了多少次任务
- 系统建议级联调整多少次（用户接受/拒绝比例）
- 撤销了多少次

这个透明度报告是建立用户信任的关键——让用户看见系统**没有偷偷改东西**。

#### 3.2.3 历史产能学习

- 每日 23:59 通过 cron job 计算当日"实际完成总时长 / 计划总时长"
- 每周日 23:59 计算过去 4 周的完成率均值，更新 `user_profiles.completion_rate_avg`
- 未来排程时，AI 自动用此完成率为 buffer 系数

#### 3.2.4 关键边界情况

| 情况 | 处理 |
|---|---|
| 任务时长 > 单日剩余产能 | 询问用户是否拆分为多个 session |
| 硬截止已过 | 拒绝排入，提示用户更新截止时间或取消 |
| 循环依赖（A→B→A） | 拒绝建立依赖，返回错误 |
| 用户工作时段为 0（出差/放假） | 自动跳过此天 |
| 用户预算被排满（≥ 100%） | 提示砍任务或加班，不强制塞 |
| 撤销窗口已过期（>24h） | 不允许撤销，但记录在事件日志可手动恢复 |

---

### 3.3 今日视图

#### 3.3.1 页面布局

```
┌─────────────────────────────────────────┐
│ 顶部栏                                    │
│ ┌────────┬──────────┬──────────────────┐ │
│ │ 5月14日 │ 产能 6h  │ 已排 5.5h (92%) │ │
│ │ 周四    │           │                 │ │
│ └────────┴──────────┴──────────────────┘ │
├─────────────────────────────────────────┤
│ [智能提醒条 - 仅当有事件时显示]            │
│ "调度引擎已自动重排 3 个任务" [查看]      │
├─────────────────────────────────────────┤
│ 时间块清单                                │
│                                          │
│ 09:00 ────────────────────────────────  │
│   ▢ 写公众号文章                          │
│     内容创作 · 90 分钟 · 高优             │
│                                          │
│ 10:30 ────────────────────────────────  │
│   ▢ 社群答疑                              │
│     日常 · 30 分钟                        │
│                                          │
│ ...                                      │
└─────────────────────────────────────────┘
                                  [+] 输入框
```

#### 3.3.2 时间块组件 (TimeBlock)

显示要素:
- 开始时间（24h 制，左对齐）
- 任务标题（一行截断，hover 显示完整）
- 二级信息（分类 · 时长 · 优先级）
- 完成 checkbox（左侧）
- 操作按钮（hover 显示：编辑、顺延、删除）

交互:
- 单击 checkbox → 标记完成，弹出快速回报"实际耗时"
- 单击任务标题 → 进入详情侧栏
- 拖拽 → 调整顺序或时间
- 右键 / 长按 → 上下文菜单（编辑、顺延、取消、查看详情、删除）
- 移动端左滑 → 顺延
- 移动端右滑 → 完成

#### 3.3.3 智能提醒条

显示条件（按优先级，每次只显示最高优先级一条）:
1. 硬截止冲突（红色）
2. 级联重排已发生（黄色，含 24h 撤销倒计时）
3. 今日任务过满 ≥ 90%（黄色）
4. 今日任务过少 ≤ 30%（蓝色）
5. AI 周复盘洞察可查看（中性灰）

每条内置 1-2 个操作按钮。

#### 3.3.4 轻日模式（Low-Energy Mode）

**问题背景**：一人公司创业者会有真实的低能量日——感冒、生理期、家事、心情不好。这种时候打开 App 看到一排没完成的任务会触发**焦虑而非帮助**，是真实的流失风险。

**设计**：

今日视图顶部右侧增加一个状态按钮（默认隐藏，hover 显示，或键盘快捷键 `Cmd + Shift + L`）：

```
[今天状态：正常] ▼
   ├ 正常（满产能）
   ├ 轻日（产能减半，2-3h）
   ├ 暂停（仅显示必做事项，其他全顺延）
```

**轻日模式下的系统行为**：

- 当日产能预算降到正常的 50%（如默认 6h → 3h）
- 自动将「普通」「可推迟」优先级任务**整体顺延到明日**（但不级联到下游）
- 仅保留「高优」「关键」任务可见
- 顶部不显示"任务过少"的提醒
- 不进入周完成率统计（避免拉低数据让用户更焦虑）
- 状态会自动在第二天 00:00 重置回"正常"

**暂停模式下的系统行为**：

- 仅显示有硬截止且今日已是最后一天的任务
- 其他任务全部隐藏（不顺延，只是不显示，下次切回正常会回来）
- 顶部显示温柔提示：「今天好好休息，明天再来。」
- 仍不进入完成率统计

**今日心情备注（可选）**:

今日视图顶部允许用户写一行短文字（≤ 50 字）：「今天状态如何？」

这个字段：
- 当日可见，第二天自动隐藏（但保留在数据库）
- 不喂给 AI 当作 prompt 输入（避免用户写消极话被 AI 反馈放大）
- 仅用于用户自我跟踪 + 周复盘时回顾"这周状态分布"

**数据模型补充**：

```sql
alter table public.user_profiles
  add column current_energy_mode text default 'normal'
  check (current_energy_mode in ('normal','light','paused'));
alter table public.user_profiles
  add column energy_mode_set_at timestamptz;

create table public.daily_mood_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  note_date date not null,
  energy_mode text not null,
  mood_note text,
  created_at timestamptz not null default now(),
  unique (user_id, note_date)
);
```

---

### 3.4 项目视图

#### 3.4.1 页面布局

列表视图（默认）:

```
┌─────────────────────────────────────────┐
│ 项目                       [+ 新建项目]   │
│ [全部▼] [活跃] [暂停] [完成]              │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐   │
│ │ 新课程开发：一人公司增长术          │   │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 65%   │   │
│ │ 当前里程碑: 内测完成 (5/20)         │   │
│ │ 健康                              │   │
│ └───────────────────────────────────┘   │
│ ┌───────────────────────────────────┐   │
│ │ 内容矩阵搭建                       │   │
│ │ ━━━━━━━━━━━ 40%                   │   │
│ │ 慢于预期                           │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### 3.4.2 项目详情页

四个 Tab:

1. **概览**: 基本信息、里程碑时间线、健康度指标、时间投入统计
2. **任务**: 关联任务列表，支持**列表视图 + 看板视图**双视图切换
3. **里程碑**: 完整里程碑管理（增删改、调整顺序）
4. **数据**: 该项目相关的 outcome metrics（如该项目下任务完成日的运营数据关联）

#### 3.4.3 任务多视图（重要）

**问题背景**：项目管理类用户来自 Notion / Linear / Asana，他们的心智模型是**多视图切换**。只做列表视图体验比同行差一截。v1 至少要做列表 + 看板两个视图。

**视图切换器**：

任务 Tab 顶部右上角放一个分段控件：

```
[ 列表 | 看板 ]   [+ 筛选]   [排序 ▼]
```

切换时无页面跳转，仅切换内容区。视图状态记忆在 URL query string（`?view=board`），便于分享和返回时保留。

**列表视图**（默认）：

按状态分组的纵向列表：
- 进行中（最上方，展开）
- 未开始
- 已完成（默认折叠，显示数量）
- 已取消（默认折叠，仅在筛选打开时显示）

每行任务显示：
- 完成 checkbox
- 任务标题
- 标签 chip
- 截止日期（如有）
- 计划时间（如已排程）
- 优先级图标

支持拖拽改变顺序（同组内）+ 拖拽跨组改变状态。

**看板视图**：

三列（v1 固定，不支持自定义）：

```
┌─────────────┬─────────────┬─────────────┐
│  未开始 (5)  │ 进行中 (3)   │ 已完成 (12)  │
│             │             │             │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Card    │ │ │ Card    │ │ │ Card    │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │
│ ┌─────────┐ │             │             │
│ │ Card    │ │             │             │
│ └─────────┘ │             │             │
└─────────────┴─────────────┴─────────────┘
```

卡片显示：
- 任务标题（最多 2 行截断）
- 优先级色条（左边一道窄色条）
- 截止日期 chip（如有，超期红色）
- 计划时间 chip（如已排程）
- 标签

交互：
- 卡片可拖拽换列（自动更新 status）
- 列内可拖拽排序（更新 display_order）
- 卡片点击进入任务详情页（侧栏滑出，不离开当前页面）
- 列顶部 `+` 可快速添加任务到该状态

**视图未实施**（v1.1+）：

- 日历视图（任务按 scheduled_start 排在月历上）
- 甘特图视图（带依赖箭头）
- 时间线视图

#### 3.4.4 项目健康度计算

```
预期进度 = (今日 - start_date) / (target_end_date - start_date)
实际进度 = 完成任务数 / 关联任务总数

健康度:
- 健康: 实际进度 ≥ 预期进度 - 5%
- 慢于预期: 实际进度 < 预期进度 - 5% 且 ≥ 预期进度 - 15%
- 严重滞后: 实际进度 < 预期进度 - 15%
```

---

### 3.5 复盘视图

#### 3.5.1 每日数据回报

**触发**: 每日 `daily_report_time`（默认 20:00）推送 Web Push + 邮件

**输入**: 用户语音或文字
示例：「抖音今天播放 4 万 2 千、点赞 1500、涨粉 80，公众号阅读 3200，关注 12」

**AI 解析**: 调用 `outcome_parser` prompt

**确认 UI**:

```
┌─────────────────────────┐
│ AI 已识别                 │
│                          │
│ 抖音                      │
│   播放    42,000          │
│   点赞    1,500           │
│   涨粉    +80             │
│                          │
│ 公众号                    │
│   阅读    3,200           │
│   关注    +12             │
│                          │
│ [确认]  [修改]  [取消]    │
└─────────────────────────┘
```

#### 3.5.1.1 漏报宽限与补报（关键）

**问题背景**：原设计假设用户每天 20:00 都会主动报数据，这是不现实的——出差、应酬、家事都会让用户漏报，漏报一次后心理上很容易"破窗"放弃。必须有宽容机制。

**A. 48 小时宽限期**

- 用户当日未报数据，第二天 20:00 不发新提醒，仅在复盘页置顶显示"昨天还没报，30 秒补一下"按钮
- 48 小时内补报：数据正常计入，标记为"补报"
- 超过 48 小时未补：该日数据标记为"缺失"，不再提示

**B. 周末一键补报**

- 周日 18:00 主动推送一条邮件 / Web Push："本周还有 X 天数据没报，1 分钟补全？"
- 点开进入"批量补报"视图：

```
┌───────────────────────────────────────┐
│ 本周漏报数据补全                       │
│                                        │
│ 周二 (5/14)  [_______________]        │
│ 抖音 / 小红书 / 公众号                │
│                                        │
│ 周四 (5/16)  [_______________]        │
│                                        │
│ [跳过本周]                  [提交]    │
└───────────────────────────────────────┘
```

每个缺失日一个输入框，用户连说几段即可。AI 自动按日期归属解析。

**C. 周报数据完整性提醒**

周一生成周报时，如果数据缺失比例 ≥ 50%（缺 4 天以上）：

- 周报顶部显示警告："本周数据缺失较多，AI 洞察可能不准确"
- AI 不生成"洞察"模块（避免误导），仅展示已有数据
- 提供"现在补报"快捷入口

**D. 极简推送格式（v1.1+ 注明）**

未来移动 App / 邮件推送支持回复式提交：

- 邮件正文写"回复本邮件直接提交（格式：xxx）"，用户在邮箱回复一句话即提交（通过 inbound email parsing）
- iOS / Android 推送通知支持下拉直接输入文字

v1 桌面 Web 做不到，但要在 PRD 注明 v1.1 必须有，因为这是漏报防治的核心解。

#### 3.5.2 周复盘视图

**生成时机**: 每周一 09:00 通过 cron job 生成

**生成失败 fallback**: 用户首次进入复盘视图时若发现本周报告未生成，触发即时生成

**包含模块**（按从上到下显示顺序，关键调整：用户自己的复盘排在前，AI 洞察在后）：

**1. 用户自评（顶部，最重要）**

```
┌────────────────────────────────────────┐
│ 这周你怎么看？                          │
│                                         │
│ 最满意的一件事                          │
│ [_________________________________]    │
│                                         │
│ 最受挫的一件事                          │
│ [_________________________________]    │
│                                         │
│ 下周想专注的方向                        │
│ [_________________________________]    │
│                                         │
│ [跳过]                  [保存反思]      │
└────────────────────────────────────────┘
```

设计原则：
- 三个开放式字段，每个不超过 100 字
- 全部可选填，可以全跳过
- 跳过状态下，用户下次打开复盘会再提醒一次（不强制）
- 这些字段会被存入 `weekly_self_reviews` 表
- 用户填写后会**喂给 AI**，让 AI 洞察更精准（"你说最受挫的是 X，从数据看 X 项目时间投入只有 1.5h，下周建议……"）

**为什么排第一**：用户自己写的几句话比 AI 洞察价值高 10 倍。让用户先做主观复盘，再看客观数据 + AI 洞察，能形成"自己思考 → 数据印证或挑战"的认知节奏。

**2. 任务完成情况**

- 总完成率（本周完成数 / 本周计划数）
- 7 天完成热力图（每格显示 X/Y）
- 项目时间投入（条形图）
- 与历史均值对比

**3. 运营数据**

- 按平台分组
- 关键指标 + 周环比
- 4 周趋势线（mini sparkline）
- 数据完整性指示（缺失天数提示）

**4. AI 关联洞察**

- 2-3 条洞察，每条 ≤ 100 字
- 结构: 观察事实 + 可能原因 + 行动建议
- 每条洞察附"生成相关任务（草稿）"按钮（不直接排程）
- **如果用户填写了自评**，AI 洞察会引用用户的话作为锚点

**5. 系统调整记录（透明度模块）**

- 本周用户主动改了多少次任务
- 系统建议级联调整多少次（接受/拒绝比例）
- 撤销次数
- 这部分用于建立"系统不在背后偷改东西"的信任

**6. 状态分布（如果用户在轻日模式有备注）**

- 本周轻日 / 暂停 / 正常天数分布
- 用户写的心情备注摘要

**数据模型补充**：

```sql
create table public.weekly_self_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  week_start_date date not null,
  most_satisfied text,
  most_frustrated text,
  next_week_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);
```

#### 3.5.3 平台配置

用户首次进入复盘前，引导用户配置自己关心的平台：

```
┌──────────────────────────────────────┐
│ 你想追踪哪些平台的数据？               │
│                                       │
│ [+] 抖音    指标: 播放 点赞 涨粉      │
│ [+] 小红书   指标: 阅读 点赞 涨粉      │
│ [+] 公众号   指标: 阅读 在看 关注      │
│ [+] B 站                              │
│ [+] 自定义...                         │
└──────────────────────────────────────┘
```

平台与指标皆可自定义，但每个平台最多 5 个指标。

---

### 3.6 用户系统

#### 3.6.1 注册/登录

- 邮箱 + 密码（Supabase Auth）
- Magic Link（邮箱链接登录）
- 微信扫码登录（v1.1+）
- Google OAuth（v1.1+）

#### 3.6.2 引导流程（Onboarding）

新用户首次登录走 5 步引导:

1. **欢迎**: 30 秒动画 / 视频说明产品定位（可跳过）
2. **工作时段**: 默认 09:00-18:00
3. **每日产能**: 默认 6 小时
4. **首个项目**（可跳过）: 引导用户创建一个进行中的项目
5. **第一个任务**: 引导用户在智能输入框输入一句话

#### 3.6.3 设置页

| 板块 | 字段 |
|---|---|
| 个人信息 | 姓名、邮箱、头像、时区 |
| 工作偏好 | 工作时段、每日产能、每日回报时间 |
| AI 偏好 | 解析默认时长（30/60/90/120 min）、是否启用语音、显示 AI 解析过程 |
| 通知 | Web Push、邮件提醒频率、漏报周末补报提醒 |
| 平台配置 | 关注的运营平台与指标 |
| 订阅 | 当前套餐、续费、付款方式、发票、邀请码 |
| 推广 | 我的邀请链接、邀请记录、奖励状态 |
| 数据 | CSV / JSON 导出、账户删除 |

---

### 3.7 任务详情页

任务详情是产品深度使用的关键。用户从轻量待办进化为深度任务管理，需要任务能承载"事情的全部上下文"。

#### 3.7.1 调用方式

- 点击列表 / 看板中任务卡片 → 侧栏滑入（默认）
- 双击任务 → 全屏页面（用户偏好可设置默认行为）
- URL 直达：`/tasks/:id`

#### 3.7.2 页面结构

```
┌────────────────────────────────────────┐
│  ← 返回      [全屏]  [删除]            │
├────────────────────────────────────────┤
│  任务标题（可直接编辑）                  │
│  [□] 已完成 / 进行中                    │
├────────────────────────────────────────┤
│  属性栏（横向）                          │
│  项目 · 优先级 · 时长 · 截止 · 标签       │
├────────────────────────────────────────┤
│  描述（富文本，可空）                    │
│  [____________________________________]│
├────────────────────────────────────────┤
│  附件 & 链接                            │
│  ・设计稿 https://...                   │
│  ・客户邮件 https://...                 │
│  [+ 添加链接]                           │
├────────────────────────────────────────┤
│  备注 & 想法（用户做任务时的临时记录）   │
│  [____________________________________]│
├────────────────────────────────────────┤
│  任务历史（折叠，可展开）                │
│  · 5/14 09:00 创建                      │
│  · 5/14 14:30 顺延至 5/15（用户操作）   │
│  · 5/15 11:00 完成（实际耗时 105 分钟） │
└────────────────────────────────────────┘
```

#### 3.7.3 核心字段

**任务历史**（自动记录，用户不可手动改）：

```sql
create table public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null,
  event_type text not null check (event_type in (
    'created','title_changed','rescheduled','priority_changed',
    'postponed','completed','reopened','cancelled','description_changed',
    'link_added','link_removed','note_added'
  )),
  before_value jsonb,
  after_value jsonb,
  triggered_by text not null default 'user' check (triggered_by in ('user','system','ai_cascade')),
  created_at timestamptz not null default now()
);

create index idx_task_history_task on public.task_history (task_id, created_at desc);
```

**附件链接**（v1 仅支持外部 URL，不做文件上传，节约存储与法律风险）：

```sql
create table public.task_links (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  url text not null,
  title text,
  preview_image text,
  added_at timestamptz not null default now()
);
```

**备注 / 想法**：直接复用 `tasks.description` 字段（升级为富文本 Markdown），不再单设表。

**完成回顾**（任务完成时弹出的快速回顾）：

```sql
alter table public.tasks
  add column completion_note text,
  add column lessons_learned text;
```

完成任务时的快速回顾弹窗：

```
┌──────────────────────────────────┐
│  完成「写广告脚本」               │
│                                   │
│  实际耗时：[120] 分钟（计划 120）│
│                                   │
│  关键产出（可空）                 │
│  [______________________]        │
│                                   │
│  下次会改进的（可空）             │
│  [______________________]        │
│                                   │
│       [跳过]      [保存完成]     │
└──────────────────────────────────┘
```

#### 3.7.4 子任务（标注 v1.1+）

v1 不实施子任务。如果用户有这种需求，可通过"任务依赖"近似表达。v1.1 加入 parent_task_id 字段实现真正的子任务结构。

---

### 3.8 付费订阅

v1 即上线付费，使用 **XORPAY** 作为支付处理，支持微信 / 支付宝收款。v1 不做自动扣款订阅，采用“14 天免费试用 + 到期主动付费续用”的模式：用户购买月付或年付后，系统按支付成功回调延长可用期。

#### 3.8.1 用户付费流程

**首次注册**：

```
注册 → 邮箱验证 → 引导设置 → 进入产品 →
14 天试用期开始（无需绑卡）→
试用期开始第 7 天：邮件提醒，开始展示订阅入口 →
试用期开始第 13 天：弹出选套餐 + 支付提醒对话框（不可关闭超过 1 次）→
试用期结束第 14 天 24:00：未付费用户进入"只读模式"
```

**只读模式**：

- 用户可以登录、查看自己的所有数据
- 不能新建任务、不能调用 AI、不能生成周报
- 顶部常驻 banner：「升级以继续使用，或导出数据后注销账户」
- 7 天后自动归档账户（数据保留 30 天，可申诉恢复）

**XORPAY 支付流程**：

```
用户选择套餐（月付 / 年付）
    ↓
POST /api/subscription/checkout
    ↓
后端创建 payment_orders 记录
    ↓
后端调用 XORPAY pay 接口（native / alipay）
    ↓
前端展示二维码或跳转支付链接
    ↓
XORPAY 回调 /api/webhooks/xorpay
    ↓
后端校验回调签名，更新 payment_orders 与 subscriptions
    ↓
用户获得对应周期使用权
```

**支付方式**：
- 桌面 Web：优先使用微信 Native / 支付宝当面付二维码
- 移动 Web：支付宝可跳转二维码链接拉起 App；微信优先使用收银台 / JSAPI，若环境不支持则展示二维码
- 支付状态以 XORPAY 服务端回调为准；前端轮询订单状态仅作为体验补充

#### 3.8.2 订阅套餐

| 套餐 | 月付 | 年付（送 2 个月） | 主要差异 |
|---|---|---|---|
| 基础版 | ¥68 | ¥680 | AI 调用 50/日，项目 ≤ 10 |
| 专业版 | ¥128 | ¥1280 | AI 调用 200/日，无项目限制，优先客服 |

**显式不做**：
- ❌ 永久免费版（避免免费用户拖累整体体验）
- ❌ 学生版（v1 不做，v1.2 再评估）
- ❌ 7 折 / 闪购等大促（保护品牌定位）

#### 3.8.3 限额到达提醒

AI 调用达到当日限额时：

```
┌──────────────────────────────────────┐
│  今天的 AI 调用配额用完了              │
│  （基础版 50 次 / 日）                 │
│                                        │
│  · 配额将在明天 00:00 重置             │
│  · 升级专业版可享 200 次 / 日          │
│                                        │
│  [手动添加任务]   [升级专业版]        │
└──────────────────────────────────────┘
```

#### 3.8.4 退订流程

设置 → 订阅 → 取消续费提醒，**一键完成**（不做任何挽留弹窗、问卷拦截、客服跟进的恶心套路）。

- v1 不做自动扣款，因此没有真正意义上的代扣退订
- 用户关闭续费提醒后，到期日前仍可正常使用
- 到期当日未续费则转为"只读模式"
- 提供"立即续费"快捷入口

#### 3.8.5 数据模型

```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  plan text not null check (plan in ('trial','basic','pro')),
  status text not null check (status in ('trialing','active','past_due','expired')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  renewal_reminder_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  order_id text not null unique,
  xorpay_aoid text unique,
  plan text not null check (plan in ('basic','pro')),
  billing_period text not null check (billing_period in ('monthly','yearly')),
  pay_type text not null check (pay_type in ('native','alipay','jsapi')),
  amount_cny numeric(10,2) not null,
  status text not null default 'created' check (status in ('created','pending','paid','failed','expired','refunded')),
  qr_url text,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payment_orders_user_date on public.payment_orders (user_id, created_at desc);
create index idx_payment_orders_status on public.payment_orders (status);

create table public.daily_ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  usage_date date not null,
  call_count int not null default 0,
  unique (user_id, usage_date)
);

create index idx_ai_usage_user_date on public.daily_ai_usage (user_id, usage_date desc);
```

---

### 3.9 邀请推荐与对外展示（增长机制）

冷启动阶段口碑传播是种子用户阶段唯一靠谱的获客方式。v1 必须从第一天就内置增长机制。

#### 3.9.1 邀请推荐

**邀请链接**：

每个付费用户拥有一个唯一邀请码（6 位短码），形如 `solo.work/i/AB12CD`。

**奖励规则**：

- 被邀请人通过邀请链接注册 + 完成付费试用转化 → 邀请人订阅延长 1 个月
- 被邀请人享受邀请专属优惠：首月 5 折（¥34 起）
- 单个邀请人最多累计延长 12 个月（防刷）

**入口位置**：

- 设置页「推广」板块
- 周复盘视图底部"觉得有用？邀请朋友试试"
- 用户完成第 30 个任务时弹出一次"用得不错？分享给朋友"

#### 3.9.2 周复盘公开分享卡片

用户可以把自己的周复盘脱敏后生成可分享卡片（PNG / 链接）。

**默认脱敏规则**：

- 所有具体数字以"提升 X%"或"完成 N 件"形式展示
- 不展示任务名、项目名、平台数据具体值
- 不展示客户名、合作方名

**卡片内容（默认模板）**：

```
┌─────────────────────────────────────┐
│  本周完成 22 件事                    │
│  ━━━━━━━━━━━━━━━━━ 78%              │
│                                      │
│  3 个项目推进                         │
│  其中新课程开发推进 +12%             │
│                                      │
│  这周最专注的是「内容创作」          │
│                                      │
│  ─────────────────────────────       │
│  solo.work · 一人公司任务工作站      │
└─────────────────────────────────────┘
```

**用户可选三种分享模板**：

1. 简约数据卡（如上）
2. 文字感悟卡（突出用户自评的几句话）
3. 进度图卡（突出热力图 + 趋势）

**水印与品牌**：

- 卡片底部固定显示极简水印：`solo.work · 工具名`
- 文字水印，不闪烁、不强行加大、不弹窗
- 用户付费状态下水印保留（让品牌曝光）
- 用户专业版可选择移除水印（增加付费理由）

**反垃圾措施**：

- 单用户每周最多生成 3 张分享卡（防机器人滥用）
- 卡片链接 30 天后失效（避免长期外链滥用）

#### 3.9.3 数据模型

```sql
create table public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  code text not null unique,
  total_invitees int not null default 0,
  total_conversions int not null default 0,
  total_months_earned int not null default 0,
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_email text not null,
  status text not null default 'signed_up' check (status in ('signed_up','trial_active','converted','failed','expired')),
  reward_granted boolean not null default false,
  created_at timestamptz not null default now(),
  converted_at timestamptz,
  unique (invitee_user_id)
);

create table public.share_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  card_type text not null check (card_type in ('weekly_data','weekly_reflection','progress')),
  week_start_date date not null,
  share_token text not null unique,
  view_count int not null default 0,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);
```

---

## 4. 数据模型

### 4.1 数据库选型

| 用途 | 选型 |
|---|---|
| 主数据库 | Supabase PostgreSQL 15+ |
| 文件存储 | Supabase Storage（用户头像） |
| 缓存 | 无（v1 不引入；如有需要后续加 Upstash Redis） |
| 全文搜索 | PostgreSQL 内置 `pg_trgm` |

### 4.2 完整 Schema

```sql
-- ============================================
-- 用户配置表（业务字段扩展，认证用 auth.users）
-- ============================================
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  timezone text not null default 'Asia/Shanghai',
  work_hours_start time not null default '09:00',
  work_hours_end time not null default '18:00',
  daily_capacity_minutes int not null default 360 check (daily_capacity_minutes between 60 and 720),
  daily_report_time time not null default '20:00',
  completion_rate_avg numeric(3,2) not null default 0.75 check (completion_rate_avg between 0 and 1),
  voice_enabled boolean not null default true,
  show_ai_reasoning boolean not null default false,
  current_energy_mode text not null default 'normal' check (current_energy_mode in ('normal','light','paused')),
  energy_mode_set_at timestamptz,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 项目表
-- ============================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text,
  start_date date not null default current_date,
  target_end_date date,
  actual_end_date date,
  status text not null default 'active' check (status in ('planning','active','paused','completed','cancelled')),
  color text not null default '#1F2937',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 里程碑表
-- ============================================
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  target_date date not null,
  completed_at timestamptz,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================
-- 任务表（核心）
-- ============================================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  category text,
  priority text not null default 'normal' check (priority in ('high','key','normal','low')),
  estimated_minutes int not null default 60 check (estimated_minutes > 0),
  actual_minutes int check (actual_minutes is null or actual_minutes >= 0),
  hard_deadline timestamptz,
  recurrence_rule text,
  status text not null default 'pending' check (status in ('pending','scheduled','in_progress','completed','postponed','cancelled')),
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  completed_at timestamptz,
  completion_note text,
  lessons_learned text,
  tags text[] not null default '{}',
  source_input text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 任务依赖（多对多）
-- ============================================
create table public.task_dependencies (
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, depends_on_task_id),
  check (task_id != depends_on_task_id)
);

-- ============================================
-- 运营数据表
-- ============================================
create table public.outcome_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  metric_date date not null,
  platform text not null,
  metric_key text not null,
  metric_value numeric not null,
  raw_input text,
  created_at timestamptz not null default now(),
  unique (user_id, metric_date, platform, metric_key)
);

-- ============================================
-- 平台配置（用户自定义平台列表）
-- ============================================
create table public.platforms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  color text not null default '#1F2937',
  metric_keys text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ============================================
-- AI 调用日志（成本监控、prompt 优化）
-- ============================================
create table public.ai_call_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  prompt_type text not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  cost_cny numeric(8,4),
  latency_ms int,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

-- ============================================
-- 调度引擎事件日志
-- ============================================
create table public.scheduling_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  event_type text not null check (event_type in ('initial_schedule','cascade','manual_adjust','hard_deadline_conflict','overflow')),
  affected_task_ids uuid[] not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================
-- 周复盘报告缓存
-- ============================================
create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  week_start_date date not null,
  report_data jsonb not null,
  ai_insights jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

-- ============================================
-- 目标拆解草稿
-- ============================================
create table public.decomposition_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  original_goal text not null,
  clarification_qa jsonb,
  decomposition_result jsonb not null,
  status text not null default 'draft' check (status in ('draft','partial_committed','fully_committed','discarded')),
  committed_task_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 级联撤销快照
-- ============================================
create table public.undo_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  action_type text not null,
  before_state jsonb not null,
  affected_task_ids uuid[] not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  used boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- 任务历史与外部链接
-- ============================================
create table public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  event_type text not null check (event_type in (
    'created','title_changed','rescheduled','priority_changed',
    'postponed','completed','reopened','cancelled','description_changed',
    'link_added','link_removed','note_added'
  )),
  before_value jsonb,
  after_value jsonb,
  triggered_by text not null default 'user' check (triggered_by in ('user','system','ai_cascade')),
  created_at timestamptz not null default now()
);

create table public.task_links (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  url text not null,
  title text,
  preview_image text,
  added_at timestamptz not null default now()
);

-- ============================================
-- 轻日模式、用户自评与周复盘
-- ============================================
create table public.daily_mood_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  note_date date not null,
  energy_mode text not null check (energy_mode in ('normal','light','paused')),
  mood_note text,
  created_at timestamptz not null default now(),
  unique (user_id, note_date)
);

create table public.weekly_self_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  week_start_date date not null,
  most_satisfied text,
  most_frustrated text,
  next_week_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

-- ============================================
-- 订阅、XORPAY 支付订单与 AI 配额
-- ============================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  plan text not null check (plan in ('trial','basic','pro')),
  status text not null check (status in ('trialing','active','past_due','expired')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  renewal_reminder_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  order_id text not null unique,
  xorpay_aoid text unique,
  plan text not null check (plan in ('basic','pro')),
  billing_period text not null check (billing_period in ('monthly','yearly')),
  pay_type text not null check (pay_type in ('native','alipay','jsapi')),
  amount_cny numeric(10,2) not null,
  status text not null default 'created' check (status in ('created','pending','paid','failed','expired','refunded')),
  qr_url text,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  usage_date date not null,
  call_count int not null default 0,
  unique (user_id, usage_date)
);

-- ============================================
-- 邀请与分享卡片
-- ============================================
create table public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  code text not null unique,
  total_invitees int not null default 0,
  total_conversions int not null default 0,
  total_months_earned int not null default 0,
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_user_id uuid not null references public.user_profiles(id) on delete cascade,
  invitee_email text not null,
  status text not null default 'signed_up' check (status in ('signed_up','trial_active','converted','failed','expired')),
  reward_granted boolean not null default false,
  created_at timestamptz not null default now(),
  converted_at timestamptz,
  unique (invitee_user_id)
);

create table public.share_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  card_type text not null check (card_type in ('weekly_data','weekly_reflection','progress')),
  week_start_date date not null,
  share_token text not null unique,
  view_count int not null default 0,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

-- ============================================
-- 索引
-- ============================================
create index idx_tasks_user_status_scheduled on public.tasks (user_id, status, scheduled_start);
create index idx_tasks_user_project on public.tasks (user_id, project_id);
create index idx_tasks_user_today on public.tasks (user_id, scheduled_start)
  where status in ('scheduled','in_progress');
create index idx_outcome_user_date on public.outcome_metrics (user_id, metric_date desc);
create index idx_ai_logs_user_date on public.ai_call_logs (user_id, created_at desc);
create index idx_scheduling_events_user_date on public.scheduling_events (user_id, created_at desc);
create index idx_milestones_project on public.milestones (project_id, display_order);
create index idx_drafts_user on public.decomposition_drafts (user_id, created_at desc);
create index idx_undo_user_active on public.undo_snapshots (user_id, expires_at) where used = false;
create index idx_task_history_task on public.task_history (task_id, created_at desc);
create index idx_payment_orders_user_date on public.payment_orders (user_id, created_at desc);
create index idx_payment_orders_status on public.payment_orders (status);
create index idx_ai_usage_user_date on public.daily_ai_usage (user_id, usage_date desc);

-- ============================================
-- 触发器：更新 updated_at
-- ============================================
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_user_profiles_updated before update on public.user_profiles
  for each row execute function public.set_updated_at();
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();
create trigger trg_tasks_updated before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger trg_drafts_updated before update on public.decomposition_drafts
  for each row execute function public.set_updated_at();
create trigger trg_weekly_self_reviews_updated before update on public.weekly_self_reviews
  for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger trg_payment_orders_updated before update on public.payment_orders
  for each row execute function public.set_updated_at();

-- ============================================
-- Row Level Security
-- ============================================
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.outcome_metrics enable row level security;
alter table public.platforms enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.scheduling_events enable row level security;
alter table public.ai_call_logs enable row level security;
alter table public.decomposition_drafts enable row level security;
alter table public.undo_snapshots enable row level security;
alter table public.task_history enable row level security;
alter table public.task_links enable row level security;
alter table public.daily_mood_notes enable row level security;
alter table public.weekly_self_reviews enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_orders enable row level security;
alter table public.daily_ai_usage enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.share_cards enable row level security;

-- 通用策略：用户只能访问自己的数据
create policy "Own profile" on public.user_profiles for all using (auth.uid() = id);
create policy "Own projects" on public.projects for all using (auth.uid() = user_id);
create policy "Own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Own outcomes" on public.outcome_metrics for all using (auth.uid() = user_id);
create policy "Own platforms" on public.platforms for all using (auth.uid() = user_id);
create policy "Own reports" on public.weekly_reports for all using (auth.uid() = user_id);
create policy "Own scheduling events" on public.scheduling_events for all using (auth.uid() = user_id);
create policy "Own ai logs" on public.ai_call_logs for select using (auth.uid() = user_id);
create policy "Own drafts" on public.decomposition_drafts for all using (auth.uid() = user_id);
create policy "Own undo snapshots" on public.undo_snapshots for all using (auth.uid() = user_id);
create policy "Own task history" on public.task_history for all using (auth.uid() = user_id);
create policy "Own task links" on public.task_links for all using (auth.uid() = user_id);
create policy "Own mood notes" on public.daily_mood_notes for all using (auth.uid() = user_id);
create policy "Own weekly self reviews" on public.weekly_self_reviews for all using (auth.uid() = user_id);
create policy "Own subscriptions" on public.subscriptions for all using (auth.uid() = user_id);
create policy "Own payment orders" on public.payment_orders for all using (auth.uid() = user_id);
create policy "Own ai usage" on public.daily_ai_usage for all using (auth.uid() = user_id);
create policy "Own referral code" on public.referral_codes for all using (auth.uid() = user_id);
create policy "Own share cards" on public.share_cards for all using (auth.uid() = user_id);

-- 邀请关系双方可读；只有服务端使用 service_role 更新奖励状态
create policy "Referral participants can read" on public.referrals for select using (
  auth.uid() = inviter_user_id or auth.uid() = invitee_user_id
);

-- 公开分享页通过服务端 API 读取 share_token，不直接开放匿名表查询

-- 里程碑通过 project 间接判断
create policy "Milestones via project" on public.milestones for all using (
  exists (select 1 from public.projects p where p.id = milestones.project_id and p.user_id = auth.uid())
);

-- 任务依赖通过 task 间接判断
create policy "Task deps via task" on public.task_dependencies for all using (
  exists (select 1 from public.tasks t where t.id = task_dependencies.task_id and t.user_id = auth.uid())
);
```

### 4.3 TypeScript 类型定义

参考章节 11.2 完整类型库。

---

## 5. API 设计

### 5.1 设计原则

- REST 风格 + 资源导向
- 全部 JSON
- 路径前缀 `/api/v1`（v1 阶段省略 `v1`，下次大版本再加）
- 认证：Supabase JWT in `Authorization: Bearer <token>` header
- 错误格式统一：`{ error: { code, message, details? } }`
- 分页：`?limit=20&cursor=<base64>`

### 5.2 端点总览

**核心 / 任务**

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/parse` | 智能输入解析（核心） |
| POST | `/api/tasks` | 创建任务 |
| GET | `/api/tasks` | 查询任务列表 |
| GET | `/api/tasks/today` | 今日任务 |
| GET | `/api/tasks/:id` | 任务详情 |
| PATCH | `/api/tasks/:id` | 更新任务 |
| DELETE | `/api/tasks/:id` | 删除任务 |
| POST | `/api/tasks/:id/postpone` | 顺延（dry-run 模式获取 plan） |
| POST | `/api/tasks/:id/postpone/confirm` | 确认顺延执行（含 cascade） |
| POST | `/api/tasks/:id/complete` | 完成任务 |
| POST | `/api/tasks/bulk` | 批量创建（粘贴场景） |
| GET | `/api/tasks/:id/history` | 任务历史记录 |
| POST | `/api/tasks/:id/links` | 添加链接附件 |
| DELETE | `/api/tasks/:id/links/:linkId` | 删除链接附件 |

**调度 / 撤销**

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/schedule/recompute` | 强制重排 |
| POST | `/api/undo/:undoId` | 撤销级联操作（24h 内有效） |
| GET | `/api/undo/active` | 获取当前活跃的撤销点 |

**项目 / 里程碑**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects` | 项目列表 |
| POST | `/api/projects` | 创建项目 |
| GET | `/api/projects/:id` | 项目详情 |
| PATCH | `/api/projects/:id` | 更新项目 |
| DELETE | `/api/projects/:id` | 删除项目 |
| GET | `/api/projects/:id/tasks?view=list\|board` | 项目任务（按视图） |
| GET | `/api/projects/:id/milestones` | 项目里程碑 |
| POST | `/api/projects/:id/milestones` | 新增里程碑 |
| PATCH | `/api/milestones/:id` | 更新里程碑 |
| DELETE | `/api/milestones/:id` | 删除里程碑 |

**复盘 / 数据**

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/outcomes` | 记录运营数据 |
| POST | `/api/outcomes/bulk` | 批量补报漏报数据 |
| GET | `/api/outcomes` | 查询运营数据 |
| GET | `/api/outcomes/missing` | 查询本周漏报日期 |
| GET | `/api/platforms` | 平台配置 |
| POST | `/api/platforms` | 新增平台 |
| PATCH | `/api/platforms/:id` | 更新平台 |
| DELETE | `/api/platforms/:id` | 删除平台 |
| GET | `/api/reports/weekly` | 周报（自动生成或返回缓存） |
| POST | `/api/reports/weekly/self-review` | 提交用户自评 |

**目标拆解草稿**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/drafts` | 拆解草稿列表 |
| GET | `/api/drafts/:id` | 草稿详情 |
| PATCH | `/api/drafts/:id` | 修改草稿 |
| POST | `/api/drafts/:id/commit` | 把草稿全部或挑选项排入日程 |
| DELETE | `/api/drafts/:id` | 丢弃草稿 |

**轻日模式 / 心情**

| 方法 | 路径 | 说明 |
|---|---|---|
| PATCH | `/api/me/energy-mode` | 切换轻日 / 暂停 / 正常 |
| POST | `/api/me/mood-note` | 提交今日心情备注 |

**订阅 / 支付**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/subscription` | 当前订阅状态 |
| POST | `/api/subscription/checkout` | 创建 XORPAY 支付订单并返回二维码 / 支付链接 |
| POST | `/api/subscription/renewal-reminder` | 开启 / 关闭续费提醒 |
| POST | `/api/subscription/resume` | 续费并恢复使用权 |
| POST | `/api/webhooks/xorpay` | XORPAY 支付成功回调 |
| GET | `/api/payment-orders/:orderId` | 查询本平台支付订单状态 |
| GET | `/api/usage/today` | 今日 AI 调用配额使用情况 |

**邀请 / 分享**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/referrals/me` | 我的邀请码与战绩 |
| GET | `/api/referrals/redeem/:code` | 验证邀请码并标记邀请关系 |
| POST | `/api/share-cards` | 生成分享卡片 |
| GET | `/api/share-cards/public/:token` | 公开访问分享卡（无需登录） |

**用户**

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/me` | 当前用户信息 |
| PATCH | `/api/me` | 更新用户设置 |
| POST | `/api/me/export` | 导出全部数据（CSV / JSON） |
| DELETE | `/api/me` | 删除账户 |

### 5.3 核心端点详解

#### 5.3.1 `POST /api/parse`

最重要的端点。解析自然语言输入。

**请求**:
```json
{
  "input": "下周二之前给小米发个广告脚本，2 小时能搞定",
  "input_type": "text",
  "conversation_id": null
}
```

`input_type`: `text` | `voice` | `paste`

`conversation_id`: 非空时为多轮对话续传（目标拆解时用）

**响应（quick_task）**:
```json
{
  "intent": "quick_task",
  "confidence": 0.95,
  "result": {
    "task": {
      "title": "写广告脚本",
      "project_id": null,
      "category": "商业合作",
      "priority": "high",
      "estimated_minutes": 120,
      "hard_deadline": "2026-05-19T18:00:00+08:00",
      "tags": ["小米", "广告"]
    },
    "suggested_slot": {
      "scheduled_start": "2026-05-16T10:00:00+08:00",
      "scheduled_end": "2026-05-16T12:00:00+08:00",
      "reasoning": "本周内最早的连续 2h 空档"
    },
    "insights": [
      "本周已有 2 个广告任务，建议下周不再接广告"
    ]
  }
}
```

**响应（goal_decomposition 第一轮）**:
```json
{
  "intent": "goal_decomposition",
  "confidence": 0.92,
  "result": {
    "phase": "clarification",
    "conversation_id": "abc-def-123",
    "questions": [
      "你目前课程月销大概多少？",
      "主要靠提客单价还是扩用户量？",
      "6 月开始还是 7 月开始算？硬截止 12 月吗？"
    ]
  }
}
```

**响应（goal_decomposition 第二轮，前端带上 conversation_id 和 user 的回答再次调用）**:
```json
{
  "intent": "goal_decomposition",
  "result": {
    "phase": "decomposition",
    "stages": [
      { "name": "蓄水期", "date_range": "2026-07-01 ~ 2026-08-31", "target_metric": "月销 2.5 万" },
      { "name": "爬坡期", "date_range": "2026-09-01 ~ 2026-10-31", "target_metric": "月销 3.5 万" },
      { "name": "冲刺期", "date_range": "2026-11-01 ~ 2026-12-31", "target_metric": "月销 5 万" }
    ],
    "supporting_projects": [
      { "name": "内容引流矩阵", "description": "抖音 + 小红书每周 5 条" },
      { "name": "私域转化漏斗优化", "description": "转化率提 50%" },
      { "name": "课程产品线扩充", "description": "9 月前上线新课" }
    ],
    "this_week_tasks": [
      { "title": "复盘私域转化路径", "estimated_minutes": 90, "priority": "high", "suggested_day": "2026-05-19" },
      { "title": "新课程大纲 v1", "estimated_minutes": 120, "priority": "key", "suggested_day": "2026-05-20" }
    ]
  }
}
```

**响应（bulk_import）**:
```json
{
  "intent": "bulk_import",
  "result": {
    "tasks": [
      { "title": "...", "estimated_minutes": 60, "priority": "normal", "suggested_day": "..." }
    ]
  }
}
```

**响应（outcome_report）**:
```json
{
  "intent": "outcome_report",
  "result": {
    "metric_date": "2026-05-14",
    "metrics": [
      { "platform": "抖音", "metric_key": "播放", "metric_value": 42000 },
      { "platform": "抖音", "metric_key": "点赞", "metric_value": 1500 }
    ]
  }
}
```

**响应（task_maintenance）**:
```json
{
  "intent": "task_maintenance",
  "result": {
    "operation": "postpone",
    "target_task_ids": ["uuid-1"],
    "new_value": { "scheduled_start": "..." },
    "requires_confirmation": false
  }
}
```

如 `requires_confirmation: true`，前端展示确认 UI 后再调用对应操作端点。

#### 5.3.2 `POST /api/tasks/:id/postpone`

此端点只做 dry-run，不写入数据库。它返回本次顺延将产生的计划、受影响任务、硬截止冲突与是否需要确认。用户确认后，前端必须调用 `POST /api/tasks/:id/postpone/confirm` 才执行写库。

**请求**:
```json
{
  "target_date": "2026-05-15"
}
```

`target_date` 可选；不传则推到下一个空档。

**响应**:
```json
{
  "plan": [
    {
      "task_id": "uuid-1",
      "old_scheduled_start": "2026-05-14T10:00:00+08:00",
      "old_scheduled_end": "2026-05-14T12:00:00+08:00",
      "new_scheduled_start": "2026-05-15T10:00:00+08:00",
      "new_scheduled_end": "2026-05-15T12:00:00+08:00"
    }
  ],
  "cascaded_tasks": [ /* 受级联影响的任务预览，不含已写入变更 */ ],
  "alerts": [
    { "type": "hard_deadline_conflict", "task_id": "...", "message": "..." }
  ],
  "requires_confirmation": true
}
```

#### 5.3.3 `POST /api/tasks/:id/postpone/confirm`

**请求**:
```json
{
  "mode": "isolated",
  "target_date": "2026-05-15",
  "accepted_plan_signature": "server-issued-signature"
}
```

**响应**:
```json
{
  "success": true,
  "updated_tasks": [ /* 写库后的任务 */ ],
  "undo_id": "uuid",
  "undo_expires_at": "2026-05-15T14:30:00+08:00"
}
```

#### 5.3.4 `GET /api/reports/weekly?week=2026-W19`

**响应**:
```json
{
  "week_start_date": "2026-05-12",
  "week_end_date": "2026-05-18",
  "task_completion": {
    "total": 28,
    "completed": 22,
    "completion_rate": 0.78,
    "daily_breakdown": [
      { "date": "2026-05-12", "completed": 4, "total": 4 }
    ],
    "project_time_invested": [
      { "project_id": "...", "name": "新课程开发", "minutes": 480 }
    ]
  },
  "outcomes": [
    {
      "platform": "抖音",
      "metrics": [
        { "key": "播放", "value": 230000, "wow_change": 0.15 }
      ]
    }
  ],
  "ai_insights": [
    {
      "title": "广告挤压课程开发时间",
      "fact": "课程开发实际投入 8h（计划 12h），被 2 个临时广告吃掉 4h",
      "suggestion": "下周建议把广告报价上调 30% 或拒单",
      "action": { "type": "create_task", "draft_task": { "title": "..." } }
    }
  ]
}
```

### 5.4 错误码

| 状态码 | 业务码 | 含义 |
|---|---|---|
| 400 | `validation_error` | 请求参数校验失败 |
| 401 | `unauthorized` | 未登录或 token 过期 |
| 403 | `forbidden` | 操作越权 |
| 404 | `not_found` | 资源不存在 |
| 409 | `conflict` | 冲突（如硬截止冲突） |
| 422 | `ai_low_confidence` | AI 置信度低，需用户澄清 |
| 429 | `rate_limited` | 触发限流 |
| 500 | `internal_error` | 服务端错误 |
| 502 | `ai_service_unavailable` | AI 服务不可用，建议降级 |
| 504 | `ai_timeout` | AI 超时 |

### 5.5 限流策略

- 普通端点: 60 req/min/user
- `/api/parse`: 20 req/min/user
- 突发 burst: 10 req/sec

实现：Supabase Edge Function + Upstash Rate Limiter（v1 可先不做，监控触发再加）

---

## 6. AI Prompt 设计

### 6.1 总体原则

- 全部使用 DeepSeek API
- 简单解析用 `deepseek-chat`（V3）
- 复杂推理（目标拆解、关联洞察）用 `deepseek-reasoner`（R1）
- 全部要求严格 JSON 输出（response_format: json_object）
- 每个 prompt 都附带 system prompt + few-shot 示例
- Temperature: 解析类用 0.1，创造类用 0.4

### 6.2 Intent Classification

**模型**: `deepseek-chat`
**温度**: 0.1
**最大输出 tokens**: 200

**System Prompt**:
```
你是一个一人公司工作站的输入分类器。用户会输入一段文字或语音转写，你需要判断属于哪一类，并返回严格 JSON。

类别定义：
- quick_task: 单个具体任务的描述。通常包含"要"、"做"、"写"、"录"等动词 + 时长/截止线索。例：「明天上午写个广告脚本」
- goal_decomposition: 宏大目标，通常包含时间跨度（"半年"、"年底"）+ 数字目标（"5 万"、"涨粉 1 万"）。例：「下半年月销做到 5 万」
- bulk_import: 多任务的批量计划，通常超过 200 字或包含明显的列表结构（"1." "2." "Week 1" "周二:" 等）。
- task_maintenance: 对现有任务的操作。例：「把昨天那个脚本任务移到周三」「删除小米相关的任务」
- outcome_report: 数据汇报。通常包含平台名 + 数字 + 指标。例：「抖音今天播放 4 万 涨 80 粉」
- unknown: 无法判断

只返回 JSON，不要任何解释文字：
{
  "intent": "quick_task" | "goal_decomposition" | "bulk_import" | "task_maintenance" | "outcome_report" | "unknown",
  "confidence": <0-1 float>,
  "reasoning": "<10 字以内简短理由>"
}
```

**Few-shot**:
```
User: 明天上午写个广告脚本
Assistant: {"intent":"quick_task","confidence":0.95,"reasoning":"单个任务+时间"}

User: 我希望年底前实现月入 10 万
Assistant: {"intent":"goal_decomposition","confidence":0.92,"reasoning":"宏大目标+数字"}

User: 抖音今天 4 万播放，1500 点赞
Assistant: {"intent":"outcome_report","confidence":0.97,"reasoning":"平台+数据"}

User: 把那个脚本任务推迟到周三
Assistant: {"intent":"task_maintenance","confidence":0.9,"reasoning":"任务操作"}
```

### 6.3 Quick Task Parser

**模型**: `deepseek-chat`
**温度**: 0.1

**System Prompt**:
```
你是一个任务解析助手。把用户的一句话解析成结构化任务字段。

上下文：
- 今天日期: {today_date_iso}
- 用户工作时段: {work_hours_start} - {work_hours_end}
- 用户的项目列表: {projects_json}  // [{id, name}, ...]
- 用户常用分类: 内容创作 / 商业合作 / 日常运营 / 新课程开发 / 营销 / 其他

任务：
1. 识别任务标题（精简，≤15 字）
2. 匹配到一个已有项目（若文本中提到项目相关线索），否则 project_id 为 null
3. 推断分类
4. 推断优先级：硬截止越近 + 涉及客户/收入 → 高优；新课程/产品开发关键节点 → 关键；日常运营 → 普通；可推迟 → 低
5. 估算时长（分钟）。文本未提及时按分类默认：内容创作 90、商业合作 60、日常运营 30、新课程开发 120
6. 解析硬截止（如有"下周二之前"等表达，转为该日 18:00 ISO timestamp；无则 null）
7. 抽取关键 tags（客户名、产品名等）

严格返回 JSON，不要任何说明：
{
  "title": "...",
  "project_id": "<uuid or null>",
  "category": "...",
  "priority": "high" | "key" | "normal" | "low",
  "estimated_minutes": <int>,
  "hard_deadline": "<ISO timestamp or null>",
  "tags": ["..."]
}
```

**Few-shot**:
```
[Context: 今天=2026-05-14 周四, projects=[{id:"p1",name:"新课程开发"},{id:"p2",name:"小米合作"}]]

User: 下周二之前要给小米发个广告脚本，大概 2 小时能搞定
Assistant: {"title":"写广告脚本","project_id":"p2","category":"商业合作","priority":"high","estimated_minutes":120,"hard_deadline":"2026-05-19T18:00:00+08:00","tags":["小米","广告"]}

User: 明天上午整理下选题库
Assistant: {"title":"整理选题库","project_id":null,"category":"日常运营","priority":"normal","estimated_minutes":60,"hard_deadline":null,"tags":["选题"]}
```

### 6.4 Goal Decomposition · Phase 1 (Clarification)

**模型**: `deepseek-reasoner`
**温度**: 0.3

**System Prompt**:
```
你是一位资深的一人公司业务教练。用户提出一个宏大目标，你需要问 3 个最关键的问题来理解约束，再做拆解。

不要问超过 3 个问题。问题要：
- 具体，能产生数字答案
- 涵盖"现状起点"、"路径偏好"、"时间窗口"三个方向

上下文：
- 今天日期: {today_date_iso}
- 用户已有项目: {projects_json}

返回严格 JSON：
{
  "questions": ["...", "...", "..."],
  "estimated_complexity": "low" | "medium" | "high"
}
```

### 6.5 Goal Decomposition · Phase 2 (Decomposition)

**模型**: `deepseek-reasoner`
**温度**: 0.4
**最大输出 tokens**: 1500

**重要说明**: 此 Prompt 的输出**仅生成 `decomposition_drafts` 表的草稿**，不直接写入 tasks 表。用户审阅后选择"全部排入" / "挑选排入" / "仅保存"再触发实际排程。详见章节 3.1.8。

**System Prompt**:
```
你是一位资深的一人公司业务教练。基于用户提供的目标和澄清回答，输出三层拆解方案。

重要：你的输出是给用户审阅的草稿，不是直接执行的指令。所以：
- 多给一些可选的备选方案，让用户挑选
- 每个任务说清楚"为什么这周做"，让用户判断是否同意
- 不要假装你完全了解用户的业务，承认你的建议是基于通用规律

要求：
1. stages: 2-4 个阶段，每阶段含名称、日期范围、目标数字指标
2. supporting_projects: 2-4 个支撑项目，每个含名称、描述、对最终目标的贡献度估计（高/中/低）
3. this_week_tasks: 4-8 个本周可立刻执行的具体任务，含标题、预估时长、优先级、推荐日期、说明
4. assumptions: 列出本次拆解所基于的关键假设（让用户检查是否成立）

约束：
- 不要使用「赋能、闭环、抓手、私域沉淀」这类正确的废话
- 给出可执行、可量化的具体动作
- 本周任务的总时长不超过 {weekly_capacity_minutes} 分钟（用户的周产能）
- 在 rationale 中说"为什么这周做这件而不是别的"

上下文：
- 今天: {today_date_iso}
- 用户工作时段: {work_hours}

严格 JSON 输出：
{
  "stages": [
    { "name": "...", "date_range": "YYYY-MM-DD ~ YYYY-MM-DD", "target_metric": "..." }
  ],
  "supporting_projects": [
    { "name": "...", "description": "...", "contribution": "high" | "medium" | "low" }
  ],
  "this_week_tasks": [
    {
      "title": "...",
      "estimated_minutes": <int>,
      "priority": "high" | "key" | "normal",
      "suggested_day": "YYYY-MM-DD",
      "rationale": "<为什么这周做这件，而不是别的>"
    }
  ],
  "assumptions": [
    "<本次拆解假设了：...>",
    "<本次拆解假设了：...>"
  ],
  "draft_metadata": {
    "estimated_quality": "high" | "medium" | "low",
    "recommended_user_review_time_minutes": <int>
  }
}
```

### 6.6 Bulk Import Parser

**模型**: `deepseek-chat`
**温度**: 0.2

**System Prompt**:
```
你是一个批量任务解析器。用户粘贴了一段多任务的计划文本（通常来自其他 AI 工具），你需要解析成任务数组。

上下文：
- 今天日期: {today_date_iso}
- 用户工作时段与产能预算（已包含在 max_daily_minutes 中）

规则：
- 识别每一个独立任务，不要合并
- 标题 ≤ 20 字
- 估算合理时长（默认 60 分钟）
- 推荐日期遵循文本中的时间表述（"Week 1" → 距今 1 周内；"周一" → 最近的周一）
- 每天累计推荐时长不超过 max_daily_minutes
- 如果文本无明确时间，从今天开始按工作日均分

严格返回 JSON：
{
  "tasks": [
    {
      "title": "...",
      "estimated_minutes": <int>,
      "priority": "high" | "key" | "normal" | "low",
      "category": "...",
      "suggested_day": "YYYY-MM-DD"
    }
  ],
  "total_count": <int>,
  "warnings": ["..."]  // 如解析有歧义、文本过长被截断等
}
```

### 6.7 Task Maintenance Parser

**模型**: `deepseek-chat`
**温度**: 0.1

**System Prompt**:
```
你是一个任务维护意图解析器。用户输入一句话操作现有任务，你需要识别操作 + 目标任务。

上下文：
- 用户最近 7 天的任务列表: {recent_tasks_json}  // [{id, title, scheduled_start}, ...]

操作类型：
- postpone: 推迟
- reschedule: 改时间
- complete: 标记完成
- cancel: 取消/删除
- update_priority: 改优先级
- update_estimate: 改预估时长
- query: 查询（如"这周还有什么任务"）

如果目标任务有多个候选（如"小米相关的任务"匹配到 3 个），返回所有候选并标 requires_confirmation=true。

严格 JSON：
{
  "operation": "...",
  "target_task_ids": ["uuid", ...],
  "new_value": { /* 具体新值，如 {scheduled_start: "..."} */ },
  "requires_confirmation": <bool>,
  "candidates": [ /* 当 requires_confirmation 时，列出所有候选任务 */ ]
}
```

### 6.8 Outcome Parser

**模型**: `deepseek-chat`
**温度**: 0.1

**System Prompt**:
```
你是一个运营数据解析器。把用户的语音/文字解析成结构化数据。

上下文：
- 用户配置的平台和指标：{platforms_json}  // [{name, metric_keys:[...]}]
- 数据日期: {metric_date}（默认今天）

规则：
- 数字识别：「4 万 2 千」=42000，「1.5w」=15000，「+80 粉」=80
- 平台模糊匹配：用户可能说「抖音」「dy」都对应「抖音」平台
- 指标模糊匹配：「播放量」「播放」「pv」 → 「播放」
- 如果指标不在用户配置中，归到 platform 但 metric_key 用原始词，并在 warnings 中提示

严格 JSON：
{
  "metric_date": "YYYY-MM-DD",
  "metrics": [
    { "platform": "...", "metric_key": "...", "metric_value": <int|float> }
  ],
  "warnings": ["..."]
}
```

### 6.9 Weekly Insight Generator

**模型**: `deepseek-reasoner`
**温度**: 0.5
**最大输出 tokens**: 1200

**System Prompt**:
```
你是一位资深的一人公司业务教练。给定用户上周的任务完成数据和运营数据，生成 2-3 条可行动的洞察。

输入数据：
- 任务完成统计: {task_stats_json}
- 项目时间投入: {project_time_json}
- 运营数据（含周环比）: {outcomes_json}
- 历史 4 周趋势: {trend_json}
- 用户的目标和支撑项目（如有）: {goals_json}

每条洞察的结构：
- title: 一句话总结
- fact: 具体观察事实（含数字）
- suggestion: 具体行动建议
- action: 可生成的相关任务草稿（可选）

要求：
- 不要泛泛而谈，必须基于具体数字
- 不要超过 3 条，宁少勿多
- 不要使用"赋能、闭环、抓手、用户心智、产品力"这类正确的废话
- 行动建议要具体到本周可执行

严格 JSON：
{
  "insights": [
    {
      "title": "...",
      "fact": "...",
      "suggestion": "...",
      "action": {
        "type": "create_task" | "create_milestone" | "review_goal" | null,
        "draft_task": { "title": "...", "estimated_minutes": <int>, "priority": "..." }
      }
    }
  ]
}
```

### 6.10 Prompt 测试与评估

每个 prompt 必须建立测试集（至少 20 个 case），在 v1 上线前完成 eval：

- 准确率目标：
  - Intent classification: ≥ 95%
  - Quick task: 关键字段（标题、时长、截止）准确率 ≥ 90%
  - Bulk import: 任务数量准确率 ≥ 95%，字段准确率 ≥ 85%
  - Outcome parser: 数字准确率 ≥ 95%

- 工具建议：用 Promptfoo 或自建简易 eval 脚本（参考章节 11.3）

---

## 7. UI / UX 设计规范

### 7.1 设计原则

本产品的 UI 对标 **Notion** 和 **Linear** 的整体克制风格，但**色彩方向完全不同**。明确禁止：

- 禁用 emoji（任何位置）
- **严禁任何紫色、紫蓝色、蓝紫色**——包括但不限于：所有 H 值在 240°-310° 之间的色相、所有"科技蓝"倾向偏紫的色值、Linear 系产品的招牌强调色。本产品的强调色路线为**纯中性灰黑**，不走任何彩色 accent
- 禁用蓝色作为主强调色（仅在"信息状态"语义下小范围使用深蓝）
- 禁用渐变色（任何位置）
- 禁用阴影（除 focus ring 外）
- 禁用毛玻璃 / blur 效果
- 禁用霓虹 / glow / neon
- 禁用 Lottie 动画、夸张过渡

允许且推荐：

- 黑白灰为绝对主色调
- 强调色为接近黑色的深色（按钮主色 `#1F2937`）
- 状态色（成功/警告/危险/信息）取低饱和度版本
- 1px 极细描边（hairline border）
- 微妙的 fade / slide 过渡（≤ 200ms）

### 7.2 颜色系统

#### 7.2.1 Light Mode（默认）

```css
/* 背景 */
--bg-default: #FFFFFF;
--bg-subtle: #FAFAF9;     /* 轻微的 warm white，类似 Notion 页面背景 */
--bg-muted: #F4F4F3;
--bg-hover: #EFEEEC;
--bg-active: #E5E4E0;

/* 文字 */
--text-default: #1A1A19;
--text-muted: #6C6B68;
--text-subtle: #98978F;
--text-placeholder: #B8B7B0;
--text-inverse: #FFFFFF;

/* 边框 */
--border-default: rgba(0, 0, 0, 0.07);
--border-hover: rgba(0, 0, 0, 0.12);
--border-strong: rgba(0, 0, 0, 0.18);
--border-focus: #1A1A19;

/* 强调色 — 接近黑色，不是任何蓝紫 */
--accent-default: #1F2937;
--accent-hover: #111827;
--accent-active: #030712;
--accent-subtle-bg: #F3F4F6;

/* 状态色 — 低饱和度 */
--success-bg: #F0FAF4;
--success-fg: #15803D;
--success-border: #BBF7D0;

--warning-bg: #FFFBEB;
--warning-fg: #B45309;
--warning-border: #FDE68A;

--danger-bg: #FEF2F2;
--danger-fg: #B91C1C;
--danger-border: #FECACA;

--info-bg: #ECF4FB;
--info-fg: #0F4C81;
--info-border: #B6D4EC;
```

**色相硬约束**（设计师与开发者必须遵守）：
- 任何色值在 HSL 色相轮上 **必须落在 0°-220° 或 0°（红/橙/黄/绿/青/蓝）区间**
- **220°-340°（蓝紫/紫/紫红）区间完全禁用**
- 状态色 info 用纯青蓝（H ≈ 205°-215°），绝不向紫色倾斜

#### 7.2.2 Dark Mode

```css
--bg-default: #0F0F0F;
--bg-subtle: #161615;
--bg-muted: #1F1F1E;
--bg-hover: #2A2A28;
--bg-active: #353532;

--text-default: #ECECEA;
--text-muted: #A4A39E;
--text-subtle: #7A7975;
--text-placeholder: #5A5955;
--text-inverse: #0F0F0F;

--border-default: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.14);
--border-strong: rgba(255, 255, 255, 0.22);
--border-focus: #ECECEA;

--accent-default: #ECECEA;   /* dark mode 主按钮反白 */
--accent-hover: #FFFFFF;
--accent-subtle-bg: #2A2A28;

--success-bg: #14271C;
--success-fg: #86EFAC;
--warning-bg: #2A1F0A;
--warning-fg: #FCD34D;
--danger-bg: #2C0B0B;
--danger-fg: #FCA5A5;
--info-bg: #0A1A26;
--info-fg: #7EC8E3;
```

#### 7.2.3 项目色（用户可选）

为项目分配标识色时，仅提供以下 8 种克制色，全部为低饱和度：

```
#1F2937  Slate
#374151  Gray
#7F1D1D  Deep red
#7C2D12  Deep orange
#713F12  Deep amber
#14532D  Deep green
#164E63  Deep cyan
#0F4C81  Deep blue
```

注意：**列表中没有任何紫色、紫蓝色、粉色。** 8 个色值经过色相筛查，全部落在 H 0°-215° 区间。任何后续新增项目色必须经过同样筛查。

### 7.3 Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;

/* Sizes (px / line-height) */
--text-xs: 12px / 1.5
--text-sm: 13px / 1.55
--text-base: 14px / 1.6     /* 主要 UI */
--text-md: 15px / 1.6       /* 正文 */
--text-lg: 18px / 1.4       /* h3 */
--text-xl: 22px / 1.3       /* h2 */
--text-2xl: 28px / 1.2      /* h1 */

/* Weights — 严格三档 */
400 regular   /* 95% 文字 */
500 medium    /* 按钮、标签、tag */
600 semibold  /* 仅大标题 h1/h2 */
```

**绝不使用** font-weight 700/800/900。

### 7.4 间距系统（8px base）

```
2  : 2px   --space-2xs
4  : 4px   --space-xs
8  : 8px   --space-sm
12 : 12px  --space-md
16 : 16px  --space-lg
24 : 24px  --space-xl
32 : 32px  --space-2xl
48 : 48px  --space-3xl
64 : 64px  --space-4xl
```

### 7.5 圆角

```css
--radius-sm: 4px;    /* 标签、tag */
--radius-md: 6px;    /* 按钮、输入框（Notion 风格）*/
--radius-lg: 8px;    /* 卡片 */
--radius-xl: 12px;   /* 弹窗 */
--radius-full: 9999px;
```

### 7.6 阴影

只保留 focus ring，其他场景禁用。

```css
--focus-ring: 0 0 0 2px var(--border-focus);
--focus-ring-subtle: 0 0 0 2px rgba(31, 41, 55, 0.2);
```

### 7.7 核心组件规范

#### 7.7.1 Button

```
Sizes:
  sm: height 28px, padding 0 12px, font 13px
  md: height 32px, padding 0 14px, font 13px   ← 默认
  lg: height 36px, padding 0 16px, font 14px

Variants:
  primary    bg=accent-default, text=inverse, hover→accent-hover
  secondary  bg=transparent, border=border-default, text=text-default, hover→bg-hover
  ghost      bg=transparent, text=text-default, hover→bg-hover
  danger     bg=danger-bg, text=danger-fg, hover→danger-bg darker
```

绝不使用渐变、3D 效果、彩色边框。

#### 7.7.2 Input

```
Height: 32px (sm) / 36px (md) / 40px (lg)
Padding: 0 10px
Border: 1px solid border-default
Border-radius: radius-md
Bg: bg-default
Hover: border-color → border-hover
Focus: border-color → border-focus, box-shadow → focus-ring
Disabled: bg → bg-muted, text → text-muted
Placeholder: text → text-placeholder
```

#### 7.7.3 Card

```
Bg: bg-default
Border: 1px solid border-default
Border-radius: radius-lg
Padding: 16px 18px (默认) / 12px 14px (紧凑)
Hover (可点击时): border-color → border-hover, bg → bg-subtle
```

绝不使用阴影、渐变背景。

#### 7.7.4 Tag

```
Height: 22px
Padding: 0 8px
Border-radius: radius-sm
Font: 11px medium

Variants (内填色，无边框):
  default    bg-muted / text-muted
  success    success-bg / success-fg
  warning    warning-bg / warning-fg
  danger     danger-bg / danger-fg
  info       info-bg / info-fg
```

#### 7.7.5 Modal / Dialog

```
Width: 480px (默认) / 640px (宽) / 320px (确认对话框)
Border-radius: radius-xl
Bg: bg-default
Border: 1px solid border-default

Overlay: rgba(0, 0, 0, 0.4)（仅在 Modal 用）

Header: padding 20px 24px 12px, font-size 16px, font-weight 500
Body:   padding 0 24px 16px, font-size 14px
Footer: padding 12px 24px 20px, button-group right-aligned
```

#### 7.7.6 智能输入框

这是产品的核心组件，单独详细规范：

```
Container:
  Width: 640px (desktop) / 100% - 32px (mobile)
  Bg: bg-default
  Border: 1px solid border-default
  Border-radius: radius-lg
  Box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)  ← 唯一允许使用阴影的组件
  Padding: 0
  Position: 居中偏上（top: 20vh）

Header (icon row):
  Padding: 12px 16px 0
  Display: flex, gap: 8px
  Icons: 麦克风、键盘标识（无 emoji）

Input area:
  Padding: 12px 16px 16px
  Font: 16px / 1.5 regular
  Min-height: 48px
  Max-height: 240px (auto-scroll)
  Resize: none

Result panel (展开时):
  Padding: 0 16px 16px
  Border-top: 1px solid border-default
  Margin-top: 8px
```

#### 7.7.7 时间块 (TimeBlock)

```
Container:
  Display: grid, grid-template-columns: 56px 1fr auto
  Gap: 12px
  Padding: 10px 12px
  Border-radius: radius-md
  Hover: bg → bg-subtle
  Min-height: 52px

Time column (左):
  Font: 13px regular, text-muted
  Text-align: right
  Padding-top: 2px

Content column (中):
  Title: 14px medium, text-default
  Meta: 12px regular, text-muted, margin-top 2px

Actions column (右):
  显示完成 checkbox（始终）+ hover 时显示 hidden actions
```

### 7.8 页面布局

#### 7.8.1 主导航 (Sidebar)

```
Width: 232px (展开) / 56px (折叠)
Bg: bg-subtle
Border-right: 1px solid border-default

Sections:
  Logo (32px height)
  Quick add button (Cmd+K)
  Nav links: 今日 / 项目 / 复盘 / 设置
  Workspace switcher (bottom)
  User menu (bottom)
```

#### 7.8.2 主内容区

```
Max-width: 1024px (除项目详情可宽至 1280px)
Padding: 32px 48px (desktop) / 16px (mobile)
Bg: bg-default
```

#### 7.8.3 移动端响应

```
Breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px

Mobile-specific:
  Sidebar → 底部 Tab Bar (4 个图标)
  快速输入 → 底部悬浮按钮
  Modal → 全屏滑入面板
  长按 → 浮层操作菜单
```

### 7.9 微动效

仅允许以下：

```
Fade in:           opacity 0→1, duration 150ms
Slide in (modal):  translateY(8px)→0 + fade, duration 200ms
Hover scale (btn): 不做（保持平整）
Loading shimmer:   不做（用骨架屏 + opacity pulse）
```

Easing 统一使用 `cubic-bezier(0.16, 1, 0.3, 1)` 或 CSS `ease-out`。

### 7.10 图标

- 全部使用 **Lucide React**（轻量、风格统一）
- 不使用任何 emoji
- 不使用任何彩色图标
- 图标默认 16px，hover 时不放大
- 颜色继承父元素 `currentColor`

### 7.11 空状态 (Empty State)

```
Center-aligned
Icon: 24px Lucide outline, text-subtle
Title: 15px medium, text-default
Description: 13px regular, text-muted, max-width 320px
CTA Button (可选)

绝不使用插画、卡通形象、emoji
```

---

## 8. 技术栈与架构

### 8.1 技术选型

| 层 | 选型 | 版本 | 备注 |
|---|---|---|---|
| 框架 | Next.js | 14+ | App Router |
| UI | React | 18+ | |
| 样式 | TailwindCSS | 3.4+ | + 自定义 tokens |
| 组件库 | shadcn/ui | 最新 | 仅作起点，深度改造 |
| 状态管理 | Zustand | 4+ | 客户端状态 |
| 数据获取 | TanStack Query | 5+ | 服务端状态 |
| 表单 | React Hook Form + Zod | 最新 | |
| 后端 | Supabase | 最新 | DB + Auth + Edge Functions + Storage |
| AI | DeepSeek API | V3 + R1 | 通过 OpenAI 兼容接口 |
| 语音 | Web Speech API（v1） | - | 浏览器原生，免费 |
| 部署 | Vercel | - | + Supabase 自托管 / Supabase Cloud |
| 监控 | Sentry | - | 错误追踪 |
| 分析 | PostHog | - | 自托管或云端 |

### 8.2 目录结构

```
solo-workstation/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/                    # 已认证布局
│   │   │   ├── layout.tsx           # Sidebar + main
│   │   │   ├── today/               # 今日视图
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx         # 列表
│   │   │   │   └── [id]/            # 详情
│   │   │   ├── retro/               # 复盘
│   │   │   │   ├── page.tsx         # 周报
│   │   │   │   └── daily/           # 每日数据回报
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── parse/               # 智能解析
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── outcomes/
│   │   │   └── reports/
│   │   ├── layout.tsx               # 根布局
│   │   └── page.tsx                 # Landing
│   ├── components/
│   │   ├── ui/                      # 基础组件（Button, Input, ...）
│   │   ├── input-box/               # 智能输入框（核心）
│   │   ├── time-block/              # 时间块
│   │   ├── project-card/
│   │   └── ...
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # 浏览器端
│   │   │   ├── server.ts            # 服务端
│   │   │   └── types.ts             # DB 类型（auto-gen）
│   │   ├── ai/
│   │   │   ├── deepseek.ts          # API 客户端
│   │   │   ├── prompts/
│   │   │   │   ├── intent.ts
│   │   │   │   ├── quick-task.ts
│   │   │   │   ├── goal-decomp.ts
│   │   │   │   ├── bulk-import.ts
│   │   │   │   ├── maintenance.ts
│   │   │   │   ├── outcome.ts
│   │   │   │   └── insights.ts
│   │   │   └── parser.ts            # 调度 prompt → DeepSeek → 验证 JSON
│   │   ├── scheduler/
│   │   │   ├── engine.ts            # 调度引擎核心
│   │   │   ├── cascade.ts           # 级联逻辑
│   │   │   ├── slot-finder.ts       # 空档查找
│   │   │   └── capacity.ts          # 产能学习
│   │   └── utils/
│   ├── hooks/
│   ├── stores/                      # Zustand
│   └── types/
├── supabase/
│   ├── migrations/                  # SQL 迁移文件
│   ├── functions/                   # Edge Functions
│   │   ├── parse-input/
│   │   ├── schedule-task/
│   │   ├── cascade-reschedule/
│   │   ├── generate-weekly-report/  # cron
│   │   └── send-daily-reminder/     # cron
│   └── config.toml
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── prompts/                     # Prompt eval
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### 8.3 环境变量

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# DeepSeek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com

# XORPAY
XORPAY_AID=
XORPAY_APP_SECRET=
XORPAY_BASE_URL=https://xorpay.com

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=  # Vercel cron 鉴权
```

### 8.4 Cron Jobs

通过 Vercel Cron 触发 Supabase Edge Functions：

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-reminder",
      "schedule": "0 12 * * *"   // UTC 12:00 = 北京 20:00
    },
    {
      "path": "/api/cron/weekly-report",
      "schedule": "0 1 * * 1"    // UTC 1:00 周一 = 北京 9:00 周一
    },
    {
      "path": "/api/cron/capacity-recompute",
      "schedule": "0 17 * * 0"   // UTC 17:00 周日 = 北京 1:00 周一
    }
  ]
}
```

### 8.5 AI 调用层

```typescript
// src/lib/ai/deepseek.ts

import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function callDeepseek(params: {
  model: 'deepseek-chat' | 'deepseek-reasoner';
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}) {
  const startTime = Date.now();
  try {
    const completion = await deepseek.chat.completions.create({
      model: params.model,
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userMessage },
      ],
      temperature: params.temperature ?? 0.1,
      max_tokens: params.maxTokens ?? 800,
      response_format: params.jsonMode ? { type: 'json_object' } : undefined,
    });

    const result = completion.choices[0].message.content;
    const latency = Date.now() - startTime;

    // 记录到 ai_call_logs（异步，不阻塞）
    logCall({
      model: params.model,
      input_tokens: completion.usage?.prompt_tokens,
      output_tokens: completion.usage?.completion_tokens,
      latency_ms: latency,
      success: true,
    }).catch(console.error);

    return JSON.parse(result!);
  } catch (error) {
    const latency = Date.now() - startTime;
    logCall({
      model: params.model,
      latency_ms: latency,
      success: false,
      error_message: String(error),
    }).catch(console.error);
    throw error;
  }
}
```

### 8.6 降级策略

DeepSeek API 失败时的处理：

1. 自动重试 1 次（300ms 延迟）
2. 仍失败：前端切换为"表单输入模式"，用户手动填字段
3. 解析类失败不阻塞核心 CRUD（用户仍可手动创建任务）
4. AI 调用失败率监控告警：阈值 ≥ 5% 触发 PagerDuty / 邮件

---

## 9. 开发计划（10 周）

### 9.1 总体节奏

**重要变更**：基于第二轮 PRD 评审新增的 11 项功能（输入引导、人在回路、草稿模式、漏报宽限、任务详情、多视图、用户自评、轻日模式、付费订阅、邀请机制、分享卡片），开发周期确定为 **10 周**。

假设单人开发 + AI 协作（Claude Code），每周投入 25-30 小时。

| 周 | 主题 | 关键交付物 |
|---|---|---|
| 1-2 | 基础设施 | Next.js + Supabase + XORPAY 跑通；数据库 schema（含订阅、支付订单、邀请、撤销表）部署 |
| 3-4 | 调度引擎核心 | 任务 CRUD；排程算法；人在回路级联 + 撤销机制；50+ 单元测试 |
| 5-6 | AI 输入层 | 7 个 prompt 全部实现 + eval 通过；语音输入；批量粘贴；输入框引导 UX |
| 7 | 视图层 | 今日视图（含轻日模式）；项目视图（列表 + 看板）；任务详情页 |
| 8 | 复盘 | 每日数据（含漏报宽限）+ 周报 + 用户自评 + AI 洞察 |
| 9 | 商业 & 增长 | XORPAY 集成；试用→付费流程；邀请机制；分享卡片 |
| 10 | 内测 & 打磨 | 3-5 个种子用户邀请；反馈快速迭代；性能压测 |

### 9.2 周一详细任务

#### Week 1
- [ ] 项目初始化（Next.js 14 + TypeScript + Tailwind + shadcn/ui）
- [ ] Supabase 项目创建，本地开发环境（supabase CLI）
- [ ] 数据库迁移 Part 1：核心表（user_profiles, projects, tasks, milestones, task_dependencies）+ RLS
- [ ] Vercel 部署管道配置
- [ ] Sentry + PostHog 集成
- [ ] 设计 tokens（Tailwind config）实现

#### Week 2
- [ ] Supabase Auth（邮箱密码 + Magic Link）
- [ ] 登录 / 注册 / 引导流程页面
- [ ] User profile API
- [ ] 基础布局（Sidebar + Main + Mobile bottom tab）
- [ ] 用户设置页（工作时段、产能预算等）
- [ ] 数据库迁移 Part 2：辅助表（outcome_metrics, platforms, weekly_reports, undo_snapshots, decomposition_drafts, subscriptions, payment_orders, referral_codes, share_cards, task_history, task_links, weekly_self_reviews, daily_mood_notes, daily_ai_usage）

#### Week 3
- [ ] Task CRUD API + 完整测试
- [ ] Project CRUD API
- [ ] Milestone CRUD API
- [ ] 排程算法 v1（slot-finder + capacity check）
- [ ] 50+ 单元测试覆盖核心算法

#### Week 4
- [ ] 级联逻辑（BFS + topological sort）+ 人在回路 plan/confirm 两阶段 API
- [ ] 撤销机制（undo_snapshots 创建、24h 过期、一键回滚）
- [ ] 硬截止冲突检测
- [ ] 调度事件日志记录
- [ ] 任务完成 / 顺延 / 取消 API
- [ ] 产能学习 cron job

#### Week 5
- [ ] DeepSeek 客户端封装 + 日志记录 + 配额管控
- [ ] Prompt 1-3: Intent / Quick Task / Outcome Parser
- [ ] 智能输入框 UI（核心组件）+ Placeholder 轮播 + Chip 模板
- [ ] 解析结果展示 UI + AI 兜底表单
- [ ] Prompt eval 框架搭建

#### Week 6
- [ ] Prompt 4-5: Goal Decomp Phase 1 + 2（多轮对话，输出到 drafts 表）
- [ ] 拆解草稿审阅与挑选排入 UI（关键）
- [ ] Prompt 6: Bulk Import
- [ ] Prompt 7: Task Maintenance
- [ ] 语音输入（Web Speech API）
- [ ] "显示 AI 解析过程"开关
- [ ] 第 3 次失败的主动救援引导
- [ ] 所有 prompt eval 通过 90% 准确率

#### Week 7
- [ ] 今日视图完整实现（时间块、提醒条、交互）
- [ ] 轻日模式（产能减半 + 暂停 + 心情备注）
- [ ] 项目列表视图 + 看板视图（双视图切换）
- [ ] 任务详情页（侧栏 + 全屏，含历史、链接、备注）
- [ ] 完成回顾弹窗
- [ ] 拖拽排序（dnd-kit）
- [ ] 键盘快捷键（Cmd+K, Enter, Esc, /, Cmd+Shift+L）
- [ ] 移动端响应式

#### Week 8
- [ ] 每日数据回报 UI + 漏报宽限（48h 内可补报）
- [ ] 周末一键补报视图
- [ ] 周报 cron + 周报视图
- [ ] 用户自评模块（顶部三个开放字段）
- [ ] AI 洞察生成（引用用户自评作为锚点）
- [ ] 系统调整记录（透明度模块）
- [ ] 平台配置 UI
- [ ] 数据导出（CSV）

#### Week 9
- [ ] XORPAY 集成（签名、创建订单、二维码 / 支付链接、回调校验、订单查询）
- [ ] 14 天试用机制（无需绑卡，第 13 天弹付费提醒对话框）
- [ ] 付费套餐选择 UI（基础版 / 专业版，月付 / 年付）
- [ ] 只读模式（试用过期、订阅过期）
- [ ] 配额管控（每日 AI 调用次数）
- [ ] 续费提醒开关与到期只读流程
- [ ] 邀请码生成 + 邀请链接 + 奖励发放
- [ ] 分享卡片生成（3 种模板，PNG + 公开链接）
- [ ] 用户中心：订阅状态、邀请战绩、分享历史

#### Week 10
- [ ] 邀请 3-5 个种子用户内测
- [ ] 反馈收集渠道（站内 widget + 飞书群）
- [ ] 性能压测（关键 API、AI 调用、级联）
- [ ] Bug 修复 + UX 打磨
- [ ] 上线前 checklist：安全、监控、备份
- [ ] 公开发布准备：着陆页、定价页、Onboarding 视频

### 9.3 风险与对策

| 风险 | 影响 | 对策 |
|---|---|---|
| 排程算法 Week 3-4 超时 | 整体延期 | v1 只做基础版（slot finder + 简单 cascade），复杂依赖留 v1.1 |
| Prompt 调优时间不足 | 准确率不达标 | Week 5 末尾留 2 天专门做 eval；准备降级方案 |
| 种子用户找不到 | 反馈无来源 | Week 7 同步在自媒体账号发预热内容，建候补名单 |
| DeepSeek API 故障 | 用户无法使用 | 实现降级 UI；监控告警；保留 OpenRouter 备份方案配置 |
| XORPAY 回调或风控异常 | 付费转化卡住 | 支付状态支持手动查询；保留人工开通 fallback；关键错误进入告警 |
| 任务详情页 Scope 过大 | Week 7 超时 | 拆分：基础详情 v1 必做（标题/属性/描述/链接/历史），完成回顾可挪到 v1.1 |
| 邀请刷量 | 邀请成本失控 | 单用户最多累计 12 个月奖励；新注册邮箱需验证；监控异常邀请关系 |

---

## 10. 非功能性需求

### 10.1 性能

| 指标 | 目标 |
|---|---|
| 首屏加载 (LCP) | ≤ 2.0s (P75, 4G) |
| 智能输入框打开 | ≤ 100ms |
| AI 解析响应 | ≤ 5s (P95) |
| 级联调整 | ≤ 2s（含 DB 写入） |
| 今日视图渲染 | ≤ 500ms（含 200 个任务） |

### 10.2 安全

- 全部表启用 RLS，禁止 service_role 在前端使用
- API 全部走 Supabase JWT 验证
- 敏感操作（删除项目、级联多于 5 个任务）二次确认
- DeepSeek API Key 仅服务端使用，永不暴露
- 用户数据导出 / 删除符合 GDPR-like 标准
- 密码 bcrypt（Supabase 默认）

### 10.3 可观测性

- Sentry：前端 + 后端错误
- PostHog：用户行为埋点（关键事件：register, first_task_created, first_parse_success, weekly_report_viewed）
- ai_call_logs 表：每次 AI 调用都记录 token + cost + latency
- 自建监控 dashboard（Metabase 或简易 Supabase view）

### 10.4 可访问性 (a11y)

- 全部交互元素键盘可达
- 焦点环可见（focus ring）
- 颜色对比度 ≥ WCAG AA
- 表单字段必带 label
- ARIA 标签覆盖图标按钮

### 10.5 国际化

- v1 仅中文
- 文案集中在 `src/i18n/zh-CN.ts`，便于 v1.1 加英文版

---

## 11. 附录

### 11.1 关键 TypeScript 类型

```typescript
// src/types/index.ts

export type Priority = 'high' | 'key' | 'normal' | 'low';

export type TaskStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'cancelled';

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: Priority;
  estimated_minutes: number;
  actual_minutes: number | null;
  hard_deadline: string | null;
  recurrence_rule: string | null;
  status: TaskStatus;
  scheduled_start: string | null;
  scheduled_end: string | null;
  completed_at: string | null;
  tags: string[];
  source_input: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  target_end_date: string | null;
  actual_end_date: string | null;
  status: ProjectStatus;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  target_date: string;
  completed_at: string | null;
  display_order: number;
  created_at: string;
}

export interface OutcomeMetric {
  id: string;
  user_id: string;
  metric_date: string;
  platform: string;
  metric_key: string;
  metric_value: number;
  raw_input: string | null;
  created_at: string;
}

export type ParseIntent =
  | 'quick_task'
  | 'goal_decomposition'
  | 'bulk_import'
  | 'task_maintenance'
  | 'outcome_report'
  | 'unknown';

export interface ParseResponse<T = unknown> {
  intent: ParseIntent;
  confidence: number;
  result: T;
}

export interface QuickTaskResult {
  task: Omit<Task, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'completed_at' | 'actual_minutes' | 'scheduled_start' | 'scheduled_end'>;
  suggested_slot: {
    scheduled_start: string;
    scheduled_end: string;
    reasoning: string;
  };
  insights: string[];
}

export interface WeeklyReport {
  week_start_date: string;
  week_end_date: string;
  task_completion: {
    total: number;
    completed: number;
    completion_rate: number;
    daily_breakdown: Array<{ date: string; completed: number; total: number }>;
    project_time_invested: Array<{ project_id: string; name: string; minutes: number }>;
  };
  outcomes: Array<{
    platform: string;
    metrics: Array<{ key: string; value: number; wow_change: number }>;
  }>;
  ai_insights: Array<{
    title: string;
    fact: string;
    suggestion: string;
    action: {
      type: 'create_task' | 'create_milestone' | 'review_goal' | null;
      draft_task?: Partial<Task>;
    };
  }>;
}
```

### 11.2 Prompt Eval 脚本结构

```typescript
// tests/prompts/eval.ts

interface TestCase {
  input: string;
  context?: Record<string, unknown>;
  expected: Record<string, unknown>;
  matcher?: (actual: any, expected: any) => boolean;
}

interface PromptSuite {
  name: string;
  prompt_fn: (input: string, ctx: any) => Promise<any>;
  cases: TestCase[];
  threshold: number;
}

async function runSuite(suite: PromptSuite) {
  let passed = 0;
  for (const tc of suite.cases) {
    const actual = await suite.prompt_fn(tc.input, tc.context);
    const matched = tc.matcher
      ? tc.matcher(actual, tc.expected)
      : defaultMatcher(actual, tc.expected);
    if (matched) passed++;
    else console.log(`FAIL: ${suite.name}: ${tc.input}`, { actual, expected: tc.expected });
  }
  const accuracy = passed / suite.cases.length;
  if (accuracy < suite.threshold) {
    throw new Error(`${suite.name} accuracy ${accuracy} < threshold ${suite.threshold}`);
  }
  console.log(`PASS: ${suite.name} ${passed}/${suite.cases.length} (${(accuracy*100).toFixed(1)}%)`);
}
```

### 11.3 .env.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com

# XORPAY
XORPAY_AID=999
XORPAY_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
XORPAY_BASE_URL=https://xorpay.com

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=<random 32-char string>

# Optional
NODE_ENV=development
```

### 11.4 package.json 关键依赖

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "openai": "^4.60.0",
    "@tanstack/react-query": "^5.50.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.400.0",
    "date-fns": "^3.6.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@sentry/nextjs": "^8.0.0",
    "posthog-js": "^1.150.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "supabase": "^1.180.0"
  }
}
```

### 11.5 Tailwind Config（关键部分）

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          default: 'var(--bg-default)',
          subtle: 'var(--bg-subtle)',
          muted: 'var(--bg-muted)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
        },
        text: {
          default: 'var(--text-default)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          placeholder: 'var(--text-placeholder)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          default: 'var(--border-default)',
          hover: 'var(--border-hover)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
        accent: {
          DEFAULT: 'var(--accent-default)',
          hover: 'var(--accent-hover)',
          active: 'var(--accent-active)',
          subtle: 'var(--accent-subtle-bg)',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### 11.6 关键决策记录

| 决策 | 选择 | 理由 |
|---|---|---|
| 单一 AI 供应商 | 仅 DeepSeek | 成本最低，中文场景质量足够 |
| 客户端 vs SaaS | SaaS Web + PWA | 多端同步、产品化路径、降低维护成本 |
| 数据库 | Supabase PostgreSQL | Auth + DB + Edge Function 一体，单人维护友好 |
| 状态管理 | Zustand + TanStack Query | 比 Redux 轻，比 Context 强 |
| 不做 API 集成（抖音等） | 强制手动报数据 | 各平台不开放 + 手动报数据本身有反思价值 |
| 不做多用户协作 | v1 不实施 | 一人公司用户单人足够，B 端是 v2/v3 杠杆 |
| 调度算法 | 贪心 + 启发式 | 不需要最优解，"够好"即可，开发周期可控 |
| 周报生成时机 | 周一早上 | 用户周末通常不工作，周一开始新一周时看 |

### 11.7 上线后第一个月监控指标

| 指标 | 含义 | 健康阈值 |
|---|---|---|
| D7 留存 | 第 7 日仍打开应用的用户比例 | ≥ 40% |
| 第一周任务创建数 / 用户 | 验证使用深度 | ≥ 10 |
| 智能输入框使用率 | 占任务创建的比例 | ≥ 70% |
| AI 解析成功率 | 不需要用户重新理解的比例 | ≥ 85% |
| 周报阅读率 | 生成后 24h 内查看 | ≥ 50% |
| AI 调用成本 / DAU | 单 DAU 日均 AI 成本 | ≤ ¥0.5 |
| 错误率（Sentry） | 致命错误率 | ≤ 0.5% |

---

## 12. 后续版本规划（仅供参考，v1 不实施）

### v1.1（约 4-6 周后）
- 微信扫码登录
- Google OAuth
- 浏览器扩展（半自动抓取平台数据）
- 任务模板库
- 高级依赖关系（任务图谱可视化）

### v1.2
- 出海英文版
- 海外收款通道
- 订阅套餐（Free / Pro 区分）

### v2（约 4-6 个月后）
- 工作室版（3-5 人协作）
- 团队任务分配
- 共享项目

### v3+
- 完整 CRM 模块
- 营销自动化
- 财务管理

---

**文档结束。**

如对任何章节有疑问，建议优先阅读章节 1.5（v1 边界）和章节 9（开发计划），明确知道"什么不做"比"做什么"更重要。
