/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-31 18:47:07
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 21:08:19
 */
import request from '@/utils/request'
//获取镜像列表
export function GetList(params) {
    return request({
        url: '/image/list',
        method: 'get',
        params
    })
}
//获取镜像详情
export function GetDetail(params) {
    return request({
        url: '/image/detail',
        method: 'get',
        params
    })
}
//搜索镜像列表
export function SearchList(params) {
    return request({
        url: '/image/search',
        method: 'get',
        params
    })
}
//删除镜像
export function RemoveMirror(data) {
    return request({
        url: '/image/delete',
        method: 'post',
        data
    })
}
//创建
export function CreateContainer(data) {
    return request({
        url: '/container/create',
        method: 'post',
        data
    })
}