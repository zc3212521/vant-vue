<template>
  <div>
    <p>hello world</p>
    <van-slider v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'myComponent',
  data () {
    return {
      value: 75
    }
  }
}
</script>

<style lang="less" scoped>
</style>
