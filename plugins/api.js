import {
  get,
  post
} from '@/plugins/axios'
const admin = "";
const http = "http://39.105.43.110:810"
const alapi = "https://v2.alapi.cn/api"
// const http = "http://127.0.0.1:810"
export default {
  ServerDomain: '',
  login: data => post(http+admin + '/login', data),
  getCodeImg: data => get(http+admin + '/captchaImage', data),
  getInfo: data => get(http+admin + '/getInfo', data),
  getTiktok: data => post(http+admin + '/system/tiktok', data),
  getPipixia: data => post(http+admin + '/system/pipixia', data),
  getQrCode: data => post(http+admin + '/system/QrCode', data),
  logout: data => post(http+admin + '/logout', data),
  register: data => post(http+admin + '/register', data),
  RefreshToken: data => post(http+admin + '/refresh', data),
  sendEmailCode: data => post(http+admin + '/sendEmailCode', data),
  getJoke: data => post(alapi+admin + '/joke', {token:"6ANYpr3duQPq0T2H",page:1,num:10}),
  getJokeRandom: data => post(alapi+admin + '/joke/random', {token:"6ANYpr3duQPq0T2H"}),
  getQinghua : data => post(alapi+admin + '/qinghua ', {token:"6ANYpr3duQPq0T2H"}),
  getDog : data => post(alapi+admin + '/dog ', {token:"6ANYpr3duQPq0T2H"}),
}
