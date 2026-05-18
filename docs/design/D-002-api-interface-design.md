---
layer: design
doc_no: D-002
audience: 开发团队
purpose: 记录 mallchat-taro 项目使用的后端 API 接口
owner: 开发团队
inputs: mallchat-cloud 后端 API
outputs: API 接口文档
triggers: API 变更、新功能开发
downstream: 开发实现、测试验证
---

# mallchat-taro API 接口文档

## 1. API 基础信息

- **基础路径:** `/api`
- **认证方式:** Bearer Token (JWT)
- **请求格式:** JSON
- **响应格式:** JSON

## 2. 用户相关接口

### 2.1 用户登录

**POST** `/api/user/login/ma`

**请求参数:**
```typescript
interface LoginRequest {
  code: string;  // 微信小程序 code
}
```

**响应:**
```typescript
interface LoginResponse {
  code: number;
  data: {
    token: string;
  };
}
```

### 2.2 获取当前用户信息

**GET** `/api/user/info`

**响应:**
```typescript
interface UserInfo {
  id: number;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: number;
}
```

### 2.3 更新用户信息

**PUT** `/api/user/info`

**请求参数:**
```typescript
interface UpdateUserRequest {
  userName?: string;
  userAvatar?: string;
  userProfile?: string;
}
```

## 3. 聊天相关接口

### 3.1 获取会话列表

**GET** `/api/chat/session/list`

**响应:**
```typescript
interface ChatSessionVO {
  roomId: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  topStatus: number;
  activeTime: string;
}
```

### 3.2 发送消息

**POST** `/api/chat/message/send`

**请求参数:**
```typescript
interface SendMessageRequest {
  roomId: number;
  content: string;
  type: number;  // 1-文本，2-图片，3-文件
}
```

### 3.3 获取历史消息

**GET** `/api/chat/message/list`

**请求参数:**
```typescript
interface MessageListParams {
  roomId: number;
  pageSize?: number;
  lastMessageId?: number;
}
```

**响应:**
```typescript
interface ChatMessageVO {
  id: number;
  roomId: number;
  fromUserId: number;
  fromUserName: string;
  fromUserAvatar: string;
  content: string;
  type: number;
  status: number;
  createTime: string;
}
```

### 3.4 撤回消息

**POST** `/api/chat/message/recall`

**请求参数:**
```typescript
interface RecallMessageRequest {
  messageId: number;
}
```

### 3.5 标记消息已读

**POST** `/api/chat/message/read`

**请求参数:**
```typescript
interface MarkReadRequest {
  roomId: number;
  lastReadMessageId: number;
}
```

## 4. 好友相关接口

### 4.1 获取好友列表

**GET** `/api/chat/friend/list`

**响应:**
```typescript
interface ChatFriendUserVO {
  id: number;
  userName: string;
  userAvatar: string;
  onlineStatus: number;
}
```

### 4.2 搜索用户

**GET** `/api/user/search`

**请求参数:**
```typescript
interface SearchUserParams {
  keyword: string;
}
```

### 4.3 发送好友申请

**POST** `/api/chat/friend/apply`

**请求参数:**
```typescript
interface FriendApplyRequest {
  userId: number;
  message?: string;
}
```

### 4.4 处理好友申请

**POST** `/api/chat/friend/apply/handle`

**请求参数:**
```typescript
interface HandleApplyRequest {
  applyId: number;
  status: number;  // 1-同意，2-拒绝
}
```

## 5. 群聊相关接口

### 5.1 创建群聊

**POST** `/api/chat/room/add`

**请求参数:**
```typescript
interface CreateRoomRequest {
  name: string;
  memberIds: number[];
}
```

**响应:**
```typescript
interface BaseResponseLong {
  code: number;
  data: number;  // roomId
}
```

### 5.2 获取群详情

**GET** `/api/chat/room/detail`

**请求参数:**
```typescript
interface RoomDetailParams {
  roomId: number;
}
```

**响应:**
```typescript
interface ChatRoomVO {
  id: number;
  name: string;
  avatar: string;
  ownerUserId: number;
  memberCount: number;
  announcement?: string;
}
```

### 5.3 获取群成员列表

**GET** `/api/chat/room/members`

**请求参数:**
```typescript
interface RoomMembersParams {
  roomId: number;
}
```

**响应:**
```typescript
interface ChatRoomMemberVO {
  userId: number;
  userName: string;
  userAvatar: string;
  role: number;  // 1-成员，2-管理员，3-群主
}
```

### 5.4 邀请成员

**POST** `/api/chat/room/invite`

**请求参数:**
```typescript
interface InviteMembersRequest {
  roomId: number;
  memberIds: number[];
}
```

### 5.5 退出群聊

**POST** `/api/chat/room/quit`

**请求参数:**
```typescript
interface QuitRoomRequest {
  roomId: number;
}
```

### 5.6 解散群聊

**POST** `/api/chat/room/dismiss`

**请求参数:**
```typescript
interface DismissRoomRequest {
  roomId: number;
}
```

## 6. 文件上传接口

### 6.1 上传文件

**POST** `/api/file/upload`

**请求参数:**
```typescript
// multipart/form-data
interface UploadParams {
  file: File;
  bizType: string;  // 'chat_image' | 'chat_file' | 'avatar'
}
```

**响应:**
```typescript
interface UploadResponse {
  code: number;
  data: {
    url: string;
    fileName: string;
    fileSize: number;
  };
}
```

## 7. 通知相关接口

### 7.1 获取通知列表

**GET** `/api/notification/list`

**响应:**
```typescript
interface NotificationVO {
  id: number;
  type: number;
  title: string;
  content: string;
  readStatus: number;
  createTime: string;
}
```

### 7.2 标记通知已读

**POST** `/api/notification/read`

**请求参数:**
```typescript
interface MarkNotificationReadRequest {
  notificationId: number;
}
```

## 8. WebSocket 协议

### 8.1 连接地址

```
ws://localhost:9090?token={jwt_token}
```

### 8.2 消息格式

```typescript
interface WsMessage {
  type: number;    // 消息类型
  data: any;       // 消息数据
}
```

### 8.3 消息类型

| 类型 | 值 | 说明 |
|------|-----|------|
| AUTH | 0 | 认证 |
| HEARTBEAT | 1 | 心跳 |
| MESSAGE | 2 | 聊天消息 |
| SYSTEM_NOTICE | 3 | 系统通知 |
| ONLINE_STATUS | 8 | 在线状态 |
| FRIEND_APPROVE | 10 | 好友申请 |
| ERROR | 99 | 错误 |

## 9. 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
