// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection("jianzhi").add({
      data: {
        _openid: wxContext.OPENID,
        createTime: db.serverDate(),
        gangwei: event.gangwei,
        didian: event.didian,
        gongsi: event.gongsi,
        daiyu: event.daiyu,
        yaoqiu: event.yaoqiu,
        shijian: event.shijian,
        neirong: event.neirong,
        writer: event.writer,
        call: event.call,
        sendTime: event.sendTime,
        touxiang: event.touxiang,
        userName: event.userName
      }
    })
  } catch (e) {
    console.log(e)
  }
}