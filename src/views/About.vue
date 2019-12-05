<template>
  <div class="about">
    <van-nav-bar
      title="about"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <my-component />
    <br />
    <van-button type="primary" to="demo">跳转Demo页面</van-button>
  </div>
</template>

<script>
import MyComponent from '@/components/MyComponent'
export default {
  name: 'about',
  components: {
    MyComponent
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    onClickRight () {
      this.$toast('点击右侧')
    }
  }
}
</script>

<style lang="less" scoped>
  .about {
    text-align: center;
  }
</style>
