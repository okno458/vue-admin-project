<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './Card/index'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components:{
    Card,
    Sale,
    Observe
  },
}
</script>

<style lang="scss" scoped>
</style>
