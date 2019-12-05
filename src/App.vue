<template>
  <div id="app">
    <div class="loading-wrap" v-if="loading">
      <van-loading color="#1989fa"/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: mapState({
    loading: state => state.globalLoading
  })
}
</script>

<style lang="less">
  @import "./assets/css/common.less";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .loading-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.3);
    text-align: center;
    padding-top: 30vh;
  }
</style>
