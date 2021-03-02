<template>
  <a-modal
    :title="operation ? '新建岗位': '编辑岗位'"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    cancelText="关闭"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="岗位名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['jobName', {rules: [{ required: true, message: '请输入岗位名称' }]}]" 
            placeholder="请输入岗位名称" 
          />
        </a-form-item>
        <a-form-item
          label="所属部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :required="true"
          :validate-status="treeSelectValidate.validateStatus"
          :help="treeSelectValidate.errorMsg"
        >
          <a-tree-select
            style="width: 100%"
            :treeData="deptRows"
            :treeDefaultExpandAll="false"
            v-model="value"
            placeholder="请选择部门"
          />
        </a-form-item>
        <a-form-item
          label="排序"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0" 
            :max="99" 
            v-decorator="['sort']" 
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import { pick } from 'lodash'
import { mapActions } from 'vuex'
import lang from '@/lang'

export default {
  props: {
    deptRows: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      operation: true,     // true-新建，false-编辑
      confirmLoading: false,
      form: this.$form.createForm(this),
      value: undefined,
      dictId: '',

      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },

      treeSelectValidate: {
        validateStatus: '',
        errorMsg: ''
      },

    }
  },
  methods: {
    ...mapActions('job', ['UpdateDictById', 'InsertJob']),

    showModal (record) {
      this.visible = true

      if (record === undefined) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            sort: 0
          })
        })
        return
      }

      this.operation = false
      this.jobId = record.jobId
      const data = pick(record, ['jobName', 'value', 'sort'])

      this.$nextTick(() => {
          this.form.setFieldsValue(data)
      })
    },
    
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.value = undefined
      this.visible = false
      this.treeSelectValidate = {
        validateStatus: '',
        errorMsg: ''
      }
    },

    // 提交表单
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {

        if (err) {
          return
        }

        if (this.value == undefined) {
          this.treeSelectValidate = {
            validateStatus: 'error',
            errorMsg: '请选择部门'
          }
          return
        }

        this.confirmLoading = true
        const { InsertJob, UpdateDictById, operation, dictId, value } = this
        const data = pick(fieldsValue, ['jobName', 'sort'])
        data.deptId = value

        if (operation) {  // 新增
          InsertJob(data)
          .then(res => {
            this.$notification['success']({
              message: '系统提示',
              description: lang.t(res)
            })

            this.$emit('ok')
            this.handleCancel()
          })
          .catch(err => {
            this.$notification['error']({
              message: '系统提示',
              description: lang.t(err)
            })
          })
          .finally(() => {
            this.confirmLoading = false
          })
        } else {  // 编辑
          const values = {
            ...data,
            id: this.dictId
          }

          UpdateDictById(values)
          .then(res => {
            this.$notification['success']({
              message: '系统提示',
              description: lang.t(res)
            })

            this.$emit('ok')
            this.handleCancel()
          })
          .catch(err => {
            this.$notification['error']({
              message: '系统提示',
              description: lang.t(err)
            })
          })
          .finally(() => {
            this.dictId = ''
            this.confirmLoading = false
          })
        }
      })
    },
  }
}
</script>