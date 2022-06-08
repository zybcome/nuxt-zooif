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
              翻译工具
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 翻译工具</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->

    <!-- start banner Area -->
    <section>
      <div class="container">
        <div class="box">
          <div class="left col-12 col-sm-6">
            <p class="title"><span class="badge badge-primary">请输入：</span></p>
            <!-- 有道付费翻译 -->
            <!-- <select class="form-control" id="exampleFormControlSelect1">
              <option value="zh-CHS">中文</option>
              <option value="zh-CHT">中文繁体</option>
              <option value="en">英文</option>
              <option value="ko">韩文</option>
              <option value="ja">日文</option>
              <option value="fr">法文</option>
              <option value="de">德文</option>
              <option value="th">泰语</option>
            </select> -->
            <textarea
              class="input_textarea"
              id="textarea_val1"
              rows="10"
              cols="30"
            ></textarea>
            <div class="btn_box col-12 col-sm-12">
              <!-- 有道免费翻译 -->
              <select class="form-control" id="exampleFormControlSelect1">
                <option value="auto">自动</option>
                <option value="ZH_CN2EN">中文>>英文</option>
                <option value="EN2ZH_CN">英文>>中文</option>
                <option value="ZH_CN2JA">中文>>日语</option>
                <option value="ZH_CN2KR">中文>>韩语</option>
                <!-- <option value="ZH_CN2FR">中文>>法语</option>
                <option value="ZH_CN2DE">中文>>德语</option>
                <option value="ZH_CN2RU">中文>>俄语</option>
                <option value="ZH_CN2ES">中文>>西班牙语</option>
                <option value="ZH_CN2PT">中文>>葡萄牙语</option>
                <option value="ZH_CN2IT">中文>>意大利语</option>
                <option value="ZH_CN2VI">中文>>越南语</option>
                <option value="ZH_CN2ID">中文>>印尼语</option>
                <option value="ZH_CN2AR">中文>>阿拉伯语</option>
                <option value="ZH_CN2NL">中文>>荷兰语</option>
                <option value="ZH_CN2th">中文>>泰语</option> -->
              </select>
            </div>
          </div>
          <div class="left col-12 col-sm-6">
            <p class="title"><span class="badge badge-success">输出结果：</span></p>
            <!-- 有道付费翻译 -->
            <!-- <select class="form-control" id="exampleFormControlSelect2">
              <option value="zh-CHS">中文</option>
              <option value="zh-CHT">中文繁体</option>
              <option value="en">英文</option>
              <option value="ko">韩文</option>
              <option value="ja">日文</option>
              <option value="fr">法文</option>
              <option value="de">德文</option>
              <option value="th">泰语</option>
            </select> -->
            <textarea
              class="input_textarea"
              id="textarea_val2"
              rows="10"
              cols="30"
              v-model="result"
            ></textarea>
            <div class="btn_box col-12 col-sm-12">
              <button
                class="btn btn-primary btn-sm" @click="translate('i18n')"
              >i18n翻译</button>
              <button
                class="btn btn-primary btn-sm" @click="translate('auto')"
              >翻译</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
  </div>
</template>

<script>
import api from "~/plugins/api";
// import VFooter from "~/components/footer";
import { Message } from "element-ui";
export default {
  components: {},
  data: function () {
    return {
      result: "",
      arrayAgo: [],
      arrayAfter: [],
    };},

  computed: {},

  mounted: function () {
  },

  methods: {
    truncate(q){
      var len = q.length;
      if(len<=20) return q;
      return q.substring(0, 10) + len + q.substring(len-10, len);
    },
    toArray(str) {
      if (str.indexOf("\n") != "-1") {
        // .split("/").join("\n");
        return str.split("\n");
      } else {
        return [str];
      }
    },
    //重组数组
    reArry(res){
      let returnArry = [];
      let linshiStr = "";
      res.map((item,index) => {
        if(linshiStr.length>=500){
          // console.log(linshiStr);
          var linshiStrArry = this.toArray(linshiStr);
          var lastStr = linshiStrArry[linshiStrArry.length-2];
          // console.log(lastStr);
          linshiStrArry.splice(linshiStrArry.length-2,2);
          // console.log(linshiStrArry)
          returnArry.push(linshiStrArry);
          if(index!=res.length-1){
            linshiStr = lastStr+"\n"+item+"\n";
          }else{
            linshiStr = lastStr+"\n"+item;
            returnArry.push(linshiStr);
          }
        }else{
          if(index!=res.length-1){
            linshiStr += item+"\n";
          }else{
            linshiStr += item;
            var linshiStrArry = this.toArray(linshiStr);
            returnArry.push(linshiStrArry);
          }
        }
      });
      return returnArry;
    },
    translate(type) {
      var that = this;
      that.result = "";
      if(type=="i18n"){
        that.getDengAgoI18n(that.toArray($("#textarea_val1").val()));
      }else{
        that.getDengAgo(that.toArray($("#textarea_val1").val()));
      }
      if(that.arrayAfter.length<=0){
        Message({
          message: "要翻译的内容有误",
          type: "warning"
        });
        return;
      }else{
        var appKey = '65974774235e057b';
        var key = 'bUEGCv1qoLaREC70tCAiDQ2RxZPFZ3L5';//注意：暴露appSecret，有被盗用造成损失的风险
        var query = '';
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = $("#exampleFormControlSelect1").val();
        var to = $("#exampleFormControlSelect2").val();
        var vocabId =  '2A732D8863284E69BA7399AACA7B962C';
        var item = that.reArry(that.arrayAfter);
        var fewaf = [];
        item.filter((items,index) => {
          var str = "";
          items.map((itemss,indexs) => {
            if(indexs==items.length-1){
              str+=itemss;
            }else{
              str+=itemss+"\n";
            }
          });
          fewaf.push(str);
        });
        var ArrayXiabiao = 0;
        var indexAgo = 0;
        function ajax_(){
          if(ArrayXiabiao<=item.length-1){
            query = fewaf[ArrayXiabiao];







            // 有道免费翻译
            $.ajax({
              url: 'http://39.105.43.110:304/translate',
              // url: '/translate',
              type: 'get',
              data: {
                  doctype: "json",
                  type: from,
                  i: query,
              },
              success: function (data) {
                data.translateResult.map((items,index1)=>{
                  let str = "";
                  items.map(res=>{
                    str+=res.tgt;
                  })
                  
                  if(type=="i18n"){
                    that.result += that.arrayAgo[indexAgo]+"="+str+"\n";
                  }else{
                    that.result += str+"\n";
                  }
                  indexAgo++;
                });
                ArrayXiabiao++;
                if(ArrayXiabiao<=item.length-1){
                  ajax_();
                }
              }
            });






















            // 有道付费翻译
            // var salt = (new Date).getTime();
            // var curtime = Math.round(new Date().getTime()/1000);
            // var str1 = appKey + that.truncate(query) + salt + curtime + key;
            // var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
            // $.ajax({
            //   url: 'http://openapi.youdao.com/api',
            //   type: 'post',
            //   dataType: 'jsonp',
            //   data: {
            //       q: query,
            //       appKey: appKey,
            //       salt: salt,
            //       from: from,
            //       to: to,
            //       sign: sign,
            //       signType: "v3",
            //       curtime: curtime,
            //       vocabId: vocabId,
            //   },
            //   success: function (data) {
            //     that.toArray(data.translation[0]).map((item,index1)=>{
            //       that.result += that.arrayAgo[indexAgo]+"="+item+"\n";
            //       indexAgo++;
            //     });
            //     ArrayXiabiao++;
            //     if(ArrayXiabiao<=item.length-1){
            //       ajax_();
            //     }
            //   }
            // });
          }
        }
        ajax_();
      }
    },
    getDengAgo(array){
      this.arrayAgo = [];
      this.arrayAfter = [];
      var that = this;
      array.filter((res, index) => {
        // if(res.indexOf("=")!=-1){
          var text = res;
          var text1 = res;
          that.arrayAgo.push(text);
          that.arrayAfter.push(text1);
        // }
      });
    },
    getDengAgoI18n(array){
      this.arrayAgo = [];
      this.arrayAfter = [];
      var that = this;
      array.filter((res, index) => {
        if(res.indexOf("=")!=-1){
          var text = res.split("=")[0];
          var text1 = res.split("=")[1];
          that.arrayAgo.push(text);
          that.arrayAfter.push(text1);
        }
      });
    }
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
@import "../../static/css/text-tool.css";
</style>