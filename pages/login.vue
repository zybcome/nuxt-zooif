<template>
  <div class="all">
    <div class="login">
      <div class="login-img"></div>
      <div class="login-right">
        <h3 class="title">
          <span class="title-login">欢迎登录</span> |
          <span
            class="title-text"
            style="font-weight:bold"
          >ZooIf</span>
        </h3>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账户"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-user.png"
                alt=""
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-psw.png"
                alt=""
              />
            </el-input>
          </el-form-item>
          <el-form-item
            prop="code"
            v-if="captchaOnOff"
          >
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
              placeholder="图片验证码"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-code.png"
                alt=""
              />
            </el-input>
            <div class="login-code">
              <img
                :src="codeUrl"
                @click="getCode"
                class="login-code-img"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              style="margin-bottom:0"
              v-model="loginForm.rememberMe"
            >记住密码</el-checkbox>
            <div style="float: right; font-size: 12px;">
              <router-link
                class="link-type"
                :to="'/login'"
              >忘记密码</router-link><span>&nbsp;|</span>
              <router-link
                class="link-type"
                :to="'/regist'"
              >没有账号？立即注册</router-link>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "~/plugins/api";
import Cookies from "js-cookie";

export default {
  components: {
    // VFooter,
  },
  data: function () {
    return {
      encrypt: "",
      decrypt: "",
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的用户名" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },

  computed: {},

  created: function () {
    this.$store.dispatch("FedLogOut");
    this.$store.dispatch("LogOut");},
  mounted: function () {
    var jsencrypt = require("~/plugins/jsencrypt");
    this.encrypt = jsencrypt.encrypt;
    this.decrypt = jsencrypt.decrypt;
    // import { encrypt, decrypt } from "~/plugins/jsencrypt";
    this.getCode();
    this.getCookie();
  },

  methods: {
    getCode: function () {
      var that = this;
      api.getCodeImg().then((res) => {
        if (res) {
          that.captchaOnOff =
            res.captchaOnOff === undefined ? true : res.captchaOnOff;
          if (that.captchaOnOff) {
            that.codeUrl = "data:image/gif;base64," + res.img;
            that.loginForm.uuid = res.uuid;
          }
        }
      });
    },
    getCookie: function () {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined
            ? this.loginForm.password
            : this.decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin: function () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set(
              "username",
              this.loginForm.username,
              { expires: 30 },
              null,
              api.ServerDomain
            );
            Cookies.set(
              "password",
              this.encrypt(this.loginForm.password),
              {
                expires: 30,
              },
              null,
              api.ServerDomain
            );
            Cookies.set(
              "rememberMe",
              this.loginForm.rememberMe,
              {
                expires: 30,
              },
              null,
              api.ServerDomain
            );
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$store.dispatch("GetInfo").then((res) => {
                if(res.code == 200){
                  this.$router.replace("/");
                }
              });
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
  },
};
</script>
<style>
.login .el-input__inner {
  background-color: #f8f8f8 !important;
}
.login .el-input--prefix .el-input__inner {
  padding-left: 40px;
}
</style>
<style lang="less" scoped>
@import "../static/css/login.css";
</style>