<template>
  <div>
    <div class="borrow-details">
      <div class="borrow-content clearfix">
        <ul>
          <li>
            <span>借款金额</span>
            <span>{{data.productMoney}}元</span>
          </li>
        </ul>
        <ul>
          <li>
            <span>借款期限</span>
            <span>{{data.productDay}}</span>
          </li>
        </ul>
        <ul>
          <li>
            <span id="">综合费用</span>
            <span>{{data.totalFee}}元</span>
          </li>
        </ul>
        <ul>
          <li>
            <span>到账金额<img src="~@/assets/img/ic_info.png"
                           @click='isShowDesc = true'></span>
            <span>{{data.actualMoney}}元</span>
          </li>
        </ul>
        <ul>
          <li>
            <span>收款账户</span>
            <span id="cardNo">{{data.cardName}} {{data.cardNo}}</span>
          </li>
        </ul>
      </div>
      <div class="borrow-btn">
        <div class="borrow-word" @click="apply()">
          申请下单
        </div>
      </div>
    </div>

    <!-- 提交的loading -->
    <div class="modal" id="myModal3" style="display:none;">
      <div class="popup"><img class="photo" src="～@/assets/img/loading.png"/></div>
    </div>
    <!-- 回购价描述 -->
    <div class="modal" v-if='isShowDesc'>
      <div class="popup"></div>
      <div class="details-dialog1">
        <div class="modal-content">
          <div class="details-modal-body fee-msg">
            到账金额 = 借款金额 - 综合费用
          </div>
          <div class="modal-footer">
            <p style="margin-bottom: 0;" @click='isShowDesc = false'>知道了</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderConfirm, orderSubmit } from '@/api/order';
import util from '@/lib/util';
import wv from '@/lib/bridge';

export default {
  name: 'store_order_apply',
  data() {
    return {
      data: {},
      isShowDesc: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      orderConfirm()
        .then(data => {
          this.data = data;
        });
    },
    apply() {
      const deviceMes = wv.getDevice();
      const arr = deviceMes.split('|'); //截取原生字段
      orderSubmit({
        productId: this.data.productId,
        productDay: this.data.productDay,
        productMoney: this.data.productMoney,
        paramValue: '',
        phoneModel: arr[1],
        phoneMemory: arr[2],
        phoneType: util.isIos ? 'ios' : 'android'
      })
        .then(data => {
          window.mui.alert("提单成功", "提示", function() {
            try {
              wv.closeAndOpen(0);
            } catch(e) {
            }
          });
        });
    }
  }

};
</script>

<style scoped>
  body {
    font-size: 15px;
    background: #f2f2f2
  }

  .check-head {
    height: 0.64rem;
    width: 100%;
    background: #ffb700
  }

  .check-head img {
    width: 0.14rem;
    height: 0.22rem;
    float: left;
    margin-top: 0.31rem;
    margin-left: 0.15rem
  }

  .check-title {
    font-size: 22px;
    color: #fff;
    float: left;
    margin-top: 0.31rem;
    margin-left: 1.16rem
  }

  .ic-phone {
    position: absolute;
    right: 0;
    width: 0.3rem;
    top: 0.07rem
  }

  .borrow-content ul {
    padding: 0 0.15rem;
    height: 0.44rem;
    border-bottom: 1px solid #f5f5f5;
    line-height: 0.44rem;
    background: #fff
  }

  .borrow-content ul li i {
    display: inline-block;
    width: 0.16rem;
    height: 0.16rem;
    text-align: center;
    line-height: 0.16rem;
    border: 0.01rem solid #999;
    color: #999;
    border-radius: 50%;
    font-size: 0.12rem;
    float: left;
    margin: 0.21rem 0 0 0.05rem
  }

  .borrow-content ul li span {
    font-size: 0.14rem;
    color: #666
  }

  .borrow-content ul li span:nth-of-type(1) {
    float: left
  }

  .borrow-content ul li span:last-of-type {
    float: right;
    text-align: right
  }

  .borrow-content ul li .couponIcon {
    display: inline-block;
    line-height: 0.18rem;
    text-align: center;
    width: 0.18rem;
    height: 0.18rem;
    color: #fff;
    border-radius: 0.03rem;
    background: #ff7206;
    font-size: 0.12rem;
    float: left;
    margin: 0.2rem 0 0 0.1rem
  }

  .borrow-content ul li svg {
    width: 0.14rem;
    height: 0.14rem;
    display: inline-block;
    margin-top: 0.22rem
  }

  .borrow-content ul:nth-of-type(5), ul:last-of-type {
    position: relative
  }

  .borrow-content ul li img {
    width: 0.2rem;
    margin-left: 0.06rem;
    display: inline-block;
  }

  .total-fee-detail {
    background: #fff;
    padding-left: 0.16rem
  }

  .total-fee-detail p {
    font-size: 0.12rem;
    color: #BFBFBF;
    line-height: 0.28rem
  }

  .total-fee-detail p span {
    float: right;
    padding-right: 0.16rem
  }

  .countdown {
    width: 92%;
    margin: 0.15rem auto 0
  }

  .countdown-content {
    color: #a1a6bb
  }

  .countdown-money, .countdown-time {
    color: #ffb700
  }

  .borrow-btn {
    width: 100%;
    margin-top: 0.9rem;
    margin-bottom: 0.06rem
  }

  .borrow-word {
    width: 3.21rem;
    height: 0.45rem;
    font-size: 0.16rem;
    color: #333333;
    background: #FFDB45;
    box-shadow: 0 0.12rem 0.09rem -0.05rem rgba(255, 219, 69, 0.50);
    border-radius: 0.24rem;
    text-align: center;
    line-height: 0.45rem;
    margin: 0 auto
  }

  .resister {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.15rem
  }

  .resister input {
    width: 0.13rem;
    height: 0.13rem;
    float: left
  }

  .resister p {
    margin: 0;
    font-size: 12px
  }

  .resister span {
    color: blue
  }

  .borrow-checked {
    visibility: hidden;
    position: absolute
  }

  .check-box {
    position: absolute;
    top: 50%;
    transform: translateY(-50%)
  }

  .borrow-check {
    position: relative;
    width: 3.21rem;
    height: 0.35rem;
    margin: 0 auto
  }

  .read-agreement {
    height: 0.35rem;
    float: left;
    font-size: 12px;
    margin-left: 0.2rem;
    line-height: 0.35rem
  }

  .read-agreement a {
    color: #4690ff
  }

  .check-box span {
    position: relative
  }

  .check-box .input_check {
    position: absolute;
    visibility: hidden
  }

  .check-box .input_check + label {
    display: inline-block;
    width: 0.15rem;
    height: 0.15rem;
    border: 1px solid #4690ff
  }

  .check-box .input_check:checked + label:after {
    content: "";
    position: absolute;
    left: 0.03rem;
    top: 0.04rem;
    width: 0.09rem;
    height: 0.04rem;
    border: 1px solid #4690ff;
    border-top-color: transparent;
    border-right-color: transparent;
    -ms-transform: rotate(-60deg);
    -moz-transform: rotate(-60deg);
    -webkit-transform: rotate(-60deg);
    transform: rotate(-45deg)
  }

  .modal-footer {
    text-align: center
  }

  .modal-footer p {
    width: 100%;
    border-top: 0.01rem solid #ccc;
    height: 0.5rem;
    line-height: 0.5rem;
    color: #333;
    font-family: '微软雅黑 Bold', '微软雅黑';
    font-weight: 700;
    font-style: normal;
    text-align: center
  }

  .apply-success-title {
    float: left;
    margin-left: 1.1rem
  }

  .btn-sure {
    width: 1.2rem;
    height: 0.4rem;
    background: #fff;
    border: 1px solid #ffd466;
    border-radius: 0.2rem;
    margin-bottom: 0.3rem
  }

  .btn-sure1 {
    width: 1.2rem;
    height: 0.4rem;
    background: #fff;
    border: 1px solid #ffd466;
    border-radius: 0.2rem;
    margin-bottom: 0.3rem
  }

  .modal {
    z-index: 1000
  }

  .details-modal-header {
    text-align: center;
    margin-top: 0.35rem;
    height: 0.35rem
  }

  .details-modal-header-box {
    width: 1.55rem;
    height: 0.35rem;
    margin: 0 auto
  }

  .details-modal-header .details-modal-header-box img {
    width: 0.305rem;
    height: 0.305rem;
    float: left
  }

  .details-modal-body {
    text-align: center;
    font-size: 15px
  }

  .details-dialog {
    position: relative;
    margin: 50% 7%
  }

  .popup {
    height: 100%;
    background: #000;
    opacity: 0.6;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000
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

  .details-modal-body {
    padding-bottom: 0.15rem;
    font-size: 0.16rem;
    color: #666;
    line-height: 0.36rem
  }

  .modal-footer {
    text-align: center
  }

  .details-dialog1 {
    width: 70%;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    margin: 50% 15%;
    border-radius: 10px;
    z-index: 1001
  }

  .details-modal-header1 {
    text-align: center;
    color: #666;
    padding-top: 0.25rem
  }

  .details-modal-header1 svg {
    width: 0.4rem;
    height: 0.4rem
  }

  .commit-success {
    font-size: 0.16rem;
    color: #666;
    line-height: 0.36rem
  }

  .details-modal-body {
    text-align: center
  }

  .details-modal-body1 {
    text-align: center;
    font-size: 0.14rem;
    color: #999;
    padding-bottom: 0.2rem
  }

  .details-box {
    width: 2.3rem;
    height: 2.5rem;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    margin: 50% 20%;
    border-radius: 0.1rem
  }

  .details-box .borrow-success {
    width: 100%;
    height: 0.91rem
  }

  .details-box .details-text {
    font-size: 0.14rem;
    color: #666;
    letter-spacing: 0;
    line-height: 0.21rem;
    text-align: justify;
    padding: 0.2rem 0.13rem
  }

  .details-box .details-btn {
    width: 2rem;
    height: 0.4rem;
    /*background: url("~@/assets/img/btn_evaluate@3x.png") no-repeat center center;*/
    background-size: 100% 100%;
    border: none;
    margin-left: 0.15rem
  }

  .details-box .borrow-hide {
    height: 0.73rem;
    width: 0.32rem;
    position: absolute;
    top: -.67rem;
    right: 0
  }

  .agreement-model {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6);
    display: none
  }

  .agreement-box {
    width: 100%;
    height: auto;
    position: fixed;
    left: 0;
    bottom: 0;
    display: none
  }

  .agreement-box a {
    display: block;
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    border-top: 0.01rem solid #F1F1F1;
    color: #4690ff;
    background: #FFF;
    text-align: center;
    cursor: pointer
  }

  .agreement-box a:last-of-type {
    color: #999;
    border-top: 0.1rem solid #f1ecec
  }

  .down-arrow {
    transform: rotate(90deg);
    transition: 0.5s
  }

  @-webkit-keyframes rotation360 {
    from {
      -webkit-transform: rotate(0)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

  #myModal3 img {
    display: block;
    margin: 60% auto;
    -webkit-transform: rotate(360deg);
    animation: rotation360 2s linear infinite;
    -moz-animation: rotation360 2s linear infinite;
    -webkit-animation: rotation360 2s linear infinite;
    -o-animation: rotation360 2s linear infinite
  }

  .borrow-company {
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    color: #999;
    font-size: 0.14rem;
    text-align: center
  }

  #myModal5 .details-box {
    width: 2.53rem;
    height: 2.44rem;
    background: white;
    border: none;
    border-radius: 0
  }

  #myModal5 .details-box .details-top {
    width: 2.53rem;
    height: 0.9rem;
    background: rgb(216, 171, 93);
    padding-top: 0.2rem
  }

  #myModal5 .details-box .details-top img {
    display: block;
    margin: 0 auto;
    width: 0.4rem;
    height: 0.36rem
  }

  #myModal5 .details-box .details-top p {
    font-size: 0.14rem;
    color: #FFFFFF;
    line-height: 0.34rem;
    text-align: center
  }

  #myModal5 .details-box .details-bottom {
    width: 100%;
    height: 1.54rem;
    padding-top: 0.26rem;
    text-align: center
  }

  #myModal5 .details-box .details-bottom p {
    line-height: 0.22rem;
    font-size: 0.13rem;
    color: #333
  }

  #myModal5 .details-box .details-bottom p .reject-day {
    font-size: 0.2rem;
    color: #D8AB5D
  }

  #myModal5 .details-box .details-bottom .know-about {
    width: 1.24rem;
    height: 0.36rem;
    background: rgb(216, 171, 93);
    margin: 0.2rem auto 0;
    line-height: 0.36rem;
    color: white;
    font-size: 0.13rem;
    text-align: center;
    border-radius: 1rem
  }

  .fee-msg {
    font-size: 0.14rem;
    line-height: 0.22rem;
    color: #333;
    text-align: left;
    padding: 0.18rem 0.22rem 0.14rem
  }

  #actualMoney {
    color: red
  }

  #cardNo {
    font-weight: bold
  }
</style>
