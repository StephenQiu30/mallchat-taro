## Why

`demo.html` 已给出 MallChat 移动端 IM 的高保真方向，但 Taro 当前页面仍存在联系人私聊跳转链路不稳、聊天输入栏工具入口不完整等问题。该 change 用于认领 Taro 端作为首个自动化执行的视觉还原和主链路修正任务。

## What Changes

- 新增 Taro 移动端 IM 体验 PRD、视觉还原设计和执行计划。
- 修改联系人页点击好友逻辑：先获取或创建私聊房间，再进入聊天页。
- 修改聊天详情输入栏：补齐语音、表情、图片、更多入口，并保留文本和图片发送能力。
- 不新增后端接口，不引入新 UI 库，不实现真实语音录制或表情面板。

## Capabilities

### New Capabilities

- `mobile-im-experience`: Taro 端移动 IM 主页面、联系人私聊入口、聊天详情输入栏和 demo.html 风格还原体验。

### Modified Capabilities

- 无。

## Impact

- 文档：`docs/prd/P-001-mobile-im-experience-prd.md`、`docs/design/D-003-demo-im-ui-restoration.md`、`docs/plans/PL-001-demo-im-mobile-shell-plan.md`。
- 代码：`src/pages/contact/index.tsx`、`src/pages/chat/index.tsx`、`src/pages/chat/index.scss`。
- 验证：OpenSpec strict 校验、`pnpm run build:weapp`。
