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
              骰子游戏
            </h1>
            <p class="text-white link-nav"><a href="/">首页 </a> <span class="lnr lnr-arrow-right"></span> <a href=""> 骰子游戏</a></p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- End banner Area -->
    <div class="whois_search">
      <div class="whois_search_position">
        <p class="whois_search_p">
          骰子数量
        </p>
        <div class="whois_search_div">
          <!-- <input
            type="number"
            class="form-control whois_search_input"
            v-model="touziNumber"
            placeholder="请输入骰子数量5-10"
          /> -->
          <el-select v-model="touziNumber" placeholder="请选择骰子数量">
            <el-option
              v-for="item in touziNumberArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" @click="startGame(touziNumber)">开始游戏</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="骰子游戏" :visible.sync="openDialog" :fullscreen="true" :center="true">
   		<div class="wrap_touzi">
        <el-collapse-transition>
          <div id='dice_mask' v-show="showMsak"><el-tag v-show="showMsak">{{showMsakText}}</el-tag></div>
        </el-collapse-transition>
   			<div v-for="item in touziArray" :id="'dice'+item" :class="'dice dice_'+(item+1)"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="ckickSuiji()">随机</el-button>
        <el-button v-if="showMsak" type="success" circle @click="openMask()">开</el-button>
        <el-button v-if="!showMsak" type="warning" circle @click="closeMask()">关</el-button>
        <el-button type="danger" round @click="ckickDuoyi()">多一</el-button>
      </div>
    </el-dialog>
    <!-- <v-footer></v-footer> -->
  </div>
</template>

<script>
// import VFooter from "~/components/footer";
import { Message } from "element-ui";
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'

Vue.component(CollapseTransition.name, CollapseTransition)
export default {
  components: {
    // VFooter,
  },
  head() {
    return {
      title: '骰子游戏 - ZooIf',
    }
  },
  data: function () {
    return {
      touziNumber:'',
      touziNumberArray:[
        {label:"5个",value:5},
        {label:"6个",value:6},
        {label:"7个",value:7},
        {label:"8个",value:8},
        {label:"9个",value:9},
      ],
      showMsak:true,
      openDialog:false,
      touziArray:[],
      showMsakText:'随机'
    };
  },

  computed: {},

  mounted: function () {
  },

  methods: {
    openMask(){
      this.showMsak = false;
    },
    closeMask(){
      this.showMsak = true;
    },
    startGame(num){
      if(num<=9&&num>=5){
        this.touziArray = [];
        for(let i=0;i<num;i++){
          this.touziArray.push(i);
        }
        this.openDialog = true;
        // this.ckickDuoyi();
      }else{
        Message.error('错了哦');
      }
    },
    ckickSuiji(){
      this.showMsak = true;
      this.showMsakText = "随机"
      for(let i=0;i<this.touziNumber;i++){
        this.touziSelect(i,0)
      }
    },
    ckickDuoyi(){
      this.showMsak = true;
      this.showMsakText = "多一"
      for(let i=0;i<this.touziNumber;i++){
        this.touziSelect(i,1)
      }
    },
    touziSelect(i,status){
        var dice = $("#dice"+i);
        dice.attr("class","dice");//清除上次动画后的点数
        var num = Math.floor(Math.random()*6+1);//产生随机数1-6
        if(status == 1&&i<this.touziNumber/2){
          num = 1;
        }
        dice.animate({left: '+2px'}, 100,function(){
          dice.addClass("dice_t");
        }).delay(200).animate({top:'-2px'},100,function(){
          dice.removeClass("dice_t").addClass("dice_s");
        }).delay(200).animate({opacity: 'show'},600,function(){
          dice.removeClass("dice_s").addClass("dice_e");
        }).delay(100).animate({left:'-2px',top:'2px'},100,function(){
          dice.removeClass("dice_e").addClass("dice_"+num);
        });
    }
  },
};
</script>
<style scoped>
@import "../../static/css/whois.css";
.wrap_touzi{width: 320px; margin: 0 auto; padding:10px; position:relative;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}
.dice{margin: 5px;width:90px; height:90px; background:url(../../static/img/dice.png) no-repeat; cursor:pointer;}
.dice_1{background-position:-5px -4px}
.dice_2{background-position:-5px -107px}
.dice_3{background-position:-5px -212px}
.dice_4{background-position:-5px -317px}
.dice_5{background-position:-5px -427px}
.dice_6{background-position:-5px -535px}
.dice_t{background-position:-5px -651px}
.dice_s{background-position:-5px -763px}
.dice_e{background-position:-5px -876px}
p#result{text-align:center; font-size:16px}
p#result span{font-weight:bold; color:#f30; margin:6px}
#dice_mask{display: flex;align-items: center;justify-content: center;width:100%; height:100%; background:#fff; opacity:0.98; position:absolute; top:0; left:0; z-index:999;border-bottom: 1px solid #333;}

</style>