// component/nav/nav.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    d: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    top: 20,
    height: 30,
  },
  observers: {
    'some.subfield': function (subfield) {
      // 使用 setData 设置 this.data.some.subfield 时触发
      // （除此以外，使用 setData 设置 this.data.some 也会触发）
      subfield === this.data.some.subfield
    },
    'arr[12]': function (arr12) {
      // 使用 setData 设置 this.data.arr[12] 时触发
      // （除此以外，使用 setData 设置 this.data.arr 也会触发）
      arr12 === this.data.arr[12]
    },
  },
  lifetimes: {
    attached: async function () {
      // 在组件实例进入页面节点树时执行
      let menuButtonRect = wx.getMenuButtonBoundingClientRect(),
        systemInfo = await wx.getSystemInfo(),
        statusBarHeight = systemInfo.statusBarHeight,
        navTop = menuButtonRect.top,//胶囊按钮与顶部的距离
        navHeight = menuButtonRect.height + menuButtonRect.top * 2 - statusBarHeight;//导航高度

      console.log("navHeight=", navHeight)
      this.setData({
        top: systemInfo.statusBarHeight,
        right: systemInfo.windowWidth * 2 - (menuButtonRect.left + menuButtonRect.right),
        height: navHeight
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    aa: async () => {
    }
  }
})
