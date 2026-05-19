---
layer: Design
doc_no: "D-003"
audience:
  - Dev
  - QA
feature_area: mobile-im-experience
purpose: "记录 Taro 小程序端还原 demo.html 的视觉规则、组件映射和实现边界。"
canonical_path: "docs/design/D-003-demo-im-ui-restoration.md"
status: draft
version: "0.1.0"
owner: "StephenQiu30"
inputs:
  - "../prd/P-001-mobile-im-experience-prd.md"
outputs:
  - "移动端 IM 视觉还原设计"
triggers:
  - "调整 Taro 端 IM 页面视觉"
downstream:
  - "../plans/PL-001-demo-im-mobile-shell-plan.md"
---

# demo.html 移动端 IM 视觉还原设计

## 1. 视觉语言

- 背景：浅灰 `#F3F4F6/#F7F8FA`。
- 主卡片：白色、细边框、轻阴影、24rpx 到 34rpx 圆角。
- 强调色：蓝色 `#0A84FF/#3B82F6`，用于选中态、自己消息、群头像、在线/操作入口。
- 字体层级：页面标题 34rpx 到 44rpx，正文 28rpx 到 30rpx，辅助信息 20rpx 到 24rpx。
- 状态：未读红点、在线绿点、置顶标签、群聊标签、空态/未登录态均需保留。

## 2. 页面映射

| demo.html | Taro 页面 | 实现原则 |
| --- | --- | --- |
| 消息页 | `src/pages/index` | 真实会话数据 + demo 卡片样式 |
| 联系人页 | `src/pages/contact` | 真实好友列表 + 私聊房间跳转 |
| 动态/我的 | `src/pages/profile` | 登录资料 + 蓝色封面 + 服务入口 |
| 聊天详情 | `src/pages/chat` | 真实消息链路 + 左白右蓝气泡 + 工具输入栏 |

## 3. 本轮实现边界

1. 保留 Taro 当前 API 和组件体系。
2. 修正私聊跳转链路。
3. 输入栏补齐语音和表情入口的视觉占位，真实语音录制与表情面板延后。
4. 不引入新的 UI 组件库或图标库。

## 4. 验收

- 编译通过。
- 设计稿关键结构均能在页面源码中找到对应实现。
- 新增占位入口有明确 toast 反馈，不制造不可点击的假按钮。
