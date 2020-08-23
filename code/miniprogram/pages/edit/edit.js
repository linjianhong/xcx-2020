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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当前页面'
    });


    this.setData({ value: "theApp" })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  saveValue: function (e) {
    console.log("保存", e.detail)
    var item = this.data.item || {};
    item.text = e.detail.value;
    this.setData({ item: Datas.update(item) });
  }

})