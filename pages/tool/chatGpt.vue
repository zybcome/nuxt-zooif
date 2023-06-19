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
              ChatGpt
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> ChatGpt</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
    <div class="whois_search">
      <div class="whois_search_position">
<!--        <input-->
<!--          style="display: block;width: 100%;"-->
<!--          type="text"-->
<!--          class="form-control whois_search_input"-->
<!--          v-model="keyText"-->
<!--          placeholder="请输入openKey"-->
<!--        />-->
        <!-- <p class="whois_search_p">
          输入文字
        </p> -->
        <div class="whois_search_div">
          <input
            type="text"
            class="form-control whois_search_input"
            v-model="keyText"
            placeholder="请输入openKey"
          />
          <button
            class="whois_search_button"
            @click="getKey()"
          >
            <!-- <i class="iconfont icon-sousuo"></i> -->
            <span>
              获取默认Key
            </span>
          </button>
        </div>
        <div class="whois_search_div" style="margin-top: 10px;">
          <input
            type="text"
            class="form-control whois_search_input"
            v-model="askText"
            placeholder="请输入对话内容"
            id="askTextId"
            v-on:keyup.enter="getChatGpt()"
          />
          <button
            class="whois_search_button"
            @click="getChatGpt()"
          >
            <!-- <i class="iconfont icon-sousuo"></i> -->
            <span>
              发送
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container" id="askText" v-html="askTextString">
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
      askText: "",
      keyText: "",
      keyIndex:0,
      askTextString:"",
      statefocus:true,
      keyArray:["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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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"]

    };
  },
  head:{
    title: 'ChatGpt - ZooIf',
    meta: [
        { name: 'referrer', content: 'never' },
    ],
  },
  computed: {},

  mounted: function () {
    if(window.localStorage.getItem("zooifOpenKey")){
      this.keyText = window.localStorage.getItem("zooifOpenKey");
    }
    $("#askTextId").focus();
  },

  methods: {
    getKey(){
      this.keyText = this.keyArray[this.keyIndex];
      window.localStorage.setItem("zooifOpenKey",this.keyText)
      this.keyIndex++;
    },
    getChatGpt() {
      if (this.askText&&this.keyText) {
        this.askTextString=`<p>我：${this.askText}</p>`+this.askTextString
        this.askText = "";
        $("#askTextId").focus();
        api.getChatGpt({askText:this.askText,keyText:this.keyText}).then((res) => {
          if(res.code==200){
            this.askTextString=`<p>chatGpt：${JSON.parse(res.data).choices[0].message.content}</p>`+this.askTextString
          }
        }).catch(err=>{
          this.askTextString=`<p>chatGpt：${err}</p>`+this.askTextString
          Message({
            type: "error",
            message: err,
          });
        });
      } else {
        Message({
          type: "error",
          message: "输入的内容和key不能为空！",
        });
      }
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>
