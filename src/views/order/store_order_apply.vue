<template>
<div>222</div>
</template>

<script>
import { checkIsCanBorrow } from '@/api/order'
export default {
  name: 'store_order_apply',
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      checkIsCanBorrow().then(data => {

      })
    }
  }

};
</script>

<style scoped>

</style>
