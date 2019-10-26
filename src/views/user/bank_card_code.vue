<template>
  <div>
    <ul>
      <li>
        <span>当前银行卡</span>
        <span>{{data.bankName}}</span>
      </li>
      <li>
        <span>银行</span>
        <span>{{data.cardNo}}</span>
      </li>
      <li>
        <span>开户人</span>
        <span>{{data.userName}}</span>
      </li>
      <li>
        <span>预留手机号</span>
        <span>{{data.userPhone}}</span>
      </li>
      <li>
        <input placeholder="请输入验证码" type="text" v-model='validateCode'/>
      </li>
    </ul>
    <div class="bind-card">
      <input type="button" value="绑定" @click="bind"/>
    </div>
    <div id="myModal" style="display:none">
      <img src="~@/assets/img/loading.png">
    </div>
  </div>
</template>

<script>
import { getBankCardInfo, bankBind } from '@/api/user';

export default {
  name: 'bank_card_code',
  data() {
    return {
      data: {},
      validateCode: ''
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getBankCardInfo()
        .then(data => {
          console.log(data)
          this.data = data;
        });
    },
    bind() {
      if (!this.validateCode) {
        // TODO
        // mui.alert("请输入验证码");
        return false;
      }
      bankBind({
        validateCode: this.validateCode
      })
        .then(data => {
          // TODO 返回首页
          // mui.alert('绑定成功', function(e) {
          //   wv.closeAndOpen(2);
          // })
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
