import { createApp } from 'vue'
import App from './App.vue'

import store from './store';

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports'
import AmplifyVue from '@aws-amplify/ui-vue'
import { getCurrentUser } from 'aws-amplify/auth'

import router from './router'
import '@/styles/main.scss'
import '@/styles/amplify.scss'

Amplify.configure(awsconfig)

const sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const currentTheme = localStorage.getItem('theme') || sysTheme

document.documentElement.setAttribute('data-theme', currentTheme)

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: currentTheme,
    themes: {
      light: {
        colors: {
          surface: 'rgb(248, 248, 248)',
        },
      },
    },
  },
})

const initializeApp = async () => {
  try {
    const { userId, signInDetails } = await getCurrentUser()

    store.dispatch('auth/setUser', {
      userId,
      email: signInDetails.loginId,
    })
  } catch (error) {
    console.warn(error)
  }

  const app = createApp(App)
    .use(store)
    .use(AmplifyVue)
    .use(vuetify)
    .use(router)
    .mount('#app')
}

initializeApp()
