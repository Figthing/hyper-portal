<template>
  <a-modal
    title="编辑参数"
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
          label="参数名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input 
            read-only
            v-decorator="['configName']" 
          />
        </a-form-item>
        <a-form-item
          label="参数键名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input 
            read-only
            v-decorator="['configKey', {rules: [{ required: false }]}]" 
          />
        </a-form-item>
        <a-form-item
          label="参数键值"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['configValue']"
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
      confirmLoading: false,
      form: this.$form.createForm(this),
      configId: 0,

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
    ...mapActions('config', ['UpdateById', 'ListSysConfig']),

    showModal (record) {
      this.visible = true

      const data = pick(record, ['configName', 'configKey', 'configValue', 'remark'])

      this.configId = record.configId

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
        const { configId, UpdateById, ListSysConfig } = this

        const data = pick(fieldsValue, ['configValue', 'remark'])
        data.id = this.configId

        UpdateById(data)
        .then(res => {
          this.$notification['success']({
            message: '系统提示',
            description: lang.t(res)
          })

          ListSysConfig()
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
      })
    }
  }
}
</script>