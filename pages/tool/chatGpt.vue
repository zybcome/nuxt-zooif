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
<!--          <button-->
<!--            class="whois_search_button"-->
<!--            @click="getKey()"-->
<!--          >-->
<!--            &lt;!&ndash; <i class="iconfont icon-sousuo"></i> &ndash;&gt;-->
<!--            <span>-->
<!--              获取默认Key-->
<!--            </span>-->
<!--          </button>-->
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
      keyArray:[]
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
