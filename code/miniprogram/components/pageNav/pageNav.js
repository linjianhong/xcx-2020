// components/pageNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text1: {
      type: String,
      value: '智能快记',
    },
    envId: String

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready() {
    var theApp = getApp();
    this.setData({ SystemInfo: theApp.SystemInfo })
  }
})
