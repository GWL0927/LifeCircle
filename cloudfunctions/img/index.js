// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await cloud.uploadFile({
      fileContent: new Buffer(event.fileContent, 'base64'),
      cloudPath: event.cloudPath // 使用随机文件名
    })
  } catch (e) {
    return e
  }
}