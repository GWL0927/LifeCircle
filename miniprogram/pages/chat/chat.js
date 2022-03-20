// pages/chat/chat.js
const db = wx.cloud.database();
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    scrollTop: 0,
    lastId: '',
    roomId: 1,
    msg: []
  },
  clone(target) {
    return JSON.parse(JSON.stringify(target))
  },
  inputChange(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  onFocus() {
    this.setData({
      scrollTop: 9999
    });
  },
  inputSend() {
    if (!this.data.login) {
      wx.showToast({
        title: '请先登录！',
        icon: 'none'
      })
      return false;
    }
    if (this.data.inputVal === '') {
      wx.showToast({
        title: '请输入内容!',
        icon: 'none'
      })
      return false;
    }

    wx.cloud.callFunction({
      name: 'chatmsg',
      data: {
        roomId: this.data.roomId,
        msgType: 'text',
        message: this.data.inputVal,
      },
      success: res => {
        this.setData({
          inputVal: ''
        })
      }
    })
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    const msg = this.data.mock;
    const length = msg.length;
    const lastId = msg[length - 1].id;
    setTimeout(() => {
      this.setData({ lastId });
    }, 300);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    if (JSON.stringify(options) != "{}") {
      // 私聊
      wx.setNavigationBarTitle({
        title: options.userName
      })
      wx.getStorage({
        key: 'openid',
        success: res => {
          this.setData({
            roomId: options.openid + '-' + res.data
          })
          db.collection("private-msgs").where(
            _.or([
              {
                roomId: options.openid + '-' + res.data
              },
              {
                roomId: res.data + '-' + options.openid
              }
            ])
          )
          .orderBy('_createTime', 'asc')
          .watch({
            onChange: res => {
              if (res.docs.length != 0) {
                this.setData({
                  msg: [...res.docs],
                  lastId: res.docs[res.docs.length - 1].id || 0
                })
              }
            },
            onError: err => {
              console.error('the watch closed because of error', err)
            }
          })
        }
      })  
    } else {
      // 群聊
      wx.setNavigationBarTitle({
        title: '畅谈天地' 
      })
      this.setData({
        roomId: 1
      })
      db.collection("msgs").where({
        roomId: 1
      })
      .orderBy('_createTime', 'asc')
      .watch({
        onChange: res => {
          this.setData({
            msg: [...res.docs],
            lastId: res.docs[res.docs.length - 1].id
          })
        },
        onError: err => {
          console.error('the watch closed because of error', err)
        }
      })
    }

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
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.setData({
          openid: res.data
        })
      }
    })
    wx.getStorage({
      key: 'login',
      success: res => {
        this.setData({
          login: res.data
        })
      },
      fail: res => {
        this.setData({
          login: false,
          openid: ''
        })
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    })
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