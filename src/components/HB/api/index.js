import request from './request'
import { saveAs } from '../utils/saveAs'

/**
 * 新增
 * @param data '{ }'
 * @returns {AxiosPromise}
 */
export function h_add (url, data, header, timeout) {
    return request({
        url: url,
        method: 'POST',
        data,
        header,
        timeout
    })
}

/**
 * 编辑
 * @param data '{}'
 * @returns {AxiosPromise}
 */
export function h_edit (url, data, id, header, timeout) {
    return request({
        url: url + (id ? '/' + id : ''),
        method: 'PUT',
        data,
        header,
        timeout
    })
}


/**
 * 删除
 * @param data '{}'
 * @returns {AxiosPromise}
 */
export function h_delete (url, id, header, timeout) {
    return request({
        url: url + (id ? '/' + id : ''),
        method: 'DELETE',
        header,
        timeout
    })
}


/**
 * 获取列表
 * @param data '{}'
 * @returns {AxiosPromise}
 */
 export function h_getList (url, params, header, timeout) {
    return request({
        url: url,
        method: 'GET',
        params,
        header,
        timeout
    })
}


/**
 * 获取详情
 * @param data '{}'
 * @returns {AxiosPromise}
 */
 export function h_getDetail (url, id, header, timeout) {
    return request({
        url: url + (id ? '/' + id : ''),
        method: 'GET',
        header,
        timeout
    })
}


/**
 * 其他网络请求
 * @param data '{}'
 * @returns {AxiosPromise}
 */
 export function h_request (method, url, params, data, header, timeout, id) {
    return request({
        url: url+ (id ? '/' + id : ''),
        method: method,
        params,
        data,
        header,
        timeout
    })
}

/**
 * 下载接口
 * @param data '{}'
 * @returns {AxiosPromise}
 */
 export function h_download (method, url, params, data, header, timeout, filename, id) {
    request({
        url: url+ (id ? '/' + id : ''),
        method: method,
        params,
        data,
        header,
        timeout,
        responseType : 'blob'
    }).then(res => {
        saveAs(res, filename)
    })
}