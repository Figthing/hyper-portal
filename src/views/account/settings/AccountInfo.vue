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
import { mapState } from 'vuex'

var stateColor = ['processing', 'default', 'warning']
var stateText = ['正常', '停用', '锁定']

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
        { title: '创建时间', key: 'createTime' },
      ]
    }
  },
  filters: {
    statusIconFilter(val) {
      return `${stateColor[val]}`
    },
    statusTextFilter(val) {
      return `${stateText[val]}`
    }
  }
}
</script>

<style scoped>

</style>
