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
              二维码生成器
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 二维码生成器</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_p">
          输入文字或连接地址
        </p>
        <div class="whois_search_div">
          <input
            type="text"
            class="form-control whois_search_input"
            v-model="qrCodeText"
          />
          <button
            class="whois_search_button"
            @click="getQrCode()"
          >
            <!-- <i class="iconfont icon-sousuo"></i> -->
            <span>
              生成
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container">
            <img style="display: block;margin: 0 auto;" v-if="qrCodeImg!=''" :src="qrCodeImg" alt="">
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
    };
  },
  head:{
    meta: [
        { name: 'referrer', content: 'never' },
    ],
  },
  computed: {},

  mounted: function () {},

  methods: {
    yulan() {
      this.dialogVideoStatus = true;
    },
    xiazai() {
      this.start_download(this.videoUrl);
    },
    getQrCode() {
      if (this.qrCodeText) {
        api.getQrCode(this.qrCodeText).then((res) => {
          if (res.code == 200) {
            this.qrCodeImg = res.qrCode;
          }
        });
      } else {
        Message({
          type: "error",
          message: "文字或连接地址不能为空！",
        });
      }
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>