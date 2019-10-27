import axios from 'axios';
// import wv from '@/lib/bridge';
import qs from 'qs';

class AjaxRequest {
  constructor(options) {
    this.baseUrl = process.env.VUE_APP_BASE_URL;
  }

  request(config) {
    // 创建一个 axios 实例
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000, // 请求超时时间
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      // `transformRequest` allows changes to the request data before it is sent to the server
      // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
      // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
      // FormData or Stream
      // You may modify the headers object.
      transformRequest: []

    });

    // 请求拦截器
    instance.interceptors.request.use(
      req => {
        /**
         * 给req添加token，或者header添加认证
         * 也可以在transformRequest中处理
         */
        req.data = req.data || {};
        // TODO
        // req.data.token = wv.getToken();
        req.data.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyIiwicGhvbmUiOiIxNTg2NzExMDU5MyIsImNsaWVudFR5cGUiOiJpb3MiLCJjbGllbnRBbGlhcyI6InRlc3QiLCJjbGllbnRWZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE1NzE4NDA4MDh9.Kn3D3yylFQShc-872Y_Ft36CAyuKICzrwJZNnGMKmeE';
        req.data = qs.stringify(req.data);
        return req;
      },
      error => {
        // 发送失败
        errorLog('网络好像出了点问题，请检查网络后尝试访问');
        return error;
        // Promise.reject(error);
      }
    );

    // 响应拦截器
    instance.interceptors.response.use(
      async response => {
        // dataAxios 是 axios 返回数据中的 data
        let dataAxios = response.data;

        // 这个状态码是和后端约定的
        const { code } = dataAxios;
        // 根据 code 进行判断
        if (code === undefined) {
          // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
          return dataAxios;
        } else {
          // 有 code 代表这是一个后端接口 可以进行进一步的判断
          switch (code) {
            case 2000:
              // [ 示例 ] code === 2000 代表没有错误
              return dataAxios.data;
            default:
              // 不是正确的 code
              errorLog(`${dataAxios.msg || dataAxios.message}`);
              break;
          }
          return Promise.reject(dataAxios);
        }
      },
      error => {
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.message = '请求错误';
              break;
            case 401:
              error.message = '未授权，请登录';
              break;
            case 403:
              error.message = '拒绝访问';
              break;
            case 404:
              error.message = `请求地址出错: ${error.response.config.url}`;
              break;
            case 408:
              error.message = '请求超时';
              break;
            case 500:
              error.message = '服务器内部错误';
              break;
            case 501:
              error.message = '服务未实现';
              break;
            case 502:
              error.message = '网关错误';
              break;
            case 503:
              error.message = '服务不可用';
              break;
            case 504:
              error.message = '网关超时';
              break;
            case 505:
              error.message = 'HTTP版本不受支持';
              break;
            default:
              break;
          }
        }
        errorLog(error);
        return Promise.reject(error);

      }
    );
    return instance(config)
      .catch((err) => {
        return {};
      });
  }


}

// 记录和显示错误
function errorLog(error) {
  console.log(error);
  window.mui.toast(error)
  // 显示提示
  // TODO
  // window.mui.alert(error.message);
  // Message({
  //   message: error.message,
  //   type: 'error',
  //   duration: 5 * 1000
  // })
}


export default new AjaxRequest();
// M2000("2000", "success"),
// M2001("2001", "手机号已注册"),
// M2002("2002", "图形验证码错误"),
//
// M3001("3001", "未实名"),
// M3002("3002", "个人信息未认证"),
//
// M3003("3003", "银行卡未绑定"),
// M3004("3004", "手机未认证"),
// M3005("3005", "支付宝未认证"),
// M3006("3006", "人脸识别未认证"),
//
// M4000("4000", "系统异常"),
// M4001("4001", "无效的版本号"),
// M4002("4002", "无效的TOKEN"),
// M4003("4003", "版本需要强制更新"),
// M4004("4004", "公共参数异常"),
// M4005("4005", "操作过于频繁"),
// M4006("4006", "sign鉴权失败"),
//
// M5000("5000", "参数错误"),
//
// M6001("6001", "不存在的商品"),
// M6002("6002", "不存在的收货地址"),
// M6003("6003", "订单金额异常"),
// M6004("6004", "付款订单信息异常"),
//
// M70000("70000", "测试"),
// M80000("80000", "业务异常"),
