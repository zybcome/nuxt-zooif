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
          <li
            class="nav-item"
            data-menuanchor="firstPage"
          >
            <a
              class="nav-link"
              href="http://layui.zooif.com"
              target="_blank"
            >
              layui
            </a>
          </li>
          <li
            class="nav-item"
            data-menuanchor="firstPage"
          >
            <a
              class="nav-link"
              href="http://zooif.com/avatar"
              target="_blank"
            >
              头像生成器
            </a>
          </li>
          <li class="nav-item dropdown">
            <nuxt-link
              class="nav-link dropdown-toggle"
              to=""
              id="navbarDropdown-user"
              role="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >趣味
            </nuxt-link>
            <div
              class="dropdown-menu"
              aria-labelledby="navbarDropdown-user"
            >
              <nuxt-link
                to="/tool/joke"
                class="dropdown-item"
              >笑话大全</nuxt-link>
              <nuxt-link
                to="/tool/jokeRandom"
                class="dropdown-item"
              >笑话随机</nuxt-link>
              <nuxt-link
                to="/tool/qinghua"
                class="dropdown-item"
              >爱的箴言</nuxt-link>
              <nuxt-link
                to="/tool/dog"
                class="dropdown-item"
              >舔狗日记</nuxt-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <nuxt-link
              class="nav-link dropdown-toggle"
              to=""
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
                to="/tool/touziGame"
                class="dropdown-item"
              >骰子游戏</nuxt-link>
              <nuxt-link
                to="/tool/tiktok"
                class="dropdown-item"
              >抖音去水印</nuxt-link>
              <nuxt-link
                to="/tool/pipixia"
                class="dropdown-item"
              >皮皮虾去水印</nuxt-link>
              <nuxt-link
                to="/tool/qrCode"
                class="dropdown-item"
              >二维码生成器</nuxt-link>
              <nuxt-link
                to="/tool/text"
                class="dropdown-item"
              >国际化转换</nuxt-link>
              <nuxt-link
                to="/tool/regularExpression"
                class="dropdown-item"
              >正则验证</nuxt-link>
              <nuxt-link
                to="/tool/translation"
                class="dropdown-item"
              >翻译</nuxt-link>
              <nuxt-link
                to="/tool/chatGpt"
                class="dropdown-item"
              >chatGpt</nuxt-link>
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
              to=""
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
        $("#navbarText a").click(function () {
          if($(this).attr("id")!="navbarDropdown-user"){
            $("#navbarText").collapse('hide');
          }
        });
    // $(window).scroll(function () {
    //   //小屏幕下的导航条折叠
    //   if ($(window).width() < 768) {
    //     //点击导航链接之后，把导航选项折叠起来
    //     //滚动屏幕时，把导航选项折叠起来
    //     $(window).scroll(function () {
    //       $("#navbarText").collapse('hide');
    //     });
    //   }
    // });
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
