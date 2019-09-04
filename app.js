const config = require('config')
const noop = function noop() {};
const RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

//app.js
App({
  onLaunch(options) {
    console.debug('[AppOnLaunch]', options)
    this.globalData.sysinfo = wx.getSystemInfoSync()
  },

  onShow(options) {
    console.debug('[AppOnShow]', options)
    this.initBluetooth()
  },

  onHide() {
    wx.closeBluetoothAdapter({
      success: function(res) {
        console.debug(res);
      },
    })
  },

  onError(msg) {
    console.error('[AppOnError]', msg)
  },

  initBluetooth: function() {
    var that = this;
    wx.openBluetoothAdapter({
      success: function(res) {
        console.log("初始化蓝牙适配器");
        console.debug(res);
        wx.getBluetoothAdapterState();
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: '蓝牙初始化失败',
          icon: 'success',
          duration: 2000
        })

        setTimeout(function() {
          wx.hideToast()
        }, 2000)
      }
    });
    wx.onBluetoothAdapterStateChange(function(res) {
      var available = res.available;
      if (available) {
        wx.getBluetoothAdapterState({
          success: function(res) {
            console.debug(res);
          },
        })
      }
    })
  },

  connectTo: function(options) {
    console.debug('connectTo', options)
    if (typeof options !== 'object') {
      var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
      throw new RequestError('invalid params', message);
    }

    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;

    // 成功回调
    var callSuccess = function() {
      success.apply(null, arguments);
      complete.apply(null, arguments);
    };

    // 失败回调
    var callFail = function(error) {
      fail.call(null, error);
      complete.call(null, error);
    };
    var that = this
    if (options.devName == undefined) {
      throw new RequestError('invalid params', 'options.devName');
    }

    var bleDev = that.globalData.foundBleDevs[options.devName]
    console.log('bleDev', bleDev)
    if(bleDev == undefined){
      throw new RequestError('dev not found', options.devName);
    }

    wx.showLoading({
      mask: true,
      title: '连接中...',
    })
    wx.createBLEConnection({
      deviceId: bleDev.deviceId,
      timeout: 8000,
      success: function(res) {
        console.log('createBLEConnection success', res)
        wx.getBLEDeviceServices({
          deviceId: bleDev.deviceId,
          success: function(res) {
            wx.getBLEDeviceCharacteristics({
              deviceId: bleDev.deviceId,
              serviceId: config.uuid.serviceUuid.toUpperCase(),
              success: function(res) {
                wx.notifyBLECharacteristicValueChange({
                  deviceId: bleDev.deviceId,
                  serviceId: config.uuid.serviceUuid.toUpperCase(),
                  characteristicId: config.uuid.notifyUuid.toUpperCase(),
                  state: true,
                  success: function(res) {
                    callSuccess()
                  },
                  fail: function(res) {
                    callFail(res)
                  }
                })
              },
              fail: function(res) {
                callFail(res)
              }
            })
          },
          fail: function(res) {
            callFail(res)
          }
        })
      },
      fail: function(res) {
        console.log('createBLEConnection fail', res)
        wx.hideLoading()
        if (res.errMsg.indexOf('already connect') > 0) {
          callSuccess()
        } else {
          callFail(res)
        }
      }
    })
  },

  sendBytes: function (options) {
    if (typeof options !== 'object') {
      var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
      throw new RequestError('invalid params', message);
    }

    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;

    // 成功回调
    var callSuccess = function () {
      success.apply(null, arguments);
      complete.apply(null, arguments);
    };

    // 失败回调
    var callFail = function (error) {
      fail.call(null, error);
      complete.call(null, error);
    };
    var that = this
    var bleDev = that.globalData.foundBleDevs[options.devName]

    setTimeout(function () {
      wx.writeBLECharacteristicValue({
        deviceId: bleDev.deviceId,
        serviceId: config.uuid.serviceUuid.toUpperCase(),
        characteristicId: config.uuid.writeUuid.toUpperCase(),
        value: options.bytes,
        success: function (res) {
          callSuccess(res)
        },
        fail: function(res){
          callFail(res)
        }
      })
    }, 50)
  },

  getModel: function() {
    return this.globalData.sysinfo["model"]
  },
  getVersion: function() {
    return this.globalData.sysinfo["version"]
  },
  getSystem: function() {
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function() {
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function() {
    return this.globalData.sysinfo["SDKVersion"]
  },
  getWindowWidth: function() {
    return this.globalData.sysinfo["windowWidth"]
  },
  getWindowHeight: function() {
    return this.globalData.sysinfo["windowHeight"]
  },
  getScreenWidth: function() {
    return this.globalData.sysinfo["screenWidth"]
  },
  getScreenHeight: function() {
    return this.globalData.sysinfo["screenHeight"]
  },

  getDeviceByDevName(devName) {
    return this.globalData.foundBleDevs[devName]
  },

  addDeviceWithDevName(devName, dev) {
    this.globalData.foundBleDevs[devName] = dev
  },

  globalData: {
    sysinfo: null,
    foundBleDevs: {},
  },
})