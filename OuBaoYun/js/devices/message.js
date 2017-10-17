var lastPage=false;
function MessageList(index) {
	if (lastPage) {
		document.getElementById("divPullUp").innerText="没有更多数据了...";
		mui.toast("没有更多数据了."); 
		return; 
	}
	var DeviceID = app.getCurrentDeviceInfo().deviceid;
	var a = new  ajaxPar("GetMessageByDeviceID");
	var pagecount = 20;
 
	a.ajax({
		url:"/ajax/MessageAjax.asmx?op=GetMessageByDeviceID",
		data:{currentindex: index ,pagecount: pagecount,deviceid:DeviceID,type : 0},
		async:false,
		success:function(res){
			if (res.length < pagecount) {
				document.getElementById("divPullUp").innerText="没有更多了";
				lastPage = true; 
			}
			for (var i = 0; i < res.length; i++) {
				var div = document.createElement("div");
				div.className="mgoo-message-item";
			 	var html = []; 
				html.push('<div class="mgoo-message-item-msgimg"> <img src="../images/message/msg.png"/>  </div> ');
				html.push('<div class="mgoo-message-item-content">');
				html.push('<div>  <p>设备名称：'+res[i].DeviceName +'</p> ');
				html.push('<p>报警类型：'+res[i].Message+'</p> ');
				html.push('<p>报警时间：'+res[i].Created+'</p>  </div>'); 
				html.push('<div class="mgoo-message-item-viewmap"><img style="height: 21px;" src="../images/message/viewmap.png"/></div>');
				html.push('<div class="mgoo-message-setting-checkbox" style="margin-top: -40px;margin-left: 30px;" value="'+res[i].ExceptionID+'">    </div>'); 
				html.push('</div>')
				div.innerHTML = html.join('');
				document.getElementById("divMessageList").appendChild(div);
				document.getElementById("divPullUp").innerText="上拉加载更多...";
			}
		    var check = new checkbox(".mgoo-message-setting-checkbox",function(e,c){
					 
			}); 
			mui('.mgoo-message-item-viewmap').each(function (index,element) {
				element.addEventListener("tap",function(){ 
					var ExceptionID = this.nextSibling.getAttribute("value");
					openWindow("message-view.html",{ExceptionID:ExceptionID});
				});
			})
		}
	}); 
}

function DeleteMessage () {
	var vals = [];
	mui(".mgoo-checkbox-selected").each(function (index,element) { 
		var val = element.getAttribute("value");
		vals.push(val);  
	})
	if (vals.length <= 0) {
		mui.toast("请至少选择一条报警消息");
		return;
	}
	mui.confirm('确认删除选中的 '+vals.length+' 条报警信息？','提示',['取消','确认'],function (e) {
		if(e.index==1)
		{ 
			var state = app.getState();
			var a = new ajaxPar("DeleteMessage");
			a.ajax({
				url:"/ajax/MessageAjax.asmx?op=DeleteMessage",
				data:{userid:state.userid ,exceptionid:vals.join(',')},
				success:function (res) {
					mui.toast(res.Message); 
					if (res.StatusCode == 200) { 
						mui(".mgoo-checkbox-selected").each(function (index,element) { 
							element.parentNode.parentNode.remove();
						})
					}
				}
			});
		}
	},'div');
}

function GetMessageTypeList () {
	var a  = new ajaxPar("GetMessageTypeList");
	a.ajax({
		data:{},
		async:false,
		url:"/ajax/MessageAjax.asmx?op=GetMessageTypeList",
		success:function (res) {
		 	var html = [];
		 	for (var i=0;i < res.length;i ++) {
		 		var check ="";
		 		if (res[i].IsPush == "0") {
		 			check='checked="checked"';
		 		}   
		 		html.push('<div class="mui-col-xs-6"> ');
		 		html.push('<div class="mgoo-message-setting-checkbox" name="message" '+check+' value="'+res[i].ID+'"> ');
		 		html.push('<label>'+res[i].Message+'</label> ');
		 		html.push('</div> </div>');
		 	}
		 	document.getElementById("divMessage").innerHTML=html.join('');
		}
	});
}
function setCheckBoxSelected (element,check) {
	element.setAttribute("checked",check);
	if(check == "check")
	{
		element.className ="mgoo-message-setting-checkbox mgoo-checkbox-selected";
	}
	else{
		element.className ="mgoo-message-setting-checkbox";
	}
	element.getElementsByTagName("img")[0].src="../images/public/checkbox-false.png";
}
function SetPushMsg (ids) { 
 
	var a  = new ajaxPar("SetPushMsg");
	a.ajax({
		data:{msgtype:ids.join(',')},
		async:false,
		url:"/ajax/MessageAjax.asmx?op=SetPushMsg",
		success:function (res) {
			mui.toast(res.Message);
		}
	});
}

function GetUsersConfig()
{
	var a  = new ajaxPar("GetUsersConfig");
	a.ajax({
		data:{}, 
		url:"/ajax/MessageAjax.asmx?op=GetUsersConfig",
		success:function (res) {
			setSwitch(document.getElementById("divAudio"),res.Audio);
			setSwitch(document.getElementById("divShock"),res.Shock);
			//ShockSens
			setSelect("#divMessagePeriod .mgoo-message-setting-checkbox","period",res.Period);
			//setSelect("#divMessageKeen .mgoo-message-setting-checkbox","keen",res.ShockSens);
			
		}
	});
}
function setSwitch(doc,state)
{
	var imgs = doc.getElementsByTagName("img")
	 
	if (state) {
		if (state == 0) {
			imgs[0].style.visibility = "hidden";
			imgs[1].style.visibility= "visible";
		}
		else{
			imgs[1].style.visibility = "hidden";
			imgs[0].style.visibility= "visible";
		}
	}
	
	if (imgs[0].style.visibility == "hidden") {
		imgs[1].style.visibility = "hidden";
		imgs[0].style.visibility= "visible";
	}else	{
		imgs[0].style.visibility = "hidden";
		imgs[1].style.visibility= "visible";
	}
}

function setSelect(_id,_name,_val) {
	mui(_id).each(function (index,element) {
		var name = element.getAttribute("name");
		var val = element.getAttribute("value");
		if (name == _name && val == _val) {
			element.setAttribute("checked","checked");
			element.className ="mgoo-message-setting-checkbox mgoo-checkbox-selected";
			element.getElementsByTagName("img")[0].src="../images/public/checkbox-true.png";
		}
	});
}

