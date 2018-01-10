import config, { headers } from '../config/'
import cookie from 'react-cookies'

const Tool = {
  // appid:'wx26573b433595af31'
  appid:'wx1892e1df716e3bc6'
};
//   const appid = 'gh_bd3392a391f1'
// const appid = 'wx1892e1df716e3bc6'
//const appid = 'wxa416cd4a7d80f03b' //
const ua = window.navigator.userAgent.toLowerCase();
Tool.getWxCode = ()=>{
  if(Tool.firstLogin() && ua.match(/MicroMessenger/i) == 'micromessenger'){
    cookie.save('firstLogin',false)
    // let url = window.location.href.replace('#', 'QWERTYUIOP').split('?')[0]
    let url = window.location.href
    url ="https://m.jyall.com/user-api/v1/wxSnsapiLogin/explicit/"+Tool.appid+"/52?redirctUrl="+encodeURI(url)
    location.href= url
  }
}

//判断用户首次访问
Tool.firstLogin = ()=>{
  if(Tool.getUrlParam('firstLogin')=='false' || cookie.load('firstLogin')=='false'){
    return false
  }else{
    return true
  }
}

//获取url参数值
Tool.getUrlParam = function(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.href.split("?")[1] ? window.location.href.split("?")[1].match(reg) : null;
  if (r != null) return r[2];
  return "";
}

Tool.fetch = function(obj,data){
  try {
      var xmlhttp,status = 0;
      if (window.XMLHttpRequest){
          xmlhttp=new XMLHttpRequest();
      }
      else {
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function()
      {
          if (xmlhttp.readyState==4)
          {
              obj.setState&&obj.setState({ajaxDisplay: "none",maskDisplay: "none"});
              let json=xmlhttp.responseText?eval("("+ xmlhttp.responseText +")"):xmlhttp.responseText;
              if(xmlhttp.status != 200){
                  obj.setState({ tipContent: '网络繁忙，请稍后再试',display: 'toasts' });
              }
              status = xmlhttp.status;

              if(!xmlhttp.responseText){
                  data.successMethod(xmlhttp.responseText,status,obj);
              }else{
                  data.successMethod(json,status,obj);
              }
              if(data.complete){
                data.complete(obj);
              }
          }
      }
      xmlhttp.open(data.type,data.url,data.sync?false:true);
      xmlhttp.setRequestHeader("content-type","application/json");
      xmlhttp.setRequestHeader("sign", "50970DC4C28118A4F76411505B277B7D");
      xmlhttp.setRequestHeader("deviceid", "M");
      xmlhttp.setRequestHeader("tokenid", cookie.load('tokenid'));
      xmlhttp.setRequestHeader("APPkey", "b40538ab5bef1ffd18605efda7f820d9");
      xmlhttp.setRequestHeader("version", "2.0.0");

      if(data.type == "post" || data.type == "put"){
          xmlhttp.send(data.body?data.body:"");
      }else{
          xmlhttp.send();
      }
  } catch(e) {
      //console.log(e.name +" "+ e.message);
  } finally {

  }
}
Tool.wxShare = async function(obj, fn){
  try{
    const response = await fetch(config.apiPath.WXSHARE, {
      method: 'POST',
      headers: headers(),
      body:JSON.stringify({
        "appid": Tool.appid,
        "shareUrl": encodeURIComponent(window.location.href)
      })
    })
    const json = await response.json()
    if(json){
      await wx.config({
          debug: false,
          appId: json.appid,
          timestamp: json.timestamp,
          nonceStr: json.nonceStr,
          signature: json.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
          ]
      })
      Tool.wxReady(obj)
    }
  }catch(e){
    console.log(e.message)
  }
}

Tool.wxReady= function(obj){

  wx.ready(function () {
    // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
    wx.checkJsApi({
      jsApiList: [
        'getNetworkType',
        'previewImage'
      ],
      success: function (res) {
        console.log(JSON.stringify(res));
      }
    });

    // 2. 分享接口
    // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareAppMessage({
      title: obj.shareInfo.title,
      desc: obj.shareInfo.desc,
      link: obj.shareInfo.link,
      imgUrl: obj.shareInfo.imgUrl,
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        console.log('用户点击发送给朋友');
      },
      success: function (res) {
        console.log('已分享');
      },
      cancel: function (res) {
        console.log('已取消');
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      }
    });

    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareTimeline({
      title: obj.shareInfo.title,
      link: obj.shareInfo.link,
      imgUrl: obj.shareInfo.imgUrl,
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        console.log('用户点击分享到朋友圈');
      },
      success: function (res) {
        console.log('已分享');
      },
      cancel: function (res) {
        console.log('已取消');
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      }
    });

    // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareQQ({
      title: obj.shareInfo.title,
      desc: obj.shareInfo.desc,
      link: obj.shareInfo.link,
      imgUrl: obj.shareInfo.imgUrl,
      trigger: function (res) {
        console.log('用户点击分享到QQ');
      },
      complete: function (res) {
        console.log(JSON.stringify(res));
      },
      success: function (res) {
        console.log('已分享');
      },
      cancel: function (res) {
        console.log('已取消');
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      }
    });

    // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareWeibo({
      title: obj.shareInfo.title,
      desc: obj.shareInfo.desc,
      link: obj.shareInfo.link,
      imgUrl: obj.shareInfo.imgUrl,
      trigger: function (res) {
        console.log('用户点击分享到微博');
      },
      complete: function (res) {
        console.log(JSON.stringify(res));
      },
      success: function (res) {
        console.log('已分享');
      },
      cancel: function (res) {
        console.log('已取消');
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      }
    });

    // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
    wx.onMenuShareQZone({
      title: obj.shareInfo.title,
      desc: obj.shareInfo.desc,
      link: obj.shareInfo.link,
      imgUrl: obj.shareInfo.imgUrl,
      trigger: function (res) {
        console.log('用户点击分享到QZone');
      },
      complete: function (res) {
        console.log(JSON.stringify(res));
      },
      success: function (res) {
        console.log('已分享');
      },
      cancel: function (res) {
        console.log('已取消');
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      }
    });
  });
}

export {Tool}
