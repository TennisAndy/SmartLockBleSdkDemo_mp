const getDateString = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const getTimeString = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()%100
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

// ArrayBuffer转16进度字符串示例
const ab2hex = buffer => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

function isPrime(n) {
  if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  if (n == leastFactor(n)) return true;
  return false;
}

// leastFactor(n)
// returns the smallest prime that divides n
//     NaN if n is NaN or Infinity
//      0  if n=0
//      1  if n=1, n=-1, or n is not an integer

function leastFactor(n) {
  if (isNaN(n) || !isFinite(n)) return NaN;
  if (n == 0) return 0;
  if (n % 1 || n * n < 2) return 1;
  if (n % 2 == 0) return 2;
  if (n % 3 == 0) return 3;
  if (n % 5 == 0) return 5;
  var m = Math.sqrt(n);
  for (var i = 7; i <= m; i += 30) {
    if (n % i == 0) return i;
    if (n % (i + 4) == 0) return i + 4;
    if (n % (i + 6) == 0) return i + 6;
    if (n % (i + 10) == 0) return i + 10;
    if (n % (i + 12) == 0) return i + 12;
    if (n % (i + 16) == 0) return i + 16;
    if (n % (i + 22) == 0) return i + 22;
    if (n % (i + 24) == 0) return i + 24;
  }
  return n;
}

function randomPrime() {
  //取一个8位数的随机数
  var random = Math.floor(Math.random() * 90000000 + 10000000);
  if (isPrime(random)) return random;

  //取rondom最近的一个素数
  var index = 0
  var prime = 10000019;
  while (true) {
    index++;

    if (isPrime(random + index)) {
      prime = random + index;
      break;
    }

    if (isPrime(random - index)) {
      prime = random - index;
      break;
    }
  }
  return prime;
}

function randomPrime6() {
  //取一个6位数的随机数
  var random = Math.floor(Math.random() * 900000 + 100000);
  if (isPrime(random)) return random;

  //取rondom最近的一个素数
  var index = 0
  var prime = 100003;
  while (true) {
    index++;

    if (isPrime(random + index)) {
      prime = random + index;
      break;
    }

    if (isPrime(random - index)) {
      prime = random - index;
      break;
    }
  }
  return prime;
}

function randomN() {
  //return 5
  //取一个4~15之间的随机数
  var random = Math.floor(Math.random() * 15 + 4);
  if (isPrime(random)) return random;

  //取rondom最近的一个素数
  var index = 0
  var prime = 3;
  while (true) {
    index++;

    if (isPrime(random + index)) {
      prime = random + index;
      break;
    }

    if (isPrime(random - index)) {
      prime = random - index;
      break;
    }
  }
  return prime;
}

// Convert a hex string to a byte array
const hexToBytes = hex => {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Convert a byte array to a hex string
const bytesToHex = bytes => {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}

const macToInt = mac => {
  var macNew = mac.replace(/:/g, '').substring(4)
  //console.log('macNew', macNew)
  var high = parseInt(macNew.substr(0, 4), 16)
  //console.log('high', high)
  var low = parseInt(macNew.substr(4, 4), 16)
  //console.log('low', low)

  return (high << 16) | low
}

const hexToInt = hex => {
  var high = parseInt(hex.substr(0, 4), 16)
  //console.log('high', high)
  var low = parseInt(hex.substr(4, 4), 16)
  //console.log('low', low)

  return (high << 16) | low
}

const getLockModel = name => {
  if (name == undefined || name == null) return 0
  if (name.length == 9) {
    return 1
  } else {
    if (name.indexOf("WSL_A") == 0) {
      return 1 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_H") == 0) {
      return 10 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_B") == 0) {
      return 21 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_N") == 0) {
      return 30 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_M") == 0) {
      return 40 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_U") == 0) {
      return 50 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_J") == 0) {
      return 60 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_F") == 0) {
      return 70 + parseInt(name.substr(5, 6))
    } else if (name.indexOf("WSL_C") == 0) {
      return 80 + parseInt(name.substr(5, 6))
    } else {
      return 0
    }
  }
}

const isNbLock = model => {
  if (model > 30 && model <= 49) {
    return true
  } else {
    return false
  }
}

const isUxLock = model => {
  if (model > 30 && model <= 59) {
    return true
  } else {
    return false
  }
}

const isFxLock = model => {
  if (model > 70 && model <= 79) {
    return true
  } else {
    return false
  }
}

const getLockType = model => {
  if (model > 0 && model <= 9) {
    return '蓝牙密码锁'
  } else if (model > 10 && model <= 19) {
    return '家庭锁系列'
  } else if (model > 20 && model <= 29) {
    return '酒店密码锁'
  } else if (model > 30 && model <= 49) {
    return '蓝牙NB锁'
  } else if (model > 50 && model <= 59) {
    return '蓝牙密码锁'
  } else if (model > 60 && model <= 69) {
    return '蓝牙NB机柜锁'
  } else if (model > 70 && model <= 79) {
    return '蓝牙指纹锁'
  } else if (model > 80 && model <= 89) {
    return 'NB指纹锁'
  }
}

const getLockName = (mac, model) => {
  var name = mac.replace(/:/g, '_').slice(mac.length - 5, mac.length)
  if (model == 1) {
    return `WSL_${name}`
  } else if (model > 1 && model <= 9) {
    return `WSL_A${model % 10-1}_${name}`
  } else if (model > 20 && model <= 29) {
    return `WSL_B${model % 10-1}_${name}`
  } else if (model > 10 && model <= 19) {
    return `WSL_H${model % 10}_${name}`
  } else if (model > 30 && model <= 39) {
    return `WSL_N${model % 10}_${name}`
  } else if (model > 40 && model <= 49) {
    return `WSL_M${model % 10}_${name}`
  } else if (model > 50 && model <= 59) {
    return `WSL_U${model % 10}_${name}`
  } else if (model > 60 && model <= 69) {
    return `WSL_J${model % 10}_${name}`
  } else if (model > 70 && model <= 79) {
    return `WSL_F${model % 10}_${name}`
  } else if (model > 80 && model <= 89) {
    return `WSL_C${model % 10}_${name}`
  }
}

//得到标准时区的时间的函数
function getLocalTime(i) {
  //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
  if (typeof i !== 'number') return;
  var d = new Date();
  //得到1970年一月一日到现在的秒数
  var len = d.getTime();
  //本地时间与GMT时间的时间偏移差
  var offset = d.getTimezoneOffset() * 60000;
  //得到现在的格林尼治时间
  var utcTime = len + offset;
  return new Date(utcTime + 3600000 * i);
}

//得到标准时区的时间的函数
function getLocalTimeByZone(d, i) {
  //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
  if (typeof i !== 'number') return;
  //var d = new Date();
  //得到1970年一月一日到现在的秒数
  var len = d.getTime();
  //本地时间与GMT时间的时间偏移差
  var offset = d.getTimezoneOffset() * 60000;
  //得到现在的格林尼治时间
  var utcTime = len + offset;
  return new Date(utcTime + 3600000 * i);
}

module.exports = {
  getDateString,
  getTimeString,
  formatTime,
  formatDate,
  showBusy,
  showSuccess,
  showModel,
  isPrime,
  randomPrime,
  randomPrime6,
  randomN,
  ab2hex,
  bytesToHex,
  hexToBytes,
  macToInt,
  hexToInt,
  getLockModel,
  getLockType,
  getLockName,
  isUxLock,
  isNbLock,
  isFxLock,
  getLocalTime
}