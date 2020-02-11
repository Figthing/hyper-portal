<template>
  <div
    v-if="isShow"
    v-loading="socialLoading"
    class="login-container"
  >
    <div class="login-left">
      <img src="login_logo.jpg" alt="" class="img">
      <p class="title">{{dict.PRODUCT_NAME}}</p>
      <p>{{dict.PRODUCT_VERSION}}</p>
    </div>
    <div class="login-right">
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="loginForm">
          <span slot="label">
            <i slot="prefix" class=""><svg-icon icon-class="user" /></i> 用户名登录
          </span>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                autocomplete="off"
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="user1" />
                </i>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                :placeholder="$t('login.password')"
                name="password"
                type="password"
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="密码" />
                </i>
              </el-input>
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              {{ $t('login.logIn') }}
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('请输入至少2位以上的密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入登录账号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isShow: true,
      socialLoading: false,
      activeName: 'loginForm'
    }
  },
  computed: {
    ...mapGetters([
      'dict'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
      this.$store.dispatch('site/listDictionarys')
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick(tab) {
      this.$refs[tab.paneName].resetFields()
    }
  }
}
</script>

<style lang="scss">
  .login-container {
    width: 1000px;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 25px #cac6c6;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px 0;

    .login-left {
      width: 50%;
      /*background: #1F79D6;*/
      text-align: center;
      padding-top: 90px;
      border-right: 1px solid #00000055;

      img {
        width: 300px;
      }
    }

    .login-right {
      width: 50%;
      padding: 35px;

      .title {
        margin: 0 auto 30px auto;
        text-align: center;
        color: #505458;
      }

      .remember {
        margin: 0 0 35px 0;
      }

      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        color: #454545;
      }

      .other-login {
        margin-top: 3vh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .other-icon {
        cursor: pointer;
        margin-left: 5px;
        fill: rgba(0, 0, 0, .2);
      }

      .other-icon:hover {
        fill: rebeccapurple;
      }

      .other-login .other-way {
        font-size: 14px;
        color: #515a6e;
      }

      .register {
        float: right;
        color: #1ab2ff;
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 160px);
        text-align: right;
      }

      .login-select {
        margin-left: 100px;
        margin-bottom: 13px;

        input {
          color: #333;
          font-size: 14px;
          font-weight: 400;
          border: none;
          text-align: center;
        }
      }
    }

  }
</style>
