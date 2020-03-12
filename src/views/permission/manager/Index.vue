<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关键字">
              <a-input 
                v-model="queryParam.keywords" 
                placeholder="请输入搜索人员关键字"
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
      size="default"
      rowKey="operId"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      :dataSource="dataSource"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <a-badge 
          :status="text | statusIconFilter" 
          :text="text | statusTextFilter" 
        />
      </span>
      <span slot="sex" slot-scope="text">
        {{ text | sexTextFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="onClickEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="onClickPass(record)">
                <a href="javascript:;">密码</a>
              </a-menu-item>
              <a-menu-item key="2" @click="onClickDelete(record)">
                <a href="javascript:;">删除</a>
              </a-menu-item>
              <a-menu-item key="3" @click="onClickStatus(record)">
                <a href="javascript:;">
                  <template v-if="record.status === '0'">
                    停用
                  </template>
                  <template v-else>
                    启用
                  </template>
                </a>
              </a-menu-item>
            </a-menu>
            <a class="ant-dropdown-link" style="margin-left: 8px">
              更多 <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </span>
    </a-table>

    <create-user ref="createUser" :dictSexList="dict.sexList" @ok="handleOk" />
    <edit-user ref="editUser" :dictSexList="dict.sexList" @ok="handleOk" />
    <edit-pass ref="editPass" @ok="handleOk" />
  </a-card>
</template>

<script>
import { statusIconMap, listDictItemByType, getDictTextByValue } from '@/utils/common'
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'
import CreateUser from './modules/CreateUser'
import EditUser from './modules/EditUser'
import EditPass from './modules/EditPass'

var main

export default {
  components: {
    Ellipsis,
    CreateUser,
    EditUser,
    EditPass
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
          title: '账号',
          dataIndex: 'operAccount'
        },
        {
          title: '姓名',
          dataIndex: 'operName'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginTime'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
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

      // 字典
      dict: {
        statusList: [],
        sexList: []
      }
    }
  },
  beforeCreate() {
    main = this
  },
  mounted() {
    listDictItemByType('sys_oper_status', (data) => this.dict.statusList = data)
    listDictItemByType('sys_oper_sex', (data) => this.dict.sexList = data)
  },
  created () {
    this.loadData()
  },
  filters: {
    statusIconFilter(val) {
      return `${statusIconMap[val]}`
    },
    statusTextFilter(val) {
      return `${getDictTextByValue(main.dict.statusList, val)}`
    },
    sexTextFilter(val) {
      return `${getDictTextByValue(main.dict.sexList, val + '')}`
    }
  },
  methods: {
    ...mapActions({
      'ListManager': 'manager/ListManager',
      'DeleteManager': 'manager/DeleteManager',
      'UpdateManagerStatus': 'manager/UpdateManagerStatus'
    }),

    // 加载数据
    loadData() {

      const { ListManager, queryParam, pagination } = this

      const where = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }, queryParam)

      this.loading = true

      ListManager(where).then(data => {
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

      const { DeleteRoles, DeleteManager } = this

      this.$confirm({
        title: '提示',
        content: '此操作将把用户删除, 是否继续?',
        onOk: () => {
          let params = [] 
          params = params.concat(ids)

          DeleteManager(params)
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

    // 点击删除菜单
    onClickMenuDelete () {
      this.handleDelete(this.selectedRowKeys)
    },

    // 选中表格
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    
    // 点击删除
    onClickDelete (record) {
      this.handleDelete(record.operId)
    },

    // 点击创建用户
    onClickCreate () {
      this.$refs.createUser.showDrawer()
    },

    // 点击编辑用户
    onClickEdit(record) {
      this.$refs.editUser.showDrawer(record)
    },

    // 点击修改密码
    onClickPass (record) {
      this.$refs.editPass.showModal(record)
    },

    // 点击状态
    onClickStatus(record) {
      const { UpdateManagerStatus } = this

      UpdateManagerStatus({
        id: record.operId,
        status: record.status === '0' ? 1 : 0
      })
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
    }
  }
}
</script>
