import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhLocale from './zh-cn'
import apiLocale from './api'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...apiLocale
  }
}

const i18n = new VueI18n({
  // options: en | zh | es
  locale: 'zh',
  messages
})

export default i18n
