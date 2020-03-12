<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form 
          layout="vertical"
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item
            label="原始密码"
            hasFeedback
          >
            <a-input 
              type="password"
              v-decorator="['oldPwd', { rules: [{required: true, message: '请输入原始密码'}]}]" 
              placeholder="请输入原始密码" 
            />
          </a-form-item>

          <a-form-item
            label="新密码"
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
            hasFeedback
          >
            <a-input 
              type="password"
              v-decorator="['checkPass', { rules: [{required: true, message: '请输入确认密码'}, { validator: validatePass }]}]" 
              placeholder="请输入确认密码" 
            />
          </a-form-item>

          <a-form-item>
            <a-button 
              type="primary" 
              html-type="submit"
              :loading="state.saveBtn"
            >
              提交
            </a-button>
          </a-form-item>
        </a-form>

      </a-col>

    </a-row>

  </div>
</template>

<script>
import lang from '@/lang'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: this.$form.createForm(this),

      state: {
        saveBtn: false
      }
    }
  },
  methods: {
    ...mapActions('user', ['UpdateUserPass', 'Logout']),

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

    // 表单提交成功
    handleSuccess (res) {
      this.$notification['success']({
        message: '系统提示',
        description: lang.t(res),
        duration: 1,
        onClose: () => {
          this.Logout().then(res => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          })
        }
      })
    },

    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        this.state.saveBtn = true
        delete fieldsValue['checkPass']

        const values = {
          ...fieldsValue
        }

        this.UpdateUserPass(values)
        .then((res) => this.handleSuccess(res))
        .catch((err) => {
          this.$notification['error']({
            message: '系统提示',
            description: lang.t(err)
          })
        })
        .finally(() => {
          this.state.saveBtn = false
        })
        console.info(fieldsValue)
      })
    }
  }
}
</script>

<style scoped>

</style>
