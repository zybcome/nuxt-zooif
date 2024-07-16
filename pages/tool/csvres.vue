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
              表格
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 表格去重</a></p>
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
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    accept=".csv"
                  >
                    <el-button type="primary">点击上传店铺商品表格</el-button>
                  </el-upload>
                  <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入需下架的货号"
                    v-model="hhId">
                  </el-input>
                  <el-button type="primary" @click="clickRes">立即获取需下架的商品ID</el-button>
                  <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="去重结果"
                    v-model="resData">
                  </el-input>
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
      resData:""
    };
  },

  computed: {},

  mounted: function () {
  },

  methods: {

    beforeUpload(file) {
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        Message.error('只能上传CSV文件');
      }
      return isCSV;
    },
    handleChange(file, fileList) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const { data, meta } = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        this.tableData = data;
        console.log(this.tableData)
      };
      reader.readAsText(file.raw);
    },
    clickRes(){
      this.resData = []
      const seen = new Set();
      this.hhIdData = this.hhId.split('\n');
      console.log(this.hhIdData)
      this.hhIdData.map(hhId=>{
        this.tableData.map(spId=>{
          if(spId["SKUBM"].indexOf(hhId)!=-1){
            if (seen.has(spId["ID"].split('\t')[0])) {
              return false;
            }
            seen.add(spId["ID"].split('\t')[0]);
          }
        })
      })
      console.log(seen)
      this.resData = seen.join('\n')
      console.log(this.resData)
    }
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>
