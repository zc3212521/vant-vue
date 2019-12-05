<template>
  <div class="demo">
    <h1>Demo</h1>
    <h3>内置样式</h3>
    <h4>文字省略</h4>
    <div class="van-ellipsis">这是一段最多显示一行的文字，多余的内容会被省略。这是一段最多显示一行的文字，多余的内容会被省略。</div>
    <br />
    <div class="van-multi-ellipsis--l2">这是一段最多显示两行的文字，多余的内容会被省略。这是一段最多显示两行的文字，多余的内容会被省略。这是一段最多显示两行的文字，多余的内容会被省略。</div>
    <br />
    <div class="van-multi-ellipsis--l3">这是一段最多显示三行的文字，多余的内容会被省略。这是一段最多显示三行的文字，多余的内容会被省略。这是一段最多显示三行的文字，多余的内容会被省略。</div>
    <br />

    <h4>1px 边框（ios手机高清屏1px边框解决方案）</h4>

    <!-- 上边框 -->
    <div class="van-hairline--top"></div>

    <!-- 下边框 -->
    <div class="van-hairline--bottom"></div>

    <!-- 左边框 -->
    <div class="van-hairline--left"></div>

    <!-- 右边框 -->
    <div class="van-hairline--right"></div>

    <!-- 上下边框 -->
    <div class="van-hairline--top-bottom"></div>

    <!-- 全边框 -->
    <div class="van-hairline--surround"></div>
    <br />

    <h4>动画</h4>
    <!-- 淡入 -->
    <transition name="van-fade">
      <div v-show="visible">Fade</div>
    </transition>

    <!-- 上滑进入 -->
    <transition name="van-slide-up">
      <div v-show="visible">Slide Up</div>
    </transition>

    <!-- 下滑进入 -->
    <transition name="van-slide-down">
      <div v-show="visible">Slide Down</div>
    </transition>

    <!-- 左滑进入 -->
    <transition name="van-slide-left">
      <div v-show="visible">Slide Left</div>
    </transition>

    <!-- 右滑进入 -->
    <transition name="van-slide-right">
      <div v-show="visible">Slide Right</div>
    </transition>
    <van-button type="primary" @click="visible = !visible">显示/隐藏</van-button>
    <br /><br />
    <h3>组件示例</h3>
    <h4>按钮</h4>
    <van-button type="primary" @click="click">点击</van-button>

    <h4>图标</h4>
    <p>vant自带图标</p>
    <van-icon name="close" />
    <p>图片路径图标</p>
    <van-icon name="https://b.yzcdn.cn/vant/icon-demo-1126.png" />
    <p>本地图标文件</p>
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-icon"></use>
    </svg>
    <p>注意：本地图标文件需要用阿里图标库生成的iconfont.js，覆盖目录 /public 下的iconfont.js</p>

    <h4>Toast 轻提示</h4>
    <van-button type="primary" @click="tip">点击</van-button>

    <h4>轮播</h4>
    <van-swipe :autoplay="3000" indicator-color="white" class="demo-swipe">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>

    <h4>跳页</h4>
    <van-button type="primary" to="about">按钮跳转</van-button>
    <br /><br />
    <van-button type="primary" @click="goAbout">回调事件</van-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    click () {
      alert(666)
    },
    tip () {
      this.$toast.success('成功文案')
    },
    goAbout () {
      this.$router.push({
        name: 'about'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .demo {
    padding: 10px;
  }
  .icon {
    height: 30px;
    width: 30px;
    color: red;
   }
  .demo-swipe {
    /deep/ .van-swipe-item {
      background-color: #39a9ed;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
    }
  }
</style>
