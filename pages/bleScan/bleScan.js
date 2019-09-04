// miniprogram/pages/bleScan/bleScan.js
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searching: false,
    button_width: 0,
    list_width: 0,
    list_height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('系统: ' + app.getPlatform())
    console.log('系统版本: ' + app.getSystem())
    console.log('机型: ' + app.getModel())
    console.log('微信版本: ' + app.getVersion())
    console.log('实际宽度: ' + app.getWindowWidth())
    console.log('实际高度: ' + app.getWindowHeight())
    this.setData({
      devices_list: [],
      button_width: app.getWindowWidth() - 32,
      list_width: app.getWindowWidth(),
      list_height: app.getWindowHeight() - 32
    })
    if (app.getPlatform() == 'android' && this.versionCompare('6.5.7', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    } else if (app.getPlatform() == 'ios' && this.versionCompare('6.5.6', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    wx.onBluetoothDeviceFound(function(res) {
        //console.debug('onBluetoothDeviceFound', res)
        wx.getBluetoothDevices({
          success: function(res) {
            //console.debug('getBluetoothDevices', res.devices.length)
            var devices_list = []
            res.devices.map(function(it) {
              if (it.RSSI != 127) {
                if (it.advertisData != null) {
                  it.adData = util.ab2hex(it.advertisData)
                  if (it.adData.length > 10) {
                    var macStr = it.adData.substring(4, 16).toUpperCase()
                    //console.log('macStr', macStr)
                    it.mac = macStr.substr(10, 2) + ':' + macStr.substr(8, 2) + ':' + macStr.substr(6, 2) + ':' + macStr.substr(4, 2) + ':' + macStr.substr(2, 2) + ':' + macStr.substr(0, 2)
                    if (it.adData.substring(0, 2) == '01') {
                      it.isLightOn = true
                      it.textColor = 'green'
                    } else {
                      it.isLightOn = false
                      it.textColor = 'black'
                    }
                    if (it.adData.substring(2, 4) == '01') {
                      it.textColor = 'pink'
                      it.isBind = true
                    } else {
                      it.isBind = false
                    }

                    //console.log(it)
                  }
                } else {
                  it.textColor = 'black'
                }
                var lockModel = util.getLockModel(it.name)
                it.lockType = util.getLockType(lockModel)
                devices_list.push(it)
                app.addDeviceWithDevName(it.name, it)
              }
            })
            devices_list.sort((a, b) => a.RSSI < b.RSSI)
            that.setData({
              devices_list: devices_list,
              searching: true
            })
          },
        })
      }),
      wx.onBluetoothAdapterStateChange(function(res) {
        console.log('BtStateChange', res)
        that.setData({
          searching: res.discovering
        })
        if (!res.available) {
          that.setData({
            devices_list: [],
            searching: false
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    setTimeout(function() {
      that.searchBluetooth()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.debug('stopScan', res)
        that.setData({
          devices_list: [],
          searching: false
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    setTimeout(function() {
      that.searchBluetooth()
      wx.stopPullDownRefresh()
    }, 1000)
  },

  toUpper: function(e) {
    console.log("toUpper", e)
    wx.startPullDownRefresh({

    })
  },

  onScroll: function(e) {
    console.log("onScroll", e)
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

  searchBluetooth: function() {
    var that = this
    if (!that.data.searching) {
      that.setData({
        searching: true,
        devices_list: []
      })

      wx.startBluetoothDevicesDiscovery({
        services: [config.uuid.serviceUuid],
        allowDuplicatesKey: false,
        interval: 3,
        success: function(res) {
          console.debug('startScan', res)
        },
      })
    } else {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            devices_list: []
          })
          wx.startBluetoothDevicesDiscovery({
            services: [config.uuid.serviceUuid],
            allowDuplicatesKey: false,
            interval: 3,
            success: function(res) {
              console.debug('startScan', res)
            },
          })
        }
      })
    }
  },

  ConnectTo: function(e) {
    var that = this
    console.log('ConnectTo', e.currentTarget.id)
    var bleDevice = app.getDeviceByDevName(e.currentTarget.id)
    console.log('bleDevice', bleDevice)

    wx.navigateTo({
      url: '../lockFun/lockFun?connectedDeviceId=' + bleDevice.deviceId + '&name=' + bleDevice.name + '&mac=' + bleDevice.mac
    })
    return
  },

  versionCompare: function(ver1, ver2) { //版本比较
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
      return true
    else if (version1pre < version2pre)
      return false
    else {
      if (version1next > version2next)
        return true
      else
        return false
    }
  },
})