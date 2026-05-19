# mallchat-taro

MallChat Taro 小程序端，使用 Taro + React + TypeScript 实现 QQ-like IM 的移动端主体验。

## 当前定位

1. 优先还原 `demo.html` 中的消息、联系人、动态、聊天详情四个核心页面。
2. 复用 `mallchat-cloud` 已有的用户、好友、群聊、消息、会话、通知、文件和 WebSocket API。
3. 作为多端移动体验的主参考，后续 UniApp 与 Flutter 端应尽量与本端产品结构保持一致。

## 常用命令

```bash
npm run build:weapp
npm run dev:weapp
npm run openapi
bash scripts/validate-repository.sh
```

## 规范入口

1. 全局协作规范见 `AGENTS.md`。
2. 当前项目局部规范见 `AGENTS.local.md`。
3. 长期产品、设计、验收和运维文档放入 `docs/` 对应目录。
