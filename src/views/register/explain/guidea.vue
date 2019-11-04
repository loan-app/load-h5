<template>
  <div class="guide">
    <div class="header">
      <span @click="back"><i></i>返回</span>
      <span class="span">ios下载引导</span>
    </div>
    <div class="main">
      <p><img src="~@/assets/img/download/ios_guide1.png" alt=""/></p>
      <img src="~@/assets/img/download/ios_guide2.png" alt=""/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'guidea',
  created() {
    document.title = 'ios下载引导';
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
  p {
    margin-bottom: 0;
  }

  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    box-sizing: border-box;
    padding: 0 16px;
    position: fixed;
    top: 0;
    left: 0;
    color: white;
    background: rgba(0, 0, 0, 0.3)
  }

  .header span:nth-of-type(1) {
    line-height: 40px;
    z-index: 100;
    position: absolute;
    left: 16px
  }

  .header .span {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 16px;
    position: absolute;
    top: 0;
    left: 0
  }

  .header i {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 3px;
    border-top: 2px solid white;
    border-right: 2px solid white;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
    vertical-align: center
  }

  .guide .main, .guide .main img {
    width: 100%
  }
</style>
