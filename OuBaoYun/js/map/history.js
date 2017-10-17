var mgoo;
var lushu;
var playSpeed = 400;
var distance;
var deviceName="";
var selectRadio=1;
mui.init({
	swipeBack: true, //启用右滑关闭功能
	gestureConfig:{
	   tap: true, //默认为true
	   doubletap: true, //默认为false
	   longtap: true, //默认为false
	   swipe: true, //默认为true
	   drag: true, //默认为true
	   hold:true,//默认为false，不监听
	   release:true//默认为false，不监听
	}
});
mui.ready(function () {
	DateDefaults();
	mgoo = new mgMap("allmap","BAIDU");
	mgoo.showNavigation = false;
	mgoo.isLocateMyCity = true;
	mgoo.navigation.anchor = BMAP_ANCHOR_BOTTOM_RIGHT;
	mgoo.navigation.offset=new BMap.Size(10, 113);
	mgoo.loadMap();
	mgoo.setZoom(10);
})
mui.plusReady(function () {
  
	document.getElementById('aSettings').addEventListener('tap',function () {
        var divdate = document.getElementById("divDate");
        var className = divdate.getAttribute("class");
        if (className.indexOf("mui-hidden") >= 0) {
        	divdate.classList.remove("mui-hidden");
        }else{
        	divdate.classList.add("mui-hidden");
        } 
	});
	
	document.getElementById('divPlay').addEventListener('tap',function () { 
   		if (lushu._fromPause) {
   			this.style.background="url(../images/history/pause.png)"; 
   			lushu.start(); 
   		}else{
   			this.style.background="url(../images/history/play.png)";
   			lushu.pause();
   		}
	  	this.style.backgroundSize="100% 100%"; 
	});
	document.getElementById('divSpeedLess').addEventListener('tap',function () {
        if (lushu && lushu._opts && lushu._opts.speed > 200){
            lushu._opts.speed -= 200;
        }
	});
	document.getElementById('divSpeedPlus').addEventListener('tap',function () {
     	if (lushu && lushu._opts && lushu._opts.speed < 2000){
            lushu._opts.speed += 200;
        }
	})
	
	mui("#divChooseDay").on("tap","div",function (e) {
	 	var radio =this.getElementsByTagName("input")[0];
	 	radio.checked = true;  
	 	switch (radio.value){
	 		case "1"://选择了今天
	 			var date = new Date(); 
	 			 //IOS Date 不支持 new Date(yyyy-MM-dd)的写法，需要 new Date(yyyy/MM/dd)格式
	 			SetStartDateTime(date.format("yyyy/MM/dd") +" 00:01");
	 			SetEndDateTime(date.format("yyyy/MM/dd")+" 23:59");
	 			mui('.mgoo-datetime').each(function (index,element) {
	 		    	element.style.background="url(../images/history/button10.png)";
	 		    })
	 			selectRadio = 1;
	 			break;
	 		case "2":  //选择了昨天
	 		 	var date = new Date(new Date().getTime() - 1000*60*60*24);
	 		 	 
	 			SetStartDateTime(date.format("yyyy/MM/dd") +" 00:01");
	 			SetEndDateTime(date.format("yyyy/MM/dd")+" 23:59"); 
	 			mui('.mgoo-datetime').each(function (index,element) {
	 		    	element.style.background="url(../images/history/button10.png)";
	 		    })
	 			selectRadio = 2;
	 		  	break;
	 		case "3": //自定义 
	 		    mui('.mgoo-datetime').each(function (index,element) { 
	 		    	element.style.background="url(../images/history/button09.png)";
	 		    })
	 		    selectRadio = 3;
	 			break;
	 	}
		 
	});
 
 	document.getElementById('divBtnCancel').addEventListener('tap',function () {
 	    document.getElementById("divDate").classList.add("mui-hidden");
 	})
 	
 	document.getElementById('divBtnConfirm').addEventListener('tap',function () {
 	    document.getElementById("divDate").classList.add("mui-hidden");
 	    document.getElementById('divPlay').style.background="url(../images/history/pause.png)";
 	  	GetHistoryData();
 	})
 
 	var audiodi = document.getElementById("audioMp3");
 	var a2= document.getElementById("audioMp32");
 	var a3 = document.getElementById("audioMp33");
 	var a4 = document.getElementById("audioMp34");
 	var a5 = document.getElementById("audioMp35");
 	var audioIndex= 0;
 	/*var index1=0;
 	mui("#divChooseDate").on("scroll",".mgoo-datetime",function  (e) {
 		console.log("anzhu//;///");
 	});
 	document.querySelector('.mgoo-datetime' ).addEventListener('scroll', function (e ) { 
      console.log(scroll.y); 
    })
 	mui("body").on("",".mgoo-datetime",function  () {
 		console.log("11");
 	});
  	document.getElementById('body').addEventListener('hold',function () {
 	    console.log("按住屏幕了"+this.getAttribute("name"));
 	})
  	document.getElementById('body').addEventListener('drag',function () {
  	    console.log("拖动"+index1);
  	    index1++;
  	})
  	document.getElementById('body').addEventListener('dragstart',function () {
  	    console.log("开始拖动"+index1);
  	    index1++;
  	})
  	document.getElementById('body').addEventListener('dragend',function () {
  	    console.log("拖动结束"+index1);
  	    index1++;
  	})
  	document.getElementById('body').addEventListener('release',function () {
  	    console.log("离开屏幕"+index1);
  	    index1++;
  	});
  	document.getElementById('body').addEventListener('scroll',function () {
  	    console.log(index1);
  	})*/
 
	mui('.mgoo-datetime').each(function (index,element) {
		//向上滑动
		element.addEventListener("swipeup",function () {
			if (selectRadio!=3) {
				return;
			}
			//console.log("向上滑动");
			var name = this.getAttribute("name");
			var label = this.getElementsByTagName("label")[0];
		 	var span1 = this.getElementsByTagName("span")[0];
		 	var span2 = this.getElementsByTagName("span")[1];
		 	switch (audioIndex){
		 		case 0:
		 			audiodi.play();
		 			break;
		 		case 1:
		 			a2.play();
		 			break;
		 		case 2:
		 			a3.play();
		 			break;
		 		case 3:
		 			a4.play();
		 			break;
		 		case 4:
		 			a5.play();
		 			break;
		 	}
		 	audioIndex++;
		 	if (audioIndex > 4) {
		 		audioIndex = 0;
		 	} 
		 	setChooseDatetime(name,span1,label,span2,"swipeup"); 
		})
		//向下滑动
		element.addEventListener("swipedown",function () {
			if (selectRadio!=3) {
				return;
			}
			var name = this.getAttribute("name");
			var label = this.getElementsByTagName("label")[0];
		 	var span1 = this.getElementsByTagName("span")[0];
		 	var span2 = this.getElementsByTagName("span")[1]; 
			switch (audioIndex){
		 		case 0:
		 			audiodi.play();
		 			break;
		 		case 1:
		 			a2.play();
		 			break;
		 		case 2:
		 			a3.play();
		 			break;
		 		case 3:
		 			a4.play();
		 			break;
		 		case 4:
		 			a5.play();
		 			break;
		 	}
		 	audioIndex++;
		 	if (audioIndex > 4) {
		 		audioIndex = 0;
		 	}
			setChooseDatetime(name,span1,label,span2,"swipedown");  
		})
	
	})
	 
	var _back = mui.back;
	mui.back = function(event) {
		backMain();
		_back();
	};
});
 
function GetHistoryData () {
	var st = GetStartDateTime();
    var et = GetEndDateTime();
    var a = new ajaxPar("GetHistoryLocusList");
    var DeviceInfo= app.getCurrentDeviceInfo();
    deviceName = DeviceInfo.devicename;
    var DeviceID = DeviceInfo.deviceid;
    a.ajax({
    	url:"/ajax/DevicesAjax.asmx?op=GetHistoryLocusList",
    	data:{deviceid:DeviceID,startdate:st, enddate:et, speedfilter:7.5},
    	success:function (res) {
    		
    		if (res.length == 0) {
	 			plus.nativeUI.toast("没有查询到数据.");
	 			return;
	 		}
	 		var datalist = [];
            showInfoWindowData = [];
            var len = res.length- 1;
             
            for (var i = 0; i < len ; i++) {
                var v = res[i];
                var point = mgoo.Point(parseFloat(v.OLng).toFixed(5), parseFloat(v.OLat).toFixed(5)); 
                var distance = mgoo.getDistance(point, mgoo.Point(res[i + 1].OLng, res[i + 1].OLat));
                datalist.push(point);
                showInfoWindowData.push({ "time": v.DeviceTime, "speed": v.Speed + "Km", "Course": GetCoureName(v.Course) });
            }
            lushu = new BMapLib.LuShu(mgoo.map, datalist, {
                defaultContent: "请稍后...",
                autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                icon: new BMap.Icon('../images/maps/point@24.png', new BMap.Size(32, 32), { anchor: new BMap.Size(16, 13) }),
                speed: playSpeed,
                enableRotation: true,//是否设置marker随着道路的走向进行旋转
                landmarkPois: [],
                interval: 60
            }); 
           
            mgoo.centerAndZoom(parseFloat(res[0].OLng).toFixed(5), parseFloat(res[0].OLat).toFixed(5), 18);
         	lushu.start(); 
    	}
    });
}
 
function DateDefaults() {
	var date = new Date();
	 		 	 
	SetStartDateTime(date.format("yyyy/MM/dd") +" 00:01");
	SetEndDateTime(date.format("yyyy/MM/dd")+" 23:59"); 
}

function setChooseDatetime (name,first,self,last,type) {
	var value; 
	if (type == "swipedown") { //向下滑动
		value = ~~self.innerText - 1;
		
	}else{
		value = ~~self.innerText + 1; 
	} 
	switch (name){
		case "divYears":
			var jiayi = ~~value + 1;
			var jianyi = ~~value - 1;
		 	first.innerText = jianyi;
			self.innerText = value;
			last.innerText = jiayi;
			break;
		case "divMonth":
			value  = value > 12 ? '01' : value; 
			value = value <= 0 ? '12' : value;
			var jiayi = ~~value + 1;
			var jianyi = ~~value - 1;
			first.innerText = jianyi <= 0 ? "12" : padNumber(jianyi); 
			self.innerText = padNumber(value);
			last.innerText = jiayi > 12 ? '01' : padNumber(jiayi);
			break;
		case "divDay":
			value  = value > 31 ? '01' : value; 
			value = value <= 0 ? '31' : value;
			var jiayi = ~~value + 1;
			var jianyi = ~~value - 1;
			first.innerText = jianyi <= 0 ? 31 : padNumber(jianyi);
			self.innerText = padNumber(value);
			last.innerText = jiayi > 31 ? '01' : padNumber(jiayi); 
			break;
		case "divHours":
			value  = value >= 23 ? '00' : value; 
			value = value < 0 ? '23' : value;
			var jiayi = ~~value + 1;
			var jianyi = ~~value - 1;
			first.innerText = jianyi < 0 ? 23 : padNumber(jianyi);
			self.innerText = padNumber(value); 
			last.innerText = jiayi > 23 ? '00' : padNumber(jiayi);
			break;
		case "divMinutes":
			value  = value >= 60 ? '00' : value; 
			value = value < 0 ? '59' : value;
			var jiayi = ~~value + 1;
			var jianyi = ~~value - 1;
			first.innerText = jianyi <= 0 ? 60 : padNumber(jianyi);
			self.innerText = padNumber(value) ;
			last.innerText = jiayi > 60 ? '01' : padNumber(jiayi);
			break;
	}
}
function padNumber (num) { 
	if ((''+num).length < 2) {
		return '0'+num;
	}
	return num;
}

function GetStartDateTime() {
	var big = document.getElementById("divStartDate");
 	var dates = big.getElementsByClassName("mgoo-datetime");
 	return dates[0].getElementsByTagName("label")[0].innerText +
 	"-"+dates[1].getElementsByTagName("label")[0].innerText+
 	"-"+dates[2].getElementsByTagName("label")[0].innerText + 
 	" "+dates[3].getElementsByTagName("label")[0].innerText+
 	":"+dates[4].getElementsByTagName("label")[0].innerText;
}
function GetEndDateTime () {
	var big = document.getElementById("divEndDate");
 	var dates = big.getElementsByClassName("mgoo-datetime");
 	return dates[0].getElementsByTagName("label")[0].innerText +
 	"-"+dates[1].getElementsByTagName("label")[0].innerText+
 	"-"+dates[2].getElementsByTagName("label")[0].innerText + 
 	" "+dates[3].getElementsByTagName("label")[0].innerText+
 	":"+dates[4].getElementsByTagName("label")[0].innerText;
}

function SetStartDateTime (datetime) {
	 
	var myDate = new Date(datetime);
 
 	var last = getLastDate(myDate );
 	var next = getNextDate(myDate);
 	 
 	mui('#divStartDate .mgoo-datetime').each(function (index,element) {
 		var name = element.getAttribute("name");
 		var label = this.getElementsByTagName("label")[0];
	 	var span1 = this.getElementsByTagName("span")[0];
	 	var span2 = this.getElementsByTagName("span")[1];
 		switch (name){
 			case "divYears":
 				label.innerText = myDate.getFullYear() ;
 				span1.innerText = last.year;
 				span2.innerText = next.year;
 				break;
			case "divMonth":
				label.innerText = padNumber(myDate.getMonth() + 1);  
				span1.innerText = padNumber(last.month); 
				span2.innerText = padNumber(next.month); 
				break;
			case "divDay":
				label.innerText = padNumber(myDate.getDate());  
				span1.innerText = padNumber(last.day); 
				span2.innerText = padNumber(next.day); 
				break;
			case "divHours":
				label.innerText = padNumber(myDate.getHours());  
				span1.innerText = padNumber(last.hours); 
				span2.innerText = padNumber(next.hours); 
				break;
			case "divMinutes":
				label.innerText = padNumber(myDate.getMinutes());  
				span1.innerText = padNumber(last.mi); 
				span2.innerText =  padNumber(next.mi); 
				break;
 		}
 	})
}

function SetEndDateTime (datetime) {
	var myDate = new Date(datetime || new Date().getTime()); 
 	var last = getLastDate(myDate);
 	var next = getNextDate(myDate); 
 	mui('#divEndDate .mgoo-datetime').each(function (index,element) {
 		var name = element.getAttribute("name");
 		var label = this.getElementsByTagName("label")[0];
	 	var span1 = this.getElementsByTagName("span")[0];
	 	var span2 = this.getElementsByTagName("span")[1];
 		switch (name){
 			case "divYears":
 				label.innerText = myDate.getFullYear() ;
 				span1.innerText = last.year;
 				span2.innerText = next.year;
 				break;
			case "divMonth":
				label.innerText = padNumber(myDate.getMonth() + 1);  
				span1.innerText = padNumber(last.month); 
				span2.innerText = padNumber(next.month); 
				break;
			case "divDay":
				label.innerText = padNumber(myDate.getDate());  
				span1.innerText = padNumber(last.day); 
				span2.innerText = padNumber(next.day); 
				break;
			case "divHours":
				label.innerText = padNumber(myDate.getHours());  
				span1.innerText = padNumber(last.hours); 
				span2.innerText = padNumber(next.hours); 
				break;
			case "divMinutes":
				label.innerText = padNumber(myDate.getMinutes());  
				span1.innerText = padNumber(last.mi); 
				span2.innerText =  padNumber(next.mi); 
				break;
 		}
 	})
}

function getLastDate (time) {
	var lastDate = new Date();
	 
	var myDate = new Date(time);
 	var last = {};
 		 
 	lastDate.setMinutes(myDate.getMinutes() - 1);  
 	last.mi = lastDate.getMinutes();
 	lastDate = new Date();
 	lastDate.setHours(myDate.getHours() - 1);
 	last.hours = lastDate.getHours();
 	lastDate = new Date();
 	lastDate.setDate(myDate.getDate() - 1);
 	last.day = lastDate.getDate();
 	lastDate = new Date();
 	lastDate.setMonth(myDate.getMonth() - 1);
 	last.month= lastDate.getMonth() + 1;
 	lastDate = new Date();
 	lastDate.setFullYear(myDate.getFullYear() - 1);
 	last.year = lastDate.getFullYear();
 	return last;
}

function getNextDate (myDate) {
	var nextDate = new Date();
 	var next = {};
 	nextDate.setMinutes(myDate.getMinutes() + 1); 
 	next.mi = nextDate.getMinutes(); 
 	lastDate = new Date();
 	nextDate.setHours(myDate.getHours() + 1);
 	next.hours = nextDate.getHours();
 	nextDate = new Date();
 	nextDate.setDate(myDate.getDate() + 1);
 	next.day = nextDate.getDate();
 	nextDate = new Date();
 	nextDate.setMonth(myDate.getMonth() + 1);
 	next.month= nextDate.getMonth() + 1;
 	nextDateate = new Date();
 	nextDate.setFullYear(myDate.getFullYear() + 1);
 	next.year = nextDate.getFullYear();
 	return next;
}