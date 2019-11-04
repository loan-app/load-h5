<template>
  <div class="certification-center">
    <div class="certification-center-title">*温馨提示：请填写真实信息。</div>
    <div class="certification-center-list1">
      <ul class="realName clearfix vest" @click='goRealName'>
        <li class="certificate-img1"></li>
        <li>
          <img src="~@/assets/img/ic_real name.png">
          <p>实名认证</p>
        </li>
        <li>
          <div class="certification-state">
            <span class="status-text red" v-if='realName === 0'>未认证</span>
            <span class="status-text" v-if='realName === 1'>认证中</span>
            <span class="status-text" v-if='realName === 2'>认证成功</span>
            <span class="status-text red" v-if='realName === 3'>认证失败</span>
            <span class="status-text red" v-if='realName === 4'>认证过期</span>
            <svg class="icon1" aria-hidden="true">
              <use xlink:href="#icon-you"></use>
            </svg>
          </div>
        </li>
      </ul>
      <ul class="liveness clearfix vest" @click='goLiveness'>
        <li class="certificate-img7"></li>
        <li>
          <img src="~@/assets/img/ic_face.png">
          <p>人脸识别</p>
        </li>
        <li>
          <div class="certification-state">
            <span class="status-text red" v-if='liveness === 0'>未认证</span>
            <span class="status-text" v-if='liveness === 1'>认证中</span>
            <span class="status-text" v-if='liveness === 2'>认证成功</span>
            <span class="status-text red" v-if='liveness === 3'>认证失败</span>
            <span class="status-text red" v-if='liveness === 4'>认证过期</span>
            <svg class="icon1" aria-hidden="true">
              <use xlink:href="#icon-you"></use>
            </svg>
          </div>
        </li>
      </ul>
      <ul class="userDetails clearfix vest" @click='goUserDetails'>
        <li class="certificate-img2"></li>
        <li>
          <img src="~@/assets/img/ic_personal information.png">
          <p>个人信息</p>
        </li>
        <li>
          <div class="certification-state">
            <span class="status-text red" v-if='userDetails === 0'>未认证</span>
            <span class="status-text" v-if='userDetails === 1'>认证中</span>
            <span class="status-text" v-if='userDetails === 2'>认证成功</span>
            <span class="status-text red" v-if='userDetails === 3'>认证失败</span>
            <span class="status-text red" v-if='userDetails === 4'>认证过期</span>
            <svg class="icon1" aria-hidden="true">
              <use xlink:href="#icon-you"></use>
            </svg>
          </div>
        </li>
      </ul>
      <ul class="mobile clearfix vest" @click='goMobile'>
        <li class="certificate-img6"></li>
        <li>
          <img src="~@/assets/img/ic_phone.png">
          <p>手机认证</p>
          <div class="fee_question" @click.stop="showDialog = true">
            <img src="~@/assets/img/ic_info.png">
          </div>
        </li>
        <li>
          <div class="certification-state mobile_renzheng">
            <span class="status-text red" v-if='mobile === 0'>未认证</span>
            <span class="status-text" v-if='mobile === 1'>认证中</span>
            <span class="status-text" v-if='mobile === 2'>认证成功</span>
            <span class="status-text red" v-if='mobile === 3'>认证失败</span>
            <span class="status-text red" v-if='mobile === 4'>认证过期</span>
            <svg class="icon1" aria-hidden="true">
              <use xlink:href="#icon-you"></use>
            </svg>
          </div>
        </li>
      </ul>
    </div>
    <div class="hint" v-show='showDialog' @click.stop='showDialog = false'>
      <div class="list">
        <div class="div">
          <p>手机认证说明：</p>
          <ul>
            <li>1、认证过程中请不要中途退出，根据进度条提示等待，一般认证时间在10秒左右；</li>
            <li>2、长时间显示认证中，退出<b>认证页面然后重新查看</b>或者提交意见反馈至客服；</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="borrow-btn">
      <input type="button" class="borrow-word"
             @click='borrowWord'
             style="border:none;display:block;box-shadow:none" value="完成">
    </div>
  </div>
</template>

<script>
import { getUserIdentInfo } from '@/api/user';
import wv from '@/lib/bridge';

let inter = null;

export default {
  name: 'cert_center',
  data() {
    return {
      realName: '',
      liveness: '',
      userDetails: '',
      mobile: '',
      bindbank: '',
      showDialog: false
    };
  },
  created() {
    this.fetchData();
    inter = setInterval(this.fetchData, 5000);
  },
  beforeDestroy() {
    if (inter) {
      clearInterval(inter);
    }
  },
  methods: {
    fetchData() {
      getUserIdentInfo()
        .then(data => {
          this.mobile = data.mobile;
          this.liveness = data.liveness;
          this.realName = data.realName;
          this.userDetails = data.userDetails;
          this.bindbank = data.bindbank;
        })
        .catch(() => {
          wv.closeAndOpen(0);
          wv.closeAndOpen(1);
        });
    },
    goRealName() {
      if (this.realName === 2) {
        wv.closeAndOpen(5);
        return;
      }
      wv.closeAndOpen(5);
      mui.confirm('认证成功了吗', '提示', ['是', '否'], () => {
        this.fetchData();
      });
    },
    goLiveness() {
      if (this.liveness === 2) {
        wv.closeAndOpen(6);
        return;
      }
      wv.closeAndOpen(6);
      mui.confirm('认证成功了吗', '提示', ['是', '否'], () => {
        this.fetchData();
      });
    },
    goUserDetails() {
      if (this.userDetails === 2) {
        wv.closeAndOpen(7);
        return;
      }
      wv.closeAndOpen(7);
      mui.confirm('认证成功了吗', '提示', ['是', '否'], () => {
        this.fetchData();
      });
    },
    goMobile() {
      if (this.mobile === 2) {
        mui.alert('手机认证已经通过了');
        return;
      }
      if (this.mobile === 1) {
        mui.alert('正在认证中，稍后再试');
        return;
      }
      if (this.realName !== 2) {
        mui.toast('请先完成实名认证');
        return;
      }
      if (this.liveness !== 2) {
        mui.toast('请先完成人脸识别');
        return;
      }
      if (this.userDetails !== 2) {
        mui.toast('请先完成个人信息认证');
        return;
      }
      wv.closeAndOpen(8);
      mui.confirm('认证成功了吗', '提示', ['是', '否'], () => {
        this.fetchData();
      });
    },
    borrowWord() {
      const items_name = {
        'realName': '实名认证',
        'liveness': '人脸识别',
        'userDetails': '个人信息认证',
        'mobile': '手机认证'
      };
      for (var i = 0; i < ['realName', 'liveness', 'userDetails', 'mobile']; i++) {
        const status = this[item[i]];
        if (status !== 2) {
          mui.alert('请完成' + items_name[items[i]]);
          return;
        }
      }
      if (this.bindbank === 2) {
        wv.closeAndOpen(0);
      } else {
        this.$router.replace({
          name: 'bank_card_bind'
        });
      }
    }
  }
};
</script>

<style scoped>
  .red {
    color: red;
  }

  .icon {
    width: 0.25rem;
    height: 0.25rem;
    vertical-align: -.15em;
    fill: currentColor;
    overflow: hidden;
    color: #ffb700
  }

  .icon1 {
    vertical-align: -.3em;
    fill: currentColor;
    overflow: hidden;
    color: #9b9b9b;
    width: 0.18rem;
    height: 0.18rem
  }

  .icon1 use {
    font-size: 0.18rem
  }

  body {
    background: #f1f2f7;
    font-size: 15px
  }

  .icon-you {
    font-family: iconfont;
    color: #aeaeae
  }

  .iconfont {
    font-family: iconfont;
    color: #ffb700;
    font-size: 0.21rem
  }

  .certification-list-details {
    float: left;
    margin-left: 0.17rem
  }

  .certification-center-list {
    margin-top: 0.15rem
  }

  .certification-center-list ul li {
    height: 0.75rem;
    background: #fff;
    border-bottom: 1px solid #f1f2f7;
    line-height: 0.75rem
  }

  .certification-list-details p:nth-child(1) {
    font-size: 0.18rem;
    color: #484848
  }

  .certification-list-details p:nth-child(2) {
    font-size: 0.12rem;
    color: #717171
  }

  .certification-safe {
    height: 0.22rem;
    text-align: center;
    line-height: 0.22rem;
    margin: 0.2rem 0 0.17rem
  }

  .certification-safe img {
    width: 0.19rem;
    height: 0.22rem
  }

  .certification-safe span {
    font-size: 0.15rem;
    color: #5597ff;
    margin-left: 0.12rem
  }

  .borrow-btn {
    width: 100%
  }

  .borrow-word {
    width: 3.21rem;
    height: 0.44rem;
    background: #FFDB45;
    box-shadow: 0 0.12rem 0.09rem -0.05rem rgba(255, 219, 69, 0.50);
    border-radius: 0.24rem;
    font-family: PingFangSC-Medium;
    font-size: 0.16rem;
    color: #333333;
    margin: 0.4rem auto 0
  }

  .certification-center-list1 ul {
    height: 0.6rem;
    background: #fff;
    border-bottom: 1px solid #EDEDED;
    padding: 0 0.15rem
  }

  .certification-center-list1 ul p {
    font-weight: 700;
    float: left
  }

  .certification-center-list1 ul li:nth-child(1) {
    float: left;
    margin-top: 0.15rem
  }

  .certification-center-list1 ul li:nth-child(2) {
    float: left;
    line-height: 0.6rem;
    font-size: 0.14rem;
    color: #666
  }

  .certification-center-list1 ul li:nth-child(2) img {
    float: left;
    width: 0.24rem;
    margin-top: 0.18rem;
    margin-right: 0.16rem
  }

  .certification-center-list1 ul li:nth-child(2) p {
    float: left;
    font-size: 0.15rem;
    color: #333;
    margin-bottom: 0
  }

  .certification-center-list1 ul li:nth-child(3) {
    margin-top: 0.2rem;
    float: right
  }

  .certification-state {
    color: #666;
    font-size: 0.12rem;
    float: left;
    height: 0.2rem;
    line-height: 0.2rem
  }

  .invalid {
    color: red;
    display: inline-block;
    margin-top: -.1rem;
    text-align: right;
    font-size: 0.14rem;
    float: left
  }

  .btn-sure {
    width: 1.2rem;
    height: 0.4rem;
    border: 1px solid #ffd466;
    border-radius: 0.2rem;
    margin-bottom: 0.3rem;
    background: #ffd466;
    color: #fff
  }

  .details-modal-body {
    font-size: 0.18rem;
    text-align: center;
    padding: 10% 0
  }

  .modal-footer {
    text-align: center
  }

  .popup {
    height: 100%;
    background: #ccc;
    opacity: 0.6;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
  }

  .details-dialog {
    width: 80%;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    margin: 50% 10%;
    border-radius: 20px
  }

  .modal-content {
    border-radius: 20px
  }

  .vest-li {
    border: 0.02rem solid #ffb700;
    border-radius: 50%;
    width: 0.4rem;
    height: 0.4rem;
    text-align: center;
    line-height: 0.45rem;
    margin-left: -.1rem
  }

  .certification-center-list1 .left-icon {
    width: 0.32rem;
    height: 0.32rem
  }

  .certification-center-title {
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.12rem;
    color: #666;
    letter-spacing: 0;
    padding-left: 0.15rem
  }

  @media screen and (max-width: 320px) {
    .second li:nth-child(1) {
      width: 0.4rem;
      height: 2px;
      float: left;
      margin-top: 0.1rem
    }

    .three li:nth-child(1) {
      width: 0.4rem;
      height: 2px;
      float: left;
      margin-top: 0.1rem
    }

    .four li:nth-child(1) {
      width: 0.4rem;
      height: 2px;
      float: left;
      margin-top: 0.1rem
    }

    .five li:nth-child(1) {
      width: 0.4rem;
      height: 2px;
      float: left;
      margin-top: 0.1rem
    }

    .six li:nth-child(1) {
      width: 0.4rem;
      height: 2px;
      float: left;
      margin-top: 0.1rem
    }

    .certification-center-list1 ul {
      height: 0.6rem;
      background: #fff;
      border-bottom: 1px solid #f1f2f7;
      padding: 0 0.15rem
    }

    .certification-center-list1 ul li:nth-child(1) {
      float: left;
      margin-top: 0.15rem
    }

    .certification-center-list1 ul li:nth-child(2) {
      margin-left: 0.18rem;
      float: left;
      line-height: 0.6rem;
      font-size: 0.14rem;
      color: #666
    }

    .certification-center-list1 ul li:nth-child(3) {
      margin-top: 0.15rem;
      float: right
    }

    .certification-state {
      color: #666;
      font-size: 0.12rem;
      float: left;
      height: 0.2rem;
      line-height: 0.2rem
    }
  }

  .safe {
    position: absolute;
    bottom: 0.33rem;
    font-size: 0.12rem;
    color: #999;
    left: 50%;
    transform: translateX(-50%)
  }

  .fee_question {
    height: 100%;
    margin-left: 0.1rem;
    float: left
  }

  .fee_question img {
    width: 0.2rem
  }

  .hint {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: table;
    z-index: 100
  }

  .hint .list {
    display: table-cell;
    vertical-align: middle
  }

  .hint .list > div {
    width: 72%;
    padding: 0.1rem;
    margin: 0 auto;
    background: white;
    border-radius: 0.02rem;
    box-sizing: border-box
  }

  .hint .list .shou {
    padding: 0.3rem 0.3rem 0
  }

  .hint .list .zhi {
    padding: 0.3rem 0.16rem 0 0.3rem
  }

  .hint .list > div p {
    text-align: center;
    font-size: 0.16rem;
    font-weight: bold;
    color: #333333;
    margin: 0 0 0.2rem
  }

  .hint .list > div ul {
    font-size: 0.15rem
  }

  .hint .list > div ul li {
    font-size: 0.14rem;
    color: #333333;
    margin-bottom: 0.1rem;
    line-height: 0.2rem
  }

  .hint .list > div span {
    font-size: 0.12rem;
    color: #999999
  }

  .hint .list > div button {
    height: 0.5rem;
    width: 100%;
    color: #FFBA1B;
    font-size: 0.18rem;
    border: none;
    border-top: 0.01rem solid #EDEDED;
    margin-top: 0.27rem
  }

  .advanced .title {
    height: 0.32rem;
    line-height: 0.32rem;
    padding-left: 0.16rem;
    margin: 0
  }

  .footer {
    text-align: center;
    font-size: 0.12rem;
    color: #999999;
    margin-top: 0.36rem
  }

  .footer img {
    width: 0.14rem;
    margin-right: 0.08rem
  }
</style>
