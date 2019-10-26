//设置根元素的fontSize值
function add() {
  var html = document.documentElement;
  var hei = html.clientWidth;
  var fz = hei / 375 * 100 + 'px';
  html.style.fontSize = fz;
};
add();
window.addEventListener('resize', add, false); //屏幕改变事件

//获取接口域名信息
function apiDomain() {
  var hostname = window.location.hostname;
  var port = window.location.port;
  if (hostname === '') {  // 正式的
    return '';  // 测试的
  } else {
    return ''; // 测试的
  }
}

//页面域名
function webDomain() {
  var hostname = window.location.hostname;
  var port = window.location.port;
  if (hostname === '') {// 正式的
    return ''; // 测试的
  } else {
    return ''; // 测试的
  }
}

function changeTwoDecimal(x) { //保留2位小数
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  var f_x1 = Math.round(x * 100) / 100;
  var s_x = f_x1.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

function GetQueryString(name) { // 截取url的字段
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1)
    .match(reg);
  if (r) return unescape(r[2]);
  return '';
}

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1);
    strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

var request = GetRequest();

function getClientType() {
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  return 'android';
}

function queryUrlParam(name) { // 截取url的字段
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1)
    .match(reg);
  if (r) return decodeURI(r[2]);
  return '';
}

//判断是否为微信打开    0否  : 1是
function isWeiXin() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) === 'micromessenger' ? !0 : !1;
};
