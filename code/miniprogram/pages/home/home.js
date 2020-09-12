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

  onLoad: async function () {
    var theApp = getApp();
    this.setData({ theApp: theApp })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.initList();

    console.log(wx.getMenuButtonBoundingClientRect(),await wx.getSystemInfo())
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

  initList: async function () {
    if (!this.listPromise) this.listPromise = Datas.load();
    this.listPromise.then(list => {
      this.listPromise = false;
      var list = list.map(item => {
        return {
          id: item.id,
          t: date.format(new Date(item.t), "yyyy-MM-dd HH:mm"),
          text: item.text.split("\n")[0].substr(0, 20),
          open: false,
          left: 0,
        }
      })
      list.sort((a, b) => b.t - a.t)
      this.setData({ list })
    })
  },

  onShow() {
    this.initList();
  },


  remove: function (e) {
    var item = e.currentTarget.dataset["item"];
    item = Datas.remove(item);
    if (!item) return;
    var list = this.data.list.filter(a => a.id != item.id);
    this.setData({ list });
  },




  closeAll: function () {
    var list = this.data.list;
    list.map(a => { a.open = false; a.sliding = false; a.left = 0; });
    this.setData({ list });
  },

  itemTouchStart: function (e) {
    if (e.touches.length != 1) return this.closeAll();
    var pageX = e.touches[0].pageX;
    var item = e.currentTarget.dataset["item"];
    var list = this.data.list;
    item = list.find(a => a.id == item.id);
    console.log("itemTouchStart", item, e);
    this.data.list.filter(a => a != item).map(a => { a.open = false; a.sliding = false; a.left = 0; });
    item.left0 = item.left;
    item.pageX = pageX;
    item.sliding = true;
    this.setData({ list });
  },
  itemTouchMove: function (e, inst) {
    if (e.touches.length != 1) return this.closeAll();
    var item = e.currentTarget.dataset["item"];
    var list = this.data.list;
    item = list.find(a => a.id == item.id);
    if (!item.sliding) return;
    var pageX = e.touches[0].pageX;
    item.left = item.left0 + pageX - item.pageX;
    this.setData({ list });
  },
  itemTouchEnd: function (e) {
    var item = e.currentTarget.dataset["item"];
    if (!item.open && item.left < 10 && item.left > -10) {
      wx.navigateTo({
        url: "/pages/edit/edit?id=" + item.id,
      });
      return;
    }
    console.log("itemTouchEnd", item)
    var list = this.data.list;
    item = list.find(a => a.id == item.id);
    if (!item.sliding) return;
    var W_DELETE = 120;
    item.sliding = false;
    item.open = (item.left < -W_DELETE / 2);
    if (item.open) {
      item.left = -W_DELETE
    }
    else {
      item.left = 0;
    }
    this.setData({ list });
  },





})
