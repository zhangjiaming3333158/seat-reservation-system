import { request } from '@/utils/service'

export function signIn(data: any) {
  return request({
    url: 'user/signIn',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
    },
  })
}

export function signUp(data: any) {
  return request({
    url: 'user/signUp',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
    },
  })
}