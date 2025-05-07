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
              报活动表格过滤
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 报活动表格过滤</a></p>
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
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="handleFileChangeCa"
                      accept=".xls,.xlsx"
                      multiple
                    >
                      <el-button type="primary">加拿大上传表格</el-button>
                    </el-upload>
                  </el-col>
                  <el-col :sm="24" :md="12" style="margin-bottom: 30px">
                    <el-upload
                      ref="upload"
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="handleFileChangeOu"
                      accept=".xls,.xlsx"
                      multiple
                    >
                      <el-button type="primary">欧区上传表格</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {Message, MessageBox, Upload, Loading, Icon} from "element-ui";
export default {
  components: {
    'el-upload': Upload
  },
  head() {
    return {
      title: '报活动表格过滤 - ZooIf',
    }
  },
  data: function () {
    return {
      lowPrice:"",
      LoadingInstance: null,
    };
  },
  computed: {},
  mounted: function () {},
  methods: {
    handleFileChangeOu(file) {
      this.LoadingInstance = Loading.service({
        text: "正在加载数据，请稍候",
        customClass: "zIndex9999",
        background: "rgba(0, 0, 0, 0.5)"
      });
      setTimeout(() => {
        this.handleFileChange(file, 88);
      }, 100);
    },

    handleFileChangeCa(file) {
      this.LoadingInstance = Loading.service({
        text: "正在加载数据，请稍候",
        customClass: "zIndex9999",
        background: "rgba(0, 0, 0, 0.5)"
      });
      setTimeout(() => {
        this.handleFileChange(file, 100);
      }, 100);
    },

    async handleFileChange(file, lowPrice) {
      let that = this;
      if (process.client) {
        const { read, write, utils } = this.$xlsx;
        const saveAs = this.$saveAs;
        const reader = new FileReader();
        let chunkIndex = 1; // 分块序号计数器

        reader.onload = async (e) => {
          // 读取原始数据
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: "array" });

          // 处理活动申报价格表
          const priceSheet = workbook.Sheets["活动申报价格"];
          const priceData = utils.sheet_to_json(priceSheet);
          const stockSheet = workbook.Sheets["活动库存"];

          // 第一步：过滤数据
          const filteredData = priceData.filter(
            row => Number(row["活动申报价格"]) >= lowPrice
          );
          console.log(filteredData.length)

          // 第二步：构建SPU分组数组
          const spuGroups = [];
          let currentSpu = null;
          let currentGroup = [];

          // 生成完整的SPU分组（不拆分SPU）
          filteredData.forEach(row => {
            if (row["SPU ID"] !== currentSpu) {
              if (currentGroup.length > 0) {
                spuGroups.push([...currentGroup]);
              }
              currentGroup = [row];
              currentSpu = row["SPU ID"];
            } else {
              currentGroup.push(row);
            }
          });
          console.log(currentGroup)
          if (currentGroup.length > 0) spuGroups.push(currentGroup);

          // 第三步：智能分块逻辑
          const MAX_ROWS = 2000;
          let chunks = [];
          let currentChunk = [];
          let currentChunkRowCount = 0;
          let currentChunkRowCountTest = 0;

          console.log(spuGroups)
          spuGroups.forEach((group, index) => {
            const groupSize = group.length;

            // // 情况1：当前组无法放入当前块
            // if (currentChunkRowCount + groupSize > MAX_ROWS) {
            //   // 如果当前块已有数据，先导出
            //   if (currentChunk.length > 0) {
            //     chunks.push([...currentChunk]);
            //     currentChunk = [];
            //     currentChunkRowCount = 0;
            //   }
            // }

            // 情况2：可以放入当前块
            currentChunk.push(...group);
            currentChunkRowCount += groupSize;
            currentChunkRowCountTest++
            console.log(currentChunkRowCountTest)
            console.log(currentChunkRowCount)
            // 检查是否到达分块阈值
            if (currentChunkRowCountTest >= MAX_ROWS) {
              chunks.push([...currentChunk]);
              console.log("分块", chunks.length);
              this.exportChunk(currentChunk, stockSheet, utils, write, saveAs, chunkIndex++);
              currentChunk = [];
              currentChunkRowCount = 0;
              currentChunkRowCountTest = 0;
            }
          });

          // 处理最后未导出的块
          if (currentChunk.length > 0) {
            this.exportChunk(currentChunk, stockSheet, utils, write, saveAs, chunkIndex);
          }

          that.LoadingInstance.close();
        };

        reader.readAsArrayBuffer(file.raw);
      }
    },

    // 分块导出方法（优化版）
    exportChunk(chunkData, stockSheet, utils, write, saveAs, chunkIndex) {
      const timestamp = Date.now();

      // 创建新工作簿
      const newWB = utils.book_new();

      // 添加分块数据
      const newPriceSheet = utils.json_to_sheet(chunkData);
      utils.book_append_sheet(newWB, newPriceSheet, "活动申报价格");

      // 添加库存表（结构化克隆）
      const stockClone = structuredClone(stockSheet);
      utils.book_append_sheet(newWB, stockClone, "活动库存");

      // 生成文件
      const wbout = write(newWB, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `分块文件_${timestamp}_${chunkIndex}.xlsx` // 带有序号的文件名
      );
    }
  }
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>

<style>
</style>
