<template>
  <div class="wrap">
    <img src='~@/assets/img/pic_complete.png' class="ok-img">
    <p>恭喜您，还款成功！</p>
    <button class="continue-repayment" onclick="choose(1)">继续下单</button>
    <button class="check-order-detail" onclick="choose(2)">查看详情</button>
  </div>
</template>

<script>
import wv from '@/lib/bridge';

export default {
  name: 'store_pay_return',
  data() {
    return {};
  },
  created() {
    wv.viewSetup(0, 0, '支付结果', 0);
  },
  methods: {
    choose(value) {
      if (value === 1) {
        wv.closeAndOpen(2);
      } else {
        wv.closeAndOpen(0);
      }
    }
  }
};
</script>

<style scoped>
  .wrap {
    text-align: center;
    padding-top: 0.72rem
  }

  .ok-img {
    width: 0.88rem;
    margin: 0 auto
  }

  .wrap p {
    line-height: 0.2rem;
    font-size: 0.16rem;
    padding-top: 0.16rem;
    color: #333
  }

  .wrap button {
    display: block;
    width: 3rem;
    line-height: 0.44rem;
    border-radius: 0.22rem;
    border: none;
    outline: none;
    font-size: 0.15rem;
    color: #333;
    margin: 0 auto
  }

  .wrap button:nth-of-type(1) {
    background: #FFDB45;
    margin-top: 0.81rem;
    margin-bottom: 0.2rem
  }

  .wrap button:nth-of-type(2) {
    background: #fff
  }
</style>
