<template>
  <a-modal
    :title=" operation ? '创建角色' : '编辑角色'"
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
          label="角色名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['name', {rules: [{required: true, min: 5, message: '请填写至少5个字符的角色名称'}]}]" 
            placeholder="请输入角色名称" 
          />
        </a-form-item>
        <a-form-item
          label="角色标识"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input 
            v-decorator="['code', {rules: [{required: true, min: 3, message: '请填写至少3个字符的角色标识'}]}]" 
            placeholder="请输入角色标识" 
          />
        </a-form-item>
        <a-form-item
          label="角色描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import lang from '@/lang'
import pick from 'lodash.pick'

export default {
  data () {
    return {
      data: {},

      // true-新增,false-修改
      operation: true,
      
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    ...mapActions('role', ['InsertRole', 'UpdateRole']),
    showModal () {
      this.visible = true
      this.initForm()
    },

    // 初始化表单
    initForm() {
      if (this.data.id === undefined) {
        return
      }

      this.operation = false
      this.$nextTick(() => {
        const values = pick(this.data, ['name', 'code', 'remark'])
        this.form.setFieldsValue(values)
      })
      
    },

    // 提交表单
    handleSubmit (e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        this.confirmLoading = true

        const { InsertRole, UpdateRole } = this

        if (this.operation) {
          // 新增角色
          InsertRole(fieldsValue)
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
        } else {
          // 更新角色
          UpdateRole(Object.assign({id: this.data.id}, fieldsValue))
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
    },

    handleCancel () {
      this.data = {}
      this.form.resetFields()
      this.operation = true
      this.visible = false
    }
  }
}
</script>
