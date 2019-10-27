<template>
  <div>
    <ul>
      <li>
        <span>还款金额</span>
        <span>{{repayMoney}}元</span>
      </li>
      <li>
        <span>银行卡号</span>
        <span>{{bankInfo.cardNo}}</span>
      </li>
      <li>
        <span>银行</span>
        <span>{{bankInfo.cardName}}</span>
      </li>
    </ul>
    <div class="bind-card">
      <input type="button" value="确认还款" @click="repay_active"/>
    </div>
    <div id="myModal" style="display:none">
      <img src="~@/assets/img/loading.png">
    </div>
  </div>
</template>

<script>
import { orderRepay } from '@/api/order';
import { getBankInfo } from '@/api/user';

import util from '@/lib/util';

export default {
  name: 'store_order_repay',
  data() {
    return {
      repayNo: this.$route.query.repayNo,
      repayMoney: this.$route.query.repayMoney,
      bankInfo: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBankInfo()
        .then(data => {
          this.bankInfo = data;
        });
    },
    repay_active() {
      orderRepay({
        orderId: this.orderId,
        ...this.bankInfo
      })
        .then(data => {
          if (util.isAndroid) {
            wv.skipPage(1, '/order/store_pay_return');
          } else {
            window.location.href = '/order/store_pay_return';
          }
        });
    }
  }
};
</script>

<style scoped>
  ul {
    margin-top: 0.1rem;
    background: #fff;
    padding: 0 0.16rem
  }

  ul li {
    display: flex;
    height: 0.5rem;
    -webkit-align-items: center;
    align-items: center
  }

  ul li span:first-of-type {
    width: 1rem;
    font-size: 0.14rem;
    color: #666
  }

  ul li span:last-of-type {
    flex: 1;
    font-size: 0.14rem;
    color: #333
  }

  #validateCode {
    margin-bottom: 0.05rem;
    font-size: 0.14rem
  }

  .bind-card {
    margin-top: 0.6rem;
    background: #f5f5f5;
    text-align: center
  }

  .bind-card input {
    width: 3rem;
    height: 0.44rem;
    background: #FFDB45 !important;
    border-radius: 22px !important;
    border: none
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
</style>
