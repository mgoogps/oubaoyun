var common = {
	monitor:{img:"../images/main/button/ssgz.png"},
	history:{img:"../images/main/button/gjhf.png"},
	deviceinfo:{img:"../images/main/button/sbxx.png"},
	shefang:{ img:"../images/main/button/shefang.png"},
	jiefang:{ img:"../images/main/button/jiefang.png"},
	shache1:{ img:"../images/main/button/shache.png" },
	shache2:{ img:"../images/main/button/weijihuo2.png" },
	fenceon1:{ img:"../images/main/button/fenceon1.png" },
	fenceon2:{ img:"../images/main/button/fenceon2.png" }, 
	fence:{ GeoFenceID:0, Radius:100},
	device:{ DeviceID:0, DeviceName:'', SerialNumber:0, Lat:0 ,Lng:0 }
};
 
(function($, doc) {
	$.init(); 
	mui('.mui-scroll-wrapper').scroll();
 
	var gallery = mui('.mui-slider');
	gallery.slider({
	    interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
	});
	
	$.ready(function () {
		document.getElementById('divBtnMonitor').getElementsByTagName("img")[0].src=common.monitor.img;
		document.getElementById("divBtnHistory").getElementsByTagName("img")[0].src=common.history.img;
		document.getElementById("divBtnDeviceInfo").getElementsByTagName("img")[0].src=common.deviceinfo.img;
		
		
		
		setWindowSize();
		GetDeviceList();
	})
	$.plusReady(function () {
		mui('#popoverSlider').scroll(); 
		//plus.navigator.setFullscreen(true);
		document.addEventListener("onShow",function(e){
			console.log("onShow ..."); 
		});
		var notice = localStorage.getItem("Notice");
		if (!notice) {
			var st = new Date('2017/08/09 00:00:01');
			var et = new Date('2017/08/13 23:01:01');
			var cur =new Date(); 
			if (cur.getTime() > st.getTime() && cur.getTime() < et.getTime()) {
				mui.alert(" 近期由于移动数据统计异常，部分设备可能会处于离线状态，目前已经修复，受影响的设备将会在3天左右陆续上线，敬请留意。",
				"公告");
				localStorage.setItem("Notice","1"); 
			}
		} 
	});
	
	var btnHistory = document.getElementById('divBtnHistory'); //历史轨迹
	var btnMonitor = document.getElementById("divBtnMonitor"); //实时跟踪
	var btnDeviceInfo = document.getElementById("divBtnDeviceInfo");//设备信息
	var btnDivStatus1 = document.getElementById("divDeviceStatus1"); //解防设防
	var btnDivStatus2 = document.getElementById("divDeviceStatus2"); //远程刹车
	var btnDivStatus3 = document.getElementById("divDeviceStatus3"); //电子围栏
	  
	btnMonitor.addEventListener("tap",function(){
		var m = document.getElementById("liDevice"+common.device.DeviceID).getElementsByTagName("span")[0].innerText;
		var pars = {DeviceID:common.device.DeviceID,StatusMinute: m};
		openWindow("tracking.html",pars);
	});
	btnHistory.addEventListener('tap',function () {
		//var deviceName = document.getElementById("title").getElementsByTagName("a")[0].innerText;
	    openWindow("history.html",{DeviceName:'deviceName'},true,{bounce:"none"});
	})
	 
	btnDeviceInfo.addEventListener("tap",function  () {
		openWindow("device-info.html",{ DeviceID : common.device.DeviceID });
	});
	
	btnDivStatus1.addEventListener("tap",function () { 
		var _this = this;
		mui.confirm('确认发送该指令?','提示',['取消','确认'],function (e) { 
			if (e.index == 1) { 
				var img = _this.getElementsByTagName("img")[0];
				var csl = document.getElementById("divContentStatusLeft"); 
				var sfcf = csl.getElementsByTagName("span")[0];
				var imei = common.device.SerialNumber;
				if (img.src.indexOf("jiefang") >= 0) {
					sendCommand(imei+",SF",function  () {
						img.src = common.shefang.img
						sfcf.innerText="已设防";
						sfcf.className="mgoo-foot-color";
					});  
				}else{
					sendCommand(imei+",CF",function  () {
						img.src = common.jiefang.img
						sfcf.innerText="已撤防";
						sfcf.className="mgoo-foot-color-gray";
					}); 
					
				}
			}
		},'div');
	});
	btnDivStatus2.addEventListener("tap",function () {
		var _this = this;
		mui.confirm('确认发送该指令?','提示',['取消','确认'],function (  e) { 
			if(e.index==1)
			{
				var img = _this.getElementsByTagName("img")[0]; 
				var csl = document.getElementById("divContentStatusLeft"); 
			 	var shache = csl.getElementsByTagName("span")[1];
			 	var DeviceInfo = app.getCurrentDeviceInfo();
			 	var imei = DeviceInfo.serialnumber;
				if (img.src.indexOf('shache') >= 0) {
					//发送断油指令
					sendCommand(imei+",TY",function  () {
						app.setCommandState({serialnumber:imei,brake:"brake"})
						img.src = common.shache2.img;
						shache.innerText="未刹车";
						shache.className="mgoo-foot-color-gray";
					}); 
				}else{
					sendCommand(imei+",DY",function  () {
						app.setCommandState({serialnumber:imei,brake:""})
						img.src = common.shache1.img
						shache.innerText="已刹车";
						shache.className="mgoo-foot-color"; 
					}); 
				}
			}
		},'div');
	});
	btnDivStatus3.addEventListener("tap",function () {
		var img = this.getElementsByTagName("img")[0]; 
		var csr = document.getElementById("divContentStatusRight"); 
	 	var fenceon = csr.getElementsByTagName("span")[1];
	 	if (img.src.indexOf("fenceon2") > 0) {
	 		mui.prompt(' ','请输入半径','半径',['取消','确定'],function (e) {  
			    if (e.index == 0) { //点了关闭按钮  
					
			    }else if (e.index == 1) { //开启按钮  
			    	var radius = document.querySelector('.mui-popup-input input').value;
			    	common.fence.Radius = radius;
					addGeoFence(function () {
						fenceon.innerText="围栏"+radius+"米";
						fenceon.className="mgoo-foot-color";
						img.src = common.fenceon1.img
					});
			    }
		    },'div');
		    var popup = document.querySelector(".mui-popup-in");
		    popup.style.backgroundImage="url(../images/public/popup_bg.png)";
		    popup.style.backgroundSize="100% 100%";
		    document.querySelector(".mui-popup-inner").style.backgroundImage="url(../images/public/popup_bg.png)";
		    document.querySelector(".mui-popup-inner").style.backgroundSize="100% 100%";
		  	var btns = document.querySelectorAll(".mui-popup-button");
		  	btns[0].style.backgroundColor="#006C73";
		   	btns[0].style.backgroundImage="url(../images/public/button5.png)";  //.style.backgroundColor="#006C73";
		   	btns[0].style.backgroundSize="100% 100%";  
		   	btns[1].style.backgroundColor="#006C73";
		    btns[1].style.backgroundImage="url(../images/public/button5.png)";  //"#006C73";
		    btns[1].style.backgroundSize="100% 100%";  
		    //document.querySelector('.mui-popup-input').style.backgroundColor="red";
		    
		    document.querySelector('.mui-popup-input input').type="number"; 
		    document.querySelector('.mui-popup-input input').value = common.fence.Radius;
	 	
	 	}else{
	 		deleteFence(common.fence.GeoFenceID,function () {
				fenceon.innerText="已关闭围栏";
				fenceon.className="mgoo-foot-color-gray";
				img.src = common.fenceon2.img 
			})
	 	}
	 	
	})
	
	
}(mui, document));


function GetDeviceList () {
	var state = app.getState(); 
	var a = new ajaxPar("GetDevicesList",false);
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=GetDevicesList",
		data:{userid:state.userid},
		success:function (res) {
			var dinfo = app.getCurrentDeviceInfo();
			common.device.DeviceID = '';
			if (dinfo != null) {
				common.device.DeviceID = dinfo.deviceid || undefined ;
			} 
			var ul = document.getElementById("ulDeviceList");
			ul.innerHTML=""; 
 			if (res.length == 0) {
 				mui.toast("请添加设备.");
 				openWindow("../usercenter/device-add.html",{isback:true});
 				return;
 				//console.log("需要跳转到添加设备页面");
 			}  
			for (var i = 0; i < res.length; i++) {
				var item = res[i];
				var html =[];
				var s = GetStatus(item.Status,item.Speed); 
				html.push('<a href="javascript:;">')
				html.push('<img class="mui-media-object mui-pull-left" src="'+s.img+'">')
				html.push('<div class="mui-media-body mgoo-foot-color-white">')
				html.push(item.DeviceName +'<span class="mui-hidden">'+MinuteToHour(item.StatusMinute)+'</span>') 
				html.push('<p class="mui-ellipsis">'+s.status+'</p>  </div> </a>')
				var li = document.createElement("li");
				li.className = "mui-table-view-cell mui-media";
				li.addEventListener("tap",DeviceListLiClick);
				li.innerHTML = html.join('');
				li.setAttribute("DeviceID",item.DeviceID);
				li.setAttribute("SerialNumber",item.SerialNumber);
				li.id = "liDevice"+item.DeviceID;
				li.name=item.DeviceName; 
				ul.appendChild(li); 
				if (!common.device.DeviceID) {
					//console.log("第一个在线或者离线的DeviceID");
					common.device.DeviceID = item.DeviceID;
				}
			}
			dinfo = dinfo || {};
			dinfo.deviceid = common.device.DeviceID; 
			app.setCurrentDeviceInfo(dinfo);
			GetDeviceDetailByDeviceID(common.device.DeviceID);
		}
	});
}

function DeviceListLiClick () {
	if (this.innerText.indexOf("未激活") > 0 ) {
		plus.nativeUI.toast("该设备未激活");
		//return;
	}
	mui("#divPopoverDeviceList").popover('hide');
	var DeviceName = this.name;
	var SerialNumber = this.getAttribute("SerialNumber");
	var DeviceID=this.getAttribute("DeviceID");
	app.setCurrentDeviceInfo({deviceid : DeviceID,devicename:DeviceName,serialnumber : SerialNumber}); 
	
	GetDeviceDetailByDeviceID(DeviceID);
}

function GetDeviceDetailByDeviceID (DeviceID) { 
	var a = new ajaxPar("GetMonitorByDeviceID",false);
	
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=GetMonitorByDeviceID",
		data:{deviceid:DeviceID},
		success:function (res) {  
			var liDevice = document.getElementById("liDevice"+DeviceID);
			if (liDevice) {
				var StatusTimeInfo = liDevice.getElementsByTagName("span")[0].innerText;		
			}
			common.device.DeviceID = res.DeviceID;
			common.device.DeviceName = res.DeviceName;
			common.device.SerialNumber = res.SerialNumber;
			common.device.Lat = res.OLat;
			common.device.Lng = res.OLng;
			SetMainImg(res,StatusTimeInfo);
		}
	});
	getFence(DeviceID);
}

function GetStatus (i,speed) { 
	if (i==1) { 
		if (speed > 0) {
			return {status:parseInt(speed) +"km/h",img:"../images/main/images/driving.png"};  
		}
		return {status:"静止",img:"../images/main/images/online.png"};
	} 
	else if(i==2){return  {status:"离线",img:"../images/main/images/offline.png"}; }
	else if(i==3){return {status:"未激活",img:"../images/main/images/notused.png"}; }
	else {return {status:"已过期",img:"../images/main/images/expired.png"}; }
}

function SetMainImg (res,StatusTimeInfo) {
	//document.getElementById("title").getElementsByTagName("a")[0].innerText=res.DeviceName || res.SerialNumber;
	
	var ContentDiv = document.getElementById("divContentStatusCenter");
	var img = ContentDiv.getElementsByTagName("img")[0];
	var StatusTimeDiv = ContentDiv.getElementsByTagName("span")[0]; 
	StatusTimeDiv.innerText = StatusTimeInfo;
	//document.getElementById("spanMessageCount").innerText = res.ExceptionCount;
	setTitle({title:res.DeviceName || res.SerialNumber,count: res.ExceptionCount});
	if (res.Status == 1) {
		if (res.Speed > 0) {
			StatusTimeDiv.innerText = parseInt(res.Speed) +"km/h";
			img.src = "../images/main/button/status-move.png";
		}else{
			img.src = "../images/main/button/status-still.png"; 
		}
	}else if (res.Status == 2) { 
		img.src = "../images/main/button/status-offline.png";
	}else if(res.Status == 3){
		img.src = "../images/main/button/status-notused.png";
	}else{
		img.src = "../images/main/button/status-arrears.png";
	}
 	var csl = document.getElementById("divContentStatusLeft");
 	
 	var csr = document.getElementById("divContentStatusRight");
	var sfcf = csl.getElementsByTagName("span")[0]; //设防解防
 	var battery = csr.getElementsByTagName("span")[0]; //主电
 
	if(res.DataContext){ 
		
	 	
		var context = res.DataContext.split('-'); 
		if (context[0] == 1) {
			
		}
		if (context[1] == 1) {
			sfcf.innerText ="已设防";
			sfcf.className="mgoo-foot-color"; 
			document.getElementById("divDeviceStatus1").getElementsByTagName("img")[0].src = common.shefang.img;
		}else{
			sfcf.innerText ="已撤防";
			sfcf.className="mgoo-foot-color-gray";
			document.getElementById("divDeviceStatus1").getElementsByTagName("img")[0].src = common.jiefang.img;
		}
		var span = csl.getElementsByTagName("span")[1];
		if(context[2] == 1)
		{
			span.innerText ="已刹车"; 
			span.className="mgoo-foot-color"; 
			document.getElementById("divDeviceStatus2").getElementsByTagName("img")[0].src = common.shache1.img;
		}else
		{
			span.innerText ="未刹车";
			span.className="mgoo-foot-color-gray";  
			document.getElementById("divDeviceStatus2").getElementsByTagName("img")[0].src = common.shache2.img; 
		}
		
		if (context[3] == 1) {
			battery.innerText ="主电连接"; 
			if (context[9]) {
				battery.innerText +="("+context[9]+"V)";
			} 
			battery.className="mgoo-foot-color"; 
		}else{
			battery.innerText ="主电断开";
			battery.className="mgoo-foot-color-gray"; 
		}
	}else{
		//设备未激活.
		battery.innerText ="主电断开";
		battery.className="mgoo-foot-color-gray"; 
		sfcf.innerText ="已撤防";
		sfcf.className="mgoo-foot-color-gray";
		document.getElementById("divDeviceStatus1").getElementsByTagName("img")[0].src = common.jiefang.img;
	}

	/*var sc = app.getCommandState(res.SerialNumber); 
	
	if(sc != null && sc.brake){  
		
		
	}else{ 
		
	}*/
	
}

function setTitle (opts) {
	var main = plus.webview.currentWebview().parent();
	//触发主页面的setTitle事件
	mui.fire(main,'setTitle',opts);
}

function setWindowSize() {
	//var headerHeiht = document.getElementById("header").offsetHeight;
	var dcsHeight = document.getElementById("divContentStatus").offsetHeight;
	var subtitleHeight = document.getElementById("divSubtitle").offsetHeight;
	var sliderHeight =document.getElementById("slider").offsetHeight;
	//var footerHeight = document.getElementById("footer").offsetHeight;
	var clientHeight = document.body.clientHeight;
	var buttonsHeight = clientHeight - dcsHeight - sliderHeight  -  subtitleHeight - 13;//headerHeiht - footerHeight -
 
    //if (plus.os.name == "iOS") {
    	// buttonsHeight = buttonsHeight - 50;
    ////}
	document.getElementById("divButtons").style.height = buttonsHeight;
	document.getElementById("divButtons1").style.height = parseInt(buttonsHeight / 2) +"px" ;
	document.getElementById("divButtons2").style.height =  parseInt(buttonsHeight / 2) +"px" ;
}

function getFence (deviceid) {
	var a = new ajaxPar("GetGeoFenceListByDeviceID");
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=GetGeoFenceListByDeviceID",
		data:{deviceid : deviceid},
		success:function (res) {  
			var dzwl = document.getElementById("divDeviceStatus3");
			var img = dzwl.getElementsByTagName("img")[0];
			var span = document.getElementById("divContentStatusRight").getElementsByTagName("span")[1];
			if (res.length <= 0) {
				//return;
				img.src = common.fenceon2.img;
				span.innerText="围栏已关闭";
				span.className="mgoo-foot-color-gray"; 
				common.fence.GeoFenceID = 0;
				common.fence.Radius = 100;
			}else{
				img.src = common.fenceon1.img; 
				common.fence.Radius = res[0].Radius.replace('.00','');
				span.innerText="围栏"+common.fence.Radius+"米";
				span.className="mgoo-foot-color"; 
				common.fence.GeoFenceID = res[0].GeofenceID;
			}
		}
	});
}
function setFence (deviceid) {
	var a = new ajaxPar("SetGeoFenceByDeviceID");
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=SetGeoFenceByDeviceID",
		data:{deviceid:deviceid,radius:radius,lng:lng,lat:lat},
		success:function (res) { 
			if (res.StatusCode == 200) {
				mui.toast("围栏已开启.");
			}else{
				mui.toast("围栏开启失败.");
			}
		}
	});
}
function addGeoFence(callback) {
	var state = app.getState();
	var a = new ajaxPar("AddGeoFence");
	var data = {
		fencename : "一键围栏",
		userid : state.userid ,
		deviceid : common.device.DeviceID,
		latitude : common.device.Lat,
		longitude : common.device.Lng, 
		radius : common.fence.Radius,
		description:''
	};
	 
	console.log(JSON.stringify(data));
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=AddGeoFence",
		data:data,
		success:function (res) { 
			if (res.StatusCode == 200) {
				common.fence.GeoFenceID = res.Result;
				callback();
				mui.toast("围栏已开启.");
			}else{
				mui.toast("围栏开启失败.");
			}
		}
	});
}
function deleteFence (fenceid,callback) {
	var a = new ajaxPar("DeleteGeoFence");
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=DeleteGeoFence",
		data:{fenceid : fenceid},
		success:function (res) { 
			if (res.StatusCode == 200) {
				mui.toast('电子围栏已关闭')
 				callback();
			}else{
				mui.toast('电子围栏关闭失败')
			}
		}
	});
}