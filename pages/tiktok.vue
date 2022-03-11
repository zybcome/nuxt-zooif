<!--  -->
<template>
  <div class="whois_all">
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_title">
          Whois查询
        </p>
        <p class="whois_search_p">
          WHOIS 查询：域名注册信息、DNS 服务器、解析记录、IP 地址等，想查就查！
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
              查询
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container">
            <div class="box">
              <input
                type="email"
                class="form-control"
                id="tiktok_url"
                placeholder="请粘贴抖音分享连接！"
              >
              <button
                type="button"
                class="btn btn-primary"
                id="jiexi"
              >解析</button>
              <button
                type="button"
                class="btn btn-primary"
                id="yulan"
                style="display: none;"
                @click="yulan()"
              >预览</button>
              <button
                type="button"
                class="btn btn-primary"
                id="xiazai"
                style="display: none;"
                @click="xiazai()"
              >下载</button>
              <div class="shipin"></div>
            </div>
          </div>
        </section>
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
  components: {
    VFooter,
  },
  data: function () {
    return {
      tiktokText: "",
      videoUrl: ""
    };
  },

  computed: {},

  mounted: function () {},

  methods: {
    yulan() {
      $(".shipin").append(
        `<video controls="controls" width="100%" height="100%" autoplay="autoplay"  volume="1" id="myVideo"  loop="loop">
    <source id="media_src" src="` +
          videoUrl +
          `" type="video/mp4"/>
</video>`
      );
    },
    xiazai() {
      start_download(videoUrl);
    },
    getTiktokLink() {
      if (this.tiktokText) {
        api.getTiktok(this.tiktokText).then((res) => {
          if (res.code == 200) {
            this.videoUrl = res.videoUrl;
            $("#yulan").show();
            $("#xiazai").show();
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
      xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          download(xhr.response);
        }
      };
      xhr.send(null);
    },
  },
};
</script>
<style scoped>
@import "../static/css/whois.css";
</style>