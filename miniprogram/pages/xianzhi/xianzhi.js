const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        })
      },
    })
    db.collection('xianzhi')
      .orderBy('createTime', 'desc') //按发布商品排序
      .get()
      .then(res => {
        this.setData({
          dataList: res.data
        })
      })
  },
  delete: function(e) {
    var info = e.currentTarget.dataset.t
    wx.showLoading({
      title: '正在删除数据......',
      mask:"true"
    })
    db.collection('xianzhi').doc(info._id).remove()
    .then(res => {
      wx.showToast({
        icon: 'success',
        title: '删除成功',
      })
      wx.hideLoading()
      this.onLoad()
    })
  },
  send: function() {
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (res.data) {
          wx.navigateTo({
            url: '../send/send?name=xianzhi',
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '你还未登录'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    })
  },
  go: function(event) {
    var info = event.currentTarget.dataset.id
    wx.setStorage({
      key: 'info',
      data: info,
    })
    wx.navigateTo({
      url: '../temp/temp?name=xianzhi',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
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