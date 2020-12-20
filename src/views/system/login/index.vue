<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"/>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header"></div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="./image/logo@2x.png" alt="web logo">
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default">
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    placeholder="用户名">
                    <fa-icon slot="prepend" iconx="fas user-circle"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    ref="form-password"
                    placeholder="密码"
                    @keyup.enter.native.stop.prevent="submit"
                  >
                    <fa-icon slot="prepend" iconx="fas keyboard"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" style="margin-bottom: 11px" v-if="loginCaptcha">
                  <el-input
                    type="text"
                    v-model="formLogin.code"
                    @keyup.enter.native.stop.prevent="submit"
                    ref="form-code"
                    data-lpignore="true"
                    placeholder="验证码"
                    autocomplete="off">
                    <template slot="append">
                      <!--suppress HtmlUnknownTarget -->
                      <img class="login-code" :src="captchaUrl" @click="refrushCode(true)" alt="logo code">
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="lasting" style="margin-bottom: 11px">
                  <el-switch
                    v-model="formLogin.lasting"
                    active-text="记住我"
                    >
                  </el-switch>
                </el-form-item>
                <el-button
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login">
                  登录
                </el-button>
              </el-form>
            </el-card>
            <p
              class="page-login--options"
              flex="main:justify cross:center">
              <span><fa-icon iconx="fas question-circle"/> 忘记密码</span>
              <span>注册用户</span>
            </p>
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-locales">
            <a
              v-for="language in this.$languages"
              :key="language.value"
              @click="onChangeLocale(language.value)">
              {{ language.label }}
            </a>
          </p>
          <p class="page-login--content-footer-copyright">
            Copyright
            <fa-icon iconx="far copyright"/>
            2020 D2 Projects 开源组织出品
          </p>
          <p class="page-login--content-footer-options">
<!--            <a href="#">帮助</a>-->
<!--            <a href="#">隐私</a>-->
<!--            <a href="#">条款</a>-->
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import { blobToDataURL } from '@/libs/util.common'
import { captcha } from '@api/sys'
import { Loading } from 'element-ui'
import { hash_sha256 } from '@ozxin/js-tools/src/crypto/hash'

export default {
  mixins: [
    localeMixin,
  ],
  data () {
    return {
      // 验证码
      captchaUrl: '',
      captchaToken: '',
      // 表单
      formLogin: {
        username: '',
        password: '',
        code: '',
        lasting: false,
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted () {
    this.refrushCode()
  },
  beforeDestroy () {
  },
  computed: {
    ...mapState('d2admin/config', [
      'loginCaptcha',
    ]),
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login',
    ]),
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (!(this.formLogin.username && this.formLogin.password)) {
          return
        }
        if (this.loginCaptcha && !this.formLogin.code) {
          return
        }
        if (valid) {
          const loadingInstance = Loading.service({ fullscreen: true })
          // 登录
          this.login({
            username: this.formLogin.username,
            password: hash_sha256(this.formLogin.password),
            lasting: this.formLogin.lasting,
            code: this.formLogin.code,
            token: this.captchaToken,
          }).then(async () => {
            // 重定向对象不存在则返回顶层路径
            await this.$router.replace(this.$route.query.redirect || '/')
          }).catch(err => {
            if (err.code === 1103) {
              this.formLogin.password = ''
              this.$refs['form-password'].focus()
              this.refrushCode()
            } else if (err.code === 1001) {
              this.refrushCode(true)
            }
          }).finally(() => {
            loadingInstance.close()
          })
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    async refrushCode (focus) {
      const result = await captcha()
      this.captchaToken = result.headers['x-captcha-token']
      this.captchaUrl = await blobToDataURL(result.data)
      this.formLogin.code = ''
      if (focus) {
        this.$refs['form-code'].focus()
      }
    },
  },
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0;
      padding: 0;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 280px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0 0 15px;
      padding: 0;
      font-size: 14px;
      color: $color-primary;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0;
      margin: 0 0 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 .5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0;
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0;
      margin: 0;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
