export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contact/index',
    'pages/profile/index',
    'pages/chat/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: 'MallChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default'
  },
  tabBar: {
    custom: false,
    color: '#94a3b8',
    selectedColor: '#2563eb',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '消息'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系人'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
