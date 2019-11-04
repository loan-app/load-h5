<template>
  <div>
    <div class="credit-card">
      <div class="credit-card-confirm">添加您的银行卡用于收款、还款</div>
      <div class="credit-card-list">
        <ul class="clearfix">
          <li class="clearfix">
            <label>持卡人</label>
            <span class="credit-card-input input1" style="line-height: 0.44rem;">{{bankUserName}}</span>
          </li>
          <li class="clearfix">
            <label>卡号</label>
            <input required class="credit-card-input input3" @blur='cardInput'
                   type="number"
                   v-model='cardNo' maxlength="19"
                   placeholder="请输入银行卡号"/>
          </li>
          <li class="select-idcard clearfix">
            <label>银行<img src="~@/assets/img/ic_info.png" @click='isShowBankList = true'></label>
            <div class="bank-select1" style="width:90%">{{bankName}}</div>
          </li>
          <div class="bank_error">{{bankError}}</div>
          <li class="clearfix">
            <label>手机号</label>
            <input required class="credit-card-input input4" v-model='cardPhone'
                   type="tel" maxlength="11"
                   placeholder="请输入银行预留手机号"/>
          </li>
        </ul>
      </div>

      <div class="credit-card-next" style="text-align:center;">
        <input type="submit" @click='creditCardNext' class="credit-card-next-btn"
               value="下一步">
      </div>
    </div>
    <div id="myModal" v-show='showLoading'>
      <img src="~@/assets/img/loading.png">
    </div>
    <div class="modal" id="loadingModal" style="display: none">
      <div class="popup"><img class="photo" src="~@/assets/img/loading.png" alt=""></div>
    </div>
    <div class="bank" @click='isShowBankList = false'
         v-if='bankList.length && isShowBankList'>
      <div class="list">
        <div>
          <p>支持银行如下：</p>
          <ul>
            <li v-for='(item, index) in bankList' :key='index'>{{item.bankName}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBankUserName, getBankCardCode, getBankName, getBankList } from '@/api/user';
import wv from '@/lib/bridge';

export default {
  name: 'bank_card',
  data() {
    return {
      cardPhone: '',
      cardNo: '',
      bankUserName: '',
      bankError: '',
      bankName: '',
      bankList: [],
      isShowBankList: false,
      showLoading: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBankUserName()
        .then(data => {
          this.bankUserName = data.name;
        })
        .catch(() => {});

      getBankList()
        .then(data => {
          this.bankList = data;
        })
        .catch(() => {});
    },
    creditCardNext() {
      if (!/^(\+\d+)?1[3456789]\d{9}$/.test(this.cardPhone)) {
        mui.toast('请输入正确的手机号码');
        return false;
      }
      if (this.bankError) {
        mui.toast('请输入正确的银行卡号');
        return false;
      }
      this.showLoading = true;
      getBankCardCode({
        cardNo: this.cardNo,
        cardPhone: this.cardPhone
      })
        .then(() => {
          this.showLoading = false;
          this.$router.replace({
            name: 'bank_card_code'
          });
        })
        .catch(() => {
          this.showLoading = false;
        });
    },
    cardInput() {
      if (/^\d{16,19}$/.test(this.cardNo)) {
        getBankName({
          cardNo: this.cardNo
        })
          .then(data => {
            this.bankName = data;
            this.bankError = '';
          })
          .catch((data) => {
            this.bankError = data.msg;
          });
      } else {
        this.bankError = '请输入正确的银行卡号';
      }
    }
  }
};
</script>

<style scoped>
  .icon1 {
    vertical-align: -.15em;
    fill: currentColor;
    overflow: hidden;
    color: #9b9b9b;
    width: 0.18rem;
    height: 0.18rem
  }

  .iconfont {
    float: right
  }

  body {
    background: #f1f2f7;
    font-size: 15px
  }

  .credit-card-confirm {
    height: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.12rem;
    padding-left: 0.16rem;
    color: #666
  }

  .credit-card-list ul li {
    height: 0.44rem;
    background: #fff;
    line-height: 0.44rem;
    padding: 0 0.15rem;
    position: relative;
    border-bottom: 1px solid #E6EDF5;
    box-sizing: content-box
  }

  .credit-card-list ul li .bank-clear {
    position: absolute;
    right: 0.15rem;
    top: 0.12rem;
    width: 0.2rem;
    font-size: 0.2rem;
    height: 0.2rem;
    color: #666;
    text-align: center;
    line-height: 0.2rem;
    display: inline-block;
  }

  .credit-card-list ul li label {
    display: block;
    width: 0.6rem;
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.14rem;
    color: #666;
    float: left
  }

  .credit-card-input {
    height: 0.44rem;
    line-height: 0.2rem;
    padding-left: 0.06rem;
    font-size: 0.14rem;
    border: none;
    width: 75%;
    float: left;
    margin-bottom: 0;
  }

  .credit-card-input::-webkit-input-placeholder {
    color: #999
  }

  .select-card {
    height: 0.5rem;
    float: left;
    color: #717171
  }

  .credit-card-next {
    width: 100%;
    margin-top: 0.81rem
  }

  .credit-card-next-btn {
    width: 3.21rem;
    height: 0.45rem;
    font-size: 0.16rem;
    /*color: #9A9A9A;*/
    text-align: center;
    line-height: 0.38rem;
    background: #FFDB45;
    border-radius: 1rem;
    border: none;
    margin: 0 auto
  }

  .credit-safe {
    text-align: center;
    line-height: 0.38rem;
    font-size: 0.12rem;
    color: #666
  }

  .credit-change {
    background: #ffb700
  }

  .bank_error {
    color: red;
    padding-left: 0.15rem;
    font-size: 0.12rem;
    line-height: 0.2rem
  }

  #bankList, .mbsc-control-ev {
    border: none;
    padding-left: 0.06rem;
    outline: medium;
    height: 0.4rem
  }

  .bank-select {
    float: left;
    color: #717171;
    font-size: 0.18rem
  }

  #bank_list {
    color: #999;
    width: 73.25%;
    font-size: 0.14rem
  }

  .mbsc-sc-whl-w {
    width: 100%
  }

  .tishi {
    width: 3.21rem;
    margin-left: 0.3rem;
    margin-top: 0.2rem;
    font-size: 0.15rem;
    color: #333333
  }

  #loadingModal {
    z-index: 1000
  }

  #loadingModal .popup {
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

  #loadingModal img {
    display: block;
    margin: 60% auto;
    -webkit-transform: rotate(360deg);
    animation: rotation360 2s linear infinite;
    -moz-animation: rotation360 2s linear infinite;
    -webkit-animation: rotation360 2s linear infinite;
    -o-animation: rotation360 2s linear infinite
  }

  @-webkit-keyframes rotation360 {
    from {
      -webkit-transform: rotate(0)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

  #myModal {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
    z-index: 900
  }

  #myModal img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    margin: auto;
    -webkit-transform: rotate(360deg);
    animation: rotation360 2s linear infinite;
    -moz-animation: rotation360 2s linear infinite;
    -webkit-animation: rotation360 2s linear infinite;
    -o-animation: rotation360 2s linear infinite
  }

  .select-idcard img {
    display: inline-block;
    width: 0.2rem;
    margin-left: 0.08rem
  }

  .bank-select1 {
    height: 100%;
    margin-left: 0.6rem;
    padding-left: 0.06rem;
  }

  .bank {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: table
  }

  .bank .list {
    display: table-cell;
    vertical-align: middle
  }

  .bank .list > div {
    width: 90%;
    margin: 0 auto;
    background: white;
    border-radius: 0.1rem;
    box-sizing: border-box;
    padding: 0.1rem
  }

  .bank .list > div p {
    font-size: 0.16rem;
    font-weight: bold;
    color: #333333;
    margin-top: 0.05rem
  }

  .bank .list > div ul {
    zoom: 1;
    height: 2.5rem;
    overflow: auto;
    margin-top: 0.15rem
  }

  .bank .list > div ul:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both
  }

  .bank .list > div ul li {
    width: 31%;
    border: 1px solid #CCCCCC;
    border-radius: 0.05rem;
    float: left;
    color: #000000;
    padding: 0.08rem;
    text-align: center;
    margin-left: 0.05rem;
    margin-bottom: 0.1rem
  }
</style>
