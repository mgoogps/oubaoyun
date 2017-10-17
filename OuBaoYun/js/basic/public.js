 
 function sendCommand ( cmd ,callback) {
 	
 	var a = new ajaxPar("SendCommand");
 	a.ajax({
 		url:"/ajax/DevicesAjax.asmx?op=SendCommand",
 		data:{command : cmd},
 		success:function (res) {
 			mui.toast(res.Message); 
 			if (res.StatusCode == 200) {
 				if (callback) {
 					callback();
 				}
 			}
 		}
 	});
 }
 
function openWindow (url,extras,waitingAutoShow,styles) {
	styles = styles||{};
	styles.bounce || "vertical";
	mui.openWindow({
		url:url,
		id:url,
		styles:{
			bounce:styles.bounce, //none表示没有反弹效果 vertical表示垂直方向有反弹效果；horizontal表示水平方向有反弹效果；all表示垂直和水平方向都有反弹效果。
			bounceBackground:"#303A43" //窗口回弹效果区域的背景
		},
		show:{
		   // autoShow:true,//页面loaded事件发生后自动显示，默认为true
		    aniShow:"zoom-fade-out" ,//页面显示动画，默认为”slide-in-right“；
		    duration:"200"//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	    },
		waiting:{
			autoShow:waitingAutoShow == false ? false : true,//自动显示等待框，默认为true
			title:'正在加载...',//等待对话框上显示的提示内容
		},
		extras:extras||{}
	});
}
//对象ID， 点击后的回调函数 ，  默认值的vals，   点击前的回调函数
function checkbox (idorclass,callback,vals,beforeCallback) {
	var selectsrc = "../images/public/checkbox-true.png"; //选择的图片路径
	var unselected ="../images/public/checkbox-false.png"; //未选中的图片路径
	 
	callback = callback || function () {};
	beforeCallback = beforeCallback || function () {return true;};
	this.id = idorclass;
	var _this = this;

	//if (idorclass.indexOf('.') == 0) {
	//	this.type ="class";
	mui(idorclass).each(function (index,element) { 
		var img;
	 	if (element.getElementsByTagName("img").length <= 0) { 
	 		img = document.createElement("img");
	 		var check = element.getAttribute("checked")
			if (check == "checked") {
				img.src= selectsrc;	
			}else{
				img.src= unselected;
				element.setAttribute("checked","");
			}  
			element.className ="mgoo-message-setting-checkbox";
			if (vals && (vals[index] == 'true' || vals[index])) {
				img.src = selectsrc;
				element.setAttribute("checked","checked"); 
				element.className ="mgoo-message-setting-checkbox mgoo-checkbox-selected";
			} 
			element.appendChild(img);  
	 	}
	 	 
		element.addEventListener("tap",function () {  
			var check = this.getAttribute("checked"); 
			var before = beforeCallback(element,check);
			if(!before){
				return;
			}
 
			element.setAttribute("checked",check == "checked" ? "" : "checked");
			check = element.getAttribute("checked");
			img = element.getElementsByTagName("img")[0];
			if (check == "checked") {
				element.className ="mgoo-message-setting-checkbox mgoo-checkbox-selected"; 
				img.src = selectsrc;
			}else{
				element.className ="mgoo-message-setting-checkbox";
				img.src = unselected;
			}
			callback(element,check); 
		});
	})
}

checkbox.prototype.getValue = function (docid) {
	var vals = [];
	docid = docid || this.id;
	mui(docid).each(function (index,element) {
		var check = element.getAttribute("checked");
		if (check == "checked") {
			var val = element.getAttribute("value");
			vals.push(val);
		}else{
			
		} 
	})
	return vals;
} 


function backMain() {
	var mapPage = plus.webview.getWebviewById("main");
	mui.fire(mapPage,"onShow",{});
}
 
function GetCoureName(course) {
    var name = "";
    course = parseFloat(course);
    if ((course >= 0 && course < 22.5) || (course >= 337.5 && course < 360)) // 0
    {
        name = "正北";
    }
    else if (course >= 22.5 && course < 67.5) // 45
    {
        name = "东北";
    }
    else if (course >= 67.5 && course < 112.5) // 90
    {
        name = "正东";
    }
    else if (course >= 112.5 && course < 157.5) //135
    {
        name = "东南";
    }
    else if (course >= 157.5 && course < 202.5) //180
    {
        name = "正南";
    }
    else if (course >= 202.5 && course < 247.5) //225
    {
        name = "西南";
    }
    else if (course >= 247.5 && course < 292.5) //270
    {
        name = "正西";
    }
    else if (course >= 292.5 && course < 337.5) //315
    {
        name = "西北";
    }
    else {
        name = "未知.";
    }
    return name;
}




Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),   //day
        "h+": this.getHours(),  //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (!format) {
    	format ="yyyy-MM-dd hh:mm:ss";
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function MinuteToHour(mi) { 
	if (mi == 0)
        return "1分";
    if (mi <= 60) {
        return parseInt(mi) + "分";
    }
    var day = parseInt(mi / 60 / 24);
    var h = parseInt(mi / 60 % 24);
    var m = parseInt(mi % 60);
    mi = "";
    if (day > 0) {
        mi = day + "天";
    } if (h > 0) {
        mi += h + "时";
    } if (m > 0) {
        mi += parseFloat(m) + "分";
    }
    return mi;
}