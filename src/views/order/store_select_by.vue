<template>
  <div class="body">
    <div class="header display">
      <span>还款总额</span>
      <span class="red">{{repayMoney}}元</span>
    </div>
    <div class="centent">
      <p>选择付款方式</p>
      <li class="helibao" style="display: none;">
        <lable onclick="alert(0)">绑卡支付<img src="../static/img/ic_info.png"
                                           id="fee_question"></lable>
        <span class="redio"></span>
      </li>
      <li class="fuyou" style="display: none;">
        <lable onclick="alert(1)">快捷支付<img src="../static/img/ic_info.png"
                                           id="fee_question"></lable>
        <span class="redio"></span>
      </li>
      <li class="huiju" style="display: none;">
        <lable onclick="alert(2)">快捷支付2<img src="../static/img/ic_info.png"
                                            id="fee_question"></lable>
        <span class="redio"></span>
      </li>
    </div>
    <div class="enter">
      <button onclick="go_pay(this)">去付款</button>
    </div>
  </div>
  <div class="alert display" style="display: none;">
    <div>
      <p class="title"></p>
      <p class="content"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'store_select_by',
  data() {
    return {
      orderId: this.$route.query.orderId,
      repayMoney: this.$route.query.repayMoney,
      data: {}
    };
  },
};
</script>

<style scoped>
  .display {
    display: flex
  }

  .header {
    width: 100%;
    height: 0.45rem;
    background: white;
    padding: 0 0.16rem;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center
  }

  .header .red {
    color: red;
    font-weight: bold
  }

  .centent p {
    width: 100%;
    height: 0.3rem;
    padding-left: 0.16rem;
    line-height: 0.3rem;
    margin-bottom: 0
  }

  .centent li {
    width: 100%;
    height: 0.48rem;
    background: white;
    padding: 0 0.16rem;
    box-sizing: border-box;
    border-top: 1px solid #E4E4E4;
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .centent li img {
    width: 0.2rem;
    margin-left: 0.05rem
  }

  .centent li span {
    display: block;
    width: 0.18rem;
    height: 0.18rem;
    background: url("~@/assets/img/red_normal.png") no-repeat;
    background-size: 100% 100%
  }

  .centent li .bg_img {
    background: url("~@/assets/img/red_selected.png") no-repeat;
    background-size: 100% 100%
  }

  .alert {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    justify-content: space-between;
    align-items: center
  }

  .alert div {
    width: 90%;
    margin: 0 auto;
    border-radius: 0.2rem;
    background: white;
    padding: 0.1rem 0.16rem
  }

  .alert div .title {
    font-size: 0.16rem;
    font-weight: bold;
    color: black;
  }

  .alert div .content {
    text-align: center
  }

  .enter {
    width: 100%;
    text-align: center;
    margin-top: 1rem
  }

  .enter button {
    width: 3rem;
    height: 0.45rem;
    background: #FFDB45;
    border-radius: 0.2rem;
    color: #333;
    font-size: 0.16rem;
    border: none;
    outline: none
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
    animation: rotation360 2s linear infinite;
  }
</style>
