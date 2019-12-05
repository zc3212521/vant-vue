import http from '@/base/http'
import api from './api'

export const getLogin = (params) => {
  return http.post(api.login, params)
}
