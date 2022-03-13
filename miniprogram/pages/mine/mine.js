const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    biaobai: 0,
    xianzhi: 0,
    jianzhi: 0,
    lost: 0,
    found: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'login',
      success: res=> {
        this.setData({
          login: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success: res=> {
        this.setData({
          userInfo: res.data
        })
      }
    })
    wx.getStorage({
      key: 'openid',
      success: res=> {
        this.setData({
          openid: res.data
        })
      }
    })
  },

  getOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        let openid = res.result.openid;
        this.setData({
          openid: openid
        })
        wx.setStorage({
          key: 'openid',
          data: openid
        })
      }
    })
    wx.getUserProfile({
      desc: '生活圈',
      success: res => {
        this.setData({
          login: true,
          userInfo: res.userInfo
        })
        wx.setStorage({
          key: 'login',
          data: true,
        })
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
        })
        this.getBiaobai()
        this.getXianzhi()
        this.getLost()
        this.getJianzhi()
      }
    })
  },

  getBiaobai: function() {
    var that = this
    db.collection('biaobai').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          biaobai: res.total
        })
      }
    })
  },
  getXianzhi: function() {
    var that = this
    db.collection('xianzhi').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          xianzhi: res.total
        })
      }
    })
  },
  getJianzhi: function() {
    var that = this
    db.collection('jianzhi').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          jianzhi: res.total
        })
      }
    })
  },
  getLost: function() {
    var that = this
    db.collection('found').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          found: res.total
        })
      }
    })
    db.collection('lost').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          lost: res.total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.data.login) {
      this.getBiaobai()
      this.getXianzhi()
      this.getLost()
      this.getJianzhi()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})