<template>
  <div class='height100'>
    <div class="body" v-show='!showWechat'>
      <img src="~@/assets/img/download/bg_top.png" class="bg_top"/>
      <div class="main">
        <img src="~@/assets/img/download/mali_logo.png"/>
        <p>花兔钱包</p>
        <div class="guide">
          <button @click="downloadAndroid" style="background: #0BBFFF;">安卓版下载</button>
          <span @click="downloadAndroidTip">华为手机安装说明</span>
        </div>
        <div class="guide">
          <button @click="downloadIos" style="background: #0BBFFF;">苹果版下载</button>
          <span @click="downloadIosTip">苹果手机安装指南</span>
        </div>
      </div>
      <img src="~@/assets/img/download/bg_bottom.png" class="bg_bottom"/>
    </div>
    <div class="wechat" @click="showWechat = true" v-show='showWechat'>
      <img src="~@/assets/img/download/wechat.png" alt="weixin"/>
    </div>
  </div>
</template>

<script>
import util from '@/lib/util';
import { checkVersion } from '@/api/register';

let push;
export default {
  name: 'guide_huatuqianbao',
  data() {
    return {
      showWechat: false,
      origin_id: this.$route.query.origin,
      alias: this.$route.query.alias,
      apk_url: '',
      makert_url: '',
      clientType: util.isAndroid ? 'android' : 'ios'
    };
  },
  created() {
    document.title = '花兔钱包';
    const origin_id = parseInt(this.origin_id);
    this.origin_id = isNaN(origin_id) ? this.clientType : origin_id;
    checkVersion({
      alias: this.alias,
      type: this.clientType,
      version: '1.0.0'
    })
      .then(data => {
        this.apk_url = data.versionUrl;
        this.makert_url = data.appMarket;
      })
      .catch(() => {});
  },
  mounted() {
    // 创建cnzz统计js
    const script = document.createElement('script');
    script.src = `https://s19.cnzz.com/z_stat.php?id=1274516312&web_id=1274516312`;
    script.language = 'JavaScript';
    document.body.appendChild(script);

    var _czc = _czc || [];
    _czc.push(['_setAccount', '1274516312']);

    push = function (alias, action, clientType, origin) {
      try {
        _czc.push(['_trackEvent', clientType + '-' + origin, action]);
      } catch (e) {
        //TODO handle the exception
      }
    };
  },
  methods: {
    downloadAndroidTip() {
      this.$router.push({
        path: '/register/explain/guidea'
      });
    },
    downloadAndroid() {
      if (util.isAndroid) {
        if (util.isWeChat) {
          this.showWechat = true;
          return false;
        }
        push(this.alias, '下载', this.clientType, this.origin_id);
        if (this.makert_url) {
          window.location.href = this.makert_url;
          return;
        }
        if (this.apk_url) {
          window.location.href = this.apk_url;
          return false;
        }
      } else {
        mui.toast('请点击苹果版下载');
      }
    },
    downloadIos() {
      if (util.isIos) {
        push(this.alias, '下载', this.clientType, this.origin_id);
        if (this.makert_url) {
          window.location.href = this.makert_url;
          return false;
        }
        if (this.apk_url) {
          window.location.href = this.apk_url;
          return false;
        }
      } else {
        mui.toast('请点击安卓版下载');
      }
    },
    downloadIosTip() {
      this.$router.push({
        path: '/register/explain/guide'
      });
    }
  }
};
</script>

<style scoped>
  .height100 {
    height: 100%;
  }

  .body {
    width: 100%;
    height: 100%;
    display: table
  }

  .body .main {
    display: table-cell;
    vertical-align: middle;
    text-align: center
  }

  .body .main img {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 auto;
  }

  .body .main p {
    font-family: PingFangSC-Medium;
    font-size: 0.2rem;
    color: #333333;
    letter-spacing: 0;
    margin-top: 0.26rem;
    margin-bottom: 0.76rem;
    font-weight: bold
  }

  .guide {
    width: 2.6rem;
    height: 0.5rem;
    margin: 0 auto 0.4rem;
    position: relative
  }

  .guide button {
    width: 100%;
    height: 100%;
    background: #FC5641;
    border-radius: 0.25rem;
    border: none;
    font-size: 0.18rem;
    color: #FFFFFF;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: medium
  }

  .main .guide span {
    font-size: 0.14rem;
    color: blue;
    position: absolute;
    right: 0.1rem;
    bottom: -0.28rem
  }

  .guide:last-of-type {
    margin-bottom: 0.1rem
  }

  .body .bg_top {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0
  }

  .body .bg_bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0
  }

  a:last-of-type {
    display: none
  }

  .wechat {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333333;
    z-index: 100;
    text-align: center;
    padding-top: 0.5rem;
    box-sizing: border-box;
    display: none
  }

  .wechat img {
    width: 90%
  }

  .text {
    padding: 0.05rem 0.1rem;
    color: white;
    font-size: 0.14rem;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 45%;
    left: 33%;
    display: none
  }
</style>
