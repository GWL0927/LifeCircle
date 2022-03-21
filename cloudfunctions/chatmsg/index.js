// 云函数入口文件
const cloud = require('wx-server-sdk')
var util = require('./util.js');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 获取用户唯一身份识别ID
  let openid = wxContext.OPENID || event.openid;
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
  //                       计算天数后剩余的毫秒数，计算小时数后剩余的毫秒数  
  let minutes=Math.floor(timeDiff % (24*3600*1000) % (3600*1000) /(60*1000))  
  switch (msgType) {
    case 'text': {
      let message = event.message;
      return await db.collection(MSG).add({
        data: {
          id: 'msg' + new Date().getTime(),
          openid,
          msgType,
          roomId,
          message,
          userInfo,
          _createTime: util.formatTime(new Date()),
          minutes
        }
      })
    }
  }
  return {
    userInfo,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}