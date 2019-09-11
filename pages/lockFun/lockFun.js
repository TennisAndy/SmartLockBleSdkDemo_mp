// pages/bindLock/bindLock.js
const config = require('../../config')
const util = require('../../utils/util.js')
const plugin = requirePlugin("myPlugin")

const app = getApp()

var connectedDeviceId
var basecode = 20947807
var lockId = 1
var lockManagerId = 1
var lockMac = ''
var isInitReady = false
var isConnected = false
var lockModel
var lockDevice
var taskId = 0

var pincode = -1
var pincodeIndex = -1

var rfCardId = -1
var rfCardIndex = -1

var fingerprintIndex = -1

var isLockLogin = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBindLock: false,
    isPincodeAdd: false,
    isRfCardAdd: false,
    isFingerprintAdd: false,
    lockModel: 0,
    lock: {},
  },


  onLoad: function(options) {
    var that = this
    connectedDeviceId = options.connectedDeviceId
    lockMac = options.mac
    console.log('onLoad', 'mac = ' + lockMac)

    lockModel = util.getLockModel(options.name)

    console.log('onLoad', 'model = ' + lockModel)
    var lockType = util.getLockType(lockModel)
    var lock = {
      mac: lockMac,
      lockType: lockType,
    }

    lockDevice = app.getDeviceByDevName(options.name)
    wx.setNavigationBarTitle({
      title: options.name,
    })
    that.setData({
      lock: lock,
      lockModel: lockModel,
      isNbLock: lockModel > 30 && lockModel < 49 || lockModel > 80 && lockModel < 89 || lockModel > 100 && lockModel < 109,
      isFpLock: lockModel > 70 && lockModel < 89
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    that.initBluetooth()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (isConnected) {
      wx.closeBLEConnection({
        deviceId: connectedDeviceId,
        success: function(res) {
          isConnected = false
        },
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindLock: function() {
    var that = this
    taskId = 11
    that.initBluetooth()
  },

  unbindLock: function() {
    var that = this
    taskId = 12
    that.initBluetooth()
  },

  queryBindState: function() {
    var that = this
    taskId = 21
    that.initBluetooth()
  },

  queryBattery: function() {
    var that = this
    taskId = 22
    that.initBluetooth()
  },

  queryNbImei: function() {
    var that = this
    taskId = 31
    that.initBluetooth()
  },

  login: function() {
    var that = this
    taskId = 32
    that.initBluetooth()
  },

  openLock: function() {
    var that = this
    taskId = 41
    that.initBluetooth()
  },

  syncClock: function() {
    var that = this
    taskId = 42
    that.initBluetooth()
  },

  addPincode: function() {
    var that = this
    taskId = 51
    that.initBluetooth()
  },

  delPincode: function() {
    var that = this
    taskId = 52
    that.initBluetooth()
  },

  addRfCard: function() {
    var that = this
    taskId = 61
    that.initBluetooth()
  },

  delRfCard: function() {
    var that = this
    taskId = 62
    that.initBluetooth()
  },

  addFingerprint: function() {
    var that = this
    taskId = 71
    that.initBluetooth()
  },

  delFingerprint: function() {
    var that = this
    taskId = 72
    that.initBluetooth()
  },

  changeAdminPincode: function() {
    var that = this
    taskId = 81
    that.initBluetooth()
  },

  onQueryBindState: function() {
    var that = this
    wx.showLoading({
      title: '查询中',
    })

    var bytes = plugin.queryLockState(lockDevice.name)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onQueryBattery: function() {
    var that = this
    wx.showLoading({
      title: '查询中',
    })

    var bytes = plugin.queryLockBattery(lockDevice.name)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onQueryNbImei: function() {
    var that = this
    wx.showLoading({
      title: '查询中',
    })

    var bytes = plugin.queryNbImei(lockDevice.name)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onBindLock: function() {
    var that = this
    wx.showLoading({
      title: '绑定中',
    })

    var bytes = plugin.sendBindLock(lockDevice.name, lockId, lockManagerId, basecode)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onUnbindLock: function() {
    var that = this
    wx.showLoading({
      title: '解绑中',
    })

    var bytes = plugin.sendUnbindLock(lockDevice.name, lockId, lockManagerId, basecode)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onOpenLock: function() {
    var that = this
    wx.showLoading({
      title: '解锁中',
    })

    var bytes = plugin.sendOpenLockP1(lockDevice.name, basecode)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onLogin: function() {
    var that = this
    wx.showLoading({
      title: '登录中',
    })

    var bytes = plugin.login1(lockDevice.name, basecode)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onSyncClock: function() {
    var that = this
    wx.showLoading({
      title: '同步时钟中',
    })

    var bytes = plugin.syncClock(lockDevice.name, basecode, util.getLocalTime(8))
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onAddPincode: function() {
    var that = this
    wx.showLoading({
      title: '添加密码中',
    })
    var startTime = util.getLocalTime(8)
    var endTime = new Date(startTime.getTime() + 5 * 60 * 1000) //有效期5分钟
    pincode = util.randomPrime6()
    pincodeIndex = Math.floor(Math.random() * 100)
    var bytes = plugin.addPincode(lockDevice.name, basecode, pincode, pincodeIndex, startTime, endTime)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onDelPincode: function() {
    var that = this
    wx.showLoading({
      title: '删除密码中',
    })
    var bytes = plugin.delPincode(lockDevice.name, basecode, pincode, pincodeIndex)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onAddRfCard: function() {
    var that = this
    wx.showLoading({
      title: '添加房卡中',
    })
    var startTime = util.getLocalTime(8)
    var endTime = new Date(startTime.getTime() + 5 * 60 * 1000) //有效期5分钟
    rfCardIndex = Math.floor(Math.random() * 100)
    var bytes = plugin.addRfCard(lockDevice.name, basecode, rfCardId, rfCardIndex, startTime, endTime)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onDelRfCard: function() {
    var that = this
    wx.showLoading({
      title: '删除房卡中',
    })
    var bytes = plugin.delRfCard(lockDevice.name, basecode, rfCardId, rfCardIndex)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },


  onAddFingerprint: function() {
    var that = this
    wx.showLoading({
      title: '添加指纹中',
    })
    var startTime = util.getLocalTime(8)
    var endTime = new Date(startTime.getTime() + 5 * 60 * 1000) //有效期5分钟
    fingerprintIndex = Math.floor(Math.random() * 100)
    var bytes = plugin.addFingerprint(lockDevice.name, basecode, fingerprintIndex, startTime, endTime)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onDelFingerprint: function() {
    var that = this
    wx.showLoading({
      title: '删除指纹中',
    })
    var bytes = plugin.delFingerprint(lockDevice.name, basecode, fingerprintIndex)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  onChangeAdminPincode: function() {
    var that = this
    wx.showLoading({
      title: '修改管理密码中',
    })
    var bytes = plugin.changeAdminPincode(lockDevice.name, lockMac, 12345678, 87654321)
    console.debug('bytes', bytes)
    that.sendBytes(bytes)
  },

  doWork: function() {
    var that = this
    switch (taskId) {
      case 11:
        {
          that.onBindLock()
          break
        }
      case 12:
        {
          that.onUnbindLock()
          break
        }
      case 21:
        {
          that.onQueryBindState()
          break
        }
      case 22:
        {
          that.onQueryBattery()
          break
        }

      case 31:
        {
          that.onQueryNbImei()
          break
        }
      case 32:
        {
          that.onLogin()
          break
        }
      case 41:
        {
          that.onOpenLock()
          break
        }
      case 42:
        {
          that.onSyncClock()
          break
        }
      case 51:
        {
          that.onAddPincode()
          break
        }
      case 52:
        {
          that.onDelPincode()
          break
        }
      case 61:
        {
          if (lockModel > 70) {
            that.onAddRfCard()
          } else {
            wx.showModal({
              title: '提示',
              content: '请刷卡！',
              showCancel: false
            })

          }
          break
        }
      case 62:
        {
          that.onDelRfCard()
          break
        }
      case 71:
        {
          that.onAddFingerprint()
          break
        }
      case 72:
        {
          that.onDelFingerprint()
          break
        }
      case 81:
        {
          that.onChangeAdminPincode()
          break
        }
      default:
        {

        }
    }
  },

  initBluetooth: function() {
    var that = this
    wx.getConnectedBluetoothDevices({
      services: [config.uuid.serviceUuid],
      success: function(res) {
        res.devices.map(function(it) {
          if (it.deviceId == connectedDeviceId || it.name == name) {
            isConnected = true
          }
        })

        that.setData({
          isConnected: isConnected
        })
        console.log('isConnected', isConnected)
        if (isConnected) {
          if (isInitReady) {
            that.doWork()
          } else {
            that.setupConnection()
          }
        } else {
          that.connectTo()
        }
      },
    })
  },

  connectTo: function() {
    var that = this
    wx.showLoading({
      title: '连接中',
    })
    wx.createBLEConnection({
      deviceId: lockDevice.deviceId,
      timeout: config.ble.connectTimeOut,
      success: function(res) {
        console.debug('connectTo', res)
        isConnected = true
        wx.hideLoading()
        setTimeout(function() {
          that.setupConnection()
        }, 500)
      },
      fail: function(e) {
        console.debug('connectTo', e)
        wx.hideLoading()
        switch (e.errCode) {
          case 10003:
            {
              wx.showModal({
                title: '连接失败',
                content: '是否重新连接？',
                success: function(res) {
                  if (res.confirm) {
                    that.connectTo()
                  }
                }
              })
              break
            }
          case 10012:
            {
              wx.showModal({
                title: '连接失败',
                content: '蓝牙连接超时',
                showCancel: false
              })
              break
            }
          case 10002:
            {
              wx.showModal({
                title: '连接失败',
                content: '没有找到指定设备',
                showCancel: false
              })
              break
            }
        }
      }
    })
  },

  setupConnection: function() {
    var that = this
    wx.showLoading({
      title: '初始化连接中',
    })
    wx.getBLEDeviceServices({
      deviceId: lockDevice.deviceId,
      success: function(res) {
        console.log('Services', res)
        wx.getBLEDeviceCharacteristics({
          deviceId: lockDevice.deviceId,
          serviceId: config.uuid.serviceUuid.toUpperCase(),
          success: function(res) {
            console.log('Characteristics', res)
            wx.onBLECharacteristicValueChange(function(res) {
              var bytes = new Uint8Array(res.value)
              console.log('bytes', bytes)
              var data = plugin.parseBytes(lockDevice.name, basecode, bytes)
              console.log('data', data)
              switch (data.cmd) {
                case 'reportLockBattery':
                  {
                    if (data.data.battery < 10) {
                      wx.showModal({
                        title: '电量报警',
                        content: `门锁当前电量${data.data.battery}%！\n电量严重不足，请立即更换电池！`,
                        showCancel: false
                      })
                    } else if (data.data.battery < 30) {
                      wx.showModal({
                        title: '电量预警',
                        content: `门锁当前电量${data.data.battery}%！\n请及时更换电池！`,
                        showCancel: false
                      })
                    }
                    break
                  }
                case 'reportRfCardResult':
                  {
                    if (taskId == 61) {
                      wx.showModal({
                        title: '检测到新卡',
                        content: `是否添加此房卡，卡号：${data.data.cardId}？`,
                        success: function(res) {
                          if (res.confirm) {
                            rfCardId = data.data.cardId
                            that.onAddRfCard()
                          }
                        }
                      })
                    } else {
                      if (lockModel > 70) {
                        if (data.data.isValid) {
                          wx.showModal({
                            title: '提示',
                            content: `房卡开锁成功，序号：${data.data.index}！`,
                            showCancel: false
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: `多次刷房卡开锁失败！`,
                            showCancel: false
                          })
                        }
                      } else {
                        if (data.data.isValid) {
                          wx.showModal({
                            title: '提示',
                            content: `房卡开锁成功，卡号：${data.data.cardId}！`,
                            showCancel: false
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: `房卡未授权，卡号：${data.data.cardId}！`,
                            showCancel: false
                          })
                        }
                      }
                    }
                    break
                  }
                case 'reportPincodeResult':
                  {
                    if (lockModel > 70) {
                      if (data.data.isValid) {
                        wx.showModal({
                          title: '提示',
                          content: `密码开锁成功，序号：${data.data.index}！`,
                          showCancel: false
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: `多次密码开锁失败！`,
                          showCancel: false
                        })
                      }
                    } else {
                      if (data.data.isValid) {
                        wx.showModal({
                          title: '提示',
                          content: `密码：${data.data.pincode}开锁成功！`,
                          showCancel: false
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: `密码：${data.data.pincode}未授权！`,
                          showCancel: false
                        })
                      }
                    }
                    break
                  }
                case 'reportFingerprintResult':
                  {
                    if (data.data.isValid) {
                      wx.showModal({
                        title: '提示',
                        content: `指纹开锁成功，序号：${data.data.index}！`,
                        showCancel: false
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: `多次指纹开锁失败！`,
                        showCancel: false
                      })
                    }
                    break
                  }
                case 'queryLockState':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '查询失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    that.setData({
                      lock: {
                        mac: data.data.mac,
                        lockType: util.getLockType(lockModel),
                      },
                      isBindLock: data.data.isBind
                    })
                    lockMac = data.data.mac

                    if (taskId > 0) {
                      if (data.data.isBind) {
                        wx.showModal({
                          title: data.data.mac,
                          content: '此门锁已经硬件绑定！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      } else {
                        wx.showModal({
                          title: data.data.mac,
                          content: '此门锁硬件未绑定！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      }
                    }
                    taskId = 0
                    break
                  }
                case 'queryLockBattery':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '查询失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showModal({
                      title: '提示',
                      content: `此门锁电量为${data.data.battery}%`,
                      showCancel: false,
                      success: function(res) {}
                    })
                    break
                  }
                case 'queryNbImei':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '查询失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showModal({
                      title: '提示',
                      content: `此NB设备IMEI为${data.data.imei}`,
                      showCancel: false,
                      success: function(res) {}
                    })
                    break
                  }
                case 'sendBindLock':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '绑定失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isBindLock: data.data.isBind
                    })
                    if (data.data.isBind) {
                      wx.showToast({
                        title: '绑定成功！',
                      })
                    } else {
                      wx.showToast({
                        title: '绑定失败！',
                      })
                    }
                    break
                  }

                case 'sendUnbindLock':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '解绑失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isBindLock: data.data.isBind
                    })
                    if (data.data.isBind) {
                      wx.showToast({
                        title: '解绑失败！',
                      })
                    } else {
                      wx.showToast({
                        title: '解绑成功！',
                      })
                    }
                    break
                  }
                case 'login1':
                case 'sendOpenLockP1':
                  {
                    if (data.code != 200) {
                      wx.hideLoading()
                      if (taskId == 41) {
                        wx.showModal({
                          title: '提示',
                          content: '解锁失败！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      } else if (taskId == 32) {
                        wx.showModal({
                          title: '提示',
                          content: '登录失败！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      }

                      break
                    }
                    if (taskId == 41) {
                      var bytes = plugin.sendOpenLockP2(lockDevice.name, basecode, data.data.randomN)
                      console.debug('bytes', bytes)
                      that.sendBytes(bytes)
                    } else if (taskId == 32) {
                      var bytes = plugin.login2(lockDevice.name, basecode, data.data.randomN)
                      console.debug('bytes', bytes)
                      that.sendBytes(bytes)
                    }
                    break;
                  }
                case 'login':
                case 'sendOpenLockP2':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      if (taskId == 41) {
                        wx.showModal({
                          title: '提示',
                          content: '解锁失败！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      } else if (taskId == 32) {
                        wx.showModal({
                          title: '提示',
                          content: '登录失败！',
                          showCancel: false,
                          success: function(res) {}
                        })
                      }
                      break
                    }

                    isLockLogin = true
                    if (taskId == 41) {
                      wx.showToast({
                        title: '解锁成功！',
                      })
                    } else if (taskId == 32) {
                      wx.showToast({
                        title: '登录成功！',
                      })
                    }
                    taskId = 0
                    break;
                  }

                case 'syncClock':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '同步时间失败！' + data.data.msg,
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showModal({
                      title: '提示',
                      content: '时间更新成功！',
                      showCancel: false
                    })
                    break;
                  }
                case 'addPincode':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '添加密码失败！' + data.data.msg,
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isPincodeAdd: true
                    })
                    wx.showModal({
                      title: '提示',
                      content: `添加密码${pincode}成功！`,
                      showCancel: false
                    })
                    break
                  }

                case 'delPincode':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '删除密码失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showModal({
                      title: '提示',
                      content: `删除密码${pincode}成功！`,
                      showCancel: false,
                    })
                    that.setData({
                      isPincodeAdd: false
                    })
                    pincode = -1
                    pincodeIndex = -1
                    break
                  }

                case 'addRfCard':
                  {
                    wx.hideLoading()
                    if (data.code == 100) {
                      wx.showLoading({
                        title: data.data.msg,
                      })
                      break
                    } else if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '添加房卡失败！' + data.data.msg,
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isRfCardAdd: true
                    })
                    if (lockModel > 70) {
                      wx.showModal({
                        title: '提示',
                        content: `添加房卡成功，序号${rfCardIndex}！`,
                        showCancel: false
                      })
                    }else{
                      wx.showModal({
                        title: '提示',
                        content: `添加房卡成功，卡号${rfCardId}！`,
                        showCancel: false
                      })
                    }
                    break
                  }

                case 'delRfCard':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '删除房卡失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isRfCardAdd: false
                    })
                    if (lockModel > 70) {
                      wx.showModal({
                        title: '提示',
                        content: `删除房卡成功，序号${rfCardIndex}！`,
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: `删除房卡成功，卡号${rfCardId}！`,
                        showCancel: false,
                      })
                    }
                    rfCardId = -1
                    rfCardIndex = -1
                    break
                  }

                case 'addFingerprint':
                  {
                    wx.hideLoading()
                    if (data.code == 100) {
                      wx.showLoading({
                        title: data.data.msg,
                      })
                      break
                    } else if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '添加指纹失败！' + data.data.msg,
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    that.setData({
                      isFingerprintAdd: true
                    })
                    wx.showModal({
                      title: '提示',
                      content: `添加指纹成功，序号${fingerprintIndex}！`,
                      showCancel: false
                    })
                    break
                  }

                case 'delFingerprint':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '删除指纹失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showModal({
                      title: '提示',
                      content: `删除指纹成功，序号${fingerprintIndex}！`,
                      showCancel: false,
                    })
                    that.setData({
                      isFingerprintAdd: false
                    })
                    fingerprintIndex = -1
                    break
                  }
                case 'changeAdminPincode':
                  {
                    wx.hideLoading()
                    if (data.code != 200) {
                      wx.showModal({
                        title: '提示',
                        content: '修改管理密码失败！',
                        showCancel: false,
                        success: function(res) {}
                      })
                      break
                    }
                    taskId = 0
                    wx.showToast({
                      title: '修改管理密码成功！',
                    })
                  }
              }
            })

            wx.notifyBLECharacteristicValueChange({
              deviceId: lockDevice.deviceId,
              serviceId: config.uuid.serviceUuid.toUpperCase(),
              characteristicId: config.uuid.notifyUuid.toUpperCase(),
              state: true,
              success: function(res) {
                console.log('setupNotify', res)
                isInitReady = true
                setTimeout(function() {
                  wx.hideLoading()
                  that.onQueryBindState()
                }, 500)
              },
            })
          },
        })
      },
    })
  },

  sendBytes(bytes) {
    setTimeout(function() {
      wx.writeBLECharacteristicValue({
        deviceId: lockDevice.deviceId,
        serviceId: config.uuid.serviceUuid.toUpperCase(),
        characteristicId: config.uuid.writeUuid.toUpperCase(),
        value: bytes,
        success: function(res) {

        },
      })
    }, 50)
  },

})