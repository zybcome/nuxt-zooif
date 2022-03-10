<!-- result -->
<template>
  <div class="result_all">
    <div class="whois_search">
      <div class="whois_search_position">
        <div class="whois_search_div">
          <span
            class="whois_search_title"
            data-locale="WHOISDomainDuan"
          >
            Whois查询
          </span>
          <input
            type="text"
            class="form-control whois_search_input"
            data-i18n-placeholder="EnterADomain"
            v-model="domainInput"
          />
          <button
            class="whois_search_button"
            @click="getWhois(0)"
          >
            <i class="iconfont icon-sousuo"></i>
            <span data-locale="Search">
              查询
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="whois-center">
      <div class="whois-table">
        <div
          class="whois-info"
          v-loading="loading"
          v-if="domainObj"
        >
          <div class="whois-text">
            <span><span data-locale="RegistrationInformation">
                域名注册信息：
              </span>
              <b
                class="orange"
                v-if="domainObj.domain"
              >{{
                domainObj.domain
              }}</b></span>
            <span class="fr f14"><span data-locale="InformationUpdated">
                以下信息更新时间：
              </span><span v-if="domainObj.addDate"> {{ domainObj.addDate }}</span>
              <a
                @click="getWhois(1)"
                class="blue"
                data-locale="Refresh"
                style=""
              >
                点击刷新
              </a></span>
          </div>
          <!-- 查询的内容 没查询时候隐藏 -->
          <table class="tab5" width="100%"  style="table-layout:fixed;">
            <tbody>
              <tr>
                <td
                 width="30%"
                  align="right"
                  nowrap="nowrap"
                  data-locale="DomainName"
                >
                  域名：
                </td>
                <td
                 width="70%" v-if="domainObj.domain">{{ domainObj.domain }}</td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="Registrar"
                >
                  注册商：
                </td>
                <td v-if="domainObj.registrar">
                  {{ domainObj.registrar }}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="RegPersion"
                >
                  注册人：
                </td>
                <td v-if="domainObj.regPersion">
                  {{ domainObj.regPersion }}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="RegEmail"
                >
                  注册人邮箱：
                </td>
                <td v-if="domainObj.regEmail">
                  {{ domainObj.regEmail }}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="CreationDate"
                >
                  注册日期：
                </td>
                <td v-if="domainObj.regTime">{{ domainObj.regTime }}</td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="RegistryExpiry"
                >
                  到期日期：
                </td>
                <td v-if="domainObj.domainEndDate">
                  {{ domainObj.domainEndDate }}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="DomainStatus"
                >
                  域名状态：
                </td>
                <td v-if="domainObj.domainStatus">
                  {{ domainObj.domainStatus }}
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  nowrap="nowrap"
                  data-locale="DNSServer"
                >
                  DNS服务器：
                </td>
                <td v-if="domainObj.domainDns">{{ domainObj.domainDns }}</td>
              </tr>
            </tbody>
          </table>

          <div
            class="whois-info-box"
            v-if="domainObj.information"
            v-html="domainObj.information"
          >
            {{ domainObj.information }}
            <!-- ROID: 20030317s10001s00070930-cn<br />
            Domain Status: clientDeleteProhibited<br />
            Domain Status: clientTransferProhibited<br />
            Registrant: 郑州世纪创联电子科技开发有限公司<br />
            Registrant Contact Email: 300776@qq.com<br />
            Sponsoring Registrar:
            厦门易名科技有限公司（原厦门易名网络科技有限公司）<br />
            Name Server: u1.51dns.com<br />
            Name Server: u2.51dns.com<br />
            Registration Time: 2003-03-17 12:04:34<br />
            Expiration Time: 2023-03-17 12:04:34<br />
            DNSSEC: unsigned<br /> -->
          </div>
          <!-- 查询的内容 没查询时候隐藏 end -->
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import api from "~/plugins/api";
import VFooter from "~/components/footer";
import { Message, Notification } from "element-ui";
export default {
  head() {
    return {
      script: [
        // { src: "/js/jquery-3.6.0.min.js", type: "text/javascript" },
        // {
        //   src: "/js/jquery.i18n.properties-min-1.0.9.js",
        //   type: "text/javascript",
        // },
        // { src: '/js/lang.js', type: "text/javascript" },
        // { src: "/js/bootstrap.min.js", type: "text/javascript" },
        // { src: '/js/fullpage.min.js', type: "text/javascript" },
        // { src: '/js/index.js', type: "text/javascript" },
        // {
        //   src: "https://ssl.captcha.qq.com/TCaptcha.js",
        //   type: "text/javascript",
        // },
      ],
    };
  },
  data: function () {
    return {
      domainInput: "",
      domainObj: {},
      loading: false,
      msgTip: '',
    };
  },

  components: { VFooter },
  mounted: function () {
    this.fetchDate();
    // this.domainInput = localStorage.getItem("domainInput");
    this.domainInput = decodeURI(this.$route.query.domain);

    if (this.domainInput) {
      this.getWhois(0);
    }
    let W = $(window).width();
    if (W < 922) {
      $(".nav_all").css("cssText", "background:#000 !important");
    } else {
      $(".nav_all").css("cssText", "background:none !important");
    }
    $("body").scroll(function () {
      //开始监听滚动条
      //获取当前滚动条高度
      var topp = $("body").scrollTop();
      if (topp > 0) {
        $(".nav_all").css(
          "cssText",
          "background:linear-gradient(to right,#5256bf, #4f74d8 , #4994f2) !important"
        );
      } else {
        if (W > 922) {
          $(".nav_all").css("cssText", "background:none !important");
        } else {
          $(".nav_all").css("cssText", "background:#000 !important");
        }
      }
    });
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
        },
      });
    },
    getWhois(num) {
      var that = this;
      localStorage.setItem("domainInput", this.domainInput);
      if (this.isdomain(this.domainInput) && this.domainInput) {
        that.loading = true;
        if (num == 1) {
          that.domainObj = {};
          api
            .getWhois({ domainName: this.domainInput, actionType: 1 })
            .then((res) => {
              if (res.data == true) {
                that.ischack();
              } else {
                that.loading = false;
                that.domainObj = res.data.data;
              }
              // that.domainObj = res.data.data;
            });
        } else {
          api.getWhois({ domainName: this.domainInput }).then((res) => {
            if (res.data == true) {
              that.ischack();
            } else {
              that.loading = false;
              that.domainObj = res.data.data;
            }
          });
        }
      } else {
        Message({
          type: "error",
          message: this.msgTip,
          duration: 3000,
          closable: true,
        });
      }
    },
    ischack: function () {
      var that = this;
      var captchaLoginAppID = "2040747189"; //登录验证码appid
      var login_captcha = new TencentCaptcha(captchaLoginAppID, function (
        fsq_res
      ) {
        if (fsq_res.ret == 0) {
          api
            .getWhoisToken({
              randstr: fsq_res.randstr,
              ticket: fsq_res.ticket,
            })
            .then((res) => {
              api
                .getWhois({
                  domainName: that.domainInput,
                  actionType: 1,
                  token: res.data.token,
                  key: res.data.key,
                })
                .then((res) => {
                  that.loading = false;
                  that.domainObj = res.data;
                });
            });
        } else {
          that.loading = false;
        }
      });
      login_captcha.show();
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
@import "../static/css/result.css";
a {
  cursor: pointer;
}
</style>