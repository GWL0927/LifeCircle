// 云函数入口文件
const cloud = require('wx-server-sdk')
var util = require('./util.js');
const crypto = require('crypto');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 获取用户唯一身份识别ID
  let openid = wxContext.OPENID || event.openid;
  let toOpenid = event.toOpenid;
  // 获取私聊对方的信息
  if (toOpenid != openid) {
    let _userInfo = await db.collection('users').doc(toOpenid).get();
    var toUserInfo = _userInfo.data.userInfo;
  }
  let _userInfo_ = await db.collection('users').doc(openid).get();
  // 获取用户信息
  let userInfo = _userInfo_.data.userInfo;
  // 获取消息类型
  let msgType = event.msgType || 'text';
  // 获取会话房间号
  let roomId = event.roomId || 1
  let MSG = roomId == 1 ? 'msgs' : 'private-msgs'
  // 获取当前时间戳
  let timestamp = new Date().getTime()
  // 获取最后一条消息的时间戳
  let lastTime = new Date(event.lastTime).getTime()
  let timeDiff = timestamp - lastTime
  //计算出相差天数  
  let days = Math.floor(timeDiff / (24 * 3600 * 1000))
  //计算出小时数 
  let leave1 = timeDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数  
  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数  
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数  
  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
  let seconds = Math.round(leave3 / 1000)
  let difftime = days > 0 ? `${days}天前` : (hours > 0 ? `${hours}小时前` : (minutes > 0 ? `${minutes}分钟前` : (seconds > 58 ? `1分钟前` : '刚刚')))
  let allminutes = days * 24 * 60 + hours * 60 + minutes

  let message = event.message;
  if (roomId != 1) {
    let roomId_ = toOpenid + '-' + openid //我发给对方时roomId
    let _roomId = openid + '-' + toOpenid //对方发给我时roomId
    let msgList = await db.collection('msg-list').get(); //获取所有消息列表
    let arr = [] //存放所有_id也就是roomId
    msgList.data.forEach(function (item) {
      arr.push(item._id)
    })
    if (arr.includes(roomId_) || arr.includes(_roomId)) { //消息列表中已存在此私信聊天室
      let _roomId_ = arr.includes(roomId_) ? roomId_ : _roomId //则更新时，roomId为已存在的私信聊天室的roomId
      db.collection("msg-list").doc(_roomId_).set({
        data: {
          msgType,
          roomId: _roomId_,
          nearInformation: msgType == 'text' ? message : '[图片]',
          openid,
          toOpenid,
          toUserInfo,
          userInfo,
          _createTime: util.formatTime(new Date()),
          timestamp
        }
      })
    } else { //消息列表中不存在此私信聊天室，则更新时，roomId不用做判断
      db.collection("msg-list").doc(roomId).set({
        data: {
          msgType,
          roomId,
          nearInformation: msgType == 'text' ? message : '[图片]',
          openid,
          toOpenid,
          toUserInfo,
          userInfo,
          _createTime: util.formatTime(new Date()),
          timestamp
        }
      })
    }
  }
  switch (msgType) {
    case 'text': {
      return await db.collection(MSG).add({
        data: {
          id: 'msg' + new Date().getTime(),
          openid,
          toOpenid,
          msgType,
          roomId,
          message,
          userInfo,
          _createTime: util.formatTime(new Date()),
          allminutes,
          difftime
        }
      })
    }
    case 'image': {
      let content = event.content;
      //将图片传入云存储
      const hash = crypto.createHash('md5');
      hash.update(content, 'utf8');
      const md5 = hash.digest('hex');
      let upData = await cloud.uploadFile({
        cloudPath: 'xiaoyuan/' + md5 + event.suffix,
        fileContent: Buffer.from(content, 'base64')
      })
      let fileID = upData.fileID;
      // 内容安全校验通过写入数据
      return await db.collection(MSG).add({
        data: {
          id: 'msg' + new Date().getTime(),
          roomId,
          openid,
          msgType,
          content: fileID,
          userInfo,
          allminutes,
          _createTime: util.formatTime(new Date()),
        }
      })
      break
    }
  }
}