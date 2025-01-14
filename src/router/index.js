import { createRouter, createWebHistory } from 'vue-router'
import Browse from '@/pages/Browse.vue'
import Auth from '@/pages/Auth.vue'
import Store from '@/pages/Store/index.vue'

import Establish from '@/pages/Establish/index.vue'
import Connect from '@/pages/Establish/Connect.vue'
import Edit from '@/pages/Establish/Edit.vue'
import Preview from '@/pages/Establish/Preview.vue'

import Visit from '@/pages/Visit/index.vue'
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
    path: '/establish/:id',
    component: Establish,
    meta: {
      requiresAuth: true,
      layout: false,
    },
    children: [
      {
        path: '',
        name: 'establish',
        redirect: (to) => {
          const appendEnd = to.path[to.path.length - 1] === '/' ? '' : '/'

          return to.path + appendEnd + 'connect';
        },
      },
      {
        path: 'connect',
        name: 'establishConnect',
        component: Connect,
      },
      {
        path: 'edit',
        name: 'establishEdit',
        component: Edit,
      },
      {
        path: 'preview',
        name: 'establishPreview',
        component: Preview,
      },
    ]
  },
  {
    path: '/visit/:id',
    name: 'visit',
    component: Visit,
    meta: {
      layout: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/browse',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
