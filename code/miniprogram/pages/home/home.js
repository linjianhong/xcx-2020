//index.js
const app = getApp()
var Datas = require('../../lib/Datas.js')
var date = require('../../lib/date.js')

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    var theApp = getApp();
    this.setData({ theApp: theApp })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.initList();

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  initList: function () {
    var list = Datas.load();
    list = list.map(item => {
      return {
        id: item.id,
        t:date.format(new Date( item.t),"yyyy-MM-dd HH:mm"),
        text: item.text.split("\n")[0].substr(0, 20)
      }
    })
    this.setData({ list })
  },


  onShow() {
    this.initList();
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
  },
  edit: function (e) {
    var item = e.currentTarget.dataset["item"];
    wx.navigateTo({
      url: "/pages/edit/edit?id=" + item.id,
    });
    console.log("点击笔记", e.currentTarget.dataset["item"])
  }
})
