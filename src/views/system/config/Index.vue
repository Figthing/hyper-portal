<template>
  <a-card :bordered="false">
    <a-table
      ref="table"
      :loading="loading"
      :rowKey="(record) => record.configId"
      :columns="columns"
      :pagination="pagination"
      :dataSource="dataSource"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="configValue" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="remark" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="onClickEdit(record)">编辑</a>
        </template>
      </span>
    </a-table>
    <edit-config ref="editConfig" @ok="handleOk" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'
import EditConfig from './modules/EditConfig'

export default {
  components: {
    Ellipsis,
    EditConfig
  },
  data() {
    return {

      loading: true,

      // 查询参数
      queryParam: {},

      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '参数键名',
          dataIndex: 'configKey'
        },
        {
          title: '参数名称',
          dataIndex: 'configName'
        },
        {
          title: '参数键值',
          dataIndex: 'configValue',
          scopedSlots: { customRender: 'configValue' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],

      // 分页
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },

      // 数据
      dataSource: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions('config', ['ListPageByWhere']),

    // 加载数据
    loadData() {

      const { ListPageByWhere, queryParam, pagination } = this

      const where = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }, queryParam)

      this.loading = true

      ListPageByWhere(where).then(data => {
        this.dataSource = data.list == undefined ? [] : data.list
        this.pagination.total = data.total
        this.loading = false
      })
    },

    // 分页重新加载数据
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    },

    handleOk () {
      this.loadData()
    },

    // 点击编辑
    onClickEdit(record) {
      this.$refs.editConfig.showModal(record)
    }
  }
}
</script>