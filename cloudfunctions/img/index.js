// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto');
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const md5 = crypto.createHash('md5').update(event.fileContent, 'utf8').digest('hex');
  console.log('--文件唯一MD5编码--')
  console.log(md5);
  try {
    return await cloud.uploadFile({
      fileContent:  Buffer.from(event.fileContent, 'base64'),
      cloudPath: 'xiaoyuan/'+md5+event.suffix
    })
  } catch (e) {
    return e
  }
}