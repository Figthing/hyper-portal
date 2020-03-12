<template>
  <a-drawer
    title="新建人员"
    :width="700"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
  >

    <a-form :form="form" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="登录账号"
            hasFeedback
          >
            <a-input
              v-decorator="['account', {
                rules: [{ required: true, message: '请输入登录账号' }]
              }]"
              placeholder="请输入登录账号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="登录密码"
            hasFeedback
          >
            <a-input
              type="password"
              v-decorator="['pass', {
                rules: [{ required: true, message: '请输入登录密码' }, {min: 3, max: 16, message: '密码长度要求3-18位'}]
              }]"
              placeholder="密码长度3-18位"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="人员姓名"
            hasFeedback
          >
            <a-input
              v-decorator="['name', {
                rules: [{ required: true, message: '请输入人员的姓名' }]
              }]"
              placeholder="请输入人员的姓名"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="性别"
          >
            <a-select
              v-decorator="['sex']"
            >
              <a-select-option :key="item.itemValue" v-for="item in dictSexList" >
                {{ item.itemText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="出生年月"
            hasFeedback
          >
            <a-date-picker
              style="width: 100%"
              format="YYYY-MM-DD"
              placeholder="请选择出生年月"
              v-decorator="['birthday']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="手机号"
            hasFeedback
          >
            <a-input
              v-decorator="['phone', {rules: [{ required: false }, { validator: validatePhone }]}]"
              placeholder="请输入手机号"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="邮箱"
            hasFeedback
          >
            <a-input
              v-decorator="['email', {rules: [{ required: false }, { validator: validateEmail }]}]"
              placeholder="请输入邮箱"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="联系地址"
          >
            <a-input
              v-decorator="['address']"
              placeholder="请输入联系地址"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col>
          <a-form-item 
            label="角色配置"
            hasFeedback
          >
            <a-select
              mode="tags"
              v-decorator="['role', {rules: [{ required: true, message: '请配置角色' }]}]"
              placeholder="请选择角色"
            >
              <a-select-option :key="item.id" v-for="item in roleData" >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          取消
        </a-button>
        <a-button 
          @click="handleSubmit"
          :loading="state.saveBtn"
          type="primary">
          确认
        </a-button>
      </div>
    </a-form>

  </a-drawer>
</template>

<script>
import moment from 'moment'
import { pick, partition } from 'lodash'
import { mapActions } from 'vuex'
import { validPhone, validEmail } from '@/utils/validate'
import { listDictItemByType } from '@/utils/common'
import lang from '@/lang'

export default {
  props: {
    dictSexList: {
      type: [Array],
      required: true
    }
  },
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      state: {
        saveBtn: false
      },

      roleData: [],
    }
  },
  methods: {
    ...mapActions({
      'ListRoles': 'role/ListRoles',
      'InsertManager': 'manager/InsertManager'
    }),

    // 验证邮箱
    validateEmail (rule, value, callback) {
      if (value === '' || undefined === value) {
        callback()
      } else {
        if (!validEmail(value)) {
          callback(new Error('Email格式错误!'))
        }

        callback()
      }
    },

    // 验证手机号
    validatePhone (rule, value, callback) {
      if (value === '' || undefined === value) {
        callback()
      } else {
        if (!validPhone(value)) {
          callback(new Error('手机号格式错误!'))
        }

        callback()
      }
    },

    // 显示
    showDrawer() {
      this.visible = true
      this.initForm()
    },

    // 初始化form
    initForm() {

      const { ListRoles } = this

      // 获取角色列表
      ListRoles({
        pageSize: 100
      }).then(data => {
        this.$data.roleData = data.list
      })

      this.$nextTick(() => {
        this.form.setFieldsValue({
            sex: 2 + ''
        })
      })
    },

    // 表单提交
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        this.state.saveBtn = true

        const { InsertManager } = this
        const data = pick(fieldsValue, ['account', 'pass', 'name', 'sex', 'phone', 'email', 'address'])
        data.roleId = fieldsValue['role']

        if (fieldsValue['birthday'] !== undefined) {
          data.birthday = fieldsValue['birthday'].format('YYYY-MM-DD')
        }

        // 新增人员
        InsertManager(data)
        .then(res => {
          this.$notification['success']({
            message: '系统提示',
            description: lang.t(res)
          })

          this.$emit('ok')
          this.onClose()
        })
        .catch(err => {
          this.$notification['error']({
            message: '系统提示',
            description: lang.t(err)
          })
        })
        .finally(() => {
          this.state.saveBtn = false
        })
      })
    },
    
    // 关闭
    onClose() {
      this.visible = false
      this.$data.data = {}
      this.form.resetFields()
    },
  }
}
</script>