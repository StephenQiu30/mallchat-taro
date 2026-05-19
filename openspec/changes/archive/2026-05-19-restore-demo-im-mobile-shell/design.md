## Context

Taro 当前已经具备会话列表、好友列表、聊天详情、WebSocket、文本发送、图片发送和已读上报能力。`demo.html` 的核心差距集中在联系人进入私聊的真实 roomId 链路，以及聊天底部工具栏的 IM 入口完整性。

## Design

1. 联系人点击：
   - 调用 `getOrCreatePrivateRoom({ peerUserId })`。
   - 成功后以返回的 roomId 跳转 `/pages/chat/index?id=<roomId>&name=<friendName>`。
   - 失败时使用 toast 提示。
2. 聊天输入栏：
   - 左侧增加语音按钮，点击提示“语音消息后续开放”。
   - 输入框保持现有文本输入和回车发送。
   - 右侧在空输入时展示表情、图片、更多入口。
   - 图片入口复用现有 `handleSendImage`。
   - 表情和更多入口提供占位 toast，避免不可见失败。
3. 视觉：
   - 保持 `var(--ios-*)` 变量体系。
   - 按 `demo.html` 使用圆形工具按钮、白色输入框、浅灰毛玻璃底栏。

## Non-goals

- 不实现语音录制。
- 不实现表情面板。
- 不实现文件选择器。
- 不新增依赖。

## Verification

- `openspec validate restore-demo-im-mobile-shell --strict`
- `pnpm run build:weapp`
