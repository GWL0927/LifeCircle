# 校园生活圈小程序
拥有 表白墙、失物招领、兼职、闲置物品、畅谈天地、聊天等功能

## 基于云开发（参考文档）
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 部署教程
1. 将该项目导入微信开发者工具
2. 更改 miniprogram/app.js 里面的云环境id
``` bash
wx.cloud.init({
	env:'xxx',  //xxx为你的云环境id
    traceUser: true
})
```
3. 创建对应的9个数据库集合（biaobai、found、lost、xianzhi、jianzhi、users、msgs、private-msgs、msg-list）
4. 将 cloudfunctions 文件下的7个文件上传云函数部署（右键点击，选择第三个选项“上传并部署：云端安装环境”）