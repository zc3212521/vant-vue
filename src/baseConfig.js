const baseConfig = {
  baseURL: {
    dev: '/test', // 测试环境baseUrl
    prod: '/', // 生产服务器环境baseUrl
    sit: '/', // 测试服务器环境baseUrl
    uat: '/', // 演示服务器环境baseUrl
    yapi: 'http://yapi.hongguaninfo.com/mock/26' // yapi上mock接口地址
  },
  iconUrl: {
    scriptUrl: '//at.alicdn.com/t/font_1487793_8edxzdohoam.js' // 在 iconfont.cn 上生成
  },
  login: {
    captcha: false, // 是否开启验证码验证
    captchaUrl: ''
  },
  queryWhiteList: ['/login'], // 不需要token验证的请求接口白名单
  loadingWhiteList: [], // 不需要显示loading的请求接口白名单
  tokenExpire: 2 * 24 * 60 * 60 // token 失效时间，单位：s
}
export default baseConfig
