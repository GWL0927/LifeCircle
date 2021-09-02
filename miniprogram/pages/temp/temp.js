Page({

  /**
   * 页面的初始数据
   */
  data: {
    direction1: "down",
    direction2: "down",
    direction3: "down",
    isShow1: true,
    isShow2: true,
    isShow3: true,
    height1: null,
    height2: null,
    height3: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type:options.name
    })
    if (this.data.type == 'work') {
      wx.setNavigationBarTitle({ title: '兼职' })
    } else {
      wx.setNavigationBarTitle({ title: '闲置物品' })
    } 
    var that = this
    wx.getStorage({
      key: 'info',
      success: function(res) {
        that.setData({
          item: res.data
        })
      }
    })
  },

  // 预览图片
  previewImg: function (e) {
    let imgData = e.currentTarget.dataset.img;
    wx.previewImage({
      //当前显示图片
      current: imgData,
      //所有图片
      urls: this.data.item.fileIDs
    })
  },

  cell1() {
    if (this.data.direction1 === "down") {
      this.setData({
        direction1: "up"
      })
      this.animate('#cell1', [
        {translateY: 0},
        {translateY: -this.data.height1}
      ], 300)
      setTimeout(() => {
        this.setData({
          isShow1: false
        })
      }, 300)
    } else if (this.data.direction1 === "up") {
      this.setData({
        direction1: "down"
      })
      this.animate('#cell1', [
        {translateY: -this.data.height1},
        {translateY: 0}
      ], 300, function () {
        this.clearAnimation('#cell1', {translateY: true})
      }.bind(this))

      this.setData({
        isShow1: true
      })
    }
  },

  cell2() {
    if (this.data.direction2 === "down") {
      this.setData({
        direction2: "up"
      })
      this.animate('#cell2', [
        {translateY: 0},
        {translateY: -this.data.height2}
      ], 300)
      setTimeout(() => {
        this.setData({
          isShow2: false
        })
      }, 400)
    } else if (this.data.direction2 === "up") {
      this.setData({
        direction2: "down"
      })
      this.animate('#cell2', [
        {translateY: -this.data.height2},
        {translateY: 0}
      ], 300, function () {
        this.clearAnimation('#cell2', {translateY: true})
      }.bind(this))

      this.setData({
        isShow2: true
      })
    }
  },

  cell3() {
    if (this.data.direction3 === "down") {
      this.setData({
        direction3: "up"
      })
      this.animate('#cell3', [
        {translateY: 0},
        {translateY: -this.data.height3}
      ], 300)
      setTimeout(() => {
        this.setData({
          isShow3: false
        })
      }, 400)
    } else if (this.data.direction3 === "up") {
      this.setData({
        direction3: "down"
      })
      this.animate('#cell3', [
        {translateY: -this.data.height3},
        {translateY: 0}
      ], 300, function () {
        this.clearAnimation('#cell3', {translateY: true})
      }.bind(this))

      this.setData({
        isShow3: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.data.type == 'work') {
      if (this.data.isShow1) {
        let query = wx.createSelectorQuery()
        query.select("#cell1").boundingClientRect(rect => {
          this.setData({
            height1: rect.height
          })
        }).exec()
      }
      if (this.data.isShow2) {
        let query = wx.createSelectorQuery()
        query.select("#cell2").boundingClientRect(rect => {
          this.setData({
            height2: rect.height
          })
        }).exec()
      }
    } else {
      if (this.data.isShow3) {
        let query = wx.createSelectorQuery()
        query.select("#cell3").boundingClientRect(rect => {
          this.setData({
            height3: rect.height
          })
        }).exec()
      }
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
    wx.removeStorage({
      key: 'info',
      success: function(res) {},
    })
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