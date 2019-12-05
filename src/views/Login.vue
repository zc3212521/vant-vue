<template>
  <div class="login">
    <div class="avotor">
      <p>登录</p>
    </div>
    <form action="/">
      <van-cell-group>
        <van-field
          v-model="username"
          clearable
          placeholder="请输入用户名"
          :error="nameErr"
        />

        <van-field
          v-model="password"
          clearable
          type="password"
          placeholder="请输入密码"
        />
        <van-field
          v-model="captcha"
          center
          clearable
          placeholder="请输入验证码"
        >
        </van-field>
        <img @click="getImg" class="captcha" :src="imgUrl" alt="">
      </van-cell-group>
    </form>
    <van-button class="loginBtn" size="large" type="info" @click="login">登录</van-button>
  </div>
</template>

<script>
// import { getLogin } from '@/http/init'
// import { saveToken, encryptionPW } from '@/utils/auth'

const captchaUrl = `/captchaImage?timestamp=${new Date()}` // todo

export default {
  name: 'login',
  data () {
    return {
      imgUrl: captchaUrl,
      username: '', // 用户名
      password: '', // 密码
      captcha: '', // 验证码
      nameErr: false
    }
  },
  watch: {
    username: function (val) {
      if (val !== '') {
        this.nameErr = false
      }
    }
  },
  methods: {
    getImg () { // 点击验证码
      this.imgUrl = captchaUrl
    },
    login () {
      // 以下注释为正常登录逻辑
      // if (this.username === '') {
      //   this.nameErr = true
      //   return
      // }
      // let params = {
      //   username: this.username,
      //   password: encryptionPW(this.password),
      //   captcha: this.captcha
      // }
      // getLogin(params).then(res => {
      //   const { token, permitLogin } = res.data
      //   saveToken(token)
      //   if (permitLogin) {
      //     this.$router.push({
      //       name: 'home'
      //     })
      //   } else {
      //     this.updatePasswordVisible = true
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
      this.$router.push({
        name: 'demo'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .loginBtn{
    margin-top: 30px;
  }
  .avotor{
    width:100%;
    text-align: center;
    padding-top: 20px;
    &>img{
      width: 50px;
    }
    p{
      text-align: center;
      font-weight: 800;
    }
  }
  .login{
    padding: 20px;
  }
  .captcha{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ececec;
  }
</style>
