@@ -0,0 +1,181 @@
<!--  -->
<template>
  <div class="whois_all">

    <!-- start banner Area -->
    <section
      class="banner-area relative"
      id="home"
    >
      <div class="overlay overlay-bg"></div>
      <div class="container">
        <div class="row d-flex align-items-center justify-content-center">
          <div class="about-content col-lg-12">
            <h1 class="text-white">
              正则验证
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 正则验证</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_p">
          正则验证
        </p>
        <div class="whois_search_div">
          <input
            type="text"
            class="form-control whois_search_input"
            v-model="qrCodeText"
            style="width:100%"
            placeholder="请输入要验证的内容"
          />
            <span>reg.test(str)</span>
          <!-- <button
            class="whois_search_button"
            @click="getQrCode()"
          >
            <span>
              生成
            </span>
          </button> -->
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container">

            <el-tooltip
              class="item"
              effect="dark"
              v-for="(it,index) in testArray"
              :key="index"
              :content="it.test.toString()"
              placement="top-start"
            >
              <el-button @click="isTest(qrCodeText,it.test)">{{it.msg}}</el-button>
            </el-tooltip>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "~/plugins/api";
// import VFooter from "~/components/footer";
import { Message } from "element-ui";
export default {
  components: {
    // VFooter,
  },
  data: function () {
    return {
      qrCodeText: "",
      qrCodeImg: "",
      // shipinStatus: false,
      xiazaiStatus: false,
      yulanStatus: false,
      dialogVideoStatus: false,
      testArray: {
        isPhone: {
          test: /^1[3456789]\d{9}$/,
          msg: "手机号码",
        },
        // 是否为座机号码
        isTel: {
          test: /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/,
          msg: "座机号码",
        },
        isEmail:{
          test: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
          msg: "邮箱",
        },
        isDomain:{
          test: /^([a-zA-Z0-9][-a-zA-Z0-9]{0,62})(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/,
          msg: "域名",
        },
        isHttp:{
          test: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
          msg: "网址",
        },
        isIDCard:{
          test: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          msg: "身份证",
        },
        //是否为生日
        isBirthday:{
          test: /^((((19|20)(([02468][048])|([13579][26]))-02-29))|((20[0-9][0-9])|(19[0-9][0-9]))-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((01,3-9])|(1[0-2]))-(29|30)))))$/,
          msg: "生日",
        },
        isIp:{
          test: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          msg: "IP",
        },
        isCheineseName:{
          test: /^[\u4E00-\u9FA5]{2,4}$/,
          msg: "中文姓名",
        },
        isEnglishName:{
          test: /^[a-zA-Z]{2,20}$/,
          msg: "英文姓名",
        },
        //是否为正整数
        isPositiveInteger:{
          test: /^[1-9]\d*$/,
          msg: "正整数",
        },
        //是否为整数
        isInteger:{
          test: /^-?\d+$/,
          msg: "整数",
        },
        //是否为浮点数
        isFloat:{
          test: /^(-?\d+)(\.\d+)?$/,
          msg: "浮点数",
        },
        //是否为两位小数
        isTwoDecimal:{
          test: /^\d+(\.\d{1,2})?$/,
          msg: "两位小数",
        },
        //判断密码强度
        isPassword:{
          test: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
          msg: "密码强度",
        },
        //钱的输入格式  
        isMoney:{
          test: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/,
          msg: "金额",
        },
        isImg:{
          test: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
          msg: "图片格式",
        },
        isTrim:{
          test: /^\s*|\s*$/,
          msg: "去除首尾空格",
        },
        //QQ号码
        isQQ:{
          test: /^[1-9]\d{4,10}$/,
          msg: "QQ号码",
        },
        //邮政编码
        isPostalCode:{
          test: /^[1-9]\d{5}$/,
          msg: "邮政编码",
        },
      },
    };
  },
  head: {
    meta: [{ name: "referrer", content: "never" }],
  },
  computed: {},

  mounted: function () {
  },

  methods: {
    isTest: function (str, reg) {
      if(str.length==0){
        Message.error("请输入内容");
        return;
      }
      Message({
        message: reg.test(str) ? "正确" : "错误",
        type: reg.test(str) ? "success" : "error",
      });
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
.el-button{
  margin-right:10px;
  margin-bottom: 10px;
  margin-left: 0 !important;
}
</style>