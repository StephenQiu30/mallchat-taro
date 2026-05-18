---
layer: operations
doc_no: O-001
audience: 运维团队
purpose: 记录 mallchat-taro 项目的部署和运维流程
owner: 运维团队
inputs: 项目代码、环境配置
outputs: 部署文档
triggers: 版本发布、环境变更
downstream: 上线部署、监控告警
---

# mallchat-taro 部署与运维文档

## 1. 环境要求

### 1.1 开发环境

| 依赖 | 版本要求 |
|------|----------|
| Node.js | >= 18.0.0 |
| npm | >= 9.0.0 |
| Taro CLI | >= 4.0.0 |

### 1.2 生产环境

| 平台 | 说明 |
|------|------|
| 微信小程序 | 微信开发者工具 |
| 支付宝小程序 | 支付宝开发者工具 |
| 抖音小程序 | 抖音开发者工具 |

## 2. 开发环境搭建

### 2.1 安装依赖

```bash
cd mallchat-taro
npm install
```

### 2.2 配置环境变量

创建 `.env` 文件：

```env
# API 基础地址
TARO_APP_API_BASE_URL=http://localhost:8080/api

# WebSocket 地址
TARO_APP_WS_URL=ws://localhost:9090
```

### 2.3 启动开发服务器

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# 抖音小程序
npm run dev:tt
```

## 3. 构建与发布

### 3.1 构建生产版本

```bash
# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:alipay

# 抖音小程序
npm run build:tt
```

### 3.2 发布流程

1. **代码审查**：提交 PR 并通过代码审查
2. **测试验证**：运行测试用例，确保功能正常
3. **版本发布**：合并到主分支，打 tag
4. **构建打包**：执行构建命令生成小程序代码
5. **上传代码**：使用开发者工具上传代码
6. **提交审核**：在小程序平台提交审核
7. **发布上线**：审核通过后发布

## 4. 配置说明

### 4.1 项目配置

**文件位置:** `config/index.ts`

```typescript
const config = {
  projectName: 'mallchat-taro',
  date: '2026-05-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: 'vite',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}
```

### 4.2 页面配置

**文件位置:** `src/app.config.ts`

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contact/index',
    'pages/profile/index',
    'pages/chat/index',
    'pages/chat/ai/index',
    'pages/chat/group/create/index',
    'pages/chat/group/detail/index',
    'pages/notification/index',
    'pages/contact/apply/index',
    'pages/contact/search/index',
    'pages/profile/edit/index',
    'pages/profile/moments/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F2F2F7',
    navigationBarTitleText: 'MallChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default',
    backgroundColor: '#F2F2F7'
  },
  tabBar: {
    custom: false,
    color: '#999999',
    selectedColor: '#007AFF',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '消息',
        iconPath: 'assets/tabbar/message.png',
        selectedIconPath: 'assets/tabbar/message-active.png'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系人',
        iconPath: 'assets/tabbar/contact.png',
        selectedIconPath: 'assets/tabbar/contact-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/tabbar/profile.png',
        selectedIconPath: 'assets/tabbar/profile-active.png'
      }
    ]
  }
})
```

## 5. 监控与告警

### 5.1 性能监控

- **页面加载时间**：监控首屏加载时间
- **接口响应时间**：监控 API 调用耗时
- **WebSocket 连接状态**：监控连接成功率

### 5.2 错误监控

- **JavaScript 错误**：捕获并上报运行时错误
- **接口错误**：监控 API 调用失败率
- **WebSocket 错误**：监控连接断开和重连

### 5.3 告警规则

| 指标 | 阈值 | 告警方式 |
|------|------|----------|
| 页面加载时间 | > 3s | 邮件/钉钉 |
| 接口错误率 | > 5% | 邮件/钉钉 |
| WebSocket 断连率 | > 10% | 邮件/钉钉 |

## 6. 故障排查

### 6.1 常见问题

**问题 1：WebSocket 连接失败**

排查步骤：
1. 检查 WebSocket 服务是否正常运行
2. 检查 Token 是否有效
3. 检查网络连接是否正常

**问题 2：接口调用失败**

排查步骤：
1. 检查 API 服务是否正常
2. 检查请求参数是否正确
3. 检查认证 Token 是否过期

**问题 3：页面加载缓慢**

排查步骤：
1. 检查网络状况
2. 检查服务器性能
3. 检查是否有大量数据加载

### 6.2 日志查看

```bash
# 查看开发日志
npm run dev:weapp 2>&1 | tee dev.log

# 查看构建日志
npm run build:weapp 2>&1 | tee build.log
```

## 7. 版本管理

### 7.1 版本号规范

采用语义化版本号：`主版本号.次版本号.修订号`

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 7.2 版本发布流程

1. 创建 release 分支
2. 更新版本号
3. 更新 CHANGELOG
4. 提交 PR 并合并
5. 打 tag 并发布

## 8. 安全规范

### 8.1 敏感信息处理

- **Token 存储**：使用小程序本地存储
- **接口传输**：使用 HTTPS
- **敏感数据**：不存储敏感信息

### 8.2 权限管理

- **用户授权**：获取用户信息前需授权
- **接口权限**：根据用户角色控制接口访问
- **数据权限**：用户只能访问自己的数据
