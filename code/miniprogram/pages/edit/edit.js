// miniprogram/pages/edit/edit.js

var Datas = require('../../lib/Datas.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: '备忘录'
    });

    // console.log("页面参数", options);
    if (options.id) {
      this.setData({ id: options.id });
      var list = await Datas.load();
      var item = list.find(a => a.id == options.id);
      if (item) {
        this.setData({ item });
        this.setData({ value: item.text });
      }
    } else {
      this.setData({ value: "" })
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  gotoHome: function (e) {
    wx.navigateTo({
      url: "/pages/home/home",
    });
  },

  saveValue: function (e) {
    // console.log("延时保存", e.detail)
    var item = this.data.item || {};
    item.text = e.detail.value;
    this.delayUpdate(item);
  },

  delayUpdate: function (newItem) {
    this.updating = this.updating || {}
    if (this.updating.promise) {
      console.log("等待上一个更新...");
      return this.updating.promise.then(() => {
        this.delayUpdate(newItem)
      })
    }

    // console.log("延时保存", newItem)
    if (this.updating.timer) {
      clearTimeout(this.updating.timer);
    }
    this.updating = {
      status: "timer",
      timer: setTimeout(() => this.promiseUpdate(newItem), 1000)
    }
  },

  promiseUpdate: function (item) {
    // console.log("提交更新");
    let promise = Datas.update(item).then(newItem => {
      this.updating = {}
      this.setData({ item: newItem });
      console.log("更新完成","newItem=", newItem);
    });
    this.updating = {
      status: "promise",
      promise
    };
    return promise;
  }

})