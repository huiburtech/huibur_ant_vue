import request from './request'
//商品列表
export function getQiniuToken(method, url, params, data) {
  console.log(method)
  return request({
      method: method || 'GET',
      url: url,
      params,
      data
  })
}