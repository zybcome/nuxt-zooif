<template>
  <div class="all">
    <div class="login">
      <!-- <div class="login-img"></div> -->
      <div class="login-right">
        <h3 class="title">
          <span class="title-login">欢迎注册</span> |
          <span
            class="title-text"
            style="font-weight:bold"
          >ZooIf</span>
        </h3>
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="registerRules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
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
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="text"
              auto-complete="off"
              placeholder="邮箱"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-user.png"
                alt=""
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="emailCode">
            <el-input
              v-model="registerForm.emailCode"
              auto-complete="off"
              placeholder="请输入邮箱验证码"
              style="width: 63%"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-code.png"
                alt=""
              />
            </el-input>
            <div class="register-code">
              <el-button
                type="primary"
                plain
                @click="getEmailCode_"
                :disabled="sendEmailBtnStatus"
              >{{sendEmailBtnTime}}</el-button>
              <!-- <img :src="codeUrl" @click="getCode" class="register-code-img"/> -->
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleRegister"
            >
              <img
                slot="prefix"
                class="el-input__icon input-icon"
                src="@/static/img/login-psw.png"
                alt=""
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              auto-complete="off"
              placeholder="确认密码"
              @keyup.enter.native="handleRegister"
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
              v-model="registerForm.code"
              auto-complete="off"
              style="width: 63%"
              placeholder="请输入图片验证码"
              @keyup.enter.native="handleRegister"
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
            <div style="float: right; font-size: 12px;">
              <router-link
                class="link-type"
                :to="'/login'"
              >已有账号？立即登录</router-link>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleRegister"
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
import { Message } from "element-ui";

export default {
  components: {
    // VFooter,
  },
  head() {
    return {
      title: '注册 - ZooIf',
    }
  },
  data: function () {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      sendEmailBtnStatus: false,
      sendEmailBtnTime: "获取验证码",
      encrypt: "",
      decrypt: "",
      codeUrl: "",
      cookiePassword: "",
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: "",
        emailCode: "",
        emailUuid: "",
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
          {
            min: 6,
            max: 20,
            message: "用户账号长度必须介于 6 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            type: "email",
            trigger: "blur",
            message: "请输入正确的邮箱地址",
          },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          {
            min: 6,
            max: 20,
            message: "用户密码长度必须介于 6 和 20 之间",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        emailCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
    };
  },

  computed: {},

  created: function () {
    this.$store.dispatch("FedLogOut");
    this.$store.dispatch("LogOut");
  },
  mounted: function () {
    var jsencrypt = require("~/plugins/jsencrypt");
    this.encrypt = jsencrypt.encrypt;
    this.decrypt = jsencrypt.decrypt;
    // import { encrypt, decrypt } from "~/plugins/jsencrypt";
    this.getCode();
    // this.getCookie();
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
            that.registerForm.uuid = res.uuid;
          }
        }
      });
    },

    // getCode() {
    //   api.getCodeImg().then((res) => {
    //     this.captchaOnOff =
    //       res.captchaOnOff === undefined ? true : res.captchaOnOff;
    //     if (this.captchaOnOff) {
    //       this.codeUrl = "data:image/gif;base64," + res.img;
    //       this.registerForm.uuid = res.uuid;
    //     }
    //   });
    // },
    getEmailCode_() {
      this.sendEmailBtnStatus = true;
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!this.registerForm.email) {
        this.sendEmailBtnStatus = false;
        return Message({ message: "邮箱不能为空", type: "errror" });
      }
      setTimeout(() => {
        if (mailReg.test(this.registerForm.email)) {
          api.sendEmailCode(this.registerForm.email).then((res) => {
            console.log(res);
            if (res.code == 200) {
              Message({ message: "验证码发送成功！", type: "success" });
              this.registerForm.emailUuid = res.uuid;
              this.sendEmailBtnTime = 60;
              let setTime = window.setInterval((res) => {
                this.sendEmailBtnTime--;
                if (this.sendEmailBtnTime == 0) {
                  this.sendEmailBtnTime = "获取验证码";
                  this.sendEmailBtnStatus = false;
                  clearInterval(setTime);
                }
              }, 1000);
            } else {
              this.sendEmailBtnStatus = false;
            }
          });
        } else {
          this.sendEmailBtnStatus = false;
          Message({ message: "请输入正确的邮箱格式", type: "error" });
        }
      }, 100);
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (!this.registerForm.emailUuid) {
            Message({ message: "请先获取邮箱验证码", type: "error" });
            return;
          }
          this.loading = true;
          api
            .register(this.registerForm)
            .then((res) => {
              if (res.code == 200) {
                const username = this.registerForm.username;
                Message({
                  message: "恭喜你，您的账号 " + username + " 注册成功！",
                  type: "success",
                });
                this.$router.replace("/login");
              } else {
                this.loading = false;
                if (this.captchaOnOff) {
                  this.getCode();
                }
              }
            })
            .catch(() => {
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
@import "../static/css/regist.css";
</style>