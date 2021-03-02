<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="操作人">
              <a-input 
                v-model="queryParam.name" 
                placeholder="请输入操作人"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="创建时间">
              <a-range-picker 
                format="YYYY-MM-DD"
                v-model="queryParam.createTimeRange"
                :placeholder="['开始时间', '结束时间']"
                @change="onChangePicker" 
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="操作类型">
              <a-select v-model="queryParam.method" placeholder="请选择操作类型">
                <a-select-option value="get">查询</a-select-option>
                <a-select-option value="post">添加</a-select-option>
                <a-select-option value="put">更新</a-select-option>
                <a-select-option value="delete">删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col md="6" sm="24">
            <span class="table-page-search-submitButtons" style="float: 'right'">
              <a-button icon="search" type="primary" @click="loadData">查询</a-button>
              <a-button icon="reload" style="margin-left: 8px" @click="onClickRest">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="logId"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="8">
            <a-badge status="success" :text="'请求URL：'+record.requestUrl" />
          </a-col>
          <a-col :span="8">
            <a-badge status="success" :text="'请求方法：'+record.requestMethod" />
          </a-col>
          <a-col :span="8">
            <a-badge status="success" :text="'业务流水号：'+record.transNo" />
          </a-col>
          <a-col :span="8">
            <a-badge status="success" :text="'请求参数：'+record.requestParams" />
          </a-col>
          <a-col :span="8">
            <a-badge status="success" :text="record.code | responseResult" />
          </a-col>
        </a-row>
      </div>
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="auditModel" slot-scope="text">
        {{ text | sysModuleFilter }}
      </span>
      <span slot="code" slot-scope="text">
        {{ text | codeFileter }}
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import { Ellipsis } from '@/components'

var main

export default {
  components: {
    Ellipsis
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
          title: '操作人名称',
          dataIndex: 'operAccount'
        },
        {
          title: '系统模块',
          dataIndex: 'auditModel',
          scopedSlots: { customRender: 'auditModel' }
        },
        {
          title: '描述',
          dataIndex: 'auditDesc'
        },
        {
          title: 'IP',
          dataIndex: 'ip'
        },
        {
          title: '耗时（毫秒）',
          dataIndex: 'consumingTime'
        },
        {
          title: '操作状态',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }
      ],

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

      // 字典
      dict: {
        sysModulesName: [],
      }
    }
  },
  beforeCreate() {
    main = this
  },
  mounted() {
    listDictItemByType('sys_module_name', (data) => this.dict.sysModulesName = data)
  },
  created () {
    this.loadData()
  },
  filters: {
    sysModuleFilter(val) {
      return `${getDictTextByValue(main.dict.sysModulesName, val)}`
    },
    codeFileter(val) {
      return val === '0' ? '正常' : '异常'
    },
    responseResult(val) {
      return '响应结果：' + `${lang.t(val)}`
    }
  },
  methods: {
    ...mapActions('syslog', ['ListPageByWhere']),

    // 加载数据
    loadData() {

      const { ListPageByWhere, queryParam, pagination } = this

      const where = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }, queryParam)

      this.loading = true

      if (where.createTimeRange !== undefined) {
        delete where['createTimeRange']
      }

      ListPageByWhere(where).then(data => {
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

    // 刷新数据
    handleOk () {
      this.$refs.table.refresh()
    },

    // 选择日期
    onChangePicker(value, dateString) {
      this.queryParam.beginTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    },

    // 重置查询
    onClickRest() {
      this.queryParam = {}
    }

  }
}
</script>
