/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-31 18:47:07
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 21:08:19
 */
import request from '@/utils/request'
//登录
export function UserLogin(data) {
    return request({
        url: '/auth/auth',
        method: 'post',
        data
    })
}
//获取docker信息
export function GetDetail() {
    return request({
        url: '/auth/info',
        method: 'get',
    })
}
//获取用户列表
export function getUserList() {
    return request({
        url: '/auth/list',
        method: 'get',
    })
}
//添加用户
export function AddUser(data) {
    return request({
        url: '/auth/create',
        method: 'post',
        data
    })
}
//修改用户
export function UpdateUser(data) {
    return request({
        url: '/auth/update',
        method: 'post',
        data
    })
}
//删除用户
export function DelUser(data) {
    return request({
        url: '/auth/del',
        method: 'post',
        data
    })
}