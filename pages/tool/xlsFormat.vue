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
                <el-input placeholder="请输入文件名称：名称-操作人 例如：Zoo If-Trump" v-model="outputName" style="margin-bottom: 10px">
                  <template slot="prepend">TXT文件名</template>
                </el-input>
                <el-button type="primary" @click="exportStringToTxt(resData,outputName)">导出{{resDataNum||""}}</el-button>
                <el-button type="danger" @click="openDialogBtn()">过图{{resDataNum||""}}（黑色居多）</el-button>
                <el-button type="danger" @click="openDialogBtnWhite()">过图{{resDataNum||""}}（白色居多）</el-button>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <el-dialog :title="'图片列表'+(resDataImgList.length+resDataImgListWhite.length)+'/'+resDataImgListMate.length " custom-class="dialogClass" :visible.sync="openDialog" :fullscreen="true" :center="true">
      <div style="height: calc(100vh - 109px);overflow-y: auto;padding:20px">

<!--        黑色-->
        <el-row v-if="isBlackMaster" :gutter="20" style="margin-bottom: 30px">
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" v-for="(item,index) in resDataImgList" :key="index" style="margin-bottom: 20px">
            <div style="text-align: center">
              <el-image fit="cover" :src="item[1]" lazy>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <span class="goods_title" :title="item[2]">{{item[2]}}</span>
              <el-button style="width: 100%" size="mini" type="success" plain @click="thisWhite(index)">这是白色({{index+1}})</el-button>
              <br>
              <el-button style="width: 100%" size="mini" type="danger" plain @click="delImg(index)">删除({{index+1}})</el-button>
            </div>
          </el-col>
        </el-row>

<!--        白色-->
        <el-row :gutter="20" style="margin-bottom: 30px">
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" v-for="(item,index) in resDataImgListWhite" :key="index" style="margin-bottom: 20px">
            <div style="text-align: center">
              <el-image fit="cover" :src="item[1]" lazy>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <span class="goods_title" :title="item[2]">{{item[2]}}</span>
              <el-button style="width: 100%" size="mini" type="warning" plain @click="thisBlack(index)">这是黑色({{index+1}})</el-button>
              <br>
              <el-button style="width: 100%" size="mini" type="danger" plain @click="delImgWhite(index)">删除({{index+1}})</el-button>
            </div>
          </el-col>
        </el-row>

<!--        黑色-->
        <el-row v-if="!isBlackMaster" :gutter="20" style="margin-bottom: 30px">
          <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" v-for="(item,index) in resDataImgList" :key="index" style="margin-bottom: 20px">
            <div style="text-align: center">
              <el-image fit="cover" :src="item[1]" lazy>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <span class="goods_title" :title="item[2]">{{item[2]}}</span>
              <el-button style="width: 100%" size="mini" type="success" plain @click="thisWhite(index)">这是白色({{index+1}})</el-button>
              <br>
              <el-button style="width: 100%" size="mini" type="danger" plain @click="delImg(index)">删除({{index+1}})</el-button>
            </div>
          </el-col>
        </el-row>

        <div style="position: fixed;bottom: 10px;left: 50%;transform: translateX(-50%);display: flex; align-items: center;flex-direction: column; gap: 10px;">
          <el-input placeholder="请输入文件名称：名称-操作人-黑色 例如：Zoo If-Trump-黑色" v-model="outputName"
                    style="flex: 1;width: 700px">
            <template slot="prepend">黑色TXT文件名</template>
          </el-input>
          <el-input placeholder="请输入文件名称：名称-操作人-白色 例如：Zoo If-Trump-白色" v-model="outputNameWhite"
                    style="flex: 1;width: 700px">
            <template slot="prepend">白色TXT文件名</template>
          </el-input>
          <el-button type="primary" @click="exportImageList()">导出【黑色({{resDataImgList.length}})、白色({{resDataImgListWhite.length}})】</el-button>
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
      outputNameWhite:"",
      resDataNum:0,
      openDialog:false,
      resDataImgListMate:[],
      resDataImgList:[],
      resDataImgListWhite:[],
      isBlackMaster:true
    };
  },
  computed: {},
  mounted: function () {},
  methods: {
    // 黑色居多
    openDialogBtn(){
      this.resDataImgListMate = []
      this.resDataImgList = []
      this.resDataImgListWhite = []
      this.isBlackMaster = true
      if(this.resData){
        this.resDataImgListMate = this.resData.split('\n')
        this.resDataImgListMate.map(res=>{
          this.resDataImgList.push(res.split('-----'))
        })
        if(this.outputName) {this.openDialog = true}else return Message.error('请输入文件名称！');
        this.outputNameWhite = this.outputName
        if(this.outputName.indexOf("黑色")===-1 && this.outputName.indexOf("白色")===-1){
          this.outputName += "-黑色"
          this.outputNameWhite += "-白色"
        }
      }else{
        Message.error('格式化后文本不能为空！');
      }
    },
    openDialogBtnWhite(){
      this.resDataImgListMate = []
      this.resDataImgListWhite = []
      this.resDataImgList = []
      this.isBlackMaster = false
      if(this.resData){
        this.resDataImgListMate = this.resData.split('\n')
        this.resDataImgListMate.map(res=>{
          this.resDataImgListWhite.push(res.split('-----'))
        })
        if(this.outputName) {this.openDialog = true}else return Message.error('请输入文件名称！');
        this.outputNameWhite = this.outputName
        if(this.outputName.indexOf("黑色")===-1 && this.outputName.indexOf("白色")===-1){
          this.outputName += "-黑色"
          this.outputNameWhite += "-白色"
        }
      }else{
        Message.error('格式化后文本不能为空！');
      }
    },
    // 删除黑色
    delImg(index){
      this.resDataImgList.splice(index, 1);
    },
    // 设置为白色
    thisWhite(index){
      this.resDataImgListWhite.push(this.resDataImgList[index])
      this.resDataImgList.splice(index, 1);
    },
    // 删除白色
    delImgWhite(index){
      this.resDataImgListWhite.splice(index, 1);
    },
    //设置为黑色
    thisBlack(index){
      this.resDataImgList.push(this.resDataImgListWhite[index])
      this.resDataImgListWhite.splice(index, 1);
    },
    getResDataNum(){
      this.resDataNum = this.resData?this.resData.split('\n').length:""
    },
    async handleChange(file, fileList) {
      const { read, utils } = this.$xlsx;
      const reader = new FileReader();
      let that = this;
      reader.onload = async (e) => {
        try {
          // 读取Excel文件
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: "array" });

          // 初始化数据存储数组
          const dataArray = [];

          // 遍历所有工作表
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];

            // 将工作表转为JSON数组（自动跳过标题行）
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            // 从第二行开始处理（索引1对应第二行）
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];

              // 处理每行数据：过滤空值、去除|符号
              const processedRow = [4, 3, 1]  // 定义目标列索引 [第四列, 第三列, 第一列]
                .map(colIndex => {
                  // 获取单元格值并处理
                  const cell = row[colIndex];
                  const strValue = cell?.toString()?.trim() || '';
                  return strValue.replace(/\|/g, ''); // 移除所有|
                })
                .join('-----'); // 用指定分隔符连接

              dataArray.push(processedRow);
            }
          });

          that.resData = dataArray.join('\n');
          // 这里可以继续处理dataArray，如展示或保存

        } catch (error) {
          this.$message.error('文件解析失败，请检查文件格式');
        }
      };

      reader.readAsArrayBuffer(file.raw);
    },
    // handleChange(file, fileList) {
    //   // this.outputName = this.formatDate(new Date())
    //   this.outputName = file.name.split('.')[0]
    //   const reader = new FileReader();
    //   this.resData = ""
    //   reader.onload = (event) => {
    //     const csvData = event.target.result;
    //     const { data, meta } = Papa.parse(csvData, {
    //       header: true,
    //       skipEmptyLines: true,
    //       quoteChar: "·!`",
    //     });
    //     this.tableData = data;
    //     if(this.resData){
    //       this.resData += "\n"+this.formatXls(this.tableData)
    //     }else{
    //       this.resData = this.formatXls(this.tableData)
    //     }
    //     this.resData = this.resData.replace(/\|/g, '').replace(/"/g, '')
    //     this.getResDataNum()
    //   };
    //   reader.readAsText(file.raw);
    // },
    handleChangeTxt(file, fileList) {
      // this.outputName = this.formatDate(new Date())
      this.outputName = file.name.split('.')[0]
      const reader = new FileReader();
      this.resData = ""
      reader.onload = (event) => {
        this.resData = event.target.result;
        this.resData = this.resData.replace(/\|/g, '').replace(/"/g, '')
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
      if(that.resDataImgList.length>0){
        if(that.outputName.indexOf("黑色") == -1) return Message.error('黑色体恤文件名必须包含黑色！');
        let exportImageTxt = ""
        that.resDataImgList.map(item=>{
          if(exportImageTxt){
            exportImageTxt += "\n"+item[0]+"-----"+item[1]+"-----"+item[2]
          }else{
            exportImageTxt += item[0]+"-----"+item[1]+"-----"+item[2]
          }
        })
        that.exportStringToTxt(exportImageTxt,that.outputName)
      }
      if(that.resDataImgListWhite.length>0){
        if(that.outputNameWhite.indexOf("白色") == -1) return Message.error('白色体恤文件名必须包含白色！');
        let exportImageTxtWhite = ""
        that.resDataImgListWhite.map(item=>{
          if(exportImageTxtWhite){
            exportImageTxtWhite += "\n"+item[0]+"-----"+item[1]+"-----"+item[2]
          }else{
            exportImageTxtWhite += item[0]+"-----"+item[1]+"-----"+item[2]
          }
        })
        that.exportStringToTxt(exportImageTxtWhite,that.outputNameWhite)
      }
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
