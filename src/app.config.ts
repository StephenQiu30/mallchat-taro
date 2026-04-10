export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contact/index',
    'pages/profile/index',
    'pages/chat/index',
    'pages/contact/apply/index',
    'pages/contact/search/index',
    'pages/profile/edit/index'
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
