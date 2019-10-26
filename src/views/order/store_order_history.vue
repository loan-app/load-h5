<template>
  <ul class="ul-wrap" v-if='orderList.length'>
    <li @click='goDetail(item)' :key=index v-for='(item, index) in orderList'>
      <div>
        <p>{{item.borrowMoney}}元</p>
        <p>{{item.strCreateTime}}</p>
      </div>
      <div>
        <p>{{item.statusDesc}}</p>
        <img src="~@/assets/img/help_center_enter.png">
      </div>
    </li>
  </ul>
  <div class="wujilu" v-else>
    <div>
      <img src="~@/assets/img/pic_norecording@2x.png"/>
      <p class="p1">暂无借款记录</p>
      <button class="but" @click='goBorrow'>去借钱</button>
      <p class="p2">目前已有50000+人在这里成功借款</p>
    </div>
  </div>
</template>

<script>
import wv from '@/lib/bridge';
import { getOrderList } from '@/api/order';

const device = wv.getDevice();
const Device = device.split('|')[0];
export default {
  name: 'store_order_history',
  data() {
    return {
      orderList: []
    };
  },
  created() {
    this.order_history();
  },
  methods: {
    order_history() {
      getOrderList()
        .then((data) => {
          this.orderList = data;
        });
    },
    goDetail(item) {
      const { orderId } = item;
      // TODO
      wv.skipPage(0, webDomain() + 'order/store_order_detail.html?orderId=' + orderId);
    },
    goBorrow() {
      if (Device === 'keleguan') {
        wv.closeAndOpen(0);
        // TODO
        window.location.href = '../store_borrowing.html';
      } else {
        wv.closeAndOpen(2); //去首页
      }
    }
  }
};
</script>

<style scoped>
  .ul-wrap {
    margin-top: 0.1rem;
    width: 100%;
    background: #fff
  }

  .ul-wrap li {
    display: flex;
    height: 0.54rem;
    border-bottom: 1px solid #bdbdbd;
    padding: 0.1rem 0.16rem 0.06rem 0.2rem
  }

  .ul-wrap li div {
    display: flex;
    flex: 1;
    flex-direction: column
  }

  .ul-wrap li div p {
    display: flex;
    flex: 1;
    align-items: center;
    line-height: 0;
    margin: 0
  }

  .ul-wrap li div:first-of-type p:first-of-type {
    font-size: 0.14rem;
    color: #666
  }

  .ul-wrap li div:first-of-type p:nth-of-type(2) {
    font-size: 0.12rem;
    color: #999
  }

  .ul-wrap li div:last-of-type {
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-align-items: center;
    align-items: center
  }

  .ul-wrap li div:last-of-type p {
    font-size: 0.12rem;
    color: #999;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    padding-right: 0.1rem
  }

  .ul-wrap li div:last-of-type img {
    width: 0.08rem
  }

  .out-of-date {
    color: #EA3333 !important
  }

  .wujilu {
    width: 100%;
    height: 100%;
    display: table
  }

  .wujilu div {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  .wujilu div img {
    width: 0.88rem;
    height: 0.88rem;
    display: inline-block;
  }

  .wujilu div .p1 {
    font-size: 0.16rem;
    color: #333333;
    text-align: center;
    margin-bottom: 0.5rem
  }

  .wujilu div .p2 {
    font-size: 0.12rem;
    text-align: center;
    color: #999999;
    margin-top: 0.13rem
  }

  .wujilu div .but {
    width: 3rem;
    height: 0.45rem;
    background-image: linear-gradient(3deg, #F75600 0%, #FFA308 100%);
    box-shadow: 0 3px 8px 0 rgba(255, 79, 0, 0.40);
    font-size: 0.15rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    border-radius: 0.5rem;
    border-width: 0;
    appearance: none;
    outline: medium;
    margin-top: 0.5rem
  }
</style>
