<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="岗位名称">
              <a-input 
                v-model="queryParam.jobName" 
                placeholder="请输入岗位名称"
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
      rowKey="jobId"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="onClickEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onClickDelete(record)">删除</a>
        </template>
      </span>
    </a-table>
    <edit-job :deptRows="deptRows" ref="editJob" @ok="handleOk" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'
import EditJob from './modules/EditJob'

export default {
  components: {
    Ellipsis,
    EditJob
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
          title: '岗位名称',
          dataIndex: 'jobName'
        },
        {
          title: '所属部门',
          dataIndex: 'deptName'
        },
        {
          title: '排序',
          dataIndex: 'sort',
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

      // 部门数据
      deptRows: []
    }
  },
  mounted() {
    this.ListDeptByWhere().then(data => {
      const tmp = []
      this.listToTree(data, tmp, '0')
      this.deptRows = tmp
    })
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions({
      'ListPageByWhere': 'job/ListPageByWhere',
      'DeleteByIds': 'job/DeleteByIds',
      'ListDeptByWhere': 'dept/ListByWhere'
    }),

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
        content: '此操作将把岗位删除, 是否继续?',
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
      this.$refs.editJob.showModal()
    },

    // 点击编辑
    onClickEdit(record) {
        this.$refs.editJob.showModal(record)
    },

    // 删除
    onClickDelete(record) {
      this.handleDelete(record.jobId)
    },

    // 数组转树形结构
    listToTree(list, tree, parentId) {

      list.forEach(item => {
        // 判断是否为父级菜单
        if (item.parentId === parentId + '') {
          const child = {
            title: item.deptName,
            value: item.deptId,
            key: item.deptId,
            children: []
          }

          // 迭代 list， 找到当前菜单相符合的所有子菜单
          this.listToTree(list, child.children, item.deptId)

          // 删掉不存在 children 值的属性
          if (child.children.length <= 0) {
            delete child.children
          }

          // 加入到树中
          tree.push(child)
        }
      })
    }
  }
}
</script>