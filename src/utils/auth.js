import { JSEncrypt } from 'jsencrypt'
import baseConfig from '@/baseConfig'
import Cookies from 'js-cookie'
import { reverseString } from './index'

// 默认dev和sit环境相同
let jsePublicKeyTemp = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDavyfl/Sm5FJ9fn3WR1kUlR/aYS1LFwGxzBtoKia1qKTHJSCK/t04eSLuk8xlWmVS3PPJvwtg2Tuc9pQf8Zqq3VRcW4bMlWo+UAYqGSFsncX/Wy2Cl5oFfGYe5D4g4nDLf5RHHI91N2+/EJGylpqO+z8iKX3+uxdU0PxuvIE4XlwIDAQAB'

if (process.env.VUE_APP_DEPLOY_ENV === 'production') {
  jsePublicKeyTemp = ''
} else if (process.env.VUE_APP_DEPLOY_ENV === 'uat') {
  jsePublicKeyTemp = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr+r1c44Rnrl2rE2Erp9OXQt+hTnbuw9XkbzHKnQFNLWORAtcvTXhYz+EHZfWhITMT5i6p9ghBoIsh7LEnS+7OHULZub+Ll3iqKRooPxDH1PEgnFVbDm5Y/XJ2lfbs1nWc+73zuXDBheJSwMUa78B45XbM/Ehvv2m7HNXp7w7XHwIDAQAB'
}
const jsePublicKey = jsePublicKeyTemp

const jsePrivateKey = ''

/**
 * 加密登录密码
 * @param pw 输入的密码字符串
 * @returns {PromiseLike<ArrayBuffer>}
 */
const encryptionPW = (pw) => {
  let jse = new JSEncrypt()
  jse.setPublicKey(jsePublicKey)
  return jse.encrypt(pw)
}

/**
 * 解密登录密码
 * @param pw 输入的密码字符串
 * @returns {PromiseLike<ArrayBuffer>}
 */
const decryptPW = (pw) => {
  let jse = new JSEncrypt()
  jse.setPrivateKey(jsePrivateKey)
  return jse.decrypt(pw)
}

/**
 * 获取登录后的实际token值；去掉 Bearer 前缀
 * @returns {*}
 */
const getTokenNoBearer = () => {
  let bearerToken = getToken()
  let bearerTokenPrefix = 'Bearer '
  if (bearerToken && bearerToken.indexOf(bearerTokenPrefix) > -1) {
    bearerToken = bearerToken.substring(bearerTokenPrefix.length)
  }
  return bearerToken
}

/**
 * 获取sessionID
 */
const getToken = () => {
  return sessionStorage.getItem('token')
}

/**
 * 删除sessionID
 */
const removeToken = () => {
  sessionStorage.removeItem('token')
}

/**
 * 存储token
 * @param token
 */
const saveToken = (token) => {
  saveLoginTime()
  sessionStorage.setItem('token', token)
}

/**
 * 存储登录时间点
 */
const saveLoginTime = () => {
  localStorage.setItem('loginTime', parseInt(new Date().valueOf() / 1000))
}

/**
 * 获取登录时间点
 */
const getLoginTime = () => {
  return parseInt(localStorage.getItem('loginTime'))
}

/**
 * token是否过期
 * @returns {boolean}
 */
const ifTokenExpire = () => {
  let loginTime = getLoginTime()
  if (parseInt(new Date().valueOf() / 1000) > (loginTime + baseConfig.tokenExpire)) {
    return true
  }
  return false
}

/**
 * 退出登录
 */
const loginOut = () => {
  removeToken()
  if (window.vm) {
    window.vm.$store.dispatch('generateLoginOut')
    window.vm.$router.push({
      name: 'login'
    })
    window.vm.$store.dispatch('setClearRouterStack')
  }
}

/**
 * 记住密码
 * @type {string}
 */
const mixStr = 'hgmix1a'
const rememberPW = (data) => {
  const codeUserName = data.username
  Cookies.set('hn', codeUserName, { expires: 30 })
}

/**
 * 取得记住的密码
 * @returns {{username: *, password: string}}
 */
const getRemembePW = () => {
  if (Cookies.get('hn') && Cookies.get('hp')) {
    let username = Cookies.get('hn')
    let mpassword = Cookies.get('hp')
    let password = reverseString(mpassword).split(mixStr)[0]
    return {
      username,
      password
    }
  }
}

/**
 * 删除记住的密码
 */
const deleteRememberPW = () => {
  Cookies.remove('hn')
  Cookies.remove('hp')
}

/**
 * 改变传入树节点及其子节点的权限状态为checked
 * @param data
 * @param checked
 */
const changeTree = (data, checked) => {
  if (data.children && data.children.length) {
    data.auth[0].permission = checked
    data.children.forEach(item => {
      changeTree(item, checked)
    })
  } else {
    data.auth.forEach(item => {
      item.permission = checked
    })
  }
}
/**
 * 合并子节点到树 要求树的leaf属性严格按照顺序排列
 * @param tree
 * @param node
 * @returns {*}
 */
const combineNode = (tree, node) => {
  let currentleaf = node.leaf
  let leafArr = currentleaf.split('-')
  if (leafArr.length === 1) {
    tree[leafArr[0]] = node
  }
  if (leafArr.length === 2) {
    tree[leafArr[0]].children[leafArr[1]] = node
  }
  if (leafArr.length === 3) {
    tree[leafArr[0]].children[leafArr[1]].children[leafArr[2]] = node
  }
  return tree
}

/**
 * 根据子节点权限状态，判断父节点的权限状态，拥有全部子节点权限，父节点checkedStatus状态为 ‘0’， 拥有部分权限，‘1’， 没有任何权限， ‘2’
 * @param tree
 */
const updataTreeAuth = (tree) => {
  const ALLCHECKED = '0' // 枚举当前节点属性 全选
  const INDETERMINATE = '1' // 部分选定
  const ALLUNCHECKED = '2' // 全不选
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children) { // 菜单权限
      updataTreeAuth(tree[i].children)
      if (tree[i].children.every(item => item.checkedStatus === ALLCHECKED)) {
        tree[i].checkedStatus = ALLCHECKED
        tree[i].auth[0].permission = true
      } else if (tree[i].children.every(item => item.checkedStatus === ALLUNCHECKED)) {
        tree[i].checkedStatus = ALLUNCHECKED
        tree[i].auth[0].permission = false
      } else {
        tree[i].checkedStatus = INDETERMINATE
        tree[i].auth[0].permission = true
      }
    } else {
      if (tree[i].auth.every(item => item.permission)) {
        tree[i].checkedStatus = ALLCHECKED
      } else if (tree[i].auth.every(item => !item.permission)) {
        tree[i].checkedStatus = ALLUNCHECKED
      } else {
        tree[i].checkedStatus = INDETERMINATE
      }
    }
  }
}

/**
 * 将所有权限置为checked,用于全选/全不选
 * @param data
 * @param checked
 */
const changeTreeAllAuth = (data, checked) => {
  data.forEach(item => {
    item.auth.forEach(it => {
      it.permission = checked
    })
    if (item.hasOwnProperty('children') && item.children && item.children.length) {
      changeTreeAllAuth(item.children, checked)
    }
  })
  return data
}

/**
 * 为树结构添加leaf节点, 当children为[]时，置为null
 * @param data
 * @param parentLeaf
 */
const addLeafInTree = (data, parentLeaf = -1) => {
  data.forEach((item, n) => {
    if (parentLeaf === -1) {
      item.leaf = n + ''
    } else {
      item.leaf = `${parentLeaf}-${n}`
    }
    if (item.children && item.children.length) {
      addLeafInTree(item.children, item.leaf)
    } else {
      item.children = null
    }
  })
}

/**
 * 将树结构转换成前端需要的结构，每层添加auth属性，删除最后一层children节点
 * @param data
 */
const translateTree = (data) => {
  data.forEach(item => {
    if (item.children.some((it) => it.children.length > 0)) {
      item.auth = [{
        authName: '访问',
        action: 'display',
        permission: true,
        authType: 1
      }]
      translateTree(item.children)
    } else {
      if (item.children && item.children.length) {
        item.auth = item.children
        item.children = []
      } else {
        item.auth = [{
          authName: '未定义',
          action: 'none',
          permission: false,
          authType: 3
        }]
      }
    }
  })
}

/**
 * 简化菜单树结构为[{title:xxx, key:xxx, value:xxx,disabled: xxx, children[...]}]形式，赋值给newTree
 * @param data
 * @param newTree
 * @param withDisable 是否生成disable属性
 */
const simpleMenuTree = (data, newTree = [], withDisable = true) => {
  data.forEach((item, index) => {
    let member = {
      title: item.authName,
      key: item.authId,
      authId: item.authId,
      value: item.authId,
      parentId: item.parentId,
      authUrl: item.authUrl,
      url: item.url,
      authCode: item.authCode,
      authType: item.authType,
      children: []
    }
    if (item.children && item.children.length) {
      if (withDisable) {
        member.disabled = true
      }
      newTree.push(member)
      simpleMenuTree(item.children, newTree[index].children, withDisable)
    } else {
      if (withDisable) {
        member.disabled = false
      }
      newTree.push(member)
    }
  })
}

/**
 * 遍历树节点，查找attrkey = attrValue的节点
 * @param data
 * @param attrKey
 * @param attrValue
 */
const findNodeByAttr = (data, attrKey, attrValue) => {
  window._result = undefined
  if (!(attrKey in data[0])) {
    console.error(`不存在${attrKey}属性！`)
    return
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i][attrKey] === attrValue) {
      window._result = data[i]
      break
    } else {
      if (data[i].children && data[i].children.length && !window._result) {
        findNodeByAttr(data[i].children, attrKey, attrValue)
      }
    }
  }
  return window._result
}

/**
 * 获取当前权限树结构 已选中的 权限id列表
 * @param data 权限树
 * @param authArr 已选中的权限id 列表
 */
const getCheckedAuthIdList = (data, authArr = []) => {
  data.forEach((item, index) => {
    if (item.auth[0].authType === 1) {
      if (item.children) {
        getCheckedAuthIdList(item.children, authArr)
      }
    } else {
      item.auth.forEach(it => {
        if (it.authId && it.permission) {
          authArr.push(it.authId)
        }
      })
    }
  })
}

/**
 * 格式化auth数据
 * @param data
 * @param authList
 */
const formatAuth = (data, authList = []) => {
  data.forEach((item, index) => {
    authList.push({
      path: item.url,
      name: item.authCode,
      meta: {
        title: item.authName,
        icon: item.icon
      },
      id: item.id,
      children: []
    })
    if (item.children.length) {
      formatAuth(item.children, authList[index].children)
    }
  })
}

/**
 * 删除根节点
 * @param menuList
 */
const getMenuWithoutRoot = (menuList) => {
  if (menuList.length === 1 && menuList[0].id === '0') {
    return menuList[0].children
  }
  return menuList
}

/**
 * 为当前路由生成菜单组件openKey所需要的数组
 * @param routerName
 * @returns {Array}
 */
const getMenuNameArr = (routerName) => {
  let nameArr = routerName.split('_')
  let routerNameArr = []
  for (let i = 0; i < nameArr.length; i++) {
    if (i === 0) {
      routerNameArr.push(nameArr[0])
    } else {
      routerNameArr.push(routerNameArr[i - 1] + '_' + nameArr[i])
    }
  }
  return routerNameArr
}

/**
 * 如果是顶级菜单，返回此顶级菜单下第一个有权限可点击的菜单；如果不是顶级菜单，返回null
 * @param redirectedFromPath 当前访问的路由名称
 * @param menuTree 当前用户可点击的菜单树
 * @returns {string}
 */
const getTopMenuFirstChildMenu = (redirectedFromPath, menuTree) => {
  if (redirectedFromPath && menuTree) {
    for (let i = 0; i < menuTree.length; i++) {
      if (redirectedFromPath === menuTree[i].path) {
        let firstChildMenu = getFirstChildLinkMenu(menuTree[i])
        return firstChildMenu.name
      }
    }
  }
  return null
}

/**
 * 获取当前menu对象下第一个可点击的菜单
 * @param menuItem
 * @returns {*}
 */
const getFirstChildLinkMenu = (menuItem) => {
  if (menuItem.children && menuItem.children.length > 0) {
    return getFirstChildLinkMenu(menuItem.children[0])
  }
  return menuItem
}

/**
 * 根据路由name值返回是否有该路由访问权限
 * @param routeNameArr
 * @param auth
 * @returns {boolean}
 */
const hasVisitPermission = (routeNameArr, auth) => {
  let result = false
  for (let n = 0; n < auth.length; n++) {
    if (auth[n].children.length === 0) {
      if (auth[n].name === routeNameArr[0]) {
        result = true
      }
    } else {
      if (auth[n].name === routeNameArr[0]) {
        result = hasVisitPermission(routeNameArr.slice(1, routeNameArr.length), auth[n].children)
      }
    }
  }
  return result
}

/**
 * 获取userInfo,不可在登录页，初始化程序时使用
 * @returns {userInfo}
 */
const getUserInfo = () => {
  if (window.vm && window.vm.$store.getters.getUserInfo) {
    return window.vm.$store.getters.getUserInfo
  } else {
    console.error('请使用异步获取userInfo方法：getUserInfoAsync')
  }
}

/**
 * 异步获取 userInfo,可在初始化程序时使用
 * @param inresolve
 * @returns {Promise<any>|*}
 */
const getUserInfoAsync = (inresolve) => {
  if (inresolve) {
    if (window.vm.$store.getters.getUserInfo) {
      return inresolve(window.vm.$store.getters.getUserInfo)
    } else {
      setTimeout(() => {
        return getUserInfoAsync(inresolve)
      }, 300)
    }
  } else {
    return new Promise(resolve => {
      if (window.vm && window.vm.$store.getters.getUserInfo) {
        resolve(window.vm.$store.getters.getUserInfo)
      } else {
        setTimeout(() => {
          return getUserInfoAsync(resolve)
        }, 300)
      }
    })
  }
}

export {
  getToken,
  saveToken,
  removeToken,
  encryptionPW,
  ifTokenExpire,
  loginOut,
  decryptPW,
  rememberPW,
  getRemembePW,
  deleteRememberPW,
  changeTree,
  combineNode,
  updataTreeAuth,
  changeTreeAllAuth,
  addLeafInTree,
  translateTree,
  simpleMenuTree,
  findNodeByAttr,
  getCheckedAuthIdList,
  formatAuth,
  getMenuWithoutRoot,
  getMenuNameArr,
  getTopMenuFirstChildMenu,
  hasVisitPermission,
  getUserInfo,
  getUserInfoAsync,
  getTokenNoBearer
}
