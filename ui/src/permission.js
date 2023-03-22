/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-17 12:45:40
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 21:16:20
 */
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/cookie' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  console.log(to)
  // if (store.getters.hostname) {
  //   to.query = { hostname: store.getters.hostname }
  // }
  return next()

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
