/**
 * 实用操作封装
 */

const obj = {
  REGEXP: {
    /**
     * 手机。
     */
    PHONE: /^(\+\d+)?1[3456789]\d{9}$/, // /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/,

    /**
     * 邮编。
     */
    ZIPCODE: /^[1-9][0-9]{5}$/,

    /**
     * 邮箱。
     */
    // eslint-disable-next-line no-useless-escape
    EMAIL: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

    /**
     * 日期。
     */
    DATE: /^(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/,

    /**
     * 身份证。
     */
    IDCARD: /(^\d{18}$)|(^\d{15}$)|(^\d{17}(\d|X|x)$)/,

    /**
     * VIN码。
     */
    VINCODE: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{17}/,
  },

  /**
   * 每3个数用逗号隔开
   * @param  {Number}  num 需要转化的数值
   * @return {String}
   */
  toCutNum(num = 0) {
    // eslint-disable-next-line no-param-reassign
    num = parseFloat(num);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(num)) {
      // eslint-disable-next-line no-param-reassign
      num = 0;
    }
    let sReturn = num.toString();
    if (num < 0) {
      sReturn = sReturn.substring(1, sReturn.length);
    }
    function handleNum(intNum) {
      const mod = intNum.length % 3;
      let output = (mod === 0 ? '' : (intNum.substring(0, mod)));
      for (let i = 0, len = Math.floor(intNum.length / 3); i < len; i += 1) {
        if ((mod === 0) && (i === 0)) {
          output += intNum.substring(0, 3);
        } else {
          output += `,${intNum.substring(mod + 3 * i, mod + 3 * i + 3)}`;
        }
      }
      if (num < 0) {
        output = `-${output}`;
      }
      return output;
    }

    if (sReturn.indexOf('.') > -1) {
      const intNum = sReturn.split('.')[0];
      const dobNum = sReturn.split('.')[1];
      if (intNum.length >= 4) {
        sReturn = `${handleNum(intNum)}.${dobNum}`;
      }
    } else {
      sReturn = handleNum(sReturn);
    }

    return sReturn;
  },
  /** t
   * 四舍五入保留小数
   * @param  {Number}  num            需要转化的数值
   * @param  {Integer}  cutNum        保留的小数位数
   * @param  {Boolean} isRemoveZero    是否移除末尾的0，默认不需要
   * @param  {Boolean} isCut          是否没3个数用逗号隔开，默认不需要（仅针对整数部分加逗号）
   * @return {Number}
   */
  toFixed(num, cutNum = 0, isRemoveZero, isCut) {
    let sReturn = '0';
    // eslint-disable-next-line no-param-reassign
    num = parseFloat(num);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(num)) {
      // eslint-disable-next-line no-param-reassign
      num = 0;
    }
    // eslint-disable-next-line no-param-reassign
    cutNum = cutNum || 0;
    if (num.toString() === 'NaN') {
      // eslint-disable-next-line no-param-reassign
      num = 0;
    } else {
      // eslint-disable-next-line no-param-reassign
      num = num.toFixed(cutNum);
    }

    sReturn = num.toString();
    if (isRemoveZero) {
      while (sReturn.indexOf('.') > -1 && sReturn.endsWith('0')) {
        sReturn = sReturn.substr(0, sReturn.length - 1);
      }
      if (sReturn.endsWith('.')) {
        sReturn = sReturn.substring(0, sReturn.length - 1);
      }
    }
    if (isCut) {
      sReturn = this.toCutNum(sReturn);
    }
    return sReturn;
  },

  /**
   * 将字数符反参数解决成对象。
   * 与 $.param 相对。
   *
   * @method
   * @param {String} sParams
   * @return {Object}
   */
  unparam(sParams) {
    const asParams = (sParams || '').split('&');
    const oParams = {};
    let asSplitedParam = [];
    for (let i = asParams.length - 1; i >= 0; i -= 1) {
      asSplitedParam = asParams[i].split('=');
      oParams[asSplitedParam[0]] = asSplitedParam[1] || '';
    }

    return oParams;
  },

  /**
   * 从 URL 中读取某个参数值。
   *
   * @method getParam
   * @param {String} sName
   * @param {String|undefined} sHref ({location.href})
   * @return {String}
   */
  getParam(sName, sHref) {
    return this.decodeUri((this.unparam((sHref || window.location.href).split('?')[1] || '')[sName] || ''))
      .replace(/#*?/g, '');
  },

  /**
   * 占位符替换工厂。
   *
   * @method
   * @param {String} sContent 含占位符的字符串。
   *    当要被替换的内容中含未知替换数据，则会保留当前点位符。
   * @param {Object} oData 要替换的点位符数据，依据对象的键名与点位符一一对应，功能类似 KISSY.substitute。
   * @return {String} 返回替换后的字符串。
   */
  substitute(sContent, oData) {
    if (!oData) {
      return sContent;
    }

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const p in oData) {
      // eslint-disable-next-line no-param-reassign
      sContent = sContent.replace(new RegExp(`\\{${p}\\}`, 'g'), oData[p]);
    }

    return sContent;
  },

  /**
   * url进行编码
   * @param  {String} str 编码字符串
   * @return {String} 编码后的值
   */
  encodeUri(str) {
    return encodeURIComponent(str);
  },

  /**
   * url进行解码
   * @param  {String} str 解码字符串
   * @return {String} 解码后的值
   */
  decodeUri(str) {
    return decodeURIComponent(str);
  },

  // 是否支持本地存储
  supportStorageState: null,

  // 测试是否支持本地存储
  testIsSupportStorage() {
    if (this.supportStorageState == null) {
      try {
        const a = '1';
        localStorage.setItem('a', a);
        this.supportStorageState = localStorage.getItem('a') ? 1 : 0;
      } catch (ex) { // ios 的safari浏览器无痕模式会禁用本地存储，而且会报错
        this.supportStorageState = -2;
      }
    }

    if (this.supportStorageState === -2) {
      // eslint-disable-next-line no-new
      alert('请关闭当前浏览器无痕浏览模式，以保证当前页面正常浏览。');
    } else if (this.supportStorageState === 0) { // 不支持方法的调用模式，重写常用的几个方法，经测试傻逼UC就不支持下面这些方法，只能直接赋值
      try {
        // eslint-disable-next-line func-names
        localStorage.setItem = function (key, value) {
          localStorage[key] = value;
          localStorage.length += 1;
        };
        // eslint-disable-next-line func-names
        localStorage.getItem = function (key) {
          return localStorage[key];
        };
        // eslint-disable-next-line func-names
        localStorage.removeItem = function (key) {
          delete localStorage[key];
          localStorage.length -= 1;
        };
        // eslint-disable-next-line func-names
        sessionStorage.setItem = function (key, value) {
          sessionStorage[key] = value;
          sessionStorage.length += 1;
        };

        // eslint-disable-next-line func-names
        sessionStorage.getItem = function (key) {
          return sessionStorage[key];
        };
        // eslint-disable-next-line func-names
        sessionStorage.removeItem = function (key) {
          delete sessionStorage[key];
          sessionStorage.length -= 1;
        };
      } catch (ex) {
      }
    }

    return this.supportStorageState;
  },

  /**
   * 获得本地存储数据
   * @param  {String} key       存储关键词
   * @param  {Integer} storeTime    有效期（单位：分钟）
   * @return {Object}
   */
  getLocalData(key, storeTime) {
    if (!key) {
      return null;
    }
    this.testIsSupportStorage();

    let oStore;
    try {
      oStore = localStorage.getItem(key);
    } catch (ex) {
    }
    if (oStore) {
      oStore = JSON.parse(oStore);
    }

    if (!oStore) {
      return null;
    }
    if (storeTime && (!oStore.time || +new Date() > oStore.time + storeTime * 60 * 1000)) {
      this.removeLocalData(key);
      return null;
    }
    return oStore.data;
  },

  /**
   * 获得本地存储数据
   * @param  {String} key        存储关键词
   */
  setLocalData(key, data) {
    const oStore = {
      time: +new Date(),
      // validDate: +new Date + (storeTime || 10000000) * 1000 * 60,
      data,
    };
    this.testIsSupportStorage();

    try {
      localStorage.setItem(key, JSON.stringify(oStore));
    } catch (ex) {
    }
  },

  /**
   * 删除本地存储数据
   * @param  {String} key       存储关键词
   * @return {void}
   */
  removeLocalData(key) {
    this.testIsSupportStorage();
    try {
      localStorage.removeItem(key);
    } catch (ex) {
    }
  },

  // 是否安卓
  isAndroid: navigator.userAgent.indexOf('Android') > -1,

  // 是否ios
  isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),

  // 是否是微信
  isWeChat: navigator.userAgent.toLowerCase()
    .indexOf('micromessenger') > -1,

  /**
   * 是否性能不好的安卓，可用于针对性地进行降级的处理和体验（，别处拷的，还未验证）
   */
  isBadAndroid: (function () {
    const { appVersion } = window.navigator;

    if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
      const safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
      if (safariVersion && typeof safariVersion === 'object' && safariVersion.length >= 2) {
        return parseFloat(safariVersion[1]) < 535.19;
      }
      return true;
    }
    return false;
  }()),
  /**
   * 按名称读取cookie值
   * @param  {String} name cookie名
   * @return {void}
   */
  getCookie(name) {
    let cookieValue = '';
    const search = `${name}=`;
    if (document.cookie.length > 0) {
      let offset = document.cookie.indexOf(search);
      if (offset !== -1) {
        offset += search.length;
        let end = document.cookie.indexOf(';', offset);
        if (end === -1) {
          end = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(offset, end));
      }
    }

    /**
     * Parse JSON cookie string.
     *
     * @param {String} str
     * @return {Object} Parsed object or undefined if not json cookie
     * @public
     */
    function JSONCookie(str) {
      if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
        return str;
      }
      try {
        return JSON.parse(str.slice(2));
      } catch (err) {
        return str;
      }
    }

    return JSONCookie(cookieValue);
  },

  /**
   * 写cookie
   * @param  {String} name       cookie名
   * @param  {Any} value
   * @param  {Integer} storeTime  有效期（单位：分钟）
   * @return {void}
   */
  setCookie(name, value, storeTime) {
    // eslint-disable-next-line no-param-reassign
    storeTime = storeTime || 60 * 24 * 30;// 如果不传，默认一个月
    let exdate = new Date();
    exdate = exdate.getTime() + storeTime * 60 * 1000;
    exdate = (new Date(exdate)).toGMTString();

    // object类型的处理下结果
    if (typeof value === 'object') {
      // eslint-disable-next-line no-param-reassign
      value = `j:${JSON.stringify(value)}`;
    }

    // 使设置的有效时间正确。增加toGMTString()
    document.cookie = `${name}=${encodeURIComponent(value)
    }${(storeTime == null) ? '' : `;expires=${(new Date(exdate)).toGMTString()}`};path=/`;
  },

  /**
   * 删除cookie
   * @param  {String} name cookie名
   * @return {void}
   */
  removeCookie(name) {
    return this.setCookie(name, '', -1);
  },
  /**
   * JSON转成字符串
   * @param  {Object} json json对象
   * @return {String}     转化后字符串
   */
  stringify(json) {
    const that = this;
    if (json === null || json === undefined) {
      return json;
    }
    if (JSON && JSON.stringify) {
      return JSON.stringify(json);
    }
    let str = '';
    if (json.length !== undefined) { // 数组
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const i in json) {
        const item = json[i];
        const sType = typeof (item);

        if (item === undefined) {
          str += `${null},`;
        } else if (sType === 'object') {
          str += `${that.stringify(item)},`;
        } else if (sType === 'string') {
          str += `"${item}",`;
        } else if (sType === 'function') {
          str += `${null},`;
        } else {
          str += `${item},`;
        }
      }
      if (str) {
        str = str.substr(0, str.length - 1);
      }
      str = `[${str}]`;
    } else { // 对象
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const key in json) {
        // eslint-disable-next-line no-shadow
        let item = json[key];
        // eslint-disable-next-line no-shadow
        const sType = typeof (item);
        const sFormat = '"{key}":{val},';

        if (item === undefined || sType === 'function') {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (sType === 'object') {
          item = that.stringify(item);
        } else if (sType === 'string') {
          item = `"${item}"`;
        }
        str += that.substitute(sFormat, {
          key,
          val: item,
        });
      }
      if (str) {
        str = str.substr(0, str.length - 1);
      }
      str = `{${str}}`;
    }
    return str;
  },

  /**
   * 字符串转成json对象
   * @param  {String} str     要转化的字符串
   * @return {Object}
   */
  parseJson(str) {
    if (!str) {
      return {};
    }
    if (typeof str === 'object') {
      return str;
    }
    if (window.JSON && JSON.parse) {
      return JSON.parse(str);
    }
    try {
      // eslint-disable-next-line no-eval
      return eval(`a=${str}`);
    } catch (ex) {
      return {};
    }
  },

  /**
   * 生成唯一识别码
   * @return {String} 识别码
   */
  getGuid() {
    let guid = '';

    for (let i = 1; i <= 32; i += 1) {
      const n = Math.floor(Math.random() * 16.0)
        .toString(16);
      guid += n;

      if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
        guid += '-';
      }
    }

    return guid;
  },

  /*
  * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
  * @param fn {function}  需要调用的函数
  * @param delay  {number}    延迟时间，单位毫秒
  * @param mustRunDelay  {bool} 是否延迟执行，给mustRunDelay参数传递false 绑定的函数先执行，而不是delay后后执行。
  * @return {function}实际调用函数
  */
  throttle(fn, delay, mustRunDelay = true, debounce) {
    let curr = +new Date();
    let lastCall = 0;
    let lastExec = 0;
    let timer = null;
    let diff; // 时间差
    let context;
    let args;
    // eslint-disable-next-line func-names
    const exec = function () {
      lastExec = curr;
      fn.apply(context, args);
    };
    // eslint-disable-next-line func-names
    return function () {
      curr = +new Date();
      context = this;
      // eslint-disable-next-line
      args = arguments;
      diff = curr - (debounce ? lastCall : lastExec) - delay;
      clearTimeout(timer);
      if (debounce) {
        if (mustRunDelay) {
          timer = setTimeout(exec, delay);
        } else if (diff >= 0) {
          exec();
        }
      } else if (diff >= 0) {
        exec();
      } else if (mustRunDelay) {
        timer = setTimeout(exec, -diff);
      }
      lastCall = curr;
    };
  },

  /*
  * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
  * @param fn {function}  要调用的函数
  * @param delay   {number}    空闲时间
  * @param mustRunDelay  {bool} 是否延迟执行，给mustRunDelay参数传递false 绑定的函数先执行，而不是delay后后执行。
  * @return {function}实际调用函数
  */
  debounce(fn, delay, mustRunDelay) {
    return obj.throttle(fn, delay, mustRunDelay, true);
  },
};

window.Util = obj;
export default obj;
