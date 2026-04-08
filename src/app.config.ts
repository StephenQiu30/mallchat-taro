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
    navigationStyle: 'custom'
  },
  tabBar: {
    custom: false,
    color: '#969799',
    selectedColor: '#1989fa',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '消息',
        iconPath: 'assets/icons/tabbar-placeholder.png',
        selectedIconPath: 'assets/icons/tabbar-placeholder.png'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系人',
        iconPath: 'assets/icons/tabbar-placeholder.png',
        selectedIconPath: 'assets/icons/tabbar-placeholder.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/tabbar-placeholder.png',
        selectedIconPath: 'assets/icons/tabbar-placeholder.png'
      }
    ]
  }
})
