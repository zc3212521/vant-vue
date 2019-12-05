import * as Auth from './auth'
import moment from 'moment'
import baseConfig from '@/baseConfig'

const session = {
  get (key) {
    return sessionStorage.getItem(key)
  },
  set (key, value) {
    return sessionStorage.setItem(key, value)
  }
}

const local = {
  get (key) {
    return localStorage.getItem(key)
  },
  set (key, value) {
    return localStorage.setItem(key, value)
  }
}

/**
 * 获取obj的类型
 * @param obj
 * @returns {string|*}
 */
function getType (obj) {
  const str = Object.prototype.toString.call(obj)
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    // 判断是否是dom元素，如div等
    return 'element'
  }
  return map[str]
}

/**
 * 深拷贝对象
 * @param ori
 * @returns {Array|any}
 */
function deepClone (ori) {
  const type = getType(ori)
  let copy
  switch (type) {
    case 'array':
      return copyArray(ori, type, copy)
    case 'object':
      return copyObject(ori, type, copy)
    default:
      return ori
  }
}

/**
 * 拷贝数组
 * @param ori
 * @param type
 * @param copy
 * @returns {Array}
 */
function copyArray (ori, type, copy = []) {
  for (const [index, value] of Object.entries(ori)) {
    copy[index] = deepClone(value)
  }
  return copy
}

/**
 * 拷贝对象
 * @param ori
 * @param type
 * @param copy
 */
function copyObject (ori, type, copy = {}) {
  for (const [key, value] of Object.entries(ori)) {
    if (getType(value) === 'function') {
      copy[key] = {} // eslint-disable-line
    } else {
      copy[key] = deepClone(value)
    }
  }
  return copy
}

// /**
//  * 拷贝函数
//  * @param ori
//  * @returns {any}
//  */
// function copyFunction (ori, type, copy = () => {}) {
//   console.log('function', ori)
//   // const fun = eval(ori.toString()) // eslint-disable-line
//   // fun.prototype = ori.prototype
//   // return fun
//   return ori
// }

/**
 * 删除对象属性值为空或者为undefined的属性值
 * @param obj
 * @param keepEmptyString undefined/false ： 删除空字符串的字段；true: 保留空字符串的字段
 * @returns {*}
 */
const deleteEmpty = function (obj, keepEmptyString) {
  if (obj === undefined || obj === null) {
    return {}
  }
  Object.keys(obj).forEach(item => {
    if (item === 'filters') {
      Object.keys(obj[item]).forEach(it => {
        if (obj[item][it] === 'undefined' || obj[item][it] === undefined || obj[item][it] === null) {
          delete obj[item][it]
        } else if (obj[item][it] === '') {
          if (!keepEmptyString) {
            delete obj[item][it]
          }
        }
      })
    } else {
      if (obj[item] === 'undefined' || obj[item] === undefined || obj[item] === null) {
        // if (obj[item] === 'undefined' || obj[item] === undefined || obj[item].length <= 0) {
        delete obj[item]
      } else if (obj[item] === '') {
        if (!keepEmptyString) {
          delete obj[item]
        }
      }
    }
  })
  return obj
}
/**
 * 并列的列表转换成层级结构
 * @param obj
 * @return {*}
 */
const listConvertObj = function (list) {
  let root = null
  if (list && list.length) {
    root = {
      tagId: 0,
      parentId: null,
      'draw': 0,
      'pageCount': 1,
      'pageNumber': 1,
      'pageSize': 30,
      children: []
    }
    const group = {}
    for (let index = 0; index < list.length; index += 1) {
      if (list[index].parentId !== null && list[index].parentId !== undefined) {
        if (!group[list[index].parentId]) {
          group[list[index].parentId] = []
        }
        group[list[index].parentId].push(list[index])
      }
    }
    const queue = []
    queue.push(root)
    while (queue.length) {
      const node = queue.shift()
      node.children = group[node.tagId] && group[node.tagId].length
        ? group[node.tagId]
        : null
      if (node.children) {
        queue.push(...node.children)
      }
    }
  }
  return root
}

const log = console.log

/**
 *
 * @param title eg:['姓名', '年龄']; excel表头
 * @param obj eg: [{name: 'zhangsan', age: '20'},{name: 'lisi',age: '18'}]; 需要转换的json数组
 * @param columns eg: ['name', 'age']; json数组中对应表头的key值
 * @param showSerial: boolean ; true表示自动添加序号， 默认false
 * @returns {*[]}
 */
const json2ExcelData = (title, obj, columns, showSerial = false) => {
  if (!(title instanceof Array) || !(columns instanceof Array) ||
    !(obj instanceof Array)) {
    console.error('传入数据格式有误')
    return
  }
  if (title.length !== columns.length) {
    console.error('转换的表头数据与对应数据长度不一致')
    return
  }
  if (showSerial) {
    title.unshift('序号')
    obj.forEach((item, index) => {
      item._serial = index + 1
    })
    columns.unshift('_serial')
  }
  const aoa = [title]
  for (let i = 0; i < obj.length; i++) {
    let item = []
    for (let n = 0; n < title.length; n++) {
      item.push(obj[i][columns[n]])
    }
    aoa.push(item)
  }
  return aoa
}

/**
 * 颠倒字符串
 * @param str
 * @returns {string}
 */
const reverseString = (str) => {
  return str.split('').reverse().join('')
}

/**
 * 面包屑数据生成，递归调用
 * @param routes
 * @param i
 * @param pathArr
 * @param newArr
 * @returns {Array}
 */
const formatbreadcrumb = (routes, i = 0, pathArr, newArr = []) => {
  if (i < pathArr.length && routes) {
    routes.forEach(item => {
      let pathName = item.path
      if (item.path.indexOf('/') >= 0) {
        pathName = item.path.split('/')[0]
      }
      if (pathName === pathArr[i] &&
        (pathName !== 'main' && pathName !== 'list')) {
        newArr.push({
          title: item.meta.title,
          name: item.name,
          linkable: item.meta.linkable
        })
        if (item.children) {
          i += 1
          formatbreadcrumb(item.children, i, pathArr, newArr)
        }
      }
    })
  }
  return newArr
}

/**
 * 过滤带有权限的一级路由
 * @param permission
 * @returns {*}
 */
const filterTopRouterAuth = (permission) => {
  permission.forEach(item => {
    if (item.children && item.children.length) {
      item.children.forEach((it, n) => {
        if (it.auth) {
          item.children.splice(n, 1)
        }
      })
    }
  })
  return permission
}

/**
 * 判断arr[]:str中的某一项中存在字符串str
 * @param arr
 * @param str
 * @returns {boolean}
 */
const sliceInArr = (arr, str) => {
  if (arr instanceof Array && arr.length > 0) {
    let resultArr = arr.filter((item) => {
      return str.indexOf(item) >= 0
    })
    return resultArr.length > 0
  }
  return false
}

/**
 * 本地时间转UTC时间
 * @param local
 * @returns {string}
 */
const localDate2utc = (local) => {
  return moment(local).utc().format()
}

/**
 * UTC时间转本地时间
 * @param utc
 * @param format
 * @returns {string}
 */
const utc2localDate = (utc, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(utc).format(format)
}

/**
 * 获取当前页面的字典项配置数组
 * @param types
 * @returns {getters.getCurrentPageDicts}
 */
const getCurrentDicts = (types = []) => {
  return window.vm.$store.getters.getCurrentPageDicts
}

/**
 * 获取baseurl
 * @returns {string}
 */
const getBaseUrl = () => {
  const URLObj = baseConfig.baseURL
  let baseURL = URLObj.dev
  if (process.env.NODE_ENV === 'production') {
    if (process.env.VUE_APP_DEPLOY_ENV === 'sit') {
      baseURL = URLObj.sit
    } else if (process.env.VUE_APP_DEPLOY_ENV === 'uat') {
      baseURL = URLObj.uat
    } else if (process.env.VUE_APP_DEPLOY_ENV === 'production') {
      baseURL = URLObj.prod
    }
  } else if (process.env.NODE_ENV === 'yapi') {
    baseURL = URLObj.yapi
  }
  return baseURL
}

/**
 * 根据字典组编码查询字典数据，并转换格式为数组
 * [{
 *       label: dictName,
 *        value: dictValue
 *      }]
 * @param itemKey 字典组编码
 * @param dicts 字典组数据，需要页面传入  this.$dict
 * @returns itemArray
 */
const formatDictsToArray = (itemKey, dicts) => {
  let dict = []
  // 根据 字典组编码 获得对应的字典项数组
  for (var key in dicts) {
    // 当前字典值拼接数据 ，1个字组为一个对象，属性只有1个 为字典组编码（dicts[key])[0]）
    if (Object.keys(dicts[key])[0] === itemKey) {
      dict = dicts[key][itemKey]
    }
  }
  // 转换字典项格式
  let dictArray = []
  dict.forEach((item) => {
    let dictItem = {}
    dictItem.label = item.itemName
    dictItem.value = item.itemValue
    dictArray.push(dictItem)
  })
  return dictArray
}

/**
 * @description: 针对查询，新增，编辑表单 转换select字典数据
 * @param obj 需要替换form的数组对象
 * @param dicts 当前页面字段对象 this.$dict
 * @param propKey 对象属性名
 * @param dictKey 字典组编码 如果字典组编码与对象属性名一致可以不传
 * @return 格式化后的数组对象
 */
const formatFormSelectDictItem = (obj, dicts, propKey, dictKey) => {
  if (!dictKey) {
    dictKey = propKey
  }
  // TODO let cpObj = deepClone(obj) 无法拷贝函数类对象
  let cpObj = obj
  let selectOption = formatDictsToArray(dictKey, dicts)
  cpObj.forEach(item => {
    if (item.decorator[0] === propKey) {
      item.selectOptions = selectOption
    }
  })
  return cpObj
}

/**
 * 根据字典组编码查询字典数据，并转换格式为数组
 * [{
 *       label: dictName,
 *        value: dictValue
 *      }]
 * @param itemKey 字典组编码
 * @param dicts 字典组数据，需要页面传入  this.$dict
 * @param itemValue 字典值
 * @returns itemName 字典名称
 */
const getDictItemName = (itemKey, dicts, itemValue) => {
  let dict = {}
  // 根据 字典组编码 获得对应的字典项数组
  for (var key in dicts) {
    // 当前字典值拼接数据 ，1个字组为一个对象，属性只有1个 为字典组编码（dicts[key])[0]）
    if (Object.keys(dicts[key])[0] === itemKey) {
      dict = dicts[key][itemKey]
    }
  }
  // 转换字典项格式
  let itemLabel = ''
  dict.forEach((item) => {
    if (itemValue === item.itemValue) {
      itemLabel = item.itemName
    }
  })
  return itemLabel
}

export {
  formatFormSelectDictItem,
  getDictItemName,
  formatDictsToArray,
  Auth,
  session,
  local,
  log,
  deepClone,
  deleteEmpty,
  listConvertObj,
  json2ExcelData,
  reverseString,
  // selectList,
  // exportMould,
  formatbreadcrumb,
  filterTopRouterAuth,
  sliceInArr,
  localDate2utc,
  utc2localDate,
  getCurrentDicts,
  getBaseUrl
}
