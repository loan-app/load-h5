/**
 * native桥接调用
 */

import GConfig from '@/config';
import Say from '@/lib/overlay/say.min';

function fnWebViewBridge() {
  // 默认是安卓手机
  const isAndroid = new RegExp(/Android/ig).test(navigator.userAgent);
  const isIOS = new RegExp(/iPhone/ig).test(navigator.userAgent);
  const isWeChat = navigator.userAgent.toLowerCase()
    .indexOf('micromessenger') > -1;
  let bridgeListenState = 0; // bridge注册状态（0未监听，1已注册，2注册失败）
  const HANDLER_UNDEFINE = 'undefinedHandler'; // 接口不支持的时候返回的关键词

  // IOSbridge注册
  // eslint-disable-next-line func-names
  (function () {
    /**
     * [connectWebViewJavascriptBridge description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    // eslint-disable-next-line consistent-return
    function connectWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      // 新的延迟注入的处理
      window.WVJBCallbacks = [callback];
      const WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(() => {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);

      // 老的，延迟注入桥的处理
      document.addEventListener('WebViewJavascriptBridgeReady', () => {
        callback(window.WebViewJavascriptBridge);
      }, false);
    }

    connectWebViewJavascriptBridge((bridge) => {
      // alert("成功注册bridge");
      bridgeListenState = 1;
      window.bridge = bridge;
      // alert(window.bridge);
      if (!isAndroid) {
        try {
          // eslint-disable-next-line no-unused-expressions
          bridge.init && bridge.init((message, responseCallback) => { // 老的写法，新的不确定兼容不，处理一下
            if (responseCallback) {
              responseCallback('this is msg from html');
            }
          });
        } catch (ex) {
          console.log(ex);
        }
      }
    });
  }());

  /**
   * 显示错误信息
   * @param  {String} errMsg 错误消息
   * @return {void}
   */
  function sayError(errMsg) {
    if (window.Say !== undefined) {
      // eslint-disable-next-line no-undef
      new Say(errMsg);
    } else {
      alert(errMsg);
    }
  }

  /**
   * 生成唯一识别码
   * @return {String} 识别码
   */
  function getGuid() {
    let guid = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 32; i++) {
      const n = Math.floor(Math.random() * 16.0)
        .toString(16);

      guid += n;

      if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
        guid += '';
      }
    }

    return guid;
  }

  /**
   * 随机生成一个函数名并注册到window下
   * @param  {Function} callback 函数体
   * @return {String}            函数名称
   */
  function regRandomFn(callback) {
    if (callback === undefined || callback === '') {
      return '';
    }
    const sFnName = `appBackFn${getGuid()}`;// (+new Date() + Math.floor(Math.random() * 1000));//用唯一识别码替代原先的计算方式，原先的并发大的时候有一定的几率会生成一样的字符串

    _regJsHandle(sFnName, callback);

    return sFnName;
  }

  /**
   * 注册webview方法
   * @param  {String}   fnName   方法名称
   * @param  {Function} callback 回调函数
   * @return {void}
   */
  function _regJsHandle(fnName, callback) {
    window[fnName] = callback;
    if (isAndroid) {
      window[fnName] = callback;
    } else {
      try {
        bridge.registerHandler(fnName, callback);
      } catch (ex) {
      }
    }
  }

  let waitInterval = null;
  const aOWaiting = []; // 用来存放defer的队列数组

  /**
   * 循环等待bridge注册加载完毕
   * @return {void}
   */
  function _listenBridge() {
    const defer = $.Deferred();
    aOWaiting.push(defer);
    if (isWeChat || sessionStorage.isTest == 1) { // 测试
      listenEnd(false);
      return defer.promise();
    }

    if (window.bridge) { // 已加载就绪
      listenEnd(true);
    } else if (bridgeListenState === 2) {
      // console.trace(324);
      // clearInterval(waitInterval);
      listenEnd(false);
    } else if (waitInterval == null) {
      let nTime = 0;
      const timer1 = +new Date();
      waitInterval = setInterval(() => {
        nTime++;
        // console.log("listenBridgeTime:"+ nTime);

        if (window.bridge) { // 已加载就绪
          listenEnd(true);
          // sayError("bridge监听了：" + (nTime) + "次");
          // sayError("bridge监听用时："+ (timer2 - timer1) +"ms");
        } else if (nTime >= 50) {
          listenEnd(false);
          // sayError("bridge监听超时");
        }
      }, 10);
    }

    return defer.promise();
  }

  /**
   * 监听结束
   * @param  {Boolean} isSuccess 是否监听成功
   * @return {void}
   */
  function listenEnd(isSuccess) {
    if (!isSuccess) { // 失败的话一定不在我们的app内，但是成功的话不能保证是在app内，因为像UC浏览器也是用了跟ios一样的wv框架
      _wv.setIsInApp(false);
    }
    waitInterval && clearInterval(waitInterval);
    if (bridgeListenState === 0) {
      bridgeListenState = isSuccess ? 1 : 2;
    }
    for (let i = aOWaiting.length - 1; i >= 0; i--) {
      if (isSuccess) {
        aOWaiting[i].resolve();
      } else {
        aOWaiting[i].reject();
      }
      aOWaiting.splice(aOWaiting.length - 1, 1);
    }
  }

  /**
   * 统一app处理程序调用
   *
   * @param  {string}   handlerName 处理程序名称
   * @param  {String|Object}   params       向服务端传的参数
   * @param  {Function} onFailed   失败回调函数
   * @return {Boolean}    该接口是否支持
   */
  function _callHandler(handlerName, params, onFailed = '') {
    let newCallback;
    if (params.callback) {
      newCallback = params.callback;
    } else if (onFailed) {
      newCallback = onFailed;
    }

    if (newCallback && typeof (newCallback) === 'function') {
      // eslint-disable-next-line no-inner-declarations
      function newCallback111(data) {
        console.warn(`callbackData of handler(${handlerName}):`, data);
        newCallback(data);
      }

      // eslint-disable-next-line no-param-reassign
      params.callback = regRandomFn(newCallback111);
    }
    // eslint-disable-next-line no-param-reassign
    params = JSON.stringify(params);

    try {
      if (isAndroid) {
        if (window.bridge[handlerName]) {
          window.bridge[handlerName](params);
        }
      } else {
        window.bridge.callHandler(handlerName, params, onFailed);
      }
      return true;
    } catch (ex) {
      onFailed && onFailed();
      return false;
    }
  }

  /**
   * 服务端传送数据的标准格式
   */
  function ParamsModel(obj) {
    this.callback = ''; // 延后执行的回调函数
    this.object = obj || ''; // 参数对象
    this.code = 1; // 状态（1成功，2失败）
    this.map = {}; // 其它可配参数
  }

  // 把服务器回传的字符串转化为对象
  function _parseData(data) {
    if (typeof (data) === 'string') {
      try {
        data = JSON.parse(data);
      } catch (ex) {
      }
    }
    return data;
  }

  // 最终要向外暴露的对象
  var _wv = {
    _listenBridge,
    _callHandler,
    _parseData,
    regRandomFn,
    isInApp: null, // 是否在app内，null未知，true是，false否
    /**
     * 设置当前是否在app内运行
     */
    setIsInApp(result) {
      GConfig.isInApp = this.isInApp = result;
    },
    appVersion: '', // app版本号，取前三个版本号,比如：2.5.0
    appInfo: {
      appVersion: '',
      isDebugMode: 0, // 是否暗门模式
      scheme: '',	// 表明APP所对应的协议头
      appPrefix: GConfig.APP_PAGE_PREFIX // url scheme前缀
    }, // app环境信息
    ParamsModel,

    /**
     * 获取APP信息（版本号和app环境）
     * @param  {Function} callback 请求成功回调函数体
     * @param  {Function} onFaild 请求失败回调函数体（针对getIsInApp方法扩展的）
     * @return {void}
     */
    getAppInfo(callback, onFaild) {
      const dDate = +new Date();
      const _this = this;
      const timer = null;
      const nTime = 0;
      let bIsEnd = false // 临时处理ios老版本注册handler失败不抛异常的情况，等2.4.0升级以后这里改掉，牺牲掉老版本的ng执行时间了就会
      ;

      const newCallback = function (data) {
        if (_this.isInApp == null) {
          _this.setIsInApp(true);
        }
        let sAppVersion = '';
        if (data === HANDLER_UNDEFINE) { // 不支持该接口
          // alert("不支持该接口");
        } else {
          // if(window.nTimePick && !window.isInit11){
          //     alert("wv初始化:" + (+new Date() - nTimePick));
          //     window.isInit11 = 1;
          // }
          // var newDate = + new Date();
          bIsEnd = true;
          data = _parseData(data);
          // alert("data:" + JSON.stringify(data));

          if (data && data.object) {
            let sVal = '';
            if (data.object.appVersion) { //
              const asVersion = data.object.appVersion.split('.');
              for (let i = 0; i < asVersion.length; i++) {
                if (i > 2) {
                  break;
                }
                if (i > 0) {
                  sVal += '.';
                }
                sVal += asVersion[i];
              }
            }
            sAppVersion = sVal;

            // alert("abc" + JSON.stringify(data.object) + "|" + data.object.priFileUrl);
            _this.appVersion = sAppVersion;
            _this.appInfo = $.extend({}, _this.appInfo, data.object, {
              appVersion: sAppVersion
            });

            if (_this.appInfo.scheme) {
              _this.appInfo.appPrefix = `${_this.appInfo.scheme}:${
                _this.appInfo.appPrefix.split(':')[1]}`;
              GConfig.APP_PAGE_PREFIX = _this.appInfo.appPrefix;
            }
            // alert("ssss" + JSON.stringify(_this.appInfo));
          }
        }
        // alert("getAppInfo:"+((newDate - dDate) / 1000) + "秒" + "," + _this.appVersion);

        callback && callback(data);
      };

      if (!_this.appVersion) {
        _listenBridge()
          .then(
            () => { // 成功
              // dDate = +new Date();
              const model = new ParamsModel();
              model.callback = newCallback;
              if (onFaild === undefined) {
                onFaild = function () {
                  _this.setIsInApp(false);
                  bridgeListenState = 2;
                  newCallback({
                    object: {
                      appVersion: GConfig.testAppversion || '1.0.0'
                    }
                  }); // 桥失败的情况
                };
              }
              const bResult = _callHandler('getAppInfo', model, onFaild);
              // if(!bResult){//目前来说只有安卓会返回false的情况，ios要回调去处理
              //     newCallback();
              // } else if(!bIsEnd && isIOS) {
              //     timer = setInterval(function(){
              //         nTime++;
              //         if(bIsEnd){
              //             clearInterval(timer);
              //         } else if(nTime >= 30){
              //             newCallback();
              //             clearInterval(timer);
              //         }
              //     }, 10);
              // }
            },
            () => { // 失败
              _this.setIsInApp(false);
              newCallback({
                object: {
                  appVersion: GConfig.testAppversion || '1.0.0'
                }
              }); // 桥失败的情况
            }
          );
      } else {
        newCallback({
          object: _this.appInfo
        });
      }
      return _this;
    },


    /**
     * 获取当前用户登录信息
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    getUserInfo(callback) {
      const newCallback = function (data) {
        data = _parseData(data);
        callback && callback(data);
      };
      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel();
            _callHandler('getUserInfo', model, newCallback);
          },
          () => { // 失败，走测试调试流程
            // console.log("enter test userInfo");
            $.ajax({
              url: 'json/userInfo.txt',
              type: 'get',
              data: {},
              dataType: 'json',
              contentType: 'application/json; charset=UTF-8'
            })
              .done(newCallback)
              .fail((error) => {
                sayError('异常错误');
              });
          }
        );
    },

    /**
     * 设置用户登录信息
     * @param  {Object} params 具体参数对象
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    setUserInfo(params, callback) {
      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(params);
          model.callback = callback;
          _callHandler('setUserInfo', model, model.callback);
        }, () => {
          callback && callback();
        });
    },

    /**
     * 获取bridge注册状态
     * @return {Integer} bridge注册状态（0未监听，1已注册，2注册失败）
     */
    getBridgeListenState() {
      return bridgeListenState;
    },

    /**
     * 监听bridge注册
     * @return {void}
     */
    getIsInApp() {
      const defer = $.Deferred();
      const _this = this;

      if (_this.isInApp === true) {
        defer.resolve();
      } else if (bridgeListenState === 2) {
        _this.setIsInApp(false);
        defer.reject();
      } else {
        this.getAppInfo((data) => { // 尝试调用获取app信息的方法
          if (_this.isInApp === true) {
            defer.resolve();
          } else {
            defer.reject();
          }
        }, () => {
          bridgeListenState = 2; // 目前通过尝试调用这个方法来验证是否
          _this.setIsInApp(false);
          defer.reject();
        });
      }

      return defer.promise();
    },

    /**
     * 打开页面，可能是原生的或者webview
     * @param  {String|Object} url  跳转的url地址
     *    当为Object时候各个传参说明如下：
     *    {
     *    		url: "/index",   //必传, 跳转的地址
     *    	 	type: 1,         //跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开  2回退到栈的某个存在的页面(不刷新) 3回退到栈的某个存在的页面(刷新)
     *                      0, //  a-b-c-a   入栈b     ==> a-b-c-a-b
     *                      1, // a-b-c 入栈x ==> a-b-x
     *                      2, // a-b-c-a  入栈b  ==> 先清掉到靠近栈顶b之间的所有元素 （不包括b）, a-b
     *                      3, //  a-b-c-a  入栈b  ==>  先清掉到靠近栈顶b之间的所有元素（包括b）, 得a ,再入栈b, a-b
     *        container_style: 0, //0是正常的通用壳  1是没有顶部栏的不是透明的全屏入栈页面
     *          title: "标题",    //要打开的页面的标题
     *          jsOnResume: function(){  //页面返回时候执行的回掉
     *              alert('这是页面返回时候调用的');
     *          },
     *          params: {        //参数，注意如果打开的是native的页面，这个会拼凑在native路径地址上，如果是个web页面，会拼凑在web的path部分
     *              aa: 1,
     *              id: 2332
     *          },
     * 			  enter_animate: 0,	//0从右边推入（不传时默认），1不要动画，2从下面升上来
     * 			  leave_animate: 0,	//0往右边推出（不传时默认），1不要动画，2往下面掉下去
     *        closePageCount: 1   //关闭的页面数量
     *    }
     * @return {void}
     */
    openPage(url, type, title, jsOnResume) {
      const _this = this;
      let obj = {};

      if (typeof (url) === 'object') {
        obj = url;
        if (obj.type === undefined) {
          obj.type = 0;
        }
      } else {
        obj.url = url || '';		// 跳转的地址
        obj.type = type || 0;		// 跳转类型
        obj.title = title || '';	// 标题
        obj.jsOnResume = jsOnResume || null; // 针对登录加的，返回执行的脚本字符串
      }

      // 关闭
      if (obj.closePageCount && obj.closePageCount > 0) {
        _this.closePage(obj.closePageCount - 1);
        obj.type = 1;
      }

      // ios模态框的先关闭后打开特殊兼容处理
      let isIosDialog = false;
      if (isIOS && location.href.indexOf('isTransparentModal=1') > -1 && obj.type === 1) {
        obj.type = 0;
        isIosDialog = true;
      }

      let newOnResume;
      if (obj.jsOnResume || window.jsOnResume) {
        newOnResume = function () {
          obj.jsOnResume && obj.jsOnResume();

          window.jsOnResume && window.jsOnResume();
        };
      }

      if (!obj.url) {
        return false;
      }
      if (obj.url.indexOf('http://') == 0 || obj.url.indexOf('https://') == 0) { // 打开的是http地址，先去调用openWebPage
        return _this.openWebPage.apply(this, arguments);
      }
      if (GConfig.isInApp) {
        if (obj.url.indexOf(_this.appInfo.appPrefix) === -1) {
          obj.url = _this.appInfo.appPrefix + obj.url;
        }
      } else {
        obj.url = `${location.host + location.pathname}#${obj.url}`;
      }


      obj.url = obj.url.replace('{host}', window.location.host);

      // console.log("url:", obj.url, "title:", obj.title);
      let typeStr; // 打开类型

      if (obj.type === '1') {
        typeStr = 'WebAction_CloseAndOpen'; // 关闭原页面再跳转
      } else {
        typeStr = 'WebAction_Open'; // 直接原窗口打开
      }

      if (!obj.isWeb && obj.url.indexOf('http') != 0) {
        // 统一再对url的param进行转码
        const urlSplit = obj.url.split('?');
        let urlParamObj = {};
        if (urlSplit.length > 1) {
          urlParamObj = Util.unparam(urlSplit[1]);
        }
        // 拼凑参数
        if (obj.params !== undefined) {
          $.extend(urlParamObj, obj.params);
        }
        let paramStr = '';
        for (const key in urlParamObj) {
          paramStr += paramStr === '' ? '?' : '&';
          paramStr += `${key}=${urlParamObj[key]}`;
        }
        obj.url = urlSplit[0] + paramStr;
      }
      // obj.container_style = 0;
      // obj.enter_animate = 2
      // obj.leave_animate = 2
      // obj.url = obj.url.replace('/common/web', '/common/web-dialog');
      const nativeParams = {
        task_mode: obj.type || 0,
        container_style: obj.container_style || 0,
        enter_animate: obj.enter_animate || 0,
        leave_animate: obj.leave_animate !== undefined ? obj.leave_animate : (obj.enter_animate
          || 0) // 默认跟进入动画一致
      };
      const sUrl = obj.url + (obj.url.indexOf('?') > -1 ? '&' : '?') + $.param(nativeParams);

      const params = {
        action: typeStr,
        url: sUrl,
        // url: obj.url + 'task_mode=' + type,
        title: obj.title || '',
        jsOnResume: newOnResume || ''
      };

      if (params.jsOnResume) {
        const sFnName = regRandomFn(params.jsOnResume);
        params.jsOnResume = `window.${sFnName}()`;
      }

      // alert(JSON.stringify(params));
      _listenBridge()
        .then(() => { // 成功
          // alert(JSON.stringify(params));
          const model = new ParamsModel(params);
          const callback = function (data) {
            if (data && data.object === 404) { // 找不到该native页面
              // _this.showAlertDialog('敬请期待');
            }
          };
          // alert(JSON.stringify(model));
          model.callback = callback;
          // console.log(model)
          _callHandler('openPage', model, callback);
        }, () => {
          if (obj.isWeb) {
            obj.url = decodeURIComponent(obj.url);
          }

          if (obj.url.indexOf('#')) {
            obj.url = obj.url.substr(obj.url.lastIndexOf('#'));
          }
          location.href = obj.url;
        });

      if (isIosDialog) { // type=1的情况关闭一下ios模态框
        wv.closePage();
      }
    },

    /**
     * 用webview打开网页
     * @param  {String} url  跳转的url地址
     * @param  {Integer} type 跳转类型，1先关闭后打开，0直接打开，默认不传为直接打开
     * @param  {String} title 打开的页面的title，可不传
     * @return {void}
     */
    openWebPage(url, type, title, jsOnResume) {
      const _this = this;
      let obj = {};
      if (typeof (url) === 'object') {
        obj = url;
      } else {
        obj.url = url || '';
        obj.type = type || 0;
        obj.title = title || '';
        obj.jsOnResume = jsOnResume || null;
      }

      if (!obj.url) {
        return false;
      }
      if (obj.url.indexOf(_this.appInfo.appPrefix) == 0) { // 直接填写的是native完整路径，直接调用openPage
        return _this.openPage.apply(this, arguments);
      }

      let nativePath;
      const defaultEnterHtml = 'index.html#';
      const transpEnterHtml = GConfig.isSingleEnter ? 'index.html#' : 'overlay.html#';
      const // 原先的overlay.html不要了，用参数去替代，始终保持只有一个入口页面，这里为了兼容旧的引用，增加一个判断，同时也需要增加一个配置，等所有项目都去掉了的话，可以删除这个配置判断
        entryHtml = obj.isTransparent ? transpEnterHtml : defaultEnterHtml;

      if (obj.isFullDialog) {
        if (isIOS && obj.isTransparent == false) { // 不透明的ios，不用webfull，（需要判断版本）
          nativePath = '/common/web?url=';
          obj.container_style = 1;
          // nativePath = "/common/web_full?url=";
        } else {
          // 这个容器在安卓下是个普通的栈内页面，ios下是个模态框，栈内操作需注意，详见：http://192.168.100.24:6262/assets/demo/dxc/btPage-intro/
          // 增加个isTransparentModal传参是为了给目标页确认当前是不是ios模态框
          if (obj.isTransparent === true) {
            obj.params = Object.assign({ isTransparentModal: 1 }, obj.params || {});
          }
          nativePath = '/common/web-dialog?url=';
        }
      } else {
        nativePath = '/common/web?url=';
      }

      if (obj.url.indexOf('/') === 0) { // 斜杠开头，默认加上
        obj.url = entryHtml + obj.url;
      } else if (location.href.indexOf('http') > -1 && obj.isTransparent) {
        obj.url = obj.url.replace(defaultEnterHtml, transpEnterHtml)
          .replace('/#/', `/${transpEnterHtml}`);
      }

      // 统一再对url的param进行转码
      const urlSplit = obj.url.split('?');
      let urlParamObj = {};
      if (urlSplit.length > 1) {
        urlParamObj = Util.unparam(urlSplit[1]);
      }
      // 拼凑参数
      if (obj.params != undefined) {
        $.extend(urlParamObj, obj.params);
      }
      let paramStr = '';
      for (const key in urlParamObj) {
        paramStr += paramStr == '' ? '?' : '&';
        paramStr += `${key}=${urlParamObj[key]}`;
      }
      obj.url = urlSplit[0] + paramStr;

      if (obj.url.indexOf(nativePath) === -1) {
        obj.url = nativePath + encodeURIComponent(obj.url);

        obj.isWeb = true;
      }
      // console.log(obj)

      this.openPage(obj);
    },

    /**
     * 用webview打开全屏网页，默认为透明页
     * 全屏透明的页面
     * @param  {String|Object} url  跳转的url地址|参数对象
     * @return {void}
     */
    openFullPage(url) {
      let obj = {};
      if (typeof (url) === 'object') {
        obj = url;
      } else {
        obj.url = url || '';
      }

      obj.isTransparent = obj.isTransparent == undefined ? true : obj.isTransparent;// 透明
      obj.isFullDialog = obj.isFullDialog == undefined ? true : obj.isFullDialog;// 全屏

      // console.log(obj)
      this.openWebPage(obj);
    },

    /**
     * 关闭当前页面
     *
     * @param  {Integer} count 往前关闭的数量(不包括当前页)
     * @return {void}
     */
    closePage(count) {
      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel(count);
            _callHandler('closePage', model, '');
          },
          () => {
            // console.log("call closePage");
          }
        );
    },

    /**
     * 设置浏览器title
     * @param  {String}   title    title值
     * @return {void}
     */
    setTitle(title) {
      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel(title);
            _callHandler('showWebTitle', model, '');
          },
          () => {
            $('title')
              .text(title);
          }
        );
    },

    /**
     * 调用app接口请求数据
     * @param  {Object} params 具体参数对象
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    fetchData(params, callback) {
      const DEFAULT_OPTION = {
        url: '',
        method: 'get', // multiPart的话表示有上传文件
        data: {},
        authorization: 0, 	// 0不限，1需要登录
        fileData: null, 	// 如果有图片上传，这里传路径组合
        requestType: 0 		// 请求类型 0 java host， 1 .NET host
      };
      const _this = this;

      params = $.extend({}, DEFAULT_OPTION, params || {});
      // isShowLoading = isShowLoading === undefined ? false : isShowLoading;

      // isShowLoading = false;//全站取消

      const newCallback = function (data) {
        // alert(params.url + "-----" + data);
        // if(isShowLoading){
        //     _this.hideSubmiting();
        // }
        // console.log("------------ begin ------------");
        // console.log(data);
        if (typeof (data) === 'string') {
          try {
            // data = data.replace(/(?:\s*:\s*(['\"]))([^\1]*?)(?=\s*\1)/ig, function($1, $2, $3){
            //     // console.log($1, $2, $3);
            //     return $1.replace(/\r\n/ig, "\\r\\n").replace(/\t/ig, "");//替换换行符和制表符
            // });
            data = JSON.parse(data);

            // 解析分享数据格式
            // if (data.map && data.map.shareInfo && typeof (data.map.shareInfo) === 'string') {
            //   data.map.shareInfo = JSON.parse(data.map.shareInfo);
            // }
          } catch (ex) {
            if (_this.appInfo.isDebugMode == 1) { // 暗门模式
              sayError(`数据格式错误，数据内容：${data}`);
            } else {
              sayError('数据格式错误');
            }
          }
        }

        // if(data.code != 1){//app返回的错误状态，他们格式不正确，这里进行一下转化以统一处理
        //     data.message = data.message || data.object;
        // }
        // alert(JSON.stringify(data))
        // console.log("version: "+ window.GConfig.SITE_NAME +"，data submit:", params, "data callback:", data, "dateTime:", new Date());
        // console.log("------------ end ------------");
        // if(data && data.code == 1001){//modify by dongxiaochai@163.com  1001的类型native会拦截并耦合弹窗，就不执行回掉了
        // 	return;
        // }
        callback && callback(data);
      };

      // if(isShowLoading){
      //     _this.showSubmiting();
      // }

      function faildCallback() {
        setTimeout(() => {
          $.ajax({
            url: `${params.testUrl}?t=${new Date().getTime()}`,
            type: 'get',
            data: params.data,
            dataType: 'text',
            contentType: 'application/json; charset=UTF-8'
          })
            .done(newCallback)
            .fail((error) => {
              // if(isShowLoading){
              //     _this.hideSubmiting();
              // }
              sayError('异常错误');
            });
        }, 100);
      }

      if (GConfig.isTest) {
        faildCallback();
      } else {
        _listenBridge()
          .then(
            () => { // 成功
              if (params.testUrl) {
                delete params.testUrl;
              }
              // alert(JSON.stringify(params));
              const model = new ParamsModel(params);
              _callHandler('fetchData', model, newCallback);
            }, faildCallback
          );
      }
    },

    /**
     * 显示loading或者error弹层
     * @param  {Object} params 具体参数对象
     * @return {void}
     */
    _showLoadingDialog(params) {
      const DEFAULT_OPTION = {
        message: '提交中..',
        type: 1 // 1：加载中:2：错误:3：成功；4警告toast
      };

      params = $.extend({}, DEFAULT_OPTION, params || {});

      _listenBridge()
        .then(
          () => { // 成功
            // console.log("succ");
            const model = new ParamsModel(params);
            // model.callback = params.callback;
            // alert(JSON.stringify(model));
            _callHandler('showLoadingDialog', model, null);
            if (params.callback) {
              setTimeout(() => {
                params.callback();
              }, 1500);
            }
          },
          () => { // 失败
            // console.log("faild");
            require(['loading'], (Loading) => {
              if (params.type == 1) {
                Loading.show();
              } else if (params.type == 2) {
                sayError(params.message);
              }
            });
          }
        );
    },

    /**
     * 显示错误提示
     * @param  {String} message 提示消息
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    showError(message, callback) {
      this._showLoadingDialog({
        message,
        type: 2,
        callback
      });
    },

    /**
     * 显示成功提示
     * @param  {String} message 提示消息
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    showSuccess(message, callback) {
      this._showLoadingDialog({
        message,
        type: 3,
        callback
      });
    },

    /**
     * 显示警告提示（as6 toast弹窗）
     * @param  {Function} callback 回调函数
     * @return {void}
     */
    showWarning(message, callback) {
      this._showLoadingDialog({
        message,
        type: 4,
        callback
      });
    },

    /**
     * 显示提交中
     * @param  {String} message 提示消息
     * @return {void}
     */
    showSubmiting(message) {
      this._showLoadingDialog({
        message,
        type: 1
      });
    },

    /**
     * 取消提交中
     * @return {void}
     */
    hideSubmiting() {
      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel();
            _callHandler('dismissLoadingDialog', model, '');
          },
          () => { // 失败
          }
        );
    },

    /**
     * 加载中
     * @return {void}
     */
    getLoading() {
      const loading = {};
      let isLoading = true; // 是否加载中
      let oTimer = null; // 显示超时定时器
      let instanceCount = 0; // 当前弹出的实例数量

      /**
       * 显示loading效果
       * @return {void}
       */
      loading.show = function () {
        isLoading = true;
        // if(!isLoading){
        _listenBridge()
          .then(() => { // 成功
            const model = new ParamsModel();
            _callHandler('showLoadingView', model, () => {
              instanceCount++;
              isLoading = true;
              setTimer();
            });
          });
      };

      /**
       * 关闭loading效果
       * @param  {Function} failCallBack 失败的回调函数
       * @return {void}
       */
      // eslint-disable-next-line func-names
      loading.hide = function (failCallBack) {
        const result = failCallBack === undefined ? 1 : 0;
        // eslint-disable-next-line no-param-reassign
        failCallBack = failCallBack || '';

        if (!isLoading) {
          return;
        }
        _listenBridge()
          .then(() => { // 成功
            const model = new ParamsModel();
            model.code = !failCallBack ? 1 : 0;
            model.callback = failCallBack;
            _callHandler('loadingFinish', model, '');
            instanceCount -= 1;
          });
      };

      // 清除定时器
      function clearTimer() {
        // eslint-disable-next-line no-unused-expressions
        oTimer && clearTimeout(oTimer);
      }

      /**
       * 关闭所有loading
       * @return {void}
       */
      function hideAll() {
        if (isLoading) {
          clearTimer(); // 清除还在等待的定时器
          for (let i = 0; i < instanceCount; i++) {
            loading.hide();
          }
        }
      }

      // 设置定时器
      function setTimer() {
        // 设置超时定时器
        oTimer = setTimeout(() => {
          if (isLoading) {
            hideAll();
            sayError('请求超时');
          }
        }, 10000);
      }

      return loading;
    },

    /**
     * loading实体私有对象
     */
    _loading: null,

    /**
     * loading对象
     * @return {Object} 提供show和hide两个方法
     */
    loading() {
      if (this._loading === null) {
        this._loading = this._getLoading();
      }

      return this._loading;
    },

    /**
     * 显示确认对话框
     * @param  {Object}   params    参数对象
     * @return {void}
     */
    showConfirmDialog(params) {
      const DEFAULT_OPTION = {
        title: '', // 弹窗标题
        content: '', // 弹窗内容
        cancelLabel: '取消', // 取消按钮文本
        cancelCallback: null, // 取消按钮的回调函数
        confirmLabel: '确定', // 确定按钮文本
        confirmCallback: null // 点击确定的回调函数
      };

      // eslint-disable-next-line no-param-reassign
      params = Object.assign(DEFAULT_OPTION, params || {});

      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(params);
          if (params.confirmCallback) {
            model.callback = params.confirmCallback;
            if (params.confirmCallback) {
              // eslint-disable-next-line no-param-reassign
              params.confirmCallback = regRandomFn(params.confirmCallback);
            }
            if (params.cancelCallback) {
              // eslint-disable-next-line no-param-reassign
              params.cancelCallback = regRandomFn(params.cancelCallback);
            }
          }

          _callHandler('showDialog', model, '');
        }, () => {
        });
    },

    /**
     * 向webview动态注册函数以供native调用
     * @param  {String}   fnName   方法名称
     * @param  {Function} callback 函数体
     * @return {void}
     */
    regJSHandle(fnName, callback) {
      _listenBridge()
        .then(() => { // 成功
          _regJsHandle(fnName, callback);
        });
    },

    /**
     * 调用native方法（一般用于一些页面特定的私有方法）
     * @param  {String}   handlerName 方法名
     * @param data
     * @param  {Function} callback    回调
     * @return {void}
     */
    callNativeHandle(handlerName, data, callback) {
      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(data);
          model.callback = callback || '';
          _callHandler(handlerName, model, callback);
        });
    },

    /**
     * 提交数据给native
     * @return {void}
     * @param data
     */
    sendDataToNative(data) {
      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(data);
          _callHandler('sendDataToNative', model, '');
        });
    },

    /**
     * 往前后退几页
     * @param page           后退的页数（请传正整数，不传的话默认后退一步）
     * @param callbackStr    返回的那个页面的回调脚本字符串
     */
    goBack(page = 1, callbackStr) {
      if (page === undefined) { // 无参数
        // eslint-disable-next-line no-param-reassign
        page = 1;
      } else if (typeof (page) === 'string') { // 只有一个回调函数的情况
        // eslint-disable-next-line no-param-reassign
        callbackStr = page;
        // eslint-disable-next-line no-param-reassign
        page = 1;
      }

      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel(page);
            model.callback = callbackStr;
            _callHandler('goBack', model, '');
          },
          () => {
            window.history.go(-page);
            if (callbackStr) {
              setTimeout(() => {
                try {
                  // eslint-disable-next-line no-eval
                  eval(callbackStr);
                } catch (ex) {
                  console.log(ex);
                }
              }, 100);
            }
          }
        );
    },

    /**
     * 拨打电话
     * @param  {String}   telNum    电话号码
     * @param  {Function} callback  点击拨打的回调函数
     // * @param  {object} $event  当前的点击对象的e
     * @return {void}
     */
    callUp(telNum, callback) {
      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(telNum);
          model.callback = callback;
          _callHandler('callUp', model, callback);
        }, () => {
          /**
           * QQ内置浏览器对location.href = "tel:" + telNum;不太感冒
           * 我只能出此下策了
           * modify by ashaLiu
           * @type {string}
           */
          // const ua = navigator.userAgent;
          // const isQQBrowserInApp = ua.indexOf('MQQBrowser') === -1 && ua.indexOf('QQ') > -1;
          // if (isQQBrowserInApp && isIOS && !!$event) {
          //   $($event.currentTarget)
          //     .attr({
          //       href: `tel:${telNum}`,
          //     });
          // } else {
          //   location.href = `tel:${telNum}`;
          // }
          // callback && callback();
        });
    },

    /**
     * 重新设置webview窗体高度 暂时保留
     *
     * @params {Integer}    窗体高度，默认不用传
     */
    // resizeWebViewHeight(height) {
    //   let nDocHeight = height || $(document).height();
    //   // const nWinHeight = $(window).height();
    //   if (nDocHeight < $('body').height()) {
    //     nDocHeight = $('body').height();
    //   }
    //   _listenBridge()
    //     .then(() => { // 成功
    //       const model = new ParamsModel(nDocHeight);
    //       _callHandler('setWebViewHeight', model, '');
    //     }, () => {
    //     });
    // },

    // 打开url地址，用于打开下载地址或者拨号等等
    openUrl(url) {
      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(url);
          _callHandler('openUrl', model, '');
        }, () => {
          window.location.href = url;
        });
    },

    /**
     * 定制头部导航右上角菜单
     * @param  {Array}   menu 按钮，可传对象或数组，格式如下：
     * [{
     *  text: "分享", //显示按钮文字，跟icon二选一
     *  color: "#f24545", //按钮文字的颜色，可不传，native有默认值
     *  icon: "/img/home-buycar@2x.png", //图标icon相对路径，跟text二选一（40*40）
     *  callback: function(){} //回调函数
     * }]
     * @return {void}
     */
    renderRightMenu(menu) {
      menu.forEach((item) => {
        if (item.callback && typeof (item.callback) === 'function') {
          // eslint-disable-next-line no-param-reassign
          item.callback = regRandomFn(item.callback);
        }
      });

      _listenBridge()
        .then(() => { // 成功
          const model = new ParamsModel(menu);
          _callHandler('renderRightMenu', model, null);
        });
    },

    /**
     * 自定义左上角返回按钮点击事件
     * @param  {Function} callback 点击事件函数
     * @return {void}
     */
    customBackAction(callback) {
      _listenBridge()
        .then(() => {
          const model = new ParamsModel();
          model.callback = callback;
          _callHandler('customBackAction', model, model.callback);
        }, () => {
          // callback && callback();
        });
    },

    /**
     * 滚动收起键盘
     * @return {void}
     */
    scrollHidenSoftKeyBoard() {
      _listenBridge()
        .then(
          () => { // 成功
            const model = new ParamsModel();
            _callHandler('scrollHidenSoftKeyBoard', model, '');
          },
          () => { // 失败，走测试调试流程
            // console.log("enter test userInfo");
          }
        );
    },

    /**
     * 日期控件
     * @return {void}
     */
    showDatePicker(o) {
      const params = {
        startTime: o.startTime === undefined ? 1 : o.startTime, // 起始时间
        endTime: o.endTime === undefined ? 33071644800000 : o.endTime, // 截至时间
        title: o.title === undefined ? '请选择日期' : o.title // 日期标题
      };

      function newCallback(data) {
        // eslint-disable-next-line no-unused-expressions
        o.callback && o.callback(_parseData(data));
      }

      _listenBridge()
        .then(() => { // 成功
            const model = new ParamsModel(params);
            model.callback = newCallback;
            _callHandler('showDatePicker', model, newCallback);
          },
          () => { // 失败，走测试调试流程
          });
    }

  };

  return _wv;
}

export default fnWebViewBridge();
