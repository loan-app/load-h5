/**
 * 全局配置文件
 */
const DEFAULT_CONFIG = {
  isTest: false, // 用于开发阶段使用，全部启用测试通道，慎用再慎用

  isAppProject: true, // 当前系统类型，是否App。true是app，false是wap

  isInApp: null, // 当前系统是否在app内访问运行

  API_PREFIX: '', // 接口地址直接前缀

  version: '1.0.0',

  APP_DOWNLOAD_URL: 'https://cdnapp.cheok.com/thcs/download.html',

  /**
   * 应用跳转前缀
   * @type {String}
   */
  APP_PAGE_PREFIX: 'btthcs://www.btjf.com',
};
const envConfig = {
  // 开发环境
  development: {
    isTest: false,
    UPLOAD_URL: '/json/upload.json',
  },
  production: {},
};

const config = Object.assign({
  env: process.env.NODE_ENV,
}, DEFAULT_CONFIG, envConfig[process.env.NODE_ENV] || {});

export default config;
