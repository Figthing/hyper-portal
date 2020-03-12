<template>
  <a-drawer
    title="字典列表"
    :width="700"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
  >
    <div>
      <a-button type="primary" icon="plus" @click="onClickCreate" style="margin-bottom: 10px;">新建</a-button>
    </div>

    <a-table
      ref="table"
      rowKey="itemId"
      :loading="loading"
      :dataSource="dataSource"
      :pagination="pagination"
      :columns="columns"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="dictValue" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="dictDescript" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="onClickEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onClickDelete(record)">删除</a>
        </template>
      </span>
    </a-table>
    <edit-dict-item ref="editDictItem" :type="queryParam.type" @ok="handleOk" />
  </a-drawer>
</template>

<script>
import { Ellipsis } from '@/components'
import { mapActions } from 'vuex'
import lang from '@/lang'
import EditDictItem from './modules/EditDictItem'

export default {
  components: {
    Ellipsis,
    EditDictItem
  },
  data() {
    return {
      loading: true,

      visible: false,

      // 数据
      dataSource: [],

      // 分页
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5'],
        showTotal: (total, range) => {
          return ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },

      // 查询参数
      queryParam: {
        type: ''
      },

      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'itemText'
        },
        {
          title: '数据值',
          dataIndex: 'itemValue'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    ...mapActions('dictItem', ['ListPageDictItemByWhere', 'DeleteDictItemByIds']),

    showDrawer(type) {
      this.visible = true
      this.queryParam.type = type
      this.loadData()
    },

    // 加载数据
    loadData() {
      const { ListPageDictItemByWhere, queryParam, pagination } = this

      const where = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }, queryParam)

      this.loading = true

      ListPageDictItemByWhere(where).then(data => {
        this.dataSource = data.list == undefined ? [] : data.list
        this.pagination.total = data.total
        this.loading = false
      })
    },

    // 分页刷新
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    },

    // 删除
    handleDelete (ids) {

      const { DeleteDictItemByIds } = this

      this.$confirm({
        title: '提示',
        content: '此操作将把字典项删除, 是否继续?',
        onOk: () => {
          let params = [] 
          params = params.concat(ids)

          DeleteDictItemByIds(params)
          .then(code => {
            this.$notification['success']({
              message: '系统提示',
              description: lang.t(code)
            })         
          })
          .catch(err => {
            this.$notification['error']({
              message: '系统提示',
              description: lang.t(err)
            })
          })
          .finally(()=>{
            this.loadData()
          })
        },
        onCancel () {}
      })
    },

    // 刷新表格
    handleOk () {
      this.loadData()
    },

    // 创建字典项
    onClickCreate() {
      this.$refs.editDictItem.showModal()
    },

    // 编辑字典项
    onClickEdit(record) {
      this.$refs.editDictItem.showModal(record)
    },

    // 删除字典项
    onClickDelete(record) {
      this.handleDelete(record.itemId)
    },

    // 关闭
    onClose() {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>