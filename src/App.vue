<template>
  <div id="app">
    <transition name="router-fade">
      <router-view/>
    </transition>
  </div>
</template>
<script>
export default {
  mounted() {
    //设置根元素的fontSize值
    function add() {
      var html = document.documentElement;
      var hei = html.clientWidth;
      html.style.fontSize = hei / 375 * 100 + 'px';
    };
    add();
    window.addEventListener('resize', add, false); //屏幕改变事件
  }
};
</script>
<style lang="less">
  @import "~@/less/reset.less";

  html, body, #app {
    height: 100%;
  }

  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .2s;
  }

  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
</style>
