/*
 * @Description:
 * @Version: 2.0
 * @Autor: solid
 * @Date: 2021-12-23 22:30:23 +0800
 * @LastEditors: solid
 * @LastEditTime: 2022-06-01 11:02:10
 */
import axios from 'axios'
import store from '@/store'
import router from '../router'
import { Message } from 'element-ui'
var baseURL = process.env.VUE_APP_BASE_API
const service = axios.create({
	baseURL: baseURL,
	// withCredentials: true,
	timeout: 50000
})

// request interceptor
service.interceptors.request.use(
	(config) => {
		// config.url

		if (store.getters.hostname) {
			// let each request carry token
			// ['X-Token'] is a custom headers key
			// please modify it according to the actual situation
			config.headers['hostname'] = store.getters.hostname
			// config.headers['Authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoibG9jYWxob3N0IiwicG9ydCI6IjIzNzUiLCJpYXQiOjE2Nzg4NDg3MTcsImV4cCI6MTY4NzQ4ODcxN30.ciQDsRWRdq6aryaFzrCTDMHBWGfH0lkTbFh-Q0lq8Ws"
		}
		return config
	},
	(error) => {
		// do something with request error
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get http information such as headers or status
	 * Please return  response => response
	 */

	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	response => {
		// if the custom code is not 20000, it is judged as an error.
		if (response.data.code == 401) {
			Message({
				message: response.data.message,
				type: 'error',
				duration: 1.5 * 1000,
				onClose: function () {
					setTimeout(() => {
						router.push("/")
					}, 1.5 * 1000);
				}
			})
		} else {
			return response.data
		}
	},
	error => {
		console.log(error);
	}
)

export default service
