<template>
  <a-modal
    :title="operation ? '新建字典': '编辑字典'"
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
          label="字典名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['dictName', {rules: [{ required: true }]}]" 
            placeholder="请输入字典名称" 
          />
        </a-form-item>
        <a-form-item
          label="字典类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['dictType', {rules: [{ required: true, message: '请输入字典类型' }, { pattern: /^([\w]+)+$/, message: '只能是a-zA-Z0-_的字符' }]}]" 
            placeholder="请输入字典类型" 
          />
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['remark']"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { pick } from 'lodash'
import { mapActions } from 'vuex'
import lang from '@/lang'

export default {
  data() {
    return {
      visible: false,
      operation: true,     // true-新建，false-编辑
      confirmLoading: false,
      form: this.$form.createForm(this),
      dictId: '',

      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
    }
  },
  methods: {
    ...mapActions('dict', ['UpdateDictById', 'InsertDict']),

    showModal (record) {
      this.visible = true

      if (record === undefined) {
        return
      }

      this.operation = false
      this.dictId = record.dictId
      const data = pick(record, ['dictName', 'dictType', 'remark'])

      this.$nextTick(() => {
          this.form.setFieldsValue(data)
      })
    },
    
    // 关闭
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    // 提交表单
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {

        if (err) {
          return
        }

        this.confirmLoading = true
        const data = pick(fieldsValue, ['dictName', 'dictType', 'remark'])
        const { InsertDict, UpdateDictById, operation, dictId } = this

        if (operation) {  // 新增
          InsertDict(data)
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
    }
  }
}
</script>