<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典名称">
              <a-input 
                v-model="queryParam.name" 
                placeholder="请输入字典名称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="字典类型">
              <a-input 
                v-model="queryParam.type" 
                placeholder="请输入字典类型"
              />
            </a-form-item>
          </a-col>
          <a-col md="8" sm="24">
            <span class="table-page-search-submitButtons" style="float: 'right'">
              <a-button icon="search" type="primary" @click="loadData">查询</a-button>
              <a-button icon="reload" style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="onClickCreate">新建</a-button>
    </div>

    <a-table
      ref="table"
      rowKey="dictId"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
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
          <a-divider type="vertical" />
          <a @click="onClickDictItem(record)">字典配置</a>
        </template>
      </span>
    </a-table>
    <edit-dict ref="editDict" @ok="handleOk" />
    <dict-item ref="dictItem" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'
import EditDict from './modules/EditDict'
import DictItem from './DictItem'

export default {
  components: {
    Ellipsis,
    EditDict,
    DictItem
  },
  data() {
    return {

      loading: true,

      // 数据
      dataSource: [],

      // 查询参数
      queryParam: {},

      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '字典名称',
          dataIndex: 'dictName'
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
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

      // 字典Type
      dictType: '',
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions('dict', ['ListPageByWhere', 'DeleteByIds']),

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

    // 刷新列表
    handleOk () {
      this.loadData()
    },

    // 分页刷新
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    },

    // 删除
    handleDelete (ids) {

      const { DeleteByIds } = this

      this.$confirm({
        title: '提示',
        content: '此操作将把字典删除, 是否继续?',
        onOk: () => {
          let params = [] 
          params = params.concat(ids)

          DeleteByIds(params)
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

    // 点击新建
    onClickCreate() {
      this.$refs.editDict.showModal()
    },

    // 点击编辑
    onClickEdit(record) {
        this.$refs.editDict.showModal(record)
    },

    // 删除
    onClickDelete(record) {
      this.handleDelete(record.dictId)
    },

    // 字典配置
    onClickDictItem(record) {
      this.$refs.dictItem.showDrawer(record.dictType)
    }
  }
}
</script>