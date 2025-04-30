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
    handleFileChangeOu(file){
      this.LoadingInstance = Loading.service({ text: "正在加载数据，请稍候",customClass:"zIndex9999", background: "rgba(0, 0, 0, 0.5)" })
      setTimeout(()=>{
        this.handleFileChange(file,90)
      },100)
    },
    handleFileChangeCa(file){
      this.LoadingInstance = Loading.service({ text: "正在加载数据，请稍候",customClass:"zIndex9999", background: "rgba(0, 0, 0, 0.5)" })
      setTimeout(()=>{
        this.handleFileChange(file,100)
      },100)
    },
    async handleFileChange(file, lowPrice) {
      let that = this;
      if (process.client) {
        const { read, write, utils } = this.$xlsx;
        const saveAs = this.$saveAs;
        const reader = new FileReader();
        reader.onload = async (e) => {
          // 读取原始数据
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: "array" });

          // 处理活动申报价格表
          const priceSheet = workbook.Sheets["活动申报价格"];
          const priceData = utils.sheet_to_json(priceSheet);
          const stockSheet = workbook.Sheets["活动库存"];

          // 第一步：过滤数据并生成分组
          const filteredData = priceData.filter(
            row => Number(row["活动申报价格"]) >= lowPrice
          );

          // 第二步：构建分组数组
          const groups = [];
          let currentGroup = [];
          let currentSpu = null;

          for (const row of filteredData) {
            if (row["SPU ID"] === currentSpu) {
              currentGroup.push(row);
              // 每6个为一组
              if (currentGroup.length === 6) {
                groups.push([...currentGroup]);
                currentGroup = [];
                currentSpu = null;
              }
            } else {
              if (currentGroup.length > 0) {
                // 不完整组留到下次处理
                groups.push([...currentGroup]);
              }
              currentGroup = [row];
              currentSpu = row["SPU ID"];
            }
          }

          // 第三步：智能分块逻辑
          const MAX_ROWS = 100000;
          let chunk = [];
          let currentRowCount = 0;
          let pendingGroup = null;

          that.LoadingInstance.close();
          for (const group of groups) {
            const groupRows = group.length;

            // 检查当前组是否能放入当前块
            if (currentRowCount + groupRows > MAX_ROWS) {
              // 导出当前块并重置
              if (chunk.length > 0) {
                this.exportChunk(chunk, stockSheet, utils, write, saveAs);
              }
              chunk = [];
              currentRowCount = 0;
            }

            // 添加完整组到当前块
            if (groupRows === 6) {
              chunk.push(...group);
              currentRowCount += groupRows;
            } else {
              // 不完整组暂存到下一个块
              pendingGroup = group;
            }
          }

          // 处理最后一个块
          if (chunk.length > 0) {
            this.exportChunk(chunk, stockSheet, utils, write, saveAs);
          }
        };

        reader.readAsArrayBuffer(file.raw);
      }
    },

    // 分块导出方法
    exportChunk(chunkData, stockSheet, utils, write, saveAs) {
      const chunkNumber = Date.now(); // 使用时间戳避免重复

      // 创建新工作簿
      const newWB = utils.book_new();

      // 添加分块数据
      const newPriceSheet = utils.json_to_sheet(chunkData);
      utils.book_append_sheet(newWB, newPriceSheet, "活动申报价格");

      // 添加库存表（深度克隆）
      const stockClone = JSON.parse(JSON.stringify(stockSheet));
      utils.book_append_sheet(newWB, stockClone, "活动库存");

      // 生成文件
      const wbout = write(newWB, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `分块文件_${chunkNumber}.xlsx`
      );
    }
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>

<style>
</style>
