/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-31 18:47:07
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 21:08:19
 */
import request from '@/utils/request'
//获取容器列表
export function GetList(params) {
    return request({
        url: '/container/list',
        method: 'get',
        params
    })
}
export function GetDetail(params) {
    return request({
        url: '/container/detail',
        method: 'get',
        params
    })
}
//启动容器
export function StartContainer(data) {
    return request({
        url: '/container/start',
        method: 'post',
        data
    })
}
//暂停容器
export function StopContainer(data) {
    return request({
        url: '/container/stop',
        method: 'post',
        data
    })
}
//删除容器
export function RemoveContainer(data) {
    return request({
        url: '/container/remove',
        method: 'post',
        data
    })
}
