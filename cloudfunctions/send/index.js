// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection(event.room).add({
      data: {
        _openid: wxContext.OPENID,
        fileIDs: event.fileIDs,
        createTime: db.serverDate(),
        sendTime: event.sendTime,
        pName: event.pName,
        pCall: event.pCall,
        pWechat: event.pWechat,
        name: event.name,
        price: event.price,
        info: event.info,
        images: event.imgbox,
        touxiang: event.touxiang,
        userName: event.userName
      }
    })
  } catch (e) {
    console.log(e)
  }

}