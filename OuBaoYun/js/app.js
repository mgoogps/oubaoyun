/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
 
(function($, owner) {
	owner.url ="http://120.76.152.131:8070";
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 2) {
			return callback('账号最短为 2 个字符');
		} 
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
  		//plus.nativeUI.showWaiting("登录中...");
		var data = {
		 	loginname: loginInfo.account,
		 	password:  (loginInfo.ismd5 ? hex_md5(loginInfo.password): loginInfo.password),
		 	identifies: "OuBaoYun@BAIDU",
		 	code:''
		}; 
		var url = owner.url+"/ajax/Login.asmx/MgLogin";
		var authed = false; 
		mui.ajax(url,{
		 	data: JSON.stringify(data),
		 	timeout:5000,
			type:"POST",
			async:false,
			dataType:'json',
			headers:{'Content-Type':'application/json'},
			success:function(res) { 
				var loginResult = JSON.parse(res.d);
				if (loginResult.StatusCode === 200) {
					loginResult.account = loginInfo.account;
					loginResult.password = data.password;
					loginResult.keeppassword = loginInfo.keeppassword; 
					owner.mobile(loginResult.UserID); 
					return owner.createState(loginResult, callback);
				}else{
					return callback('用户名或密码错误');
				}
			},
			error:function (XMLHttpRequest, type, errorThrown) {
				return callback("网络超时,请稍后再试")
			}
		});  
	};

	owner.createState = function(loginInfo, callback) {
		var state = owner.getState();
		state.account = loginInfo.account;
		state.token = loginInfo.Token;
		state.userid = loginInfo.UserID;
		state.password= loginInfo.password; 
		state.username = loginInfo.UserName;
		state.keeppassword = loginInfo.keeppassword;
		owner.setState(state); 
		return callback();
	};
	
	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.username = regInfo.username || '';
		regInfo.password = regInfo.password || '';
		regInfo.phone = regInfo.phone || '';
		regInfo.code = regInfo.code || '';
	 
		if (regInfo.username.length < 2) {
			return callback('昵称最短需要 2 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (regInfo.code.length != 6) {
			return callback("验证码错误");
		}
		if (regInfo.phone.length < 11) {
			return callback("手机号码格式错误")
		} 
		mui.ajax(owner.url+"/ajax/Login.asmx/MgRegister",{
			data: JSON.stringify(regInfo),
		 	timeout:5000,
			type:"POST",
			async:false,
			dataType:'json',
			headers:{'Content-Type':'application/json'},
			success:function(res) {
				res = JSON.parse(res.d); 
				if (res.StatusCode == 200) {
					return callback();
				}else{
					return callback(res.Message);
				}
			},
			error:function (a,b,c) {
				return callback("网络超时,请稍后再试");
			}
		});
		/*var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));*/
		
	};
	
	owner.sendCode= function (phoneInfo, callback) {
		phoneInfo = phoneInfo || {};
		callback = callback || $.noop;
		phoneInfo.phone = phoneInfo.phone || '';
		phoneInfo.type = phoneInfo.type || '';
		if(phoneInfo.phone.length < 11){
			return callback("手机格式不对"); 
		} 
		mui.ajax(owner.url+"/ajax/Login.asmx/SMSCodes",{
			data: JSON.stringify(phoneInfo),
		 	timeout:5000,
			type:"POST",
			async:false,
			dataType:'json',
			headers:{'Content-Type':'application/json'},
			success:function(res) {
				res = JSON.parse(res.d); 
				if (res.StatusCode == 200) {
					return callback();
				}else{
					return callback(res.Message);
				}
			},
			error:function (a,b,c) {
				return callback("网络错误,请稍后再试");
			}
		})
	}
	
	owner.mobile = function (UserID) {
		 
		var vInfo = plus.push.getClientInfo();
		
		var mobileInfo = {};
		mobileInfo.appid = vInfo.appid;
		mobileInfo.appkey = vInfo.appkey;
		mobileInfo.clientid = vInfo.clientid;
		mobileInfo.token = vInfo.token; 
		mobileInfo.model =  plus.device.model; 
		mobileInfo.vendor =  plus.device.vendor;
		mobileInfo.imei = plus.device.imei;
		mobileInfo.uuid = plus.device.uuid;
		mobileInfo.imsi = plus.device.imsi.join(); 
		mobileInfo.resolution=(plus.display.resolutionWidth*plus.screen.scale) +"x"+(plus.display.resolutionHeight*plus.screen.scale);
		mobileInfo.dpi = plus.screen.dpiX +"x"+plus.screen.dpiY;
		mobileInfo.os = plus.os.name;
		mobileInfo.osversion = plus.os.version;
		mobileInfo.userid = UserID;
		plus.runtime.getProperty(plus.runtime.appid,function(inf){
 			mobileInfo.appversion = inf.version; 
 			mui.ajax(owner.url+"/ajax/Login.asmx/MobileInfo",{
				data: JSON.stringify(mobileInfo),
			 	timeout:5000,
				type:"POST", 
				dataType:'json',
				headers:{'Content-Type':'application/json'},
				success:function(res) { 
					res = JSON.parse(res.d); 
					if (res.StatusCode == 200) {
						 
					}else{
						//mui.toast(res.Message)
					}
				},
				error:function (a,b,c) {
	 				mui.toast("error")
				}
			});
		});
		//"id":"igexin","token":"79b57f8630e35db8c9f7e8333e5e1d7f","clientid":"79b57f8630e35db8c9f7e8333e5e1d7f","appid":"pPyZWvH3Fa6PXba10aJ009","appkey":"b7dOGlNPHR7pqwUxDhpTi4"
	}
	
	owner.appinfo = function () {
 
		if (localStorage.getItem("appinfo_mi") == "success") {
			return;
		}
		var ai = {};
		var vInfo = plus.push.getClientInfo();
		ai.appid = vInfo.appid; 
		ai.appkey = vInfo.appkey;
		ai.packagename = plus.runtime.appid; //程序包名
		ai.os = plus.os.name; 
		mui.ajax(owner.url+"/ajax/Login.asmx/MobileApps",{
			data: JSON.stringify(ai),
		 	timeout:5000,
			type:"POST", 
			dataType:'json',
			headers:{'Content-Type':'application/json'},
			success:function(res) {
				//console.log(res.d);
				res = JSON.parse(res.d); 
				if (res.StatusCode == 200) {
					//return callback();
					localStorage.setItem("appinfo_mi","success");
				}else{
					//return callback(res.Message);
					//mui.toast(res.Message)
				}
			},
			error:function (a,b,c) {
				//return callback("网络错误,请稍后再试");
			}
		})
	}
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};
	
	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	owner.setCurrentDeviceInfo = function(info){
		info = info || {};
		info.deviceid = info.deviceid || '';
		info.devicename = info.devicename || '';
		info.serialnumber = info.serialnumber || '';
		localStorage.setItem("CurrentDeviceInfo", JSON.stringify(info)); 
	}
	owner.getCurrentDeviceInfo = function  () {
		var val = localStorage.getItem("CurrentDeviceInfo") ;
		return JSON.parse(val); 
	}
	 
	owner.setCommandState = function (info) {
		info = info || {};
		info.serialnumber = info.serialnumber || '';
		info.brake = info.brake || '';
		localStorage.setItem(info.serialnumber, JSON.stringify(info)); 
	}
	/*owner.getCommandState = function (imei) {
		var val = localStorage.getItem(imei);
		return JSON.parse(val); 
	}*/
	 
	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(info, callback) {
		callback = callback || $.noop;
		info = info||{};
		info.phone = info.phone || '';
		info.password = info.password || '';
		info.code = info.code || '';
		mui.ajax(owner.url+"/ajax/Login.asmx/RetrievePassword",{
			data: JSON.stringify(info),
		 	timeout:5000,
			type:"POST",
			async:false,
			dataType:'json',
			headers:{'Content-Type':'application/json'},
			success:function(res) {
				res = JSON.parse(res.d); 
				if (res.StatusCode == 200) {
					return callback();
				}else{
					return callback(res.Message);
				}
			},
			error:function (a,b,c) {
				return callback("网络超时,请稍后再试");
			}
		}); 
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}

}(mui, window.app = {}));