<!--  -->
<template>
  <div class="whois_all">
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_title" data-locale="WHOISDomain">
          Whois查询
          </p>
        <p class="whois_search_p" data-locale="InformationOnDomain">
          WHOIS 查询：域名注册信息、DNS 服务器、解析记录、IP 地址等，想查就查！
        </p>
        <div class="whois_search_div">
          <input
            type="text"
            class="form-control whois_search_input"
            data-i18n-placeholder="EnterADomain"
            v-model="domainInput"
          />
          <!-- <a href="/result"
            > -->
          <button class="whois_search_button" @click="getWhois()">
            <i class="iconfont icon-sousuo"></i>
            <span data-locale="Search">
              查询
              </span>
          </button>
          <!-- </a
          > -->
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <ul>
          <li>
            <div class="whois-width">
              <div class="num-embellish">
                <i class="num-0"></i><i class="num-1"></i>
              </div>
              <h3 data-locale="WhatIsWHOIS">
                什么是Whois查询？
                </h3>
              <p data-locale="YouCanCheck">
                您可以用Whois来查看域名的当前信息状态，包括域名是否已被注册、注册日期、过期日期、域名状态、DNS解析服务器等。
              </p>
            </div>
          </li>
          <li>
            <div class="whois-width">
              <h3 data-locale="GetKeyInfo">
                了解域名重要信息
                </h3>
              <p data-locale="YouCanGetKey">
                REG.CN的WHOIS搜索通过深入了解 WHOIS
                数据库来获取有关域名注册可用性、所有者、管理员、联系信息，以及其他重要信息。
              </p>
              <div class="num-embellish">
                <i class="num-0"></i><i class="num-2"></i>
              </div>
            </div>
          </li>
          <li>
            <div class="whois-width">
              <h3 data-locale="GetTheDomain">
                购买已被注册的域名
                </h3>
              <p data-locale="ThatDomainYou">
                您想要、却被别人抢先注册的域名，若您依然想要拥有，可通过平台经纪人，找到并与当前所有者协商，就有机会获得。
              </p>
              <div class="num-embellish">
                <i class="num-0"></i><i class="num-3"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import api from "~/plugins/api";
import VFooter from "~/components/footer";
import { Message, Notification } from 'element-ui'
export default {
  components: {
    VFooter,
  },
  data: function () {
    return {
      domainInput: "",
      msgTip: "",
      msgTip1: "",
    };
  },

  computed: {},

  mounted:function () {
    this.fetchDate();
  },

  methods: {
    fetchDate() {
      if (localStorage.getItem("lang")&&localStorage.getItem("lang")!="zh"&&(localStorage.getItem("lang")=="hk"||localStorage.getItem("lang")=="en")) {
        this.loadProperties(localStorage.getItem("lang")); //调用
      } else {
        this.loadProperties("hk"); //调用
      }
    },
    loadProperties(lang) {
      var that = this;
      localStorage.setItem("lang", lang);
      $.i18n.properties({
        name: "strings", //资源文件名称 ， 命名格式： 文件名_国家代号.properties
        path: "lang/", //资源文件路径，注意这里路径是你属性文件的所在文件夹,可以自定义。
        mode: "map", //用 Map 的方式使用资源文件中的值
        language: lang, //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
        callback: function () {
          $("[data-locale]").each(function () {
            $(this).html($.i18n.prop($(this).data("locale")));
          });
          $("[data-i18n-placeholder]").each(function () {
            $(this).attr(
              "placeholder",
              $.i18n.prop($(this).data("i18n-placeholder"))
            );
          });
          $("[data-i18n-label]").each(function () {
            $(this)
              .children(".el-checkbox__label")
              .html($.i18n.prop($(this).data("i18n-label")));
          });
          that.msgTip = $.i18n.prop("msgTip");
          that.msgTip1 = $.i18n.prop("msgTip1");
        },
      });
    },
    getWhois() {
      if (this.domainInput) {
        if (this.isdomain(this.domainInput)) {
          // localStorage.setItem("domainInput", this.domainInput);
          // this.$router.push("result?domain="+this.domainInput);
          window.location.href = "result?domain="+this.domainInput;
        } else {
        Message({
          type: "error",
          message: this.msgTip,
          duration: 3000,
          closable: true,
        });
        }
      } else {
        Message({
          type: "error",
          message: this.msgTip1,
          duration: 3000,
          closable: true,
        });
      }
    },
    isdomain: function (str) {
      var temp =
        /^[\u4E00-\u9FA5-a-z0-9]+(\.[\u4E00-\u9FA5-a-z0-9]+)*(\.[a-z\u4E00-\u9FA5]{2,7})+$/i.test(
          str.trim()
        );
      return temp;
    },
  },
};
</script>
<style scoped>
@import "../static/css/whois.css";
</style>