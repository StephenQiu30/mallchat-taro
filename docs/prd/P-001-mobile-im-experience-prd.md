---
layer: PRD
doc_no: "P-001"
audience:
  - PM
  - Dev
  - QA
feature_area: mobile-im-experience
purpose: "定义 Taro 小程序端根据 demo.html 还原 IM 主界面的产品边界与验收标准。"
canonical_path: "docs/prd/P-001-mobile-im-experience-prd.md"
status: draft
version: "0.1.0"
owner: "StephenQiu30"
inputs:
  - "../../demo.html"
  - "../../openspec/changes/restore-demo-im-mobile-shell"
outputs:
  - "Taro 端移动 IM 体验范围"
triggers:
  - "修改消息、联系人、动态或聊天详情页"
downstream:
  - "../design/D-003-demo-im-ui-restoration.md"
  - "../plans/PL-001-demo-im-mobile-shell-plan.md"
---

# Taro 移动端 IM 体验 PRD

## 1. 背景

`demo.html` 定义了 MallChat 移动端首屏视觉：消息、联系人、动态和聊天详情页采用 QQ-like 小程序体验，强调浅灰背景、白色卡片、蓝色强调、头像、未读、在线和 iOS 安全区质感。

## 2. 目标

1. 消息页保持真实会话数据，同时更贴近 `demo.html` 的“头像 + 消息 + 加号 + 搜索 + 卡片列表”。
2. 联系人页点击好友必须获取真实私聊房间，再进入聊天详情。
3. 聊天详情页输入栏补齐语音、文本、表情、图片和更多入口，保持现有文本/图片发送能力。
4. 动态/我的页继续保持蓝色封面、个人信息卡、三列统计和服务入口。

## 3. 非目标

- 不新增后端接口。
- 不重写 Taro 状态管理。
- 不实现真实语音消息和表情面板，只补齐入口和占位反馈。
- 不同步修改 UniApp 或 Flutter。

## 4. 核心场景

```gherkin
Given 用户已登录且存在好友
When 用户在联系人页点击好友
Then 小程序应调用私聊房间接口获取 roomId
And 跳转到聊天详情页
```

```gherkin
Given 用户进入聊天详情页
When 输入框为空
Then 输入栏应展示语音、表情、图片、更多等 IM 工具入口
```

## 5. 验收门禁

- `openspec validate restore-demo-im-mobile-shell --strict` 通过。
- `pnpm run build:weapp` 通过。
- 联系人页不再把用户 ID 当作聊天房间 ID。
- 聊天输入栏视觉接近 `demo.html` 的四入口工具条。

## 6. 变更记录

| 日期 | 作者 | 版本 | 变更说明 |
| --- | --- | --- | --- |
| 2026-05-19 | StephenQiu30 | 0.1.0 | 初始化 Taro 移动端 IM 体验 PRD |
