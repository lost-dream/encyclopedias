import Vue from 'vue'
import Router from 'vue-router'
// import classifyManagerRouter from './classifyManagerRouter'
// import categoryManagerRouter from './categoryManagerRouter'
// import contentTemplateRouter from './contentTemplateRouter'
// import entryRouter from './entryRouter'
import visitorRouter from './visitorPageRouter'
import commonUserRouter from './commonUserRouter'
import administratorRouter from './administratorRouter'
// import specialManagerRouter from './specialManagerRouter'

Vue.use(Router)
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // ...classifyManagerRouter,
  // ...categoryManagerRouter,
  // ...contentTemplateRouter,
  // ...entryRouter,
  ...visitorRouter,
  ...commonUserRouter,
  ...administratorRouter,
  // ...specialManagerRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '信息百科'
  next()
})
export default router
