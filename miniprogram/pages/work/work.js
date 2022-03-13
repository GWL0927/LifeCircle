const db = wx.cloud.database()
var util = require('../util/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify(options) != "{}") {
      if (options.login == "true") {
        db.collection('jianzhi').where({
            _openid: options.openid
          })
          .orderBy('createTime', 'desc')
          .watch({
            onChange: res => {
              console.log(res);
              this.setData({
                dataList: res.docs
              })
            },
            onError: err => {
              console.log(err);
            }
          })
      } else {
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    } else {
      db.collection('jianzhi')
        .orderBy('createTime', 'desc')
        .watch({
          onChange: res => {
            console.log(res);
            this.setData({
              dataList: res.docs
            })
          },
          onError: err => {
            console.log(err);
          }
        })
    }

    wx.getStorage({
      key: 'openid',
      success: res => {
        this.setData({
          openid: res.data
        })
      },
    })
  },
  go: function (event) {
    var info = event.currentTarget.dataset.id
    wx.setStorage({
      key: 'info',
      data: info,
    })
    wx.navigateTo({
      url: '../temp/temp?name=work',
    })
  },

  //获取输入内容
  gangwei(event) {
    // console.log("输入的对象", event.detail.value)
    this.setData({
      gangwei: event.detail.value
    })
  },
  didian(event) {
    // console.log("输入的称呼", event.detail.value)
    this.setData({
      didian: event.detail.value
    })
  },
  gongsi(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      gongsi: event.detail.value
    })
  },
  daiyu(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      daiyu: event.detail.value
    })
  },
  yaoqiu(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      yaoqiu: event.detail.value
    })
  },
  shijian(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      shijian: event.detail.value
    })
  },
  neirong(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      neirong: event.detail.value
    })
  },
  writer(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      writer: event.detail.value
    })
  },
  call(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      call: event.detail.value
    })
  },
  //打开弹窗
  send() {
    var that = this
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (res.data) {
          that.setData({
            isSend: true
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
  close: function () {
    this.setData({
      isSend: false
    })
  },
  //上传数据
  publish: function () {
    let gangwei = this.data.gangwei
    let didian = this.data.didian
    let gongsi = this.data.gongsi
    let daiyu = this.data.daiyu
    let yaoqiu = this.data.yaoqiu
    let shijian = this.data.shijian
    let neirong = this.data.neirong
    let writer = this.data.writer
    let call = this.data.call

    if (!gangwei) {
      wx.showToast({
        icon: "none",
        title: '岗位不能为空'
      })
      return
    }
    if (!didian) {
      wx.showToast({
        icon: "none",
        title: '工作地点不能为空'
      })
      return
    }
    if (!gongsi) {
      wx.showToast({
        icon: "none",
        title: '公司名称不能为空'
      })
      return
    }
    if (!daiyu) {
      wx.showToast({
        icon: "none",
        title: '工资不能为空'
      })
      return
    }
    if (!yaoqiu) {
      wx.showToast({
        icon: "none",
        title: '应聘要求不能为空'
      })
      return
    }
    if (!shijian) {
      wx.showToast({
        icon: "none",
        title: '工作时间不能为空'
      })
      return
    }
    if (!neirong) {
      wx.showToast({
        icon: "none",
        title: '工作内容不能为空'
      })
      return
    }
    if (!writer) {
      wx.showToast({
        icon: "none",
        title: '称呼不能为空'
      })
      return
    }
    if (!call) {
      wx.showToast({
        icon: "none",
        title: '联系电话不能为空'
      })
      return
    }

    wx.showLoading({
      title: '发布中...',
    })
    wx.cloud.callFunction({
      name: 'work',
      data: {
        gangwei: this.data.gangwei,
        didian: this.data.didian,
        gongsi: this.data.gongsi,
        daiyu: this.data.daiyu,
        yaoqiu: this.data.yaoqiu,
        shijian: this.data.shijian,
        neirong: this.data.neirong,
        writer: this.data.writer,
        call: this.data.call,
        sendTime: util.formatTime(new Date())
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        this.setData({
          isSend: false
        })
        this.setData({
          gangwei: null,
          didian: null,
          gongsi: null,
          daiyu: null,
          yaoqiu: null,
          shijian: null,
          neirong: null,
          writer: null,
          call: null,
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '网络不给力....'
        })
        console.error('发布失败', err)
      }
    })
  },

  delete: function (e) {
    var info = e.currentTarget.dataset.t
    wx.showLoading({
      title: '正在删除数据......',
      mask: "true"
    })
    db.collection('jianzhi').doc(info._id).remove()
      .then(res => {
        wx.showToast({
          icon: 'success',
          title: '删除成功',
        })
        wx.hideLoading()
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