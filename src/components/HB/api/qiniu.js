import request from './request'
//ๅๅๅ่กจ
export function getQiniuToken(method, url, params, data) {
  console.log(method)
  return request({
      method: method || 'GET',
      url: url,
      params,
      data
  })
}