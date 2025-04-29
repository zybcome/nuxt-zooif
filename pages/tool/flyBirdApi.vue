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
              Fly Bird Api
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> Fly Bird Api</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- End banner Area -->
    <div class="whois-box">
      <div class="whois-introduce">
        <section>
          <div class="container">
            <div style="text-align:center">
              <ul style="min-height:200px;">
                <el-input placeholder="" v-model="option.type" style="margin-bottom: 10px">
                  <template slot="prepend">type</template>
                </el-input>

<!--                <el-input-->
<!--                  type="textarea"-->
<!--                  :rows="10"-->
<!--                  placeholder="joinInfoList"-->
<!--                  v-model="joinInfoList">-->
<!--                </el-input>-->
                <el-button type="primary" @click="getApi()">Get</el-button>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "~/plugins/api";
export default {
  head() {
    return {
      title: 'Fly Bird Api - ZooIf',
    }
  },
  data: function () {
    return {
      // app_secret:"0d04631beba72b69ce039e799ab2c2d65521b91e", // Fly Bird App Secret
      app_secret:"c54100b5b15d69d5cf0db9e8a653333a60f73c23", // 测试
      option:{
        type:"bg.mall.info.get",
        // type:"bg.local.goods.cats.get",
        // app_key:"1174cefa9768047ee0f0e5a200ab5302", // Fly Bird App Secret
        app_key:"f9d5cc9313893a20d5aa85c654e8f503", // 测试
        // access_token:"gpshimjsimg1v99pvpdwdgs48egbhaefpk8wk7im5a0il2bqtfwdroujt7h", // Fly Bird App Secret
        access_token:"hczowoe1dvj17vryttgbfbhpmaklppuqybg52dtornfysui0frjcugom", // 测试
        timestamp:"",
        data_type:"JSON",
      },
      testData: {
        "type": "bg.open.accesstoken.info.get",
        "timestamp": 1711531835,
        "app_key": "f9d5cc9313893a20d5aa85c654e8f503",
        "data_type": "JSON",
        "access_token": "hczowoe1dvj17vryttgbfbhpmaklppuqybg52dtornfysui0frjcugom",
        "sign": "EF66935B2FB3441DADC0F6A54671FE11"
      }
    };
  },
  computed: {},
  mounted: function () {
    this.testGetApi()
  },
  methods: {
    testGetApi(){
      api.flyBirdApi(this.testData).then(res=>{
        console.log(res)
      })
    },
    getApi(){
      this.option.app_secret = this.app_secret
      this.option.timestamp = Math.floor(Date.now() / 1000).toString();
      this.option.sign = this.generateTemuSign(this.option,this.app_secret)
      api.flyBirdApi(this.option).then(res=>{
        console.log(res)
      })
    },
    getSign(option){
      this.option.timestamp = Math.floor(Date.now() / 1000).toString();
      const sortedKeys = Object.keys(option).sort();
      let signStr = this.app_secret;
      sortedKeys.forEach(key => {
        signStr += key + option[key]; // 拼接 key+value
      });
      signStr += this.app_secret

      return MD5(signStr).toString().toUpperCase()
    },
    /**
     * 生成Temu开放平台签名
     * @param {Object} params - 请求参数(包含公共参数+业务参数)
     * @param {string} appSecret - 应用的secret_key
     * @returns {string} 32位大写MD5签名
     */
    generateTemuSign(params, appSecret) {
      // 1. 参数深拷贝避免污染原对象
      const signParams = JSON.parse(JSON.stringify(params));
      console.log(signParams)
      // 2. 按ASCII码严格排序键名
      const sortedKeys = Object.keys(signParams).sort((a, b) => {
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          const charA = a.charCodeAt(i) || 0;
          const charB = b.charCodeAt(i) || 0;
          if (charA !== charB) return charA - charB;
        }
        return 0;
      });
      console.log(sortedKeys)

      // 3. 拼接签名字符串
      let signStr = appSecret;
      sortedKeys.forEach(key => {
        const value = signParams[key];

        // 处理不同类型参数值
        let valueStr;
        if (value === null || value === undefined) {
          valueStr = '';
        } else if (typeof value === 'object') {
          // 对象/数组保持原始键序进行JSON序列化
          valueStr = JSON.stringify(value, (k, v) =>
            v instanceof Object ? Object.keys(v).sort().reduce((o, k) => (o[k] = v[k], o), {}) : v
          );
        } else {
          valueStr = String(value);
        }

        signStr += key + valueStr;
      });
      signStr += appSecret;
      console.log(signStr)
      // 4. 生成MD5签名（32位大写）
      return MD5(signStr).toString().toUpperCase();
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>

<style>
.dialogClass{background: #000 !important;}
.dialogClass .el-dialog__title{color: #fff;}
.goods_title{
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制在一行内显示文本的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>



