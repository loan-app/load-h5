function GetQueryString(name) { // 截取url的字段
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1)
    .match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}

/**
 * 获取cookie
 * @param c_name key
 * @returns
 */
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}

/**
 * 获取用户token
 * @returns
 */
function getToken() {
  var token = '';
  try {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      window.webkit.messageHandlers.getToken.postMessage(null);
      token = getCookie('token');
    } else if (/android/.test(ua)) {
      token = window.tool.getToken();
    }
  } catch (e) {

  }
  if (!token) {
    token = GetQueryString('token');
  }
  return token;
}

/**
 * 打开网页
 * @param isclose 是否关闭当前webview，0-否，1-是
 * @param url
 * @returns
 */
function skipPage(isclose, url) {
  // 处理url
  if(url.startsWith('http') === -1) {

  }
  try {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      window.webkit.messageHandlers.skipPage.postMessage({
        isclose: isclose,
        url: url
      });
    }
    if (/android/.test(ua)) {
      window.tool.skipPage(isclose, url);
    }
  } catch (e) {
    //TODO handle the exception
    window.location.href = url;
  }

}

/**
 *0-直接关闭 1-登录 2-首页（关闭）3-我的（关闭）4-意见反馈 5-实名认证6-活体检测 7-个人信息 8-手机认证9-支付宝 10-惠金商场收货地址页
 */
function closeAndOpen(type) {
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    window.webkit.messageHandlers.closeAndOpen.postMessage({
      type: type
    });
  } else {
    window.tool.closeAndOpen(type);
  }
}

/**
 *不使用该方法，默认显示返回按钮，隐藏关闭按钮，webview标题从页面中自动解析
 *backButton---返回按钮，0-隐藏，1-显示
 *closeButton---关闭按钮，0-隐藏，1-显示
 *title---webview标题，空或者不穿不改变
 *browser 0-不允许 1-点击右上角可在浏览器中打开该链接
 */
function viewSetup(backButton, closeButton, title, browser) {
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    window.webkit.messageHandlers.viewSetup.postMessage({
      backButton: backButton,
      closeButton: closeButton,
      title: title,
      browser: browser
    });
  } else if (/android/.test(ua)) {
    window.tool.viewSetup(backButton, closeButton, title, browser);
  }
}

/**
 * 获取手机信息 无参数
 * 返回参数
 * 别名|型号|内存|版本编号|deviceid|渠道号   如  malidai|iPhone9,1|32|1|asaaaa|tencent
 */
function getDevice() {
  let device = '|||||';
  try {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      window.webkit.messageHandlers.getDevice.postMessage({});
      device = getCookie('device');
    } else if (/android/.test(ua)) {
      device = window.tool.getDevice();
    }
  } catch (e) {
    //TODO handle the exception
    device = '|||||';
  }
  return device;
}

/**
 * 跳转手机本地应用商店
 */
function goAppStore() {
  try {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      window.webkit.messageHandlers.goAppStore.postMessage({});
    } else if (/android/.test(ua)) {
      device = window.tool.goAppStore();
    }
  } catch (e) {
    console.log(e);
  }
}

export default {
  goAppStore,
  getDevice,
  viewSetup,
  closeAndOpen,
  skipPage,
  getToken,
  getCookie,
  GetQueryString
}
