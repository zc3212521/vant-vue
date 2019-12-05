import ajax from './axios'

String.prototype.renderUrl = function (context) { // eslint-disable-line
  return this.replace(/{(.*?)}/g, (match, key) => context[key.trim()])
}

class Http {
  /**
   * get请求
   * @param url url，可以使用占位符
   * @param params 请求参数
   * @param urlParams 占位符参数列表
   * @param data 请求体
   * @param customConfig axios原始配置
   * @returns {*|AxiosPromise<any>|ClientRequest|ClientHttp2Stream|Promise<any>|Promise<T>}
   */
  static get (url, params, urlParams, data, customConfig) {
    url = this._formatUrl(url, urlParams)
    const config = this._requestConfig('get', url, params, data, customConfig)
    return ajax.request(config)
  }

  /**
   * post请求
   * @param url
   * @param data
   * @param urlParams
   * @param customConfig
   * @returns {*|AxiosPromise<any>|ClientRequest|ClientHttp2Stream|Promise<any>|Promise<T>}
   */
  static post (url, data, urlParams, customConfig) {
    this._formatParams(data)
    url = this._formatUrl(url, urlParams)
    const config = this._requestConfig('post', url, null, data, customConfig)
    return ajax.request(config)
  }

  static put (url, data, urlParams, customConfig) {
    this._formatParams(data)
    url = this._formatUrl(url, urlParams)
    const config = this._requestConfig('put', url, null, data, customConfig)
    return ajax.request(config)
  }

  static delete (url, data, urlParams, customConfig) {
    url = this._formatUrl(url, urlParams)
    const config = this._requestConfig('delete', url, null, data, customConfig)
    return ajax.request(config)
  }

  static patch (url, data, urlParams, customConfig) {
    this._formatParams(data)
    url = this._formatUrl(url, urlParams)
    const config = this._requestConfig('patch', url, null, data, customConfig)
    return ajax.request(config)
  }

  static request (config) {
    return ajax.request(config)
  }

  static _requestConfig (method, url, params, data, customConfig) {
    const config = customConfig || {}
    config.method = method
    config.url = url
    config.data = data
    config.params = params
    return config
  }

  /**
   * 替换url中的{name}, 为所传参数{name: 'zhangsan '} 中的 zhangsan
   * @param url eg: '/test/{userId}/somestr/{userName}/over'
   * @param urlParams eg: {userId: 1, userName: 'zhangsan'}
   * @returns {*} eg: '/test/1/somestr/zhangsan/over'
   * @private
   */
  static _formatUrl (url, urlParams) {
    if (urlParams) {
      Object.keys(urlParams).forEach(key => {
        if (url.indexOf(key) < 0) {
          console.error(`请求地址中不存在参数：${key}`)
        }
      })
      return url.renderUrl(urlParams)
    }
    return url
  }

  /**
   * 删除参数中空数组或者空对象的参数
   * @param params
   * @private
   */
  static _formatParams (params) {
    if (params instanceof Object) {
      Object.keys(params).forEach(item => {
        // if (!params[item]) delete params[item]
        if (item instanceof Object) {
          if (item instanceof Array) {
            if (item.length === 0) {
              delete params[item]
            }
          } else {
            if (Object.keys(item).length === 0) {
              delete params[item]
            }
          }
        }
      })
    }
  }
}

export default Http
