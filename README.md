# 吾家智锁sdk v1.4.0

此插件封装了吾家智锁蓝牙通信协议部分，通过接口函数轻松生成蓝牙指令，开发者只需将指令通过蓝牙发送出去，再解析指令回复获取结果。
>功能示例
>* 1.扫描锁蓝牙
![链接](./bleScan.png)
>* 2.WSL_Ux蓝牙密码锁系列
![链接](./wsl_ux.jpeg)
>* 3.WSL_Nx,WSL_Mx NB密码锁系列
![链接](./wsl_nx.jpeg)
>* 4.WSL_Fx蓝牙指纹锁系列
![链接](./wsl_fx.jpeg)
>* 5.WSL_Cx NB指纹锁系列
![链接](./wsl_cx.jpeg)
>* 6.WSL_Ox蓝牙密码锁系列
![链接](./wsl_ox.jpeg)
>* 7.WSL_Dx NB密码锁系列
![链接](./wsl_dx.jpeg)
>* 8.WSJ_Qx 蓝牙取电开关系列
![链接](./wsj_qx.jpeg)

***
## 1.sdk安装
### 1.1.申请使用插件
  微信公众平台添加插件"吾家智锁sdk"，提交申请，并发送邮件至logsoul@qq.com，申请appKey，
  注明申请小程序主体信息，联系方式，appId，应用名称，应用说明，我们将于1～2个工作日处理。

### 1.2.插件初始化
<pre><code>
  const plugin = requirePlugin("myPlugin")
  ...
  App({
  onLaunch(options) {
    console.debug('[AppOnLaunch]', options)
    this.globalData.sysinfo = wx.getSystemInfoSync()
    plugin.init('appId', 'appKey')
    .then(function(res){
      console.log('res', res)
      if(res.code != 200){ //sdk验证失败，将无法使用生成离线密码功能
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  })
</code></pre> 
***
## 2. 通用指令接口

### 2.1 指令回复解析 parseBytes
  >function parseBytes(devName, basecode, data)
  >* params: 
    >>devName: String类型，锁蓝牙名称，
    >>basecode: int类型，8位素数，用于蓝牙通信解密
    >>data: 接收到的蓝牙回复数据

  >* return json:
    >>cmd: String类型，函数接口名称，
    >>code: int类型，200表示指令返回预期结果，300表示指令错误
    >>data: object类型，指令返回数据。

>示例代码
![链接](./demoParseBytes.png)

### 2.2 查询门锁绑定状态及mac地址 queryLockState  
  >function queryLockState(devName)
  >* params: 
    >>devName: String类型，锁蓝牙名称

  >* return data: 
    >>isBind: bool类型，表示锁硬件绑定状态，
    >>mac: String类型，表示锁的蓝牙MAC地址

### 2.3 查询门锁电量信息 queryLockBattery  
  >function queryLockBattery(devName)
  >* params: 
    >>devName: String类型，锁蓝牙名称

  >* return data: 
    >>battery: int类型，表示锁电池电量百分比

  注意：开锁成功，会主动上报电量，主动上报接口名称为reportLockBattery。

### 2.4 绑定门锁 sendBindLock  
  >function sendBindLock(devName, lockId, managerId, basecode)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>lockId: int类型，锁注册id
    >>managerId: int类型，锁管理员id
    >>basecode: int类型，8位素数，用于蓝牙通信加密，建议每一把锁提供不同的basecode

  >* return: 
    >>code: int类型，200表示绑定成功，300表示绑定失败

### 2.5 解绑门锁 sendUnbindLock  
  >function sendUnbindLock(devName, lockId, managerId, basecode)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>lockId: int类型，锁注册id
    >>managerId: int类型，锁管理员id
    >>basecode: int类型，绑定时生成

  >* return: 
    >>code: int类型，200表示解绑成功，300表示解绑失败

### 2.6 蓝牙开锁 sendOpenLockP1/sendOpenLockP2 
  >function sendOpenLockP1(devName, basecode)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码  

   >* return data: 
    >>randomN: int类型，解锁第二步加密参数

  >function sendOpenLockP2(devName, basecode, randomN)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码  
    >>randomN: int类型，解锁第一步返回

  >* return: 
    >>code: int类型，200表示蓝牙开锁成功，300表示蓝牙开锁失败

## 3. 蓝牙密码锁WSL_Ux，NB密码锁WSL_Nx和WSL_Mx系列锁指令接口

### 3.1 同步时钟 syncClock
  >syncClock(devName, basecode, time)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>time: Date类型，本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，200表示同步时钟成功，300表示同步时钟失败
注意：当密码，刷卡无法开门，或重启后，需要更新时钟。  

### 3.2 添加限时密码 addPincode
  >function addPincode(devName, basecode, pincode, index, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>pincode: int类型，6位开锁密码
    >>index: int类型，密码序号，0～99，不需要，传0
    >>startTime: Date类型，密码生效时间，取本地时钟，例如中国为UTC+8时间
    >>endTime: Date类型，密码失效时间，取本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，200表示添加成功，300表示添加失败 

  注意：密码开锁结果上报，接口名称reportPincodeResult，json数据结构如下：
  > {
    >>pincode: int类型，表示开锁密码
    >>time: date类型，表示开锁时间
    >>type: int类型, 表示密码类型
    >>isValid: bool类型，表示密码是否开锁成功
  > }   

### 3.3 删除限时密码 delPincode
  >function delPincode(devName, basecode, pincode, index)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>pincode: int类型，6位开锁密码
    >>index: int类型，密码序号，0～99，不需要，传0

  >* return: 
    >>code: int类型，200表示删除成功，300表示删除失败     

### 3.4 添加限时房卡 addRfCard
  >function addRfCard(devName, basecode, cardId, index, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>cardId: int类型，房卡卡号
    >>index: int类型，房卡序号，0～99，不需要，传0
    >>startTime: Date类型，房卡生效时间，取本地时钟，例如中国为UTC+8时间
    >>endTime: Date类型，房卡失效时间，取本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，200表示添加成功，300表示添加失败    

  注意：刷卡开锁结果上报，接口名称reportRfCardResult，数据结构如下：
  > {
    >>cardId: int类型，表示房卡卡号
    >>time: date类型，表示开锁时间
    >>type: int类型, 表示房卡类型
    >>isValid: bool类型，表示房卡是否开锁成功
  > } 
  
### 3.5 删除限时房卡 delRfCard
  >function delRfCard(devName, basecode, cardId, index)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>cardId: int类型，房卡卡号
    >>index: int类型，房卡序号，0～99，不需要，传0

  >* return: 
    >>code: int类型，200表示删除成功，300表示删除失败    

## 4. 蓝牙密码锁WSL_Ox，NB密码锁WSL_Dx，蓝牙指纹锁WSL_Fx，NB指纹锁WSL_Cx系列锁指令接口

### 4.1 登录态 login1/login2
  >function login1(devName, basecode)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码  

   >* return data: 
    >>randomN: int类型，解锁第二步加密参数

  >function login2(devName, basecode, randomN)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码  
    >>randomN: int类型，解锁第一步返回

  >* return: 
    >>code: int类型，200表示登录成功，300表示登录失败
注意：登录态表示一种鉴权行为。同步时钟，管理密码，房卡，指纹，均需要先登录后方可操作。

### 4.2 同步时钟 syncClock
  >syncClock(devName, basecode, time)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>time: Date类型，本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，200表示同步时钟成功，300表示同步时钟失败  
    >>data: object类型，其中msg表示提示信息   
注意：当密码，刷卡，指纹无法开门，或重启后，需要更新时钟。  

### 4.3 添加限时密码 addPincode
  >function addPincode(devName, basecode, pincode, index, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>pincode: int类型，6位开锁密码
    >>index: int类型，密码序号，0～99
    >>startTime: Date类型，密码生效时间，取本地时钟，例如中国为UTC+8时间
    >>endTime: Date类型，密码失效时间，取本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，200表示添加成功，300表示添加失败    
    >>data: object类型，其中msg表示提示信息   
  注意：密码开锁结果上报，接口名称reportPincodeResult，数据结构如下：
  {
    > index: int类型，表示密码序号
    > time: date类型，表示开锁时间
    > isValid: bool类型，表示密码是否开锁成功
  }   

### 4.4 删除限时密码 delPincode
  >function delPincode(devName, basecode, pincode, index)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>pincode: int类型，6位开锁密码，不需要，传0
    >>index: int类型，密码序号，0～99，必须

  >* return: 
    >>code: int类型，200表示删除成功，300表示删除失败  

### 4.5 添加限时房卡 addRfCard
  >function addRfCard(devName, basecode, cardId, index, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>cardId: int类型，房卡卡号，不需要，传0
    >>index: int类型，房卡序号，0～99，必须
    >>startTime: Date类型，房卡生效时间，取本地时钟，例如中国为UTC+8时间
    >>endTime: Date类型，房卡失效时间，取本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，100时，表示进入添卡模式，200表示添加成功，300表示添加失败
    >>data: object类型，其中msg表示提示信息   
注意：指纹锁系列添加房卡，是先发送指令进入添卡模式，再刷卡完成添加。
  >密码开锁结果上报，接口名称reportRfCardResult，json数据结构如下：
  {
    > index: int类型，表示房卡序号
    > time: date类型，表示开锁时间
    > isValid: bool类型，表示房卡是否开锁成功，但无效房卡不会回调
  }  

### 4.6 删除限时房卡 delRfCard
  >function delRfCard(devName, basecode, cardId, index)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>cardId: int类型，房卡卡号，不需要，传0
    >>index: int类型，房卡序号，0～99，必须

  >* return: 
    >>code: int类型，200表示删除成功，300表示删除失败    

### 4.7 添加限时指纹 addFingerprint
  >function addFingerprint(devName, basecode, index, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>index: int类型，指纹序号，0～99，必须
    >>startTime: Date类型，指纹生效时间，取本地时钟，例如中国为UTC+8时间
    >>endTime: Date类型，指纹失效时间，取本地时钟，例如中国为UTC+8时间

  >* return: 
    >>code: int类型，100时，表示进入添加指纹模式，200表示添加成功，300表示添加失败
    >>data: object类型，其中msg表示提示信息   
注意：指纹锁系列添加指纹，是先发送指令进入添加指纹，再刷反复录入指纹完成添加。
  >指纹开锁结果上报，接口名称reportFingerprintResult，数据结构如下：
  {
    > index: int类型，表示指纹序号
    > time: date类型，表示开锁时间
    > isValid: bool类型，表示指纹是否开锁成功，但无效指纹不会回调
  }  

### 4.8 删除限时指纹 delFingerprint
  >function delFingerprint(devName, basecode, index)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>basecode: int类型，蓝牙通信加密码
    >>index: int类型，指纹序号，0～99，必须

  >* return: 
    >>code: int类型，200表示删除成功，300表示删除失败   

### 4.9 修改管理密码 changeAdminPincode
  >function changeAdminPincode(devName, mac, oldPwd, newPwd)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>mac: String类型，锁蓝牙MAC地址
    >>oldPwd: int类型，锁原来管理密码，初始状态默认12345678，可开门
    >>newPwd: int类型，锁新的管理密码

  >* return: 
    >>code: int类型，200表示修改成功，300表示修改失败  
注意：指纹锁初始状态下管理密码为12345678，因此绑定门锁后，建议立即修改管理密码。

## 5. Nx,Mx,Cx,Dx NB系列锁指令接口

### 5.1 获取NB模组IMEI queryNbImei
  >function queryNbImei(devName)
  >* params: 
    >>devName: String类型，锁蓝牙名称

  >* return data: 
    >>imei: String类型，表示NB模组设备imei

## 6. WSJ_Qx 蓝牙取电开关指令接口

### 6.1 蓝牙上电 sendOpenLockP1/sendOpenLockP2 
  >function sendOpenLockP1(devName, basecode)
  >* params: 
    >>devName: String类型，取电开关名称
    >>basecode: int类型，蓝牙通信加密码  

   >* return data: 
    >>randomN: int类型，上电第二步加密参数

  >function sendOpenLockP2(devName, basecode, randomN)
  >* params: 
    >>devName: String类型，取电开关蓝牙名称
    >>basecode: int类型，蓝牙通信加密码  
    >>randomN: int类型，上电第一步返回

  >* return: 
    >>code: int类型，200表示蓝牙上电成功，300表示蓝牙上电失败

注意：蓝牙取电开关，当蓝牙上电后，蓝牙断开后延时5分钟断开。

## 7. 门锁离线密码生成接口

### 7.1 生成离线密码 genOfflinePincode
  >function genOfflinePincode(devName, lockMac, basecode, pwdType, startTime, endTime)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>lockMac: String类型，锁蓝牙MAC
    >>basecode: int类型，蓝牙通信加密码  
    >>pwdType: int类型，离线密码类型，0是限时，1是单次，3是清理密码
    >>startTime: Date类型，离线密码生效时间，取本地时钟，例如中国为UTC+8时间，忽略即时生效
    >>endTime: Date类型，离线密码失效时间，取本地时钟，例如中国为UTC+8时间

   >* return data: 
    >>code: int类型，200表示生成功能，其他失败
    >>data: String类型，离线开锁密码或失败信息

注意：若appId或appKey非法，则sdk init不成功，无法成功调用此接口。

## 8. 门锁定制功能指令
![链接](./extra_fun.jpg)
蓝牙密码锁WSL_Ox，NB密码锁WSL_Dx，蓝牙指纹锁WSL_Fx，NB指纹锁WSL_Cx系列锁定制指令，请确认您的锁是否支持此部分指令，若不支持，则锁蓝牙指令不会回复。
### 8.1 查询门锁方舌状态 queryLockSlotState
  >function queryLockSlotState(devName)
  >* params: 
    >>devName: String类型，锁蓝牙名称

   >* return data: 
    >>code: int类型，200表示查询成功，其他失败
    >>state: int类型，表示锁方舌状态 0为关闭，1为打开

### 8.2 查询门锁开关状态 queryLockUnlockState
  >function queryLockUnlockState(devName)
  >* params: 
    >>devName: String类型，锁蓝牙名称

   >* return data: 
    >>code: int类型，200表示查询成功，其他失败
    >>state: int类型，表示锁开关状态 0为关闭，1为打开

### 8.3 设置常开模式 setLockUnlockState
  >function setLockUnlockState(devName, isUnlock)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>isUnlock: Boolean类型，表示是否常开

   >* return data: 
    >>code: int类型，200表示查询成功，其他失败
    >>state: int类型，表示锁常开状态 0为关闭常开，非0为打开常

### 8.4 设置静音模式 setLockUnlockState
  >function setLockUnlockState(devName, isMuted)
  >* params: 
    >>devName: String类型，锁蓝牙名称
    >>isMuted: Boolean类型，表示是否静音

   >* return data: 
    >>code: int类型，200表示查询成功，其他失败
    >>state: int类型，表示锁静音状态， 0为打开，1为关闭
