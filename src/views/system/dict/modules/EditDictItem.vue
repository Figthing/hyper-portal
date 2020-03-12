<template>
  <a-modal
    :title=" operation ? '新增字典项' : '编辑字典项'"
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
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['itemText', {rules: [{required: true, message: '请输入字典项名称'}]}]" 
            placeholder="请输入字典项名称" 
          />
        </a-form-item>
        <a-form-item
          label="数据值"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['itemValue', {rules: [{required: true, message: '请输入字典项数据值'}]}]" 
            placeholder="请输入字典项数据值" 
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
import { pick } from 'lodash'
import { mapActions } from 'vuex'
import lang from '@/lang'

export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      operation: true,       //true-新增字典项，false-编辑字典项
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      sort: 0,
      id: '',

      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
    }
  },
  methods: {
    ...mapActions('dictItem', ['InsertDictItem', 'UpdateDictItemById']),

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
      this.id = record.itemId
      
      this.$nextTick(() => {
        const values = pick(record, ['itemText', 'itemValue', 'sort'])
        this.form.setFieldsValue(values)
      })
    },

    handleCancel () {
      this.visible = false
      this.operation = true
      this.form.resetFields()
    },

    // 提交表单
    handleSubmit (e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {

        if (err) {
          return
        }

        this.confirmLoading = true

        const { InsertDictItem, UpdateDictItemById, type, operation } = this
        const data = pick(fieldsValue, ['itemText', 'itemValue', 'sort'])

        if (operation) {        // 新增
          InsertDictItem({
            ...data,
            dictType: type
          })
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
        } else {        // 编辑
          UpdateDictItemById({
            ...data,
            id: this.id,
            dictType: type
          })
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
        }

      })
    }
  }
}
</script>