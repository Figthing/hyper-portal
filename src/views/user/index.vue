<template>
  <div class="app-container">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="账号信息" name="first">
        <div class="user" style="width: 600px">
          <el-form ref="form1" :model="user" label-width="100px">
            <el-form-item label="账号">
              <el-input disabled v-model="user.operAccount" />
            </el-form-item>

            <el-form-item label="最后登录IP">
              <el-input disabled v-model="user.lastLoginIp" />
            </el-form-item>

            <el-form-item label="最后登录时间">
              <el-input disabled v-model="user.lastLoginTime" />
            </el-form-item>

          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="个人信息" name="second">
        <div class="user" style="width: 600px">
          <el-form ref="form2" :model="user" :rules="rules" label-width="100px">

              <el-form-item
                label="姓名"
                prop="operName"
              >
                <el-input v-model="user.operName" />
              </el-form-item>

              <el-form-item label="性别">
                <el-radio-group v-model="user.sex">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">其他</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="出生年月">
                <el-date-picker
                  v-model="user.birthday"
                  type="date"
                  :editable="false"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item
                label="邮箱"
                prop="email"
              >
                <el-input
                  v-model="user.email"
                />
              </el-form-item>

              <el-form-item
                label="手机号"
                prop="phone"
              >
                <el-input v-model="user.phone" />
              </el-form-item>

              <el-form-item label="联系地址">
                <el-input v-model="user.address" />
              </el-form-item>

              <el-form-item>
                <el-button
                 :loading="loading"
                 type="primary" @click="infoSubmitForm()">保存</el-button>
              </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="third">
        <div class="user" style="width: 600px">
          <el-form ref="form3" :model="passForm" :rules="rulesPass" label-width="100px">
            <el-form-item
              label="原始密码"
              prop="oldPass"
              >
              <el-input v-model="passForm.oldPass" />
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="newPass"
              >
              <el-input v-model="passForm.newPass" />
            </el-form-item>
            <el-form-item
             label="确认密码"
             prop="checkPass"
             >
              <el-input v-model="passForm.checkPass" />
            </el-form-item>

            <el-form-item>
              <el-button
               :loading="loading"
               type="primary"
               @click="passSubmitForm()"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUserInfo, updatePass, resetEmail, updateEmail } from '@/api/user'
import { formatDate } from '@/utils/common'
import { isvalidPhone } from '@/utils/validate'
import { Notification } from 'element-ui'

export default {
  name: 'Index',
  data() {
    // 验证手机号
    var validatePhone = (rule, value, callback) => {
      if (value === '' || undefined === value) {
        callback()
      } else {
        if (!isvalidPhone(value)) {
          callback(new Error('手机号格式错误!'))
        }

        callback()
      }
    }
    // 验证密码
    var validatePass = (rule, value, callback) => {
      if (value === '' || undefined === value) {
        callback(new Error('请输入密码'))
      }

      if (this.passForm.checkPass !== '') {
        this.$refs.form3.validateField('checkPass')
      }
      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '' || undefined === value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passForm.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else if (value.length < 3 || value.length > 18) {
        callback(new Error('密码长度要求3-18位!'))
      } else {
        callback()
      }
    }
    return {
      passForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      user: {
        operAccount: '',
        operName: '',
        lastLoginIp: '',
        lastLoginTime: '',
        sex: 0,
        phone: '',
        birthday: 0,
        email: '',
        address: ''
      },
      rulesPass: {
        oldPass: [
          { required: true, message: '请输入原始密码', trigger: ['blur'] }
        ],
        newPass: [
          { required: true, validator: validatePass, trigger: ['blur'] }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: ['blur'] }
        ]
      },
      rules: {
        operName: [
          { required: true, message: '请输入姓名', trigger: ['blur'] }
        ],
        email: [
          { type: 'email', message: '邮箱格式输入错误', trigger: ['blur'] }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      activeName: 'first',
      loading: false
    }
  },

  created() {
    this.findUserInfo()
  },

  methods: {

    // 加载用户个人信息
    findUserInfo: function() {
      getUserInfo().then((res) => {
        this.user = res.data.data
        this.user.lastLoginTime = formatDate(this.user.lastLoginTime)
      })
    },

    // 修改资料提交表单
    infoSubmitForm() {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          this.loading = true

          var formData = {
            name: this.user.operName,
            phone: this.user.phone,
            sex: this.user.sex,
            birthday: this.user.birthday,
            email: this.user.email,
            address: this.user.address
          }

          this.$store.dispatch('user/updateUserInfo', formData).then(res => {
            this.$data.loading = false
            if (res.code === '0') {
                Notification.success({
                  title: '保存成功'
                })
              this.$refs.form2.clearValidate()
            } else {
              this.$message({
                type: 'error',
                message: res.code
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 密码修改提交表单
    passSubmitForm() {
      this.$refs.form3.validate((valid) => {
        if (valid) {
          this.loading = true

          this.$store.dispatch('user/updateUserPass', this.$data.passForm).then(res => {
            if (res.success) {
              this.$store.dispatch('user/Logout').then(res => {
                Notification.success({
                  title: '密码修改成功！',
                  duration: 1500,
                  onClose: () => {
                    window.location.href = '/'
                  }
                })
              })
            } else {
              this.$data.loading = false
            }
          })
        }
      })
    },
    // 切换tab
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
