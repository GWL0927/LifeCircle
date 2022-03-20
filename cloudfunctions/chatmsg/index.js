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
          _createTime: util.formatTime(new Date())
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