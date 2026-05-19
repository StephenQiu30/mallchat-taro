---
layer: Plan
doc_no: "PL-001"
audience:
  - PM
  - Dev
  - QA
feature_area: mobile-im-experience
purpose: "拆解 Taro 小程序端 demo.html 风格还原与 IM 主链路修正任务。"
canonical_path: "docs/plans/PL-001-demo-im-mobile-shell-plan.md"
status: draft
version: "0.1.0"
owner: "StephenQiu30"
inputs:
  - "../prd/P-001-mobile-im-experience-prd.md"
  - "../design/D-003-demo-im-ui-restoration.md"
outputs:
  - "OpenSpec change restore-demo-im-mobile-shell 的执行计划"
triggers:
  - "继续执行 Taro 移动端 IM 体验改造"
downstream:
  - "../acceptance/A-003-demo-im-mobile-shell-acceptance.md"
---

# Taro demo.html 还原执行计划

## 1. 本轮任务

1. 创建 OpenSpec change `restore-demo-im-mobile-shell`。
2. 编写 PRD、Design、Plan 和 spec delta。
3. 修正联系人进入私聊的 `roomId` 获取方式。
4. 补齐聊天输入栏工具入口。
5. 执行 OpenSpec 和 Taro weapp 构建验证。

## 2. 延后任务

1. 真实语音消息录制和发送。
2. 表情面板与自定义表情。
3. 文件消息上传入口。
4. Flutter/UniApp 同风格同步。

## 3. 验收门禁

- `openspec validate restore-demo-im-mobile-shell --strict`
- `pnpm run build:weapp`
- `docs/acceptance/A-003-demo-im-mobile-shell-acceptance.md` 记录结论。
