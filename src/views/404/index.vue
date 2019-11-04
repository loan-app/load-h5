<template>
  <div class="lnvite">
    <div class="lnvite_main">
      <img src="~@/assets/img/emptypage_building.png?v=2"/>
      <div>客官，技术小哥哥还探索中 尽请期待...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  mounted() {
    document.title = localStorage.getItem('name') || '404';
  }
};
</script>

<style scoped>
  .lnvite {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .lnvite_main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
  }

  .lnvite_main div {
    width: 1.68rem;
    height: 0.48rem;
    font-size: 0.14rem;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.24rem
  }

  .lnvite_main img {
    width: 0.7rem;
    margin-bottom: 0.3rem
  }
</style>
