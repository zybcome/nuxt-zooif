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
              皮皮虾去水印解析
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 皮皮虾去水印解析</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_p">
          复制皮皮虾视频分享链接到下面输入框进行解析
        </p>
        <div class="whois_search_div">
          <input
            type="text"
            class="form-control whois_search_input"
            v-model="tiktokText"
          />
          <button
            class="whois_search_button"
            @click="getTiktokLink()"
          >
            <i class="iconfont icon-sousuo"></i>
            <span>
              解析
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container">
            <div style="text-align:center">
              <button
                v-if="yulanStatus"
                type="button"
                class="btn btn-primary"
                @click="yulan()"
              >预览</button>
              <button
                v-if="xiazaiStatus"
                type="button"
                class="btn btn-primary"
                @click="xiazai()"
              >下载</button>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- <v-footer></v-footer> -->
    <el-dialog
      title="预览"
      :visible.sync="dialogVideoStatus"
      width="300px"
    >

      <video
        controls="controls"
        width="100%"
        height="100%"
        autoplay="autoplay"
        volume="1"
        id="myVideo"
        loop="loop"
      >
        <source
          id="media_src"
          :src="videoUrl"
          type="video/mp4"
        />
      </video>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVideoStatus = false">取 消</el-button>
        <el-button
          type="primary"
          @click="xiazai()"
        >下 载</el-button>
      </span>
    </el-dialog>
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
      tiktokText: "",
      videoUrl: "",
      // shipinStatus: false,
      xiazaiStatus: false,
      yulanStatus: false,
      dialogVideoStatus: false,
    };
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
    getTiktokLink() {
      if (this.tiktokText) {
        api.getPipixia(this.tiktokText).then((res) => {
          if (res.code == 200) {
            this.videoUrl = res.videoUrl;
            this.xiazaiStatus = true;
            this.yulanStatus = true;
          }
        });
      } else {
        Message({
          type: "error",
          message: "解析地址不能为空！",
        });
      }
    },
    download(data) {
      let blob = new Blob([data], {
        type: "video/mp4",
      });
      var getBlobURL =
        (window.URL && URL.createObjectURL.bind(URL)) ||
        (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
        window.createObjectURL;
      let a = document.createElement("a");
      a.href = getBlobURL(blob);
      a.setAttribute("download", "xxx.mp4");
      a.click();
    },
    start_download(url) {
      var that = this;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          that.download(xhr.response);
        }
      };
      xhr.send(null);
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>