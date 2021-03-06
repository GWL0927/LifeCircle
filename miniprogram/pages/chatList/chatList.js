// pages/chatList/chatList.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    isLeave: false,
    toRoomId: []
  },
  init() {
    if (this.data.openid) {
      this.getMsgList()
      this.setData({
        isLeave: false,
        toRoomId: []
      })
    } else {
      this.setData({
        msgList: []
      })
    }
  },
  infoTap(e) {
    let {
      item,
      index
    } = e.currentTarget.dataset
    // 点击的消息记录的openid=自己的openid，则跳转到toOpenid
    let _openid = this.data.openid == item.openid ? item.toOpenid : item.openid
    this.data.msgList[index].isRed = false
    this.setData({
      msgList: this.data.msgList,
      isLeave: true,
      toRoomId: [_openid + '-' + this.data.openid, this.data.openid + '-' + _openid]
    })
    wx.setStorageSync('msgList', [...this.data.msgList])
    wx.navigateTo({
      url: `../chat/chat?openid=${_openid}&userName=${item.nickName}`
    })
  },
  delete(e) {
    if (e.detail == "right") {
      let roomId = e.target.dataset.item.roomId
      this.data.msgList.forEach((item, index) => {
        if (item.roomId == roomId) {
          this.data.msgList[index].isShow = false
        }
        // 更新到缓存中
        wx.setStorageSync('msgList', [...this.data.msgList])
        // 获取缓存中消息列表，并赋值给data中的msgList
        let msgListRes = wx.getStorageSync('msgList')
        this.setData({
          msgList: [...msgListRes]
        })
      })
    }
  },
  getMsgList() {
    db.collection("msg-list")
      .orderBy('_createTime', 'desc')
      .watch({
        onChange: res => {
          this.decode(res)
        },
        onError: err => {
          console.log(err)
        }
      })
  },
  decode(res) {
    let msgList = []
    res.docs.forEach((item) => {
      let arr = [item.openid, item.toOpenid] // 存放发送人id和被发送人id
      if (arr.includes(this.data.openid)) { // 存在自己的id才进行展示
        if (item.openid == this.data.openid) {
          // 自己发的，使用toUserInfo的信息展示
          let obj = {
            ...item,
            ...item.toUserInfo,
            isShow: true
          }
          msgList.push(obj)
        } else {
          // 对方发的，使用userInfo的信息展示
          let obj = {
            ...item,
            ...item.userInfo,
            isShow: true
          }
          msgList.push(obj)
        }
      }
    })

    // 消息更新和删除显示设置
    let msgListRes1 = wx.getStorageSync('msgList') // 先获取缓存的列表
    if (msgListRes1.length > 0) {
      msgListRes1.forEach((item1) => {
        msgList.forEach((item, index) => {
          if (item1.roomId == item.roomId) { // 同一个聊天室
            if (item.timestamp == item1.timestamp) {
              // 消息的时间戳相同则表示这个用户没有发新的消息来，则isShow保持缓存的值
              msgList[index].isShow = item1.isShow
              msgList[index].isRed = item1.isRed
            } else {
              // 更新了，则展示
              msgList[index].isShow = true
              msgList[index].isRed = true
              // 判断用户是否在聊天界面，且该聊天界面是否是新消息的聊天
              if (this.data.isLeave && this.data.toRoomId.includes(item.roomId)) {
                msgList[index].isRed = false
              }
            }
          }
        })
      })
    }
    // 消息列表中只要有一条中的isRed是true，则显示tabbar的红点
    let isBarRed = msgList.some((item) => {
      return item.isRed == true
    })
    // 获取当前页面url
    let pages = getCurrentPages()
    let url = pages[pages.length-1].route
    if (url == 'pages/chatList/chatList' || url =='pages/index/index' || url =='pages/mine/mine') {
      if (isBarRed) {
        wx.showTabBarRedDot({
          index: 1
        });
      } else {
        wx.hideTabBarRedDot({
          index: 1
        });
      }
    }

    // 将消息列表写入到缓存
    wx.setStorageSync('msgList', [...msgList])
    // 获取缓存中消息列表，并赋值给data中的msgList
    let msgListRes = wx.getStorageSync('msgList')
    this.setData({
      msgList: [...msgListRes]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let openid = wx.getStorageSync('openid')
    this.setData({
      openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let openid = wx.getStorageSync('openid')
    this.setData({
      openid
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})