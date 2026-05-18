---
layer: design
doc_no: D-001
audience: 开发团队
purpose: 记录 mallchat-taro 项目的技术架构和设计决策
owner: 开发团队
inputs: demo.html 设计稿、mallchat-cloud 后端 API
outputs: 技术架构文档
triggers: 项目启动、架构变更
downstream: 开发实现、测试验证
---

# mallchat-taro 技术架构文档

## 1. 项目概述

mallchat-taro 是一个基于 Taro 4.x + React 18 的跨平台聊天小程序，支持微信、支付宝、抖音等小程序平台。

## 2. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Taro | 4.1.11 |
| UI 库 | React | 18.x |
| 状态管理 | Redux Toolkit | 2.x |
| 组件库 | Taroify | 0.6.x |
| 样式 | SCSS | - |
| 构建工具 | Vite | 5.x |
| 类型检查 | TypeScript | 5.x |

## 3. 项目结构

```
mallchat-taro/
├── src/
│   ├── api/                # API 接口定义（自动生成）
│   ├── components/         # 公共组件
│   │   ├── ActionPill/
│   │   ├── Avatar/
│   │   ├── InsetCard/
│   │   ├── ListStatus/
│   │   └── PageShell/
│   ├── pages/              # 页面组件
│   │   ├── index/          # 消息列表页
│   │   ├── contact/        # 联系人页
│   │   ├── chat/           # 聊天页
│   │   ├── notification/   # 通知页
│   │   └── profile/        # 个人中心页
│   ├── services/           # 服务层
│   │   └── websocket.ts    # WebSocket 管理器
│   ├── store/              # Redux 状态管理
│   │   ├── index.ts
│   │   └── slices/
│   ├── utils/              # 工具函数
│   ├── app.tsx             # 应用入口
│   └── app.config.ts       # 应用配置
├── docs/                   # 项目文档
└── package.json
```

## 4. 核心模块设计

### 4.1 WebSocket 通信模块

**文件位置:** `src/services/websocket.ts`

**设计模式:** 单例模式

**核心功能:**
- 连接管理：连接、断开、重连
- 心跳机制：30 秒间隔心跳包
- 消息分发：按消息类型分发到不同处理器
- 事件订阅：支持自定义消息处理

**消息类型:**
```typescript
enum WsMessageType {
  AUTH = 0,           // 认证
  HEARTBEAT = 1,      // 心跳
  MESSAGE = 2,        // 聊天消息
  SYSTEM_NOTICE = 3,  // 系统通知
  ONLINE_STATUS = 8,  // 在线状态
  FRIEND_APPROVE = 10, // 好友申请
  ERROR = 99          // 错误
}
```

### 4.2 状态管理模块

**文件位置:** `src/store/`

**Redux Slices:**
- `userSlice`: 用户信息、登录状态、Token
- `websocketSlice`: WebSocket 连接状态、在线用户

**数据流:**
```
API 请求 → Redux Thunk → Store → Component
WebSocket → Event Handler → Store → Component
```

### 4.3 API 请求模块

**文件位置:** `src/api/`

**特点:**
- 基于 Taro.request 封装
- 自动携带 Token
- 统一错误处理
- TypeScript 类型支持

## 5. 页面功能矩阵

| 页面 | 功能 | 状态 |
|------|------|------|
| 消息列表 | 会话列表、未读数、搜索、置顶、删除 | ✅ 完成 |
| 联系人 | 好友列表、分组、搜索、添加好友 | ✅ 完成 |
| 聊天 | 消息气泡、图片发送、消息撤回、实时通信 | ✅ 完成 |
| 群聊管理 | 创建群聊、群详情、邀请/退出/解散 | ✅ 完成 |
| 好友动态 | 动态列表、图文展示 | ✅ 完成 |
| 通知中心 | 系统通知列表 | ✅ 完成 |
| 个人中心 | 用户信息、编辑资料、设置 | ✅ 完成 |

## 6. 数据流设计

### 6.1 消息实时通信流程

```
用户发送消息
    ↓
调用 sendMessage API
    ↓
后端处理并存储
    ↓
通过 WebSocket 推送
    ↓
wsManager 接收并分发
    ↓
Redux Store 更新
    ↓
UI 自动刷新
```

### 6.2 会话列表更新流程

```
WebSocket 收到新消息
    ↓
触发 MESSAGE 事件
    ↓
会话列表页监听事件
    ↓
调用 fetchSessions 刷新
    ↓
UI 更新会话列表
```

## 7. 设计决策记录

| 决策 | 理由 |
|------|------|
| 使用 Taroify 组件库 | 跨平台支持、iOS 风格、与 Taro 深度集成 |
| 使用 Redux Toolkit | 简化 Redux 开发、内置 Immer、支持 Thunk |
| WebSocket 单例模式 | 全局唯一连接、便于管理生命周期 |
| 消息按首字母分组 | 符合中文用户习惯、参考 QQ/微信设计 |
| 使用 SCSS | 支持变量、嵌套、提高样式可维护性 |

## 8. 性能优化策略

1. **列表虚拟化**：长列表使用虚拟滚动
2. **图片懒加载**：图片按需加载
3. **消息分页**：历史消息分页加载
4. **状态缓存**：Redux 持久化关键状态
5. **请求防抖**：搜索输入防抖处理
