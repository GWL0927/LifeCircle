const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let roomId = event.roomId
  try {
    return await db.collection('msg-list').doc(roomId).remove()
  } catch(e) {
    console.error(e)
  }
}