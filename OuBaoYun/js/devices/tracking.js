var mgoo,rmoveMarkList=null;
 
var device = {
	DeviceID:"",
	StatusMinute:"",
	Point:{lat:0,lng:0} ,
	PrevPoint: {lat:0,lng:0} 
}
var common ={
	PhonePoint : {lat:0,lng:0},	
	PersonCarDistance: false,//是否显示人车距离
	Watch : undefined,
	rmovePersonMarkerList:[],
	ShowWindowInfoStatus:true,
	infoBox:null,
}
 
mui.init();
mui.plusReady(function () {
	mgoo = new mgMap("allmap","BAIDU");
	mgoo.showNavigation = false;	 
	mgoo.isTrafficControl=true; 
	mgoo.navigation.enableGeolocation=false; 
 
	// mgoo.isLocateMyCity = true;

	mgoo.loadMap();
	mgoo.setZoom(10);
  	//手动设置交通流量图的图标的位置(图标百度自动生成的)
	mui("#allmap #tcBtn")[0].style.top = "55px";
	plus.nativeUI.showWaiting("加载中...");
	var self = plus.webview.currentWebview();
 	device.DeviceID = self.DeviceID;
	device.StatusMinute = self.StatusMinute;
	
	GetDeviceMonitor();
	setInterval('GetDeviceMonitor()',5000) 
	
	//卫星图和地图切换按钮
	document.getElementById('divMapType').addEventListener('tap',function () { 
	    var bg = this.style.backgroundImage;
	    if (bg.indexOf("type2") > 0) {
	    	this.style.backgroundImage = "url(../images/main/tracking/type1.png)";
	    	mgoo.setMapType(BMAP_HYBRID_MAP);
	    }else{
	    	this.style.backgroundImage = "url(../images/main/tracking/type2.png)";
	    	mgoo.setMapType(BMAP_NORMAL_MAP);
	    } 
	});
	//街景按钮
	document.getElementById('divMapStreet').addEventListener('tap',function () {
	    openWindow("street-scape.html",{OLng:device.Point.lng,OLat:device.Point.lat});
	})
	//人车距离按钮
	document.getElementById("divPersonCar").addEventListener("tap",function(){
		common.PersonCarDistance = !common.PersonCarDistance;
		if (common.PersonCarDistance) {
			this.getElementsByTagName("div")[0].style.backgroundImage = "url(../images/main/tracking/cars.png)";
			ConvertBaidu();
		}else{
			mgoo.setZoom(18);
    		mgoo.panTo(device.Point.lng,device.Point.lat );
			this.getElementsByTagName("div")[0].style.backgroundImage = "url(../images/main/tracking/renche.png)";
		} 
	});
	ListenPoint();
	var _back = mui.back;
	mui.back = function(event) {
		backMain();
		_back();
	};
});
function GetDeviceMonitor() { 
	var a = new ajaxPar("GetMonitorByDeviceID",false); 
	a.ajax({
		url:"/ajax/DevicesAjax.asmx?op=GetMonitorByDeviceID",
		data:{deviceid : device.DeviceID},
		success:function (res) {
			res.Speed =parseFloat(res.Speed); 
			var speedLable = document.getElementById("SpeedCircle");
			if (res.Speed <= 0) {
				speedLable.innerText ="停";
			}else{
		 	    //speedLable.getElementsByTagName("span")[0].innerText= res.Speed;
		 	    speedLable.innerHTML=res.Speed+"<br/><span style='font-size:12px;left: 0;right: 0;position:absolute;'>km/h</span>";
			}
			
			device.Point.lat = res.OLat;
			device.Point.lng = res.OLng; 
			if (JSON.stringify(device.PrevPoint) != JSON.stringify(device.Point) && device.PrevPoint.lat != 0) {
				var prev = mgoo.Point(device.PrevPoint.lng,device.PrevPoint.lat);
				var cur = mgoo.Point(res.OLng,res.OLat)
				mgoo.polyLine([prev,cur],{strokeColor:"#007AFF", strokeWeight:6,strokeOpacity:0.8});//划线
			}
			device.PrevPoint.lat = res.OLat;
			device.PrevPoint.lng = res.OLng;
			
			craeteMarker(res);
		} 
	});
}
function craeteMarker (d) {
	var marker = new Marker({
        map: mgoo.map, mapType: mgoo.mapType, lng: d.OLng, lat: d.OLat,
        course: d.Course
    });
    mgoo.clearOverlays({clearMarker:rmoveMarkList});
    rmoveMarkList = []; 
    var iconsrc = "../images/maps/point@24.png";
    
    marker.show({ showTitle: false, titleText: d.DeviceName,icon: iconsrc});
    rmoveMarkList.push(marker.marker);
    
    marker.addEventListener("click",function(){ 
    	if (common.ShowWindowInfoStatus) {
    		//common.infoBox.remove();
    		mgoo.clearOverlays({clearMarker:[common.infoBox]}); 
    	}else{ 
    		createWindowInfo(d,marker); 
    	}
    	common.ShowWindowInfoStatus = !common.ShowWindowInfoStatus
    });
    
    if (!common.PersonCarDistance) {
    	mgoo.setZoom(18);
    	mgoo.panTo( d.OLng,d.OLat ); 
    }else{ 
    	ConvertBaidu();
    }
    
    if (common.ShowWindowInfoStatus) 
    {
    	createWindowInfo(d,marker);
    }
}
function createWindowInfo (d,marker) {
	var height = "175px";
	var width="230px"; 
	var html = [];
	d.CarStatus
	var cs = CarStatus(d.CarStatus);  
	html.push("<div id='divMapWindowInfo'>");		
	html.push("<div style='height:20px;margin-top:5px;'><font style='font-size:15px; '>"+d.DeviceName+"</font>");
	if (d.CarStatus) {
		html.push("<span class='mui-icon iconfont "+ cs.dianchi.icon +"' style='font-size:20px;float:right;margin-right:5px;'><font style='font-size:10px;margin-top:-10px;'>"+cs.dianchi.dianliang+"</font></span>");
		html.push("<span class='mui-icon iconfont "+ cs.gps.icon +"' style='font-size:20px;float:right;'><font style='font-size:10px;margin-top:-10px;'>"+cs.gps.count+"</font></span>");
		html.push("<span class='mui-icon iconfont "+ cs.gsm.icon +"' style='font-size:20px;float:right;margin-right:10px;'></span>");  
	} 
	html.push("</div><hr>");
	 
	if(d.Model=="MG-X83"||d.Model=="MG-X83BA"||d.Model=="MG-X83B"||d.Model=="MG-X83BF"||d.Model=="MG-X83W"){
		height="140px";
		html.push("<div></div>");
	}else{
		var dc = Context(d.DataContext,d.Model)  
		html.push("<div style='padding-top:-1px' ><span style='font-weight:bold'>设备状态："+dc+"</span></div><hr>")
	}
	html.push("<div style='font-weight:bold'>&nbsp通讯时间:"+d.LastCommunication+"<span style='float:right;margin-right:2px'>方向:"+d.CourseName+"</span></div>")
	html.push("<div style='font-weight:bold'>&nbsp定位时间:"+d.DeviceDate+"<span style='float:right;margin-right:2px'>类型:GPS</span></div>")
	var ClassStatus="";
	if(d.Speed == 0){
		ClassStatus="<span style='padding-left:5px'>停止</span>";
	} 
	html.push("<div style='font-weight:bold'>&nbsp状态:"+DeviceStatus(d.Status)+ClassStatus+"</div>");//使用绝对定位对齐
	if(d.Address.length>=36){
		height="190px";
	}	
	html.push("<div style='font-weight:bold'>&nbsp地址:"+d.Address+"</div>")	
	html.push("</div>") 
		 
	common.infoBox = new InfoWindow({marker: marker});
	common.infoBox.map = mgoo.map; 
	common.infoBox.addInfoWindow({
        style: { //filter:alpha(Opacity=80),color: "red", , overflow: "hidden" map: mgoo.map, 
        	fontSize: "18px",  height: height, width:  width, "-moz-border-radius": "15px", "border-radius": "15px"
    	},
    	html: html.join(''), 
    	point: mgoo.Point(d.OLng,d.OLat)
    }); 
    rmoveMarkList.push(common.infoBox.CompOverlay)
	 
  
    plus.nativeUI.closeWaiting();
	
}

function DeviceStatus(status){
	switch(status){
	    case "1":
             return "<span>在线</span>";
        case "2":
            return  "<span>离线</span>";
        case "3":
            return  "<span>未激活</span>";
        case "4":
            return  "<span>已过期</span>";		
	}		
}
function ElectricSpit(Electric){
	var Spit=Electric.split('-');
	if(typeof(Spit[4])!="undefined"){
		var ElectricIcon="";
		if(Spit[4]==0){
			ElectricIcon="icon-dianchidianliang3";
		}
		else if(Spit[4]>0 && Spit[4]<20){
			ElectricIcon="icon-dianchidianliang4";
		}
		else if(Spit[4]>=20 && Spit[4]<50){
			ElectricIcon="icon-dianchidianliang";
		}
		else if(Spit[4]>=50 && Spit[4]<85){
			ElectricIcon="icon-dianchidianliang1";
		}
		else if(Spit[4]>=85 && Spit[4]<=100){
			ElectricIcon="icon-dianchidianliang2";
		}			
	}
	return 	ElectricIcon || "";	
}
function Context(str){
	if(typeof(str)!='undefined'){
		if(str==""||str=="----"){
			return "";
		} 
		var status="";		
		var Contextstr= str.split('-');
		if (Contextstr[1]==0){
		 	status+="撤防, ";
		}
		else if(Contextstr[1]==1){
			status+="设防, ";
		}
		if(Contextstr[0]==0){
			status+="ACC关, "
		}else if(Contextstr[0]==1){
			status+="ACC开, "
		}		
		if(Contextstr[3]==0){
			status+= "主电断开";
		}
		else if(Contextstr[3]==1){
		 	status+= "主电连接";	
		}
	}
	return status || "";
}
//取得电量数值，根据数值使用不同的电量图标
/*function ElectricSpit(Electric){
	var Spit=Electric.split('-');
	if(typeof(Spit[4])!="undefined"){
		var ElectricIcon="";
		if(Spit[4]==0){
			ElectricIcon="icon-dianchidianliang3";
		}
		else if(Spit[4]>0 && Spit[4]<20){
			ElectricIcon="icon-dianchidianliang4";
		}
		else if(Spit[4]>=20 && Spit[4]<50){
			ElectricIcon="icon-dianchidianliang";
		}
		else if(Spit[4]>=50 && Spit[4]<85){
			ElectricIcon="icon-dianchidianliang1";
		}
		else if(Spit[4]>=85 && Spit[4]<=100){
			ElectricIcon="icon-dianchidianliang2";
		}			
	}
	return 	ElectricIcon || "";	
}*/

function ListenPoint () {
	 
	common.Watch=plus.geolocation.watchPosition(
		function (p) {		
			common.PhonePoint.lng = p.coords.longitude;
			common.PhonePoint.lat = p.coords.latitude;
			if (common.PersonCarDistance) {
				ConvertBaidu();								
			}					
		},
		function (e) {
			mui.toast("定位失败.");
		},
		{provider:'system'}
	);
}

function CarStatus(cs1)
{
	cs1 = cs1||'';
	var str = {};
	var cst = cs1.split(",");
	if(cst[0]) { 
		var gps = cst[0]
		str.gps = {count:gps };
		if (gps >= 0 && gps <= 4) {
			str.gps.icon = "icon-gps0";
		}else if(gps>4 && gps <= 8){
			str.gps.icon = "icon-gps1";
		}else {
			str.gps.icon = "icon-gps2";
		}
	}
	if (cst[1]) { 
		var gsm = cst[1];
		str.gsm = {};
		if (gsm >= 0 && gsm <= 8) { 
			str.gsm.xinhao = 1;
			str.gsm.icon = "icon-xinhao01";
		}else if(gsm >= 9 && gsm <= 16){
			str.gsm.xinhao = 2;
			str.gsm.icon = "icon-xinhao02";
		}else if(gsm >= 17 && gsm <= 24){
			str.gsm.xinhao = 3;
			str.gsm.icon = "icon-xinhao03";
		}else {//if(gsm >= 31 && gsm <= 41)
			str.gsm.xinhao = 4;
			str.gsm.icon = "icon-xinhao04";
		}
	}
	if (cst[2]) {
		var dianchi = cst[2];
		str.dianchi = {};
		switch (dianchi){
			case '6': 
				str.dianchi.dianliang = "100%";
				str.dianchi.icon = "icon-dianliang3";
				break;
			case '5':
				str.dianchi.icon = "icon-dianliang2";
				str.dianchi.dianliang = "80%" 
				break;
			case '4':
				str.dianchi.icon = "icon-dianliang2";
				str.dianchi.dianliang = "60%"  
				break;
			case '3':
				str.dianchi.icon = "icon-dianliang1";
				str.dianchi.dianliang = "20%" 
				break;
			case '2':
				str.dianchi.icon = "icon-dianliang1";
				str.dianchi.dianliang = "10%"  
				break;
			default:
				str.dianchi.icon = "icon-dianliang1";
				str.dianchi.dianliang = "0%"   
				break;
		}
	}
	return str;
}

function ConvertBaidu(lng,lat){ 	
	var lng = common.PhonePoint.lng;
	var lat = common.PhonePoint.lat;
	var BaiduURL="http://api.map.baidu.com/geoconv/v1/?coords="+lng+","+lat+"&from=1&to=5&ak=SAbCayX7PG5UMsqW6d1DZ9K0";
	mui.ajax(BaiduURL,{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		async:false,
		headers:{'Content-Type':'application/json'},
		success:function(data){
			mgoo.clearOverlays({clearMarker:common. rmovePersonMarkerList});
			common. rmovePersonMarkerList=[];
			var curLng = data.result[0].x;
			var curLat = data.result[0].y;
			var marker=	new Marker({
				map: mgoo.map, mapType: mgoo.mapType, lng:curLng, lat:curLat,
			}); 
			var fitView = [];
			
			//三、标注点				
			marker.show({ showTitle: true,titleText: "当前位置",icon: "../images/main/tracking/NowLocation.png"});		
			common.rmovePersonMarkerList.push(marker.marker); 
			var Txtdistance=document.getElementById("DistanceWire"); 
			var CarLocation=mgoo.Point(device.Point.lng,device.Point.lat);//当前设备位置				
			var PerLocation=mgoo.Point(curLng,curLat);//获取当前手机位置
			fitView.push(CarLocation);
			fitView.push(PerLocation); 
			var distance=mgoo.getDistance(PerLocation,CarLocation);
 
			mgoo.setFitView(fitView);	
			Txtdistance.classList.remove("mui-hidden");		
			Txtdistance.innerText="人车相距约"+(distance/1000).toFixed(2)+"km";	
		}
	})	
}