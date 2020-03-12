<template>
  <a-modal
    title="重新设置密码"
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
          label="用户账号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            read-only
            v-decorator="['account']" 
          />
        </a-form-item>
        <a-form-item
          label="登录密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            type="password"
            v-decorator="['newPwd', { rules: [
              {required: true, message: '请输入新密码'},
              {min: 3, max: 16, message: '密码长度要求3-18位'}
            ]}]" 
            placeholder="密码长度3-18位" 
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            type="password"
            v-decorator="['checkPass', { rules: [{required: true, message: '请输入确认密码'}, { validator: validatePass }]}]" 
            placeholder="请输入确认密码" 
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
      operId: '',

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
    ...mapActions('manager', ['ResetManagerPass']),

    // 验证确认密码
    validatePass (rule, value, callback) {
      if (value === '' || undefined === value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.getFieldValue('newPwd')) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },

    // 显示
    showModal (record) {
      this.visible = true
      this.operId = record.operId

      this.$nextTick(() => {
          this.form.setFieldsValue({
              account: record.operName
          })
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
        const { ResetManagerPass, operId } = this

        const data = pick(fieldsValue, ['newPwd'])
        data.id = operId

        ResetManagerPass(data)
        .then(res => {
          this.$notification['success']({
            message: '系统提示',
            description: lang.t(res)
          })

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