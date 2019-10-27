<template>
  <div class="my-bankcard">
    <div class="my-bankcard-confirm">添加您的银行卡用于收款、还款</div>
    <div class="my-bankcard-list">
      <ul class="clearfix">
        <li class="clearfix">
          <label>所属银行</label>
          <div class="bank-select1">{{data.cardName}}</div>
        </li>
        <li class="clearfix">
          <label>银行卡号</label>
          <div class="my-bankcard-input input3">{{data.cardNo}}</div>
        </li>
        <li class="clearfix">
          <label>手机号</label>
          <div class="my-bankcard-input input4">{{data.cardPhone}}</div>
        </li>
      </ul>
    </div>
    <div class="my-bankcard-next" v-if='data.status === 1'>
      <input type="button" value="重新绑卡" @click='reBindCard' class="my-bankcard-next-btn bankcard_success"
             style="background:#ffb700;">
    </div>
  </div>
</template>

<script>
import { getBankInfo } from '@/api/user';

export default {
  name: 'bank_card',
  data() {
    return {
      data: {}
    };
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getBankInfo()
        .then(data => {
          this.data = data;
        });
    },
    reBindCard () {
      // TODO
      skipPage(1, domain + "/user/bank_card_bind.html");
    }
  }
};
</script>

<style scoped>
  .my-bankcard-confirm {
    height: 0.43rem;
    font-size: 0.12rem;
    line-height: 0.43rem;
    padding-left: 0.15rem;
    color: #717171
  }

  .my-bankcard-list ul li {
    height: 0.6rem;
    background: #fff;
    line-height: 0.6rem;
    padding: 0 0.15rem;
    border: 1px solid #f1f2f7
  }

  .my-bankcard-list ul li label {
    width: 1rem;
    height: 0.5rem;
    float: left;
    color: #484848
  }

  .my-bankcard-input {
    height: 0.5rem;
    line-height: 0.5rem;
    margin-top: 0.05rem;
    border: none;
    width: 60%;
    float: left
  }

  .my-bankcard-next {
    width: 100%;
    margin-top: 1.33rem;
    text-align: center
  }

  .my-bankcard-next-btn {
    width: 3.21rem;
    height: 0.45rem;
    color: #fff;
    border-radius: 0.22rem;
    text-align: center;
    line-height: 0.38rem;
    font-size: 18px;
    margin: 0 auto;
    border: none
  }

  .my-bankcard-prompt {
    padding: 0 0.28rem;
    color: #717171;
    line-height: 0.2rem;
    margin-top: 0.21rem
  }

  .my-bankcard-prompt p {
    font-size: 0.12rem
  }

  .my-bankcard-safe {
    height: 0.22rem;
    text-align: center;
    line-height: 0.22rem;
    margin-top: 0.1rem
  }

  .my-bankcard-safe img {
    width: 0.19rem;
    height: 0.22rem
  }

  .my-bankcard-safe span {
    font-size: 0.15rem;
    color: #5597ff;
    margin-left: 0.12rem
  }

  #demo9, .mbsc-control-ev {
    border: none;
    outline: medium;
    height: 0.4rem
  }

  .bank-select {
    color: #717171;
    font-size: 0.18rem
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
    right: 0;
    bottom: 0
  }

  .details-dialog, .popup {
    position: fixed;
    top: 0;
    left: 0
  }

  .details-dialog {
    width: 60%;
    background: #fff;
    margin: 50% 20%
  }

  .details-dialog, .modal-content {
    border-radius: 20px
  }

  @media screen and (max-width: 320px) {
    .my-bankcard-safe {
      height: 0.22rem;
      text-align: center;
      line-height: 0.22rem;
      margin-top: 1rem
    }
  }
</style>
