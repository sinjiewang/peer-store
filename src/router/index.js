import { createRouter, createWebHistory } from 'vue-router'
import Browse from '@/components/Browse.vue'
import Auth from '@/components/Auth.vue'
import Store from '@/components/Store.vue'
import { useStore } from 'vuex'

const routes = [
  {
    path: '/browse',
    name: 'browse',
    component: Browse,
  },
  {
    path: '/login',
    name: 'login',
    component: Auth,
  },
  {
    path: '/store',
    name: 'store',
    component: Store,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/browse',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
      if (isAuthenticated) next()
      else next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ path: '/browse' })
  } else {
    next()
  }
})

export default router
