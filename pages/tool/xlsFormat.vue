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
              表格格式化
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 表格格式化</a></p>
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
                <div>
                  <el-upload
                    action=""
                    :on-change="handleChange"
                    accept=".xls"
                  >
                    <el-button type="primary">上传表格并获取获取格式化后文本</el-button>
                  </el-upload>
                  <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="获取格式化后文本"
                    v-model="resData">
                  </el-input>
                  <el-input placeholder="请输入内容" v-model="outputName">
                    <template slot="prepend">TXT文件名</template>
                  </el-input>
                  <el-button type="primary" @click="exportStringToTxt(resData,outputName)">导出</el-button>
                </div>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- <v-footer></v-footer> -->
  </div>
</template>

<script>
import api from "~/plugins/api";
// import VFooter from "~/components/footer";
import { Message, Upload, Table } from "element-ui";
import Papa from 'papaparse';
export default {
  components: {
    'el-upload': Upload,
    'el-table': Table
  },
  head() {
    return {
      title: '去重 - ZooIf',
    }
  },
  data: function () {
    return {
      tableData:[],
      hhId:"",
      hhIdData:"",
      resData:"",
      outputName:this.formatDate(new Date())
    };
  },
  computed: {},
  mounted: function () {},
  methods: {
    handleChange(file, fileList) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const { data, meta } = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          quoteChar: "·",
        });
        this.tableData = data;
        this.resData = this.formatXls(this.tableData)
      };
      reader.readAsText(file.raw);
    },
    // 格式化表格内容转化为字符串
    formatXls(data){
      return data.map(item => {
        // 获取对象的所有键名
        const keys = Object.keys(item);
        // 动态获取第一个、第二个和第四个属性的值
        const firstValue = item[keys[4]];
        const secondValue = item[keys[3]];
        const fourthValue = item[keys[1]];
        console.log(`${firstValue}-----${secondValue}-----${fourthValue}`)
        // 按照指定格式拼接字符串
        return `${firstValue}-----${secondValue}-----${fourthValue}`;
      }).join("\n");
    },
    exportStringToTxt(data, filename) {
      if(!data){
        Message.error('格式化后文本不能为空！');
        return;
      }
      // 创建一个 Blob 对象，指定类型为 text/plain
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });

      // 创建一个下载链接
      const url = URL.createObjectURL(blob);

      // 创建一个 a 标签并模拟点击
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || this.formatDate(new Date()); // 设置下载文件的名称
      a.download+='.txt';
      a.click();

      // 释放 URL 对象
      URL.revokeObjectURL(url);
    }
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>
