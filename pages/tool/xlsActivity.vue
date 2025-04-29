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
import {Message, MessageBox, Upload} from "element-ui";
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
      lowPrice:""
    };
  },
  computed: {},
  mounted: function () {},
  methods: {
    handleFileChangeOu(file){
      this.handleFileChange(file,900)
    },
    handleFileChangeCa(file){
      this.handleFileChange(file,100)
    },
    async handleFileChange(file,lowPrice) {
      if (process.client) {
        // 通过原型链访问完整的 XLSX 对象
        const XLSX = this.$xlsx
        const saveAs = this.$saveAs

        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          // 正确调用方法：XLSX.read(...)
          const workbook = XLSX.read(data, { type: 'array' })
          // 处理活动申报价格表
          const priceSheet = workbook.Sheets['活动申报价格']
          const priceData = XLSX.utils.sheet_to_json(priceSheet)
          const filteredData = priceData.filter(row =>
            // Number(row['活动申报价格']) >= that.lowPrice
            Number(row['活动申报价格']) >= lowPrice
          )
          // 更新原工作表
          const newPriceSheet = XLSX.utils.json_to_sheet(filteredData)
          workbook.Sheets['活动申报价格'] = newPriceSheet

          // 生成新文件
          const newWB = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(newWB, newPriceSheet, '活动申报价格')

          // 保留原库存表
          const stockSheet = workbook.Sheets['活动库存']
          XLSX.utils.book_append_sheet(newWB, stockSheet, '活动库存')
          // 导出文件
          const wbout = XLSX.write(newWB, { bookType: 'xlsx', type: 'array' })
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '处理后的文件.xlsx')
        }
        reader.readAsArrayBuffer(file.raw)
      }
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>

<style>
</style>
