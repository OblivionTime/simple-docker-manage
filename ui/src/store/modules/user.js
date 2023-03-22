/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-17 14:17:49
 * @LastEditors: solid
 * @LastEditTime: 2022-05-31 18:50:40
 */

import {
	getUser,
	setUser,
	removeUser
} from '@/utils/cookie';
function getHostName() {
	let url = window.location.href.split("?")[1];
	let params = new URLSearchParams(url)
	let hostname = params.get("hostname")
	return hostname
}
getHostName()
const user = {
	state: {
		hostname: getHostName()?getHostName(): "",
		isShowLogin: false,
		userInfo: getUser() ? getUser() : '',
		address: '',
	},

	mutations: {
		SET_ISSHOWLOGIN: (state, isShowLogin) => {
			state.isShowLogin = isShowLogin
		},
		SET_USER: (state, user) => {
			state.userInfo = user
		},
		SET_ADDRESS: (state, addr) => {
			state.address = addr
		},
	},

}
export default user
