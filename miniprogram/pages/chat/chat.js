// pages/chat/chat.js
const db = wx.cloud.database();
const _ = db.command
const util = require('../util/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    scrollTop: 0,
    lastId: '',
    roomId: 1,
    msg: [],
    isTop: false, //标记触顶事件
    inputBottom: 0,
    animation: ''
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
        toOpenid: this.data.toOpenid || this.data.openid,
        roomId: this.data.roomId,
        msgType: 'text',
        message: this.data.inputVal,
        lastTime: this.data.msg.length > 0 ? this.data.msg[this.data.msg.length - 1]._createTime : 0
      },
      success: res => {
        this.setData({
          inputVal: ''
        })
      }
    })
  },
  // 触顶事件
  tapTop() {
    let timeout = null;
    if (this.data.isTop == true) {
      clearTimeout(timeout);
      return
    }
    console.log('--触顶--')
    this.setData({
      isTop: true
    }, () => {
      this.getMsgHis()
      timeout = setTimeout(() => {
        this.data.isTop = false;
      },1500);
    })
  },
  getMsgHis() {
    if (this.data.isTop) {
      wx.showLoading({
        title: '获取历史记录',
        mask: true
      })
    }
    wx.cloud.callFunction({
      name: 'msghis',
      data: {
        toOpenid: this.data.toOpenid || '0',
        msgDB: this.data.msgDB,
        step: this.data.msg.length
      },
      success: res => {
        let msgRes = res.result.data
        let newsLen = msgRes.length
        if (newsLen == 0) {
          //查无数据
          wx.showToast({
            title: '暂无更多消息',
            icon: 'none'
          })
        } else {
          msgRes = msgRes.reverse()
          this.setData({
            msg: [...msgRes, ...this.data.msg]
          }, () => {
            let len = this.data.msg.length
            if (this.data.isTop) {
              setTimeout(() => {
                this.setData({
                  lastId: msgRes[2].id
                })
              }, 50)
            } else {
              setTimeout(() => {
                this.setData({
                  lastId: this.data.msg[len - 1].id
                })
              }, 50)
            }
          })
        }
      },
      fail: err => {
        console.log(err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  initWatcher() {
    if (this.data.msgDB == "private-msgs") {
      this.msgWatcher = db.collection("private-msgs").where(
        _.or([
          {
            roomId: this.data.toOpenid + '-' + this.data.openid,
            _createTime: _.gt(util.formatTime(new Date()))
          },
          {
            roomId: this.data.openid + '-' + this.data.toOpenid,
            _createTime: _.gt(util.formatTime(new Date()))
          }
        ])
      ).watch({
        onChange: (res) => {
          if (res.docs.length != 0) {
            let newMsg = []
            res.docChanges.forEach(item => {
              newMsg.push(item.doc)
            })
            this.setData({
              msg: [...this.data.msg, ...newMsg]
            }, () => {
              let len = this.data.msg.length
              setTimeout(() => {
                this.setData({
                  lastId: this.data.msg[len - 1].id
                })
              }, 50)
            })
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    } else if (this.data.msgDB == "msgs") {
      this.msgWatcher = db.collection("msgs").where({
        roomId: this.data.roomId,
        _createTime: _.gt(util.formatTime(new Date()))
      }).watch({
        onChange: (res) => {
          if (res.docs.length != 0) {
            let newMsg = []
            res.docChanges.forEach(item => {
              newMsg.push(item.doc)
            })
            this.setData({
              msg: this.data.msg.concat(newMsg)
            }, () => {
              let len = this.data.msg.length
              setTimeout(() => {
                this.setData({
                  lastId: this.data.msg[len - 1].id
                })
              }, 50)
            })
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    }
  },
  async setAnimation() {
    // 设置聊天高度
    await this.calcHeight('.main')
    // 监听键盘高度变化
    wx.onKeyboardHeightChange(res => {
      this.setData({
        inputBottom: res.height,
        scrollHeight: this.data.cardHeight - res.height
      })
      this.translate()
    })
  },
  // 获取元素的height
  calcHeight(x) {
    return new Promise((resolve) => {
      let query = wx.createSelectorQuery().in(this)
      query.select(x).boundingClientRect()
      query.exec((res) => {
        this.setData({
          cardHeight: res[0].height
        })
        resolve()
      })
    })
  },
  translate() {
    this.animation.bottom(this.data.inputBottom).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && JSON.stringify(options) != "{}") {
      // 私聊
      wx.setNavigationBarTitle({
        title: options.userName
      })
      let openid = wx.getStorageSync('openid')
      this.setData({
        openid,
        toOpenid: options.openid,
        roomId: options.openid + '-' + openid,
        msgDB: "private-msgs"
      })
    } else {
      // 群聊
      wx.setNavigationBarTitle({
        title: '畅谈天地' 
      })
      this.setData({
        roomId: 1,
        msgDB: "msgs"
      })
    }
    // 获取聊天记录
    this.getMsgHis()

    // 设置动画的属性值
    this.setAnimation()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 220, 
      timingFunction: 'ease-out'
    })
    // 初始化聊天记录监听
    this.initWatcher()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let openid = wx.getStorageSync('openid')
    let login = wx.getStorageSync('login')
    this.setData({
      openid: !!login ? openid : '',
      login: !!login ? login : false
    })
    if (!login) {
      wx.showToast({
        icon: "none",
        title: '你还未登录'
      })
    }
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
    try {
      this.msgWatcher.close()
      console.log('--消息监听器关闭--')
    } catch (error) {
      console.log('--消息监听器关闭失败--')
    }
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