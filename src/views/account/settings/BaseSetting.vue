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
            label="姓名"
            hasFeedback
          >
            <a-input 
              v-decorator="['operName', { rules: [{message: '请输入自己的姓名'}]}]" 
              placeholder="请输入自己的姓名" 
            />
          </a-form-item>

          <a-form-item
            label="性别"
            :required="false"
          >
            <a-radio-group 
              name="radioGroup"
              v-decorator="['sex']" 
            >
              <a-radio key="0" value="0">女</a-radio>
              <a-radio key="1" value="1">男</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            label="出生年月"
          >
            <a-date-picker
              style="width: 100%"
              format="YYYY-MM-DD"
              placeholder="请选择出生年月"
              v-decorator="['birthday']"
            />
          </a-form-item>

          <a-form-item
            label="邮箱"
            :required="false"
            hasFeedback
          >
            <a-input 
              v-decorator="['email', {rules: [{ required: false }, { validator: validateEmail }]}]"
              placeholder="请输入邮箱"
            />
          </a-form-item>

          <a-form-item
            label="手机号"
            :required="false"
            hasFeedback
          >
            <a-input 
              v-decorator="['phone', {rules: [{ required: false }, { validator: validatePhone }]}]" 
              placeholder="请输入手机号"
            />
          </a-form-item>

          <a-form-item
            label="联系地址"
            :required="false"
          >
            <a-input 
              v-decorator="['address']" 
              placeholder="请输入联系地址"
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
import moment from 'moment'
import pick from 'lodash.pick'
import { mapState, mapActions } from 'vuex'
import { validPhone, validEmail } from '@/utils/validate'
import lang from '@/lang'
import AvatarModal from './AvatarModal'

export default {
  computed: {
    ...mapState('user', {'userInfo': 'info'})
  },
  components: {
    AvatarModal
  },
  data () {
    return {
      form: this.$form.createForm(this),

      state: {
        saveBtn: false
      }
    }
  },
  mounted () {
    this.findUserInfo()
  },
  methods: {
    ...mapActions('user', {'GetUserInfo': 'GetInfo', 'UpdateUserInfo': 'UpdateUserInfo'}),

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

    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        const birthday = fieldsValue['birthday'] == undefined ? '' : fieldsValue['birthday'].format('YYYY-MM-DD')
        const name = fieldsValue['operName']
        delete fieldsValue['birthday']
        delete fieldsValue['operName']

        const values = {
          ...fieldsValue,
          birthday: birthday,
          name: name
        }

        this.state.saveBtn = true

        this.UpdateUserInfo(values)
        .then(res=>{
          this.$notification['success']({
            message: '系统提示',
            description: lang.t(res)
          })

          this.GetUserInfo()
        })
        .catch((err)=>{
          this.$notification['error']({
            message: '系统提示',
            description: lang.t(err)
          })
        })
        .finally(()=>{
          this.state.saveBtn = false
        })
      })
    },

    // 获取用户信息
    findUserInfo () {
      const data = pick(this.userInfo, ['operName', 'email', 'phone', 'address'])
      this.form.setFieldsValue({
        ...data,
        sex: this.userInfo.sex + ''
      })

      if (this.userInfo.birthday !== '') {
        this.form.setFieldsValue({
          birthday: moment(this.userInfo.birthday, 'YYYY-MM-DD HH:mm:ss')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
