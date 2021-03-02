import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

import config from './modules/config'
import role from './modules/role'
import manager from './modules/manager'
import dept from './modules/dept'
import job from './modules/job'
import dict from './modules/dict'
import dictItem from './modules/dictItem'
import syslog from './modules/syslog'

// dynamic router permission control (Experimental)
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    config,
    role,
    manager,
    dept,
    job,
    dict,
    dictItem,
    syslog
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
