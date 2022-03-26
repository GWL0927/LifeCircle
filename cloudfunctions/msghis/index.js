// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  let toOpenid = event.toOpenid || '0'
  // let roomId = event.roomId || 1
  let MSG = event.msgDB
  // 获取步骤
  let step = event.step;
  if (MSG == "private-msgs") {
    return await db.collection(MSG).where(
      _.or([
        {
          roomId: toOpenid + '-' + openid
        },
        {
          roomId: openid + '-' + toOpenid
        }
      ])
    ).skip(step).limit(15).orderBy('_createTime','desc').get();
  } else if (MSG == "msgs") {
    return await db.collection(MSG).where({
      roomId: 1
    }).skip(step).limit(15).orderBy('_createTime','desc').get();
  }
}