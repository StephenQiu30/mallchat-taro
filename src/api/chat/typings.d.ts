declare namespace ChatAPI {
  type BaseResponseBoolean = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: boolean;
    /** 消息 */
    message?: string;
  };

  type BaseResponseListChatFriendUserVO = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: ChatFriendUserVO[];
    /** 消息 */
    message?: string;
  };

  type BaseResponseListChatMessageVO = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: ChatMessageVO[];
    /** 消息 */
    message?: string;
  };

  type BaseResponseListChatRoomVO = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: ChatRoomVO[];
    /** 消息 */
    message?: string;
  };

  type BaseResponseListChatSessionVO = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: ChatSessionVO[];
    /** 消息 */
    message?: string;
  };

  type BaseResponseLong = {
    /** 状态码 */
    code?: number;
    /** 数据 */
    data?: number;
    /** 消息 */
    message?: string;
  };

  type BaseResponsePageChatFriendApplyVO = {
    /** 状态码 */
    code?: number;
    data?: PageChatFriendApplyVO;
    /** 消息 */
    message?: string;
  };

  type ChatFriendAddRequest = {
    /** 好友用户ID */
    friendUserId: number;
  };

  type ChatFriendApplyQueryRequest = {
    /** 当前页号 */
    current?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序（默认升序） */
    sortOrder?: string;
  };

  type ChatFriendApplyRequest = {
    /** 目标用户ID */
    targetId: number;
    /** 申请消息 */
    msg: string;
  };

  type ChatFriendApplyVO = {
    /** 申请ID */
    id?: number;
    /** 发起用户ID */
    userId?: number;
    /** 发起用户昵称 */
    userName?: string;
    /** 发起用户头像 */
    userAvatar?: string;
    /** 申请消息 */
    msg?: string;
    /** 状态：1-待处理，2-已同意，3-已忽略 */
    status?: number;
    /** 申请时间 */
    createTime?: string;
  };

  type ChatFriendApproveRequest = {
    /** 申请记录ID */
    applyId: number;
    /** 审核状态：2-同意，3-拒绝 */
    status: number;
  };

  type ChatFriendUserVO = {
    /** 用户ID */
    id?: number;
    /** 昵称 */
    userName?: string;
    /** 头像 */
    userAvatar?: string;
  };

  type ChatMessageReadRequest = {
    /** 房间ID */
    roomId: number;
    /** 已读到的最后一条消息ID */
    lastReadMessageId: number;
  };

  type ChatMessageSendRequest = {
    /** 房间ID */
    roomId: number;
    /** 消息内容 */
    content: string;
    /** 消息类型：1-文本，2-图片，3-文件 */
    type: number;
    /** 消息扩展内容（JSON 字符串） */
    extra?: string;
    /** 被回复的消息ID */
    replyMsgId?: number;
  };

  type ChatMessageVO = {
    /** 消息ID */
    id?: number;
    /** 房间ID */
    roomId?: number;
    /** 发送者ID */
    fromUserId?: number;
    /** 发送者姓名 */
    fromUserName?: string;
    /** 发送者头像 */
    fromUserAvatar?: string;
    /** 消息内容 */
    content?: string;
    /** 消息类型：1-文本，2-图片，3-文件 */
    type?: number;
    /** 消息扩展内容 */
    extra?: string;
    replyMsg?: ReplyMsgVO;
    /** 消息状态：0-正常，1-已撤回，2-已删除 */
    status?: number;
    /** 发送时间 */
    createTime?: string;
  };

  type ChatPrivateRoomRequest = {
    /** 对方用户ID */
    peerUserId: number;
  };

  type ChatRoomAddRequest = {
    /** 房间名称 */
    name: string;
    /** 房间类型：1-群聊，2-私聊 */
    type: number;
    /** 房间头像 */
    avatar?: string;
  };

  type ChatRoomVO = {
    /** 房间ID */
    id?: number;
    /** 房间名称 */
    name?: string;
    /** 房间类型：1-群聊，2-私聊 */
    type?: number;
    /** 房间头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
  };

  type ChatSessionVO = {
    /** 房间ID */
    roomId?: number;
    /** 房间名称 */
    name?: string;
    /** 房间头像 */
    avatar?: string;
    /** 房间类型：1-群聊，2-私聊 */
    type?: number;
    /** 最后一条消息内容 */
    lastMessage?: string;
    /** 未读数 */
    unreadCount?: number;
    /** 置顶状态：0-否，1-是 */
    topStatus?: number;
    /** 最后活跃时间 */
    activeTime?: string;
  };

  type DeleteRequest = {
    /** id */
    id: number;
  };

  type joinChatRoomParams = {
    /** 房间ID */
    roomId: number;
  };

  type listHistoryMessagesParams = {
    /** 房间ID */
    roomId: number;
    /** 上一页最后一条消息ID */
    lastMessageId?: number;
    /** 加载消息数量 */
    limit?: number;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageChatFriendApplyVO = {
    records?: ChatFriendApplyVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageChatFriendApplyVO;
    searchCount?: PageChatFriendApplyVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type ReplyMsgVO = {
    /** 消息ID */
    id?: number;
    /** 发送者姓名 */
    userName?: string;
    /** 消息内容 */
    content?: string;
    /** 消息类型 */
    type?: number;
  };

  type topSessionParams = {
    /** 房间ID */
    roomId: number;
    /** 置顶状态：0-取消置顶, 1-置顶 */
    status: number;
  };
}
