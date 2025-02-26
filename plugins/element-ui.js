// import Vue from 'vue'
// import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'

// Vue.use(Element, { locale })

import Vue from 'vue'
import {
  Message,
  Notification,
  Loading,
  Popover,
  MessageBox,
  Button,
  Input,
  Form,
  FormItem,
  Checkbox,
  Alert,
  Dialog,
  Tooltip,
  Select,
  Option,
  Tag,
  Table,
  TableColumn,
  Image,
  Row,
  Col
} from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

const components = [
    Message, Notification,Popover,MessageBox,Button,Input,Form,FormItem,Checkbox,Alert,Dialog,Tooltip,Select,Option,Tag,Table,TableColumn,Image, Row, Col
];

const Element = {
    install(Vue) {
        components.forEach(component => {
            Vue.component(component.name, component)
        })
    }
}
Vue.prototype.msgTip = '';
Vue.prototype.msgTip1 = '';
Vue.prototype.msgjoinTip = '';
Vue.prototype.$MessageBox = MessageBox
Vue.use(Loading)
Vue.use(Loading.directive)
Vue.use(Element, { locale })

Vue.prototype.formatDate = function (date) {
  const year = date.getFullYear(); // 年份
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份（从0开始，需要加1）
  const day = String(date.getDate()).padStart(2, "0"); // 日期
  const hours = String(date.getHours()).padStart(2, "0"); // 小时
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 分钟
  const seconds = String(date.getSeconds()).padStart(2, "0"); // 秒

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
