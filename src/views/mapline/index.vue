<template>
<el-container>
  <!--<el-header>-->
    <!--<el-row>-->
      <!--<el-col :span="2" class="line">按路线查询公交</el-col>-->
      <!--<el-col :span="2">-->
        <!--<el-input v-model="busLineName" placeholder="请输入内容" @keyup.enter.native="busLineSearch"></el-input>-->
      <!--</el-col>-->
      <!--<el-col :span="2">-->
        <!--<el-button type="primary" @click="busLineSearch">主要按钮</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->
  <!--</el-header>-->
  <el-container>
    <el-aside width="200px" style="background-color:#1f2d3d;position: absolute;height: 700px;">

      <el-row v-for="line in treelist"  :key="line.id" class="line-list">



        <div class="tree-node">
          <h2 @click="(e)=>{treeToggle(e,line)}">
            <span class="el-tree-node__expand-icon"></span>
            <!--<input type="checkbox" @click.stop="" @change="(e)=>{treeLineCheck(e,line)}">-->
            {{line.lineName}}

            <!--<i class="el-icon-fa-level-down"></i> {{line.children.filter((car)=>{return car.UpDown==1}).length}}-->
            <!--/-->
            <!--<i class="el-icon-fa-level-up"></i> {{line.children.filter((car)=>{return car.UpDown!=1}).length}}-->
            <!--<span class="badge"></span>-->
          </h2>
          <!--<div class="children" v-if="line.id">-->
            <!--<div class="tree-node" v-for="car,index in line.busList"   :id="'id'+car.lineId" :key="index">-->
              <!--<h2>-->
                <!--<span @click="(e)=> {treeToggle(e)}"  class="el-tree-node__expand-icon"></span>-->
                <!--<input type="checkbox" @change="(e)=>{treeCheck(e,car)}" @click.stop="" />-->
                <!--<i :class="(car.upDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ') + 'updown'"></i>-->
                <!--<i class="el-icon-fa-bus"></i>-->
                <!--冀R{{car.vehicleNumber}}  {{car.speed}}km/h-->
              <!--</h2>-->
              <!--<div class="children video-list">-->
                <!--&lt;!&ndash;<h3 v-for="i in 8"><input type="checkbox" @change.navtive="(e)=>{viedeoCheck(e,car,i)}" />&ndash;&gt;-->
                  <!--&lt;!&ndash;<i class="el-icon-fa-video-camera"></i> 摄像头{{i}}&ndash;&gt;-->
                <!--&lt;!&ndash;</h3>&ndash;&gt;-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </div>

      </el-row>


    </el-aside>
    <el-main style="padding-left: 200px">


      <el-steps  align-center>

        <el-step class="buslistput" v-for="car,index in treebuslist.upSiteList"   :id="'id'+car.id" :key="index" :description="car.siteName"></el-step>
      </el-steps>

      <el-steps  align-center>

        <el-step class="buslistput" v-for="car,index in treebuslist.downSiteList"   :id="'id'+car.id" :key="index" :description="car.siteName"></el-step>
      </el-steps>




    </el-main>
  </el-container>
  <el-footer>Footer</el-footer>
</el-container>

</template>
<script>

  import AMap from 'AMap';   //在页面中引入高德地图
  import { getBusLineList,getBusList,getBusGPS } from '@/api/table'
  import ElRow from "element-ui/packages/row/src/row";
  import $ from 'jQuery'

  export default {
    components: {ElRow},
    data () {
      return {
        busList:[
          {a:2},
        ],
        reqList:[],
        busLineName:null,
        AMapUI: null,
        AMap: null,
        MapKey: '',
        MapCityName: '',

        //treeList[0].busList.push(busList[0])

        treelist:[{
        "lineName": "1lu",busList:[ {a:2}]
        }],
        treebuslist:[{
          "lineName": "离线"}],
        treebus: {
          label: 'lineName',
          children: 'vehicleNumber',
          isLeaf: false
        },
        GPSlist:'',
        treeCount: 1
      }
    },
    mounted(){
      //this.loadmap();     //加载地图和相关组件

      getBusLineList().then(response => {
        if(response.code === '000') {
          //alert(121)
          this.treelist = response.result
        }

        //this.listLoading = false

      })

      // getBusGPS().then(response => {
      //
      //   if(response.code === '000') {
      //
      //     this.GPSlist = response.result
      //   }
      // })


    },
    methods: {
      initReq(){
        // setInterval(()=>{
        //   getBusList(line.runMethod).then(response => {
        //     // console.log(response.result)
        //     if (response.code === '000') {
        //       response.result.map(bus=>{
        //         this.busList.map()
        //         a.time =  bus.time;
        //         map.update(bus); //marker.setPosition()
        //       })
        //       this.$set(line,"busList",response.result);
        //       // this.treebuslist=response.result;
        //     }
        //   })
        // },3000)
      },


      treeToggle(e,line){
         console.log(e)

        getBusGPS(line.runMethod).then(response => {
           console.log(response.result)
          if (response.code === '000') {

            //this.$set(line,"busList",response.result);
            this.treebuslist=response.result;
          }
        })

        $(e.target).closest(".tree-node").toggleClass("active");
        var reslult = $(e.target).closest(".tree-node").hasClass("active");
        if(data){
          this.$set(data,"show",true);
        }
        return reslult;
      },



      // 搜索
      busLineSearch: function (event) {
        this.treeToggle(this.busLineName)
      },

      //地图

    }
  }
</script>
<style lang="less">
  .mymap{
    width: 100%;
    height: 700px;
  }
  .line {
    font-weight: bold;
  }
  .clearBoth {
    clear: both;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 700px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .searchBanner {
    color: #000;
    font-weight: bold;
  }
  .grid-content span {
    float: left;
    margin: auto 5px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .line-list{

    text-align: left;
    padding-left: 10px;
    .children .tree-node{

    h2{ color:#00fff0;}
    }
  }
  .tree-node{ height:30px; overflow:hidden; color:#aaa; border-top:1px solid #162433;
    .badge{ background:; color:#fff;position:absolute; right:5px;top:4px; border-radius:100%; width:20px; height:20px; line-height:20px; text-align:center; font-size:12px;}
    h2{ font-weight:normal;font-size:14px; margin:0; height:30px; line-height:30px; cursor:pointer;position:relative;
      input[type=checkbox]{vertical-align:-.15em;}
    }
    h2:hover,h2.selected{ background:#293c51; color:#FFF !important;}
    h2,h3{padding:0;margin:0;}
    .video-list{
      h3{ font-weight:normal; padding-left:34px; height:30px; line-height: 30px; font-size:12px; border-top:1px dotted #162433;}
    }

    .children{display:none; background:rgba(0,149,255,.1);
      .tree-node{
        h2{padding-left: 1em; font-size:13px;}
      }
    }
    .el-tree-node__expand-icon{ transition:all .2s;}
    &.active{height:auto;
      .children{ display:block;}
      &>h2>.el-tree-node__expand-icon{transform:rotate(90deg);}
    }
  }
</style>
