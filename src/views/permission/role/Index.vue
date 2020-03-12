<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关键字">
              <a-input 
                v-model="queryParam.keywords" 
                placeholder="请输入搜索角色关键字"
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
      <a-button type="primary" icon="plus" @click="$refs.editRole.showModal()">新建</a-button>
      <a-dropdown>
        <a-menu slot="overlay" @click="onClickMenuDelete">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <a-table
      ref="table"
      rowKey="id"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="remark" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="onClickEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="onClickDelete(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="onClickGrantPermission(record)">权限授权</a>
        </template>
      </span>
    </a-table>
    <edit-role ref="editRole" @ok="handleOk" />
    <grant-permission :userPermissionTree="userPermissionTree" ref="grantPermission" @ok="handleOk" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'
import EditRole from './modules/EditRole'
import GrantPermission from './modules/GrantPermission'

export default {
  components: {
    Ellipsis,
    EditRole,
    GrantPermission
  },
  data () {
    return {
      loading: true,

      mdl: {},

      // 查询参数
      queryParam: {},

      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '角色标识',
          dataIndex: 'code'
        },
        {
          title: '角色介绍',
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

      // 数据
      dataSource: [],

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

      // 加载数据方法 必须为 Promise 对象
      selectedRowKeys: [],
      selectedRows: [],

      // 当前用户的权限树
      userPermissionTree: []
    }
  },
  mounted() {
      // 当前用户权限
      this.GetUserPermission().then(res => {
        this.userPermissionTree = this.buildTreeData(res, '0')
      })
  },
  created () {
    this.loadData()
  },
  methods: {
    ...mapActions({
      'ListRoles': 'role/ListRoles',
      'DeleteRoles': 'role/DeleteRoles',
      'GetUserPermission': 'user/GetUserPermission'
    }),

    // 加载数据
    loadData() {

      const { ListRoles, queryParam, pagination } = this

      const where = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }, queryParam)

      this.loading = true

      ListRoles(where).then(data => {
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

    // 删除
    handleDelete (ids) {

      const { DeleteRoles } = this

      this.$confirm({
        title: '提示',
        content: '此操作将把角色删除, 是否继续?',
        onOk: () => {
          let params = [] 
          params = params.concat(ids)

          DeleteRoles(params)
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

    handleOk () {
      this.loadData()
    },

    onClickMenuDelete () {
      this.handleDelete(this.selectedRowKeys)
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    
    // 点击删除
    onClickDelete (record) {
      this.handleDelete(record.id)
    },

    // 点击编辑
    onClickEdit (record) {
      this.$refs.editRole.data = record
      this.$refs.editRole.showModal()
    },

    // 点击授权
    onClickGrantPermission(record) {
      this.$refs.grantPermission.data = record
      this.$refs.grantPermission.showDrawer()
    },

    // 生成tree数据
    buildTreeData(data, parentId) {
      const tree = []

      for (var i = 0; i < data.length; i++) {
        const node = data[i]

        if (node.parentId === parentId) {
          const clientNode = {
            title: node.menuTitle,
            key: node.permissionId,
            children: this.buildTreeData(data, node.permissionId)
          }
          tree.push(clientNode)
        }
      }

      return tree
    }
  }
}
</script>
