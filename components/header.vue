<template>
  <div class="nav_all">
    <nav
      class="navbar navbar-dark bg-dark navbar-expand-lg"
      id="navBg"
    >
      <nuxt-link
        class="navbar-brand"
        to="/"
        style="font-size:24px;font-weight: bold;"
      >
        ZooIf
        <!-- <img
          src="@/static/img/logo.png"
          alt=""
        /> -->
      </nuxt-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarText"
      >
        <ul class="navbar-nav ml-auto">
          <li
            class="nav-item"
            data-menuanchor="firstPage"
          >
            <nuxt-link
              class="nav-link"
              to="/"
            >
              首页
            </nuxt-link>
          </li>

          <li class="nav-item dropdown">
            <nuxt-link
              class="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown-user"
              role="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >工具
            </nuxt-link>
            <div
              class="dropdown-menu"
              aria-labelledby="navbarDropdown-user"
            >
              <nuxt-link
                to="/tool/tiktok"
                class="dropdown-item"
              >抖音去水印</nuxt-link>
              <nuxt-link
                to="/tool/text"
                class="dropdown-item"
              >国际化转换</nuxt-link>
            </div>
          </li>
          <img
            class="shudian"
            src="@/static/img/shudian.png"
            alt=""
          />
          <li class="nav-item dropdown">
            <nuxt-link
              v-show="!token"
              class="nav-link link_border"
              to="/login"
            >登录</nuxt-link>
            <nuxt-link
              v-show="token"
              class="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown-user"
              role="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                style="margin-top: -2px; width: 20px"
                :src="avatar"
                alt=""
              />
              <span>{{ name }}</span>
            </nuxt-link>
            <div
              class="dropdown-menu"
              aria-labelledby="navbarDropdown-user"
            >
              <!-- <nuxt-link class="dropdown-item" to="http://192.168.20.63:7788"
                >会员中心</nuxt-link
              > -->
              <a
                class="dropdown-item"
                @click="outLogin"
              >退出登录</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getToken, setToken, setExpiresIn, removeToken } from "~/plugins/auth";
export default {
  inject: ["reload"],
  data() {
    return {
      myFullpage: "",
      token: false,
      avatar: "",
      name: "",
    };
  },
  beforeMount: function () {
    // this.fetchDate()
  },
  mounted: function () {
    // console.log(4) // undefined
    this.fetchDate();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "fetchDate",
  },
  methods: {
    fetchDate() {
      if (getToken()) {
        this.token = true;
      } else {
        this.token = false;
      }
      if (!this.token || this.$store.state.user.name == "") {
        if (this.$route.name != "login" && this.$route.name != "regist") {
          this.$store.dispatch("GetInfo").then((res) => {
            if (res.code == 200) {
              this.avatar = this.$store.state.user.avatar;
              this.name = this.$store.state.user.name;
            } else {
              this.token = false;
              this.$store.dispatch("FedLogOut");
            }
          });
        } else {
          this.token = false;
        }
      } else {
        this.avatar = this.$store.state.user.avatar;
        this.name = this.$store.state.user.name;
      }
    },
    outLogin() {
      this.$store.dispatch("LogOut").then((res) => {
        if (res.code == 200) {
          this.$store.dispatch("FedLogOut").then((res) => {
            this.$router.push("/login");
            this.reload();
          });
        }
      });
    },
  },
};
</script>

<style scoped>
@import "../static/css/nav.css";
</style>
