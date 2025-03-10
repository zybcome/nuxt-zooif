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
                <el-row :gutter="20">
                  <el-col :sm="24" :md="12" style="margin-bottom: 30px">
                    <el-upload
                      ref="upload"
                      action=""
                      :on-change="handleChange"
                      :show-file-list="false"
                      accept=".xls,.xlsx"
                      multiple
                    >
                      <el-button type="primary">上传表格并获取格式化后文本</el-button>
                    </el-upload>
                  </el-col>
                  <el-col :sm="24" :md="12" style="margin-bottom: 30px">
                    <el-upload
                      ref="upload"
                      action=""
                      :on-change="handleChangeTxt"
                      :show-file-list="false"
                      accept=".txt"
                      multiple
                    >
                      <el-button type="primary">上传格式化后文本</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
                <el-input
                  type="textarea"
                  :rows="10"
                  placeholder="获取格式化后文本"
                  @input="getResDataNum()"
                  v-model="resData">
                </el-input>
                <el-input placeholder="请输入文件名称：名称-操作人 例如：Zoo If-Trump" v-model="outputName">
                  <template slot="prepend">TXT文件名</template>
                </el-input>
                <el-button type="primary" @click="exportStringToTxt(resData,outputName)">导出{{resDataNum||""}}</el-button>
                <el-button type="primary" @click="openDialogBtn()">过图{{resDataNum||""}}</el-button>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <el-dialog :title="'图片列表'+resDataImgList.length+'/'+resDataImgListMate.length " custom-class="dialogClass" :visible.sync="openDialog" :fullscreen="true" :center="true">
      <div style="height: calc(100vh - 109px);overflow-y: auto;padding:20px">
        <el-row :gutter="20" style="margin-bottom: 30px">
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" v-for="(item,index) in resDataImgList" :key="index" style="margin-bottom: 20px">
            <div style="text-align: center">
              <el-image fit="cover" :src="item[1]" lazy>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <span class="goods_title" :title="item[2]">{{item[2]}}</span>
              <el-button style="width: 100%" size="mini" type="danger" plain @click="delImg(index)">删除({{index+1}})</el-button>
            </div>
          </el-col>
        </el-row>
        <div style="position: fixed;bottom: 10px;left: 50%;transform: translateX(-50%);display: flex; align-items: center; gap: 10px;">
          <el-input placeholder="请输入文件名称：名称-操作人 例如：Zoo If-Trump" v-model="outputName"
                    style="flex: 1;width: 400px;">
            <template slot="prepend">TXT文件名</template>
          </el-input>
          <el-button type="primary" @click="exportImageList()">导出({{resDataImgList.length}})</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <v-footer></v-footer> -->
  </div>
</template>

<script>
import api from "~/plugins/api";
// import VFooter from "~/components/footer";
import {Message, MessageBox, Upload} from "element-ui";
import Papa from 'papaparse';
export default {
  components: {
    'el-upload': Upload
  },
  head() {
    return {
      title: '表格格式化 - ZooIf',
    }
  },
  data: function () {
    return {
      tableData:[],
      hhId:"",
      hhIdData:"",
      resData:"",
      outputName:"",
      resDataNum:0,
      openDialog:false,
      resDataImgListMate:[],
      resDataImgList:[],
    };
  },
  computed: {},
  mounted: function () {},
  methods: {
    openDialogBtn(){
      if(this.resData){
        this.resDataImgList = []
        this.resDataImgListMate = this.resData.split('\n')
        this.resDataImgListMate.map(res=>{
          this.resDataImgList.push(res.split('-----'))
        })
        if(this.outputName) {this.openDialog = true}else Message.error('请输入文件名称！');
      }else{
        this.resDataImgListMate = []
        this.resDataImgList = []
        Message.error('格式化后文本不能为空！');
      }
    },
    delImg(index){
      this.resDataImgList.splice(index, 1); // 从数组中移除指定索引的元素
    },
    getResDataNum(){
      this.resDataNum = this.resData?this.resData.split('\n').length:""
    },
    handleChange(file, fileList) {
      // this.outputName = this.formatDate(new Date())
      this.outputName = file.name.split('.')[0]
      const reader = new FileReader();
      this.resData = ""
      reader.onload = (event) => {
        const csvData = event.target.result;
        const { data, meta } = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          quoteChar: "·!`",
        });
        this.tableData = data;
        if(this.resData){
          this.resData += "\n"+this.formatXls(this.tableData)
        }else{
          this.resData = this.formatXls(this.tableData)
        }
        this.getResDataNum()
      };
      reader.readAsText(file.raw);
    },
    handleChangeTxt(file, fileList) {
      // this.outputName = this.formatDate(new Date())
      this.outputName = file.name.split('.')[0]
      const reader = new FileReader();
      this.resData = ""
      reader.onload = (event) => {
        this.resData = event.target.result;
        this.getResDataNum()
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
        // 按照指定格式拼接字符串
        return `${firstValue.trim()}-----${secondValue.trim()}-----${fourthValue.trim()}`;
      }).join("\n");
    },
    exportImageList(){
      let that = this;
      let exportImageTxt = ""
      that.resDataImgList.map(item=>{
        if(exportImageTxt){
          exportImageTxt += "\n"+item[0]+"-----"+item[1]+"-----"+item[2]
        }else{
          exportImageTxt += item[0]+"-----"+item[1]+"-----"+item[2]
        }
      })
      that.exportStringToTxt(exportImageTxt,that.outputName)
      // MessageBox.prompt('请输入TXT文件名称', '导出过图之后TXT', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      // }).then(({ value }) => {
      // });
    },
    exportStringToTxt(data, filename) {
      if(!data){
        Message.error('格式化后文本不能为空！');
        return;
      }
      if(!filename) return Message.error('请输入文件名称！');
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
