<template>
  <div class='wrapper'>
    <div class="content">
      <div class="banner">
        <img src="~@/assets/img/download/mali_banner.png" class="bgpic">
        <div>
          <img src="~@/assets/img/download/mali_logo.png" alt=""/>
          <span>花兔钱包</span>
        </div>
      </div>
      <div class="txtMarquee-top">
        <div class="bd">
          <div class="tempWrap" style="overflow:hidden; position:relative; height:18px">
            <ul class="infoList"
                style="height: 324px; position: relative; padding: 0px; margin: 0px;">
              <div class='li-wrapper'>
                <li>用户<span class="telephone">131****1291</span>成功借款<span
                  class="fontorangge">3000</span>元
                </li>
                <li>用户<span class="telephone">182****1315</span>成功借款<span
                  class="fontorangge">4500</span>元
                </li>
                <li>用户<span class="telephone">185****0651</span>成功借款<span
                  class="fontorangge">5000</span>元
                </li>
                <li>用户<span class="telephone">177****4180</span>成功借款<span
                  class="fontorangge">2000</span>元
                </li>
                <li>用户<span class="telephone">132****1981</span>成功借款<span
                  class="fontorangge">2500</span>元
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div class="enteraera">
        <input type="tel" name="" v-model="telephone" placeholder="请输入您的手机号码"
               class="text1"
               maxlength="11">
        <input type="button" name="" value="立即借款"
               @click='borrow'
               class="enter1">
        <div class="hint1" style="visibility: hidden;color: white;"></div>
      </div>
      <div class="div">
        <span>点击按钮视为同意 <b @click="goAgreement">《服务协议》</b></span>
      </div>
    </div>
    <div class="newpop">
      <div class="mask" v-show='showPop2 || showPop3'></div>
      <div class="pop2" v-show='showPop2'>
        <p class="phone">手机号码：<span class="phonenumber">{{telephone}}</span></p>
        <div class="figure">
          <input type="text" name="" id="txtimgcode" value="" placeholder="请输入图形验证码"
                 v-model='graph_code_input'
                 class="text2">
          <span class="enter2">
            <img id="imgcode" :src='graph_code' @click="changeGraphCode">
          </span>
        </div>
        <div class="message">
          <input type="text" name="" id="Code" value="" placeholder="请输入短信验证码"
                 class="text3" maxlength="6" v-model='smsCode'>
          <span class="enter3" @click='getSmsCode'>{{getSmsBtnTxt}}</span>
          <input type="password" placeholder="请设置登录密码" v-model="password"
                 class="password"/>
        </div>
        <input type="button" class="ensure2" value="确认" @click='register'>
        <div class="close">
          <img src="~@/assets/img/close.png?v=2" class="closebtn"
               @click='showPop2 = false'>
        </div>
      </div>
      <div class="pop3" v-show='showPop3'>
        <p class="knows">{{registerMsg}}</p>
        <input type="button" class="ensure3" @click="download" value="下载登录">
        <div class="close">
          <img src="~@/assets/img/close.png?v=2" class="closebtn"
               @click='showPop3 = false'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/lib/util';
import { getGraphCode, getMobileCode, webRegister } from '@/api/register';

let push;
export default {
  name: 'huatuqianbao',
  data() {
    return {
      showPop2: false,
      showPop3: false,
      alias: this.$route.query.alias, // 商户
      origin_id: this.$route.query.origin,
      clientType: util.isAndroid ? 'android' : 'ios',
      uuid: '',
      graph_code: '',
      graph_code_input: '',
      telephone: '',
      smsCode: '',
      password: '',
      registerMsg: '',
      getSmsBtnTxt: '获取验证码',
      smsTimer: null
    };
  },
  created() {
    document.title = '花兔钱包';
    const origin_id = parseInt(this.origin_id);
    this.origin_id = isNaN(origin_id) ? this.clientType : origin_id;
  },
  mounted() {
    // 创建cnzz统计js
    const script = document.createElement('script');
    script.src = `https://s22.cnzz.com/z_stat.php?id=1274516312&web_id=1274516312`;
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

    push(this.alias, '打开', this.clientType, this.origin_id);
    this.changeGraphCode();
  },
  methods: {
    goAgreement() {
      this.$router.push({
        path: '/agreement/registar'
      });
    },
    changeGraphCode() {
      getGraphCode()
        .then(data => {
          this.uuid = data.uuid;
          this.graph_code = data.graph_code;
        });
    },
    borrow() {
      const reg1 = /^(\+\d+)?1[3456789]\d{9}$/;
      if (this.telephone === '') {
        mui.toast('手机号不能为空');
        return false;
      } else if (!reg1.test(this.telephone)) {
        mui.toast('手机号错误');
        return false;
      } else {
        this.showPop2 = true;
        this.showPop3 = false;
      }
    },
    countdown() {
      clearInterval(this.smsTimer);
      let smsTime = 60;
      this.smsTimer = setInterval(() => {
        if (smsTime === 0) {
          this.getSmsBtnTxt = '获取验证码';
          return clearInterval(this.smsTimer);
        }
        smsTime--;
        this.getSmsBtnTxt = smsTime + 's';
      }, 1000);
    },
    getSmsCode() {
      push(this.alias, '验证码', this.clientType, this.origin_id);
      getMobileCode({
        alias: this.alias,
        phone: this.telephone,
        graph_code: this.graph_code_input,
        uuid: this.uuid
      })
        .then(data => {
          this.countdown();
        })
        .catch((data) => {
          if (data.status === '2001') {
            this.registerMsg = '您的手机已注册过，请前往APP登录';
            this.showPop2 = false;
            this.showPop3 = true;
          } else {
            this.changeGraphCode();
          }
        });
    },
    register() {
      if (!this.smsCode) {
        mui.toast('短信验证码不能为空');
        return;
      }
      if (!this.password) {
        mui.toast('密码不能为空');
        return;
      }
      webRegister({
        alias: this.alias,
        phone: this.telephone,
        password: this.password,
        phone_code: this.smsCode,
        origin_id: this.origin_id
      })
        .then(data => {
          push(this.alias, '注册', this.clientType, this.origin_id);
          this.registerMsg = '恭喜您注册成功，请前往APP登录';
          this.showPop2 = false;
          this.showPop3 = true;
        })
        .catch(() => {
          this.changeGraphCode();

        });
    },
    download() {
      this.$router.this.$router.push({
        path: `/register/guide_huatuqianbao?alias=${this.alias}&origin=${this.origin_id}`
      });
    }
  }
};
</script>

<style scoped>
  .wrapper {
    background: #F8633B;
    height: 100%;
  }

  .li-wrapper {
    will-change: tranform;
    transform: translateY(0px);
    animation: loopLogo 10s infinite;
  }

  @keyframes loopLogo {
    0% {
      transform: translateY(0px);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-40px);
    }
    80% {
      transform: translateY(-60px);
    }
    100% {
      transform: translateY(-80px);
    }
  }

  a:last-of-type {
    display: none
  }

  .banner {
    width: 100%;
    position: relative
  }

  .banner div {
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: 15px;
    left: 36px
  }

  .banner div img {
    width: 40px;
    height: 40px;
    vertical-align: bottom;
    margin-right: 8.5px
  }

  .banner div span {
    font-size: 18px;
    color: #FFFFFF
  }

  .content {
    width: 100%
  }

  .bd li {
    color: white;
    height: 19px;
    list-style: none
  }

  .hint1, .hint2 {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: red;
    text-align: left;
    text-indent: 20px
  }

  .content .bgpic {
    width: 100%;
    margin-bottom: 16px
  }

  .base {
    width: 100%
  }

  .txtMarquee-top {
    width: 100%;
    text-align: center;
    height: 20px;
    font-size: 16px;
    color: #F5A623;
    overflow: hidden
  }

  .enteraera {
    width: 91.7%;
    margin: 0 auto;
    text-align: center;
    padding-top: 20px;
  }

  .enteraera div {
    width: 100%
  }

  .enteraera input {
    display: inline;
  }

  .ent_div {
    margin-bottom: 16px
  }

  .enteraera div input {
    width: 100%;
    margin: 0;
  }

  input {
    -webkit-appearance: none;
    outline: none;
    border: none
  }

  .text1, .text2, .text3 {
    width: 60%;
    height: 43px;
    border: 1px solid #7A7A7A;
    border-radius: 5px;
    text-indent: 10px;
    font-size: 16px;
    display: inline;
    margin-bottom: 0;
  }

  .text2 {
    border: 1px solid #DDDDDD
  }

  .text3 {
    border: 1px solid #DDDDDD
  }

  .enter1 {
    width: 35%;
    height: 45px;
    line-height: 1;
    border: none;
    margin-left: 5px;
    background: #FFDA3A;
    border-radius: 5px;
    color: white;
    font-size: 16px
  }

  .enter2 {
    display: inline-block;
    float: right;
    width: 35%;
    height: 43px;
    border: 1px solid #E2E2E2;
    border-radius: 5px;
    margin-bottom: -10px
  }

  .enter2 img {
    width: 100%;
    height: 43px;
    border-radius: 5px
  }

  .enter3 {
    display: inline-block;
    float: right;
    width: 35%;
    height: 43px;
    line-height: 43px;
    text-align: center;
    color: white;
    border-radius: 5px;
    background: #FFDA3A
  }

  ::-webkit-input-placeholder {
    color: #bbb
  }

  :-moz-placeholder {
    color: #bbb
  }

  ::-moz-placeholder {
    color: #bbb
  }

  :-ms-input-placeholder {
    color: #bbb
  }

  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    filter: alpha(opacity=60);
    z-index: 99
  }

  .newpop {
    position: absolute;
    width: 92%;
    left: 4%;
    top: 22%;
    border-radius: 7px;
    opacity: 1;
    filter: alpha(opacity=100);
    z-index: 999
  }

  .pop2, .pop3 {
    width: 96%;
    padding: 0 2%;
    height: 175px;
    background: #ffffff;
    border-radius: 7px;
    position: relative;
    z-index: 100;
  }

  .pop2 {
    height: 325px
  }

  .figure {
    width: 94%;
    padding-left: 3%;
    padding-top: 30px
  }

  .ensure1, .ensure2, .ensure3 {
    width: 94%;
    height: 45px;
    margin-left: 3%;
    background: #FFDA3A;
    border-radius: 5px;
    color: white;
    text-align: center;
    font-size: 1.05em
  }

  .close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: absolute;
    top: 5px;
    right: 5px
  }

  .close img {
    width: 15px
  }

  .message {
    width: 94%;
    padding-left: 3%;
    padding-top: 10px
  }

  .phone {
    text-align: center;
    padding-top: 27px;
    font-size: 16px;
    color: #333
  }

  .knows {
    text-align: center;
    padding: 40px 40px 17px;
    font-size: 16px;
    color: #333
  }

  .password {
    width: 100%;
    height: 45px;
    border: 1px solid #DDDDDD;
    border-radius: 5px;
    text-indent: 10px;
    font-size: 16px;
    margin-top: 10px
  }

  .div {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: white
  }

  .div b {
    color: blue
  }
</style>
