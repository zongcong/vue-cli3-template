import fetch from '@/service/fetch'

export const webApi = data => {
  return fetch({
    url: '/api',
    method: 'post',
    data: data
  })
}
