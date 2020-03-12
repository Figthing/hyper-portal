<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-value">
            <template v-if="item.value">
              {{ item.value }}
            </template>
            <template v-else-if="item.key == 'status'">
              <a-badge 
                :status="getInfo[item.key] | statusIconFilter" 
                :text="getInfo[item.key] | statusTextFilter"
              />
            </template>
            <template v-else>
              {{ getInfo[item.key] }}
            </template>
          </span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
import _ from 'lodash'
import { statusIconMap, listDictItemByType, getDictTextByValue } from '@/utils/common'
import { mapState, mapActions } from 'vuex'

var main

export default {
  computed: {
    ...mapState('user', {'getInfo': 'info'})
  },
  data () {
    return {
      data: [
        { title: '唯一码', key: 'operId' },
        { title: '系统登录账号', key: 'operAccount' },
        { title: '系统登录密码', key: 'pass' , value: '*******', actions: { title: '修改', callback: () => { this.$router.push({ name: 'accountSecuritySettings' }) } } },
        { title: '账号状态', key: 'status' },
        { title: '最后登录IP', key: 'lastLoginIp' },
        { title: '最后登录时间', key: 'lastLoginTime' },
        { title: '创建时间', key: 'createTime' },
      ],
      dict: {
        statusList: ''
      }
    }
  },
  beforeCreate: function () {
    main = this
  },
  mounted() {
    listDictItemByType('sys_oper_status', (data) => this.dict.statusList = data)
  },
  filters: {
    statusIconFilter(val) {
      return `${statusIconMap[val]}`
    },
    statusTextFilter(val) {
      return `${getDictTextByValue(main.dict.statusList, val)}`
    }
  }
}
</script>

<style scoped>

</style>
