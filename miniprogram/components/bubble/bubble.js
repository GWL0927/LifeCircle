// components/bubble /bubble.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      wx.getStorage({
        key: 'openid',
        success: res => {
          this.setData({
            openid: res.data
          })
        }
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      wx.getStorage({
        key: 'openid',
        success: res => {
          this.setData({
            openid: res.data
          })
        },
        fail: res => {
          this.setData({
            openid: ''
          })
        }
      })
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onReady: function() {
    },
    mychat(e) {
      if (this.data.obj.roomId != 1) {
        return false;
      }
      let temp = e.currentTarget.dataset.mychat
      if (temp.toOpenid == this.data.openid) {
        wx.showToast({
          title: '不能私信自己！',
          icon: 'none'
        })
        return false;
      }
      wx.navigateTo({
        url: `../chat/chat?openid=${temp.openid}&userName=${temp.userInfo.nickName}`
      })
    },
  }
})
