// pages/chatList/chatList.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    msgList: [
      // {
      //   avatarUrl: '../../images/123.jpg',
      //   nickName: '齐磊',
      //   difftime: '11小时前',
      //   nearInformation: '这是一条最近的消息',
      //   inforNum: 3
      // }
    ]
  },
  infoTap(e) {
    let temp = e.currentTarget.dataset.item
    console.log(temp);
    let _openid = this.data.openid == temp.openid ? temp.toOpenid : temp.openid
    wx.navigateTo({
      url: `../chat/chat?openid=${_openid}&userName=${temp.nickName}`
    })
  },
  delete(e) {
    console.log(e);
    if (e.detail == "right") {
      let roomId = e.target.dataset.item.roomId
      // wx.cloud.callFunction({
      //   name: 'delmsglist',
      //   data: {
      //     roomId
      //   },
      //   success: res => {
      //     console.log(res);
      //   }
      // })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('openid')
    this.setData({
      openid
    })
    db.collection("msg-list")
      .orderBy('_createTime', 'desc')
      .watch({
        onChange: res => {
          console.log(res);
          let msgList = []
          res.docs.forEach((item) => {
            let arr = [item.openid, item.toOpenid] // 存放发送人id和被发送人id
            if (arr.includes(openid)) { // 存在自己的id才进行展示
              if (item.openid == openid) {
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
          
          let msgListRes1 = wx.getStorageSync('msgList') // 先获取缓存的列表
          if (msgListRes1.length > 0) {
            msgListRes1.forEach((item1) => {
              msgList.forEach((item, index) => {
                if (item1.roomId == item.roomId) { // 同一个聊天室
                  if (item.timestamp == item1.timestamp) { 
                    // 消息的时间戳相同则表示没有新的消息，则isShow保持缓存的值
                    msgList[index].isShow = item1.isShow
                  } else {
                    // 更新了，则展示
                    msgList[index].isShow = true
                  }
                }
              })
            })
          }
          // 将消息列表写入到缓存
          wx.setStorageSync('msgList', [...msgList])
          // 获取缓存中消息列表，并赋值给data中的msgList
          let msgListRes = wx.getStorageSync('msgList')
          this.setData({
            msgList: [...msgListRes]
          })
        },
        onError: err => {
          console.error('the watch closed because of error', err)
        }
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