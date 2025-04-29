// 使用命名导入代替默认导入
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default ({ app }, inject) => {
  inject('xlsx', XLSX) // 注入整个命名空间
  inject('saveAs', saveAs)
}
