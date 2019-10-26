<template>
  <div class="wrap">
    <div class="top">
      <p>订单进度</p>
      <!-- 注释，直接动态在ul插入就可以了，css是用选择器写的不用js判断 -->
      <ul class="progress-of-borrow">
        <li v-for='(item, index) in data.processList' :key='index'>
          <div class='clearfix'>
            <span></span>
            <p>{{item.event}}</p>
            <p>{{item.eventTime}}</p>
          </div>
          <p>{{item.eventDescribe}}</p>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <p>订单明细</p>
      <ul class="loan-details">
        <li>
          <span>到账金额</span>
          <span>{{data.actualMoney}}</span>
        </li>
        <li>
          <span>服务费用</span>
          <span>{{data.borrowDay}}天，{{data.totalFee}}元</span>
        </li>
        <li class="overdueFee" v-if='data.overdueDay !== 0'>
          <span>逾期费</span>
          <span>{{data.overdueDay}}天，{{data.overdueFee}}元</span>
        </li>
        <li class="reduceMoney" v-if='data.reduceMoney !== 0'>
          <span>减免金额</span>
          <span>{{data.reduceMoney}}元</span>
        </li>
        <li>
          <span>还款总额</span>
          <span>{{data.shouldRepay}}元</span>
        </li>
        <li>
          <span>收款银行</span>
          <span>{{data.cardNo}}</span>
        </li>
        <li>
          <span>还款日期</span>
          <span>{{data.repayTime}}</span>
        </li>
      </ul>
    </div>
    <input type="hidden" id="data_orderId"/>
    <div class="btn-wrap" v-if='data.status === 1'>
      <button class="immediate-repayment" @click='repayment'>立即还款</button>
    </div>
    <div id="myModal" style="display:none">
      <img src="~@/assets/img/loading.png">
    </div>
  </div>
</template>

<script>
import wv from '@/lib/bridge';
import { getOrderDetail } from '@/api/order';

export default {
  name: 'store_order_detail',
  data() {
    return {
      orderId: this.$route.query.orderId,
      data: {}
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getOrderDetail({
        orderId: this.orderId
      })
        .then((res) => {
          this.data = res
        });
    },
    repayment () {
      // TODO
      skipPage(0, webDomain + 'order/store_select_by.html?repayMoney=' + shouldRepay + '&orderId=' + orderId);
      mui.confirm('还款成功了吗？', '提示', ["是", "否"], function(e) {
        this.fetchData()
        // if(e.index === 0) {
        //   initial();
        // } else {
        //   initial();
        // };
      });
    }
  }
};
</script>

<style scoped>
  .bottom, .top {
    background: #fff;
    padding: 0 0.16rem
  }

  .bottom p, .top {
    font-size: 0.14rem;
    line-height: 0.35rem;
    color: #5F5F5F;
    font-weight: bolder
  }

  .bottom {
    margin-top: 0.1rem;
    padding-bottom: 0.1rem
  }

  .progress-of-borrow li {
    margin-left: 0.05rem;
    border-left: 4px solid #DDD
  }

  .progress-of-borrow li > div {
    position: relative
  }

  .progress-of-borrow li > div > span {
    position: absolute;
    background: #D8D8D8;
    border-radius: 100px;
    left: -0.09rem;
    width: 0.14rem;
    height: 0.14rem
  }

  .progress-of-borrow li:last-of-type > div > span {
    background: #7ED321
  }

  .progress-of-borrow li:last-of-type {
    padding-left: 0.04rem;
    border: none
  }

  .progress-of-borrow li > p {
    line-height: 0.16rem;
    font-size: 0.11rem;
    padding-left: 0.21rem;
    padding-top: 0.05rem;
    padding-bottom: 0.2rem;
    color: #C4C4C4;
    margin-bottom: 0
  }

  .progress-of-borrow li div p:first-of-type {
    float: left;
    font-size: 0.14rem;
    color: #717171;
    line-height: 0.2rem;
    padding-left: 0.21rem
  }

  .progress-of-borrow li div p:last-of-type {
    float: right;
    font-size: 12px;
    color: #C4C4C4;
    line-height: 0.2rem
  }

  .progress-of-borrow li:last-of-type div p:first-of-type {
    color: #333
  }

  .loan-details li {
    height: 0.38rem;
    line-height: 0.38rem
  }

  .loan-details li span:first-of-type {
    float: left;
    font-size: 0.14rem;
    color: #999
  }

  .loan-details li span:last-of-type {
    float: right;
    font-size: 0.14rem;
    color: #333
  }

  .loan-details li span:last-of-type a {
    font-size: 0.12rem;
    color: #4A90E2
  }

  .wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
  }

  .immediate-repayment {
    display: block;
    margin: 0 auto;
    width: 3rem;
    height: 0.44rem;
    line-height: 0.44rem;
    padding: 0;
    background: #FFDB45;
    border-radius: 0.22rem;
    outline: 0;
    border: none;
    font-size: 0.15rem;
    color: #333
  }

  .btn-wrap {
    margin: 0.1rem auto
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
