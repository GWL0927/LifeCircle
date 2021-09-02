const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatEnter = function (text) {
  if (!text) {
  return
  }
  const reg = getRegExp('\\\\n', 'g')
  return text.replace(reg,'\n')
}

module.exports = {
  formatTime: formatTime,
  formatEnter: formatEnter
}
