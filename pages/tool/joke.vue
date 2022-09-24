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
              笑话大全
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 笑话大全</a></p>
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
              <ul style="height: 500px;overflow: auto;">
                <li v-for="itm in textList">
                  <h3>{{itm.title}}</h3>
                  <span>{{itm.time}}</span>
                  <p>{{itm.content}}</p>
                </li>
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
import { Message } from "element-ui";
export default {
  components: {
    // VFooter,
  },
  head() {
    return {
      title: '笑话大全 - ZooIf',
    }
  },
  data: function () {
    return {
      textList: [],
    };
  },

  computed: {},

  mounted: function () {
    this.getJokeList();
  },

  methods: {
    getJokeList() {
      api.getJoke().then((res) => {
        if (res.code == 200) {
          this.textList = res.data;
        }
      });
    },
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
</style>