import http from '@/base/http'
import api from './api'

export const getUserInfo = (params) => {
  return http.post(api.getUserInfo, params)
}

export const getUserById = (params, urlParams) => {
  return http.post(api.getUserInfo, params, urlParams)
}
