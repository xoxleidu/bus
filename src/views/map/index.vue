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
            <input type="checkbox" @click.stop="" @change="(e)=>{treeLineCheck(e,line)}">
            {{line.lineName}}

            <!--<i class="el-icon-fa-level-down"></i> {{line.children.filter((car)=>{return car.UpDown==1}).length}}-->
            <!--/-->
            <!--<i class="el-icon-fa-level-up"></i> {{line.children.filter((car)=>{return car.UpDown!=1}).length}}-->
            <!--<span class="badge"></span>-->
          </h2>
          <div class="children" v-if="line.id">
            <div class="tree-node" v-for="car,index in line.busList"   :id="'id'+car.lineId" :key="index">
              <h2 @dblclick="(e)=>{positionCar(e,car)}">
                <span @click="(e)=> {treeToggle(e)}"  class="el-tree-node__expand-icon"></span>
                <input type="checkbox" @change="(e)=>{treeCheck(e,car)}" @click.stop="" />
                <i :class="(car.upDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ') + 'updown'"></i>
                <i class="el-icon-fa-bus"></i>
                冀R{{car.vehicleNumber}}  {{car.speed}}km/h
              </h2>
              <div class="children video-list">
                <!--<h3 v-for="i in 8"><input type="checkbox" @change.navtive="(e)=>{viedeoCheck(e,car,i)}" />-->
                  <!--<i class="el-icon-fa-video-camera"></i> 摄像头{{i}}-->
                <!--</h3>-->
              </div>
            </div>
          </div>
        </div>

      </el-row>

      <!--<el-tree-->
        <!--:data="treelist"-->
        <!--:props="treebus"-->
        <!--:load="loadNode"-->
        <!--lazy-->
        <!--show-checkbox-->
        <!--@check-change="handleCheckChange"-->
        <!--style="background-color: #f2f6fc ">-->
      <!--</el-tree>-->
    </el-aside>
    <el-main style="padding-left: 200px">
      <div id="JK-map" class="mymap"></div>
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
      //his.loadmap();     //加载地图和相关组件

      var that = this;
      window.mapInit= function(){
        var map = that.map = new BMap.Map('JK-map');
        map.setCurrentCity("廊坊市");
        map.centerAndZoom(new BMap.Point(116.726509,39.53446), 13);
        that.map.enableScrollWheelZoom(true);
        var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例
        map.addTileLayer(traffic);                    // 将图层添加到地图上


        // var myP1 = new BMap.Point(116.380967,39.913285);    //起点
        // var myP2 = new BMap.Point(116.424374,39.914668);    //终点
        // var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
        //   //offset: new BMap.Size(0, -5),    //相当于CSS精灵
        //   imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
        // });
        // var driving2 = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});    //驾车实例
        // driving2.search(myP1, myP2);    //显示一条公交线路
        //
        // window.run = function (){
        //   var driving = new BMap.DrivingRoute(map);    //驾车实例
        //   driving.search(myP1, myP2);
        //   driving.setSearchCompleteCallback(function(){
        //     var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
        //     console.log('ptspts')
        //     console.log(pts)
        //     var paths = pts.length;    //获得有几个点
        //
        //     var carMk = new BMap.Marker(pts[0],{icon:myIcon});
        //     map.addOverlay(carMk);
        //     i=0;
        //     function resetMkPoint(i){
        //       carMk.setPosition(pts[i]);
        //       if(i < paths){
        //         setTimeout(function(){
        //           i++;
        //           resetMkPoint(i);
        //         },100);
        //       }
        //     }
        //     setTimeout(function(){
        //       resetMkPoint(5);
        //     },100)
        //
        //   });
        // }
        //
        // setTimeout(function(){
        //   run();
        // },1500);



      }
      if(!window.BMap){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=GQwMBW7GulaMd4k3nHoL5M7xZNqF8Y3B&callback=mapInit";
        document.body.appendChild(script);
      }else{
        mapInit()
      }


      getBusLineList().then(response => {
        if(response.code === '000') {
          //返回线路赋值
          this.treelist = response.result
        }

      })




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


      //点击车辆多选框
      treeCheck(e,data){
        if($(e.target).prop("checked")){
          this.createCar(data);
        }else{
          this.removeCar(data);
        }

      },
      //点击线路多选框
      treeLineCheck(e,data){
        var that = this;
        var isChecked = $(e.target).prop("checked");

        if(isChecked){
          that.$set(data,"show",$(e.target).prop("checked"));
        }

        that.$nextTick(function () {
          var $checkboxs = $(e.target).closest(".tree-node").children(".children").find("h2 input[type=checkbox]");
          if(isChecked){
            $checkboxs.each(function(index,el){
              if(!$(el).prop("checked")){
                $(el).trigger("click");
              }
            });

            that.createBusLine(data);
          }else{
            $checkboxs.each(function(index,el){
              if($(el).prop("checked")){
                $(el).trigger("click");
              }
            });
            that.removeBusLine(data);
          }
        })
      },


      //点击线路-加载线路下的车辆信息
      treeToggle(e,line){
        // console.log(line.runMethod)
        getBusList(line.runMethod).then(response => {
          if (response.code === '000') {
            //返回车辆信息赋值
            this.$set(line,"busList",response.result);
            // this.treebuslist=response.result;
          }
        })

        $(e.target).closest(".tree-node").toggleClass("active");
        var reslult = $(e.target).closest(".tree-node").hasClass("active");
        if(data){
          this.$set(data,"show",true);
        }
        return reslult;
      },

      //点击车辆定位
      positionCar(e,car){
        var that = this;

        var convertor = new BMap.Convertor();
        var pt = new BMap.Point(car.longitude,car.latitude);
        convertor.translate([pt], 1, 5, function(item){//转换坐标后定位
          pt = item.points[0];
          //定位
          that.map.centerAndZoom(pt, 16);
          //创建Car
          $(e.target).children("input[type=checkbox]").prop("checked","checked");
          that.createCar(car);
        });

      },



      handleCarChange(h,{node,data,store},isChecked){//车辆勾选事件
        var that = this;
        that.$set(data,"show",isChecked)
        if(isChecked){
          this.createCar(data)
        }else{
          this.removeCar(data)
        }
      },
      //移除车辆
      removeCar(data){
        this.map.removeOverlay(data.marker);
        delete data.marker
      },
      //创建车辆
      createCar(data){
        if(!data||data.show){  return false;}
        var that = this;
        var convertor = new BMap.Convertor();
        var pt = new BMap.Point(data.longitude,data.latitude);
        convertor.translate([pt], 1, 5, function(item){
          pt = item.points[0];
          if(data.marker){
            data.marker.setRotation(data.direction)
            data.marker.setPosition(pt)
          }else{
            var myIcon = new BMap.Icon("/static/point.svg", new BMap.Size(14,14));
            var label = new BMap.Label(data.vehicleNumber,{position:pt,offset:new BMap.Size(50,-1)});
            label.setZIndex(1);
            label.setStyle({border:"none",background:"none"});
            label.setContent('\
          <div style="background:#FFF;border-radius:5px; fot-size:15px;padding:2px 5px; border:1px solid #007ed2; color:#007ed2;">\
            <div style="position:absolute;left:-38px;top:10px; width:39px; border-bottom:1px solid #007ed2;"></div><i class="'+(data.upDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ')+' updown"></i>冀R\
          '+ data.vehicleNumber+'\
          </div>');
          //   label.setContent('\
          // <div style="background:#FFF;border-radius:5px; fot-size:15px;padding:2px 5px; border:1px solid #007ed2; color:#007ed2;">\
          //   <div style="position:absolute;left:-38px;top:10px; width:39px; border-bottom:1px solid #007ed2;"></div><i class="'+(data.upDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ')+' updown"></i>\
          // '+that.lines[that.lines.dict[data.runMethod]].lineName+'\
          // </div>');
            var marker = new BMap.Marker(pt,{title:data.vehicleNumber,icon:myIcon,rotation:data.direction});  // 创建标注
            marker.parentData = data;
            marker.setLabel(label);
            marker.addEventListener("click", function(){
              that.$set(that,"carMarkerWindow",this.parentData)
              setTimeout(()=>{
                var infoWindow = new BMap.InfoWindow(that.$refs.carMarkerWindow,{width:350});
                this.openInfoWindow(infoWindow); //开启信息窗口
              })
            });
            that.$set(data,"marker",marker);
            that.map.addOverlay(marker);              // 将标注添加到地图中
          }
        })

      },


      createBusLine(line){        //创建线路

        var that = this;
        return new Promise(function(resolve,reject){
          var busLineSearch  = new BMap.BusLineSearch("廊坊市",{
            onGetBusLineComplete:function(busItem){
              if(!line.xianluLine){
                that.createXianlu(busItem,line);//创建线路｛线、点｝
              }
            },
            onGetBusListComplete:function(busList){
              //console.log(busList)
              var busItem = busList.getBusListItem(0);
              busLineSearch.getBusLine(busItem);
            }
          });
          var searchName = line.lineName;
          if(searchName == "1路"){
            searchName = "1路a线";
          }
          busLineSearch.getBusList(searchName);
        });
      },
      removeBusLine(line){        //删除线路
        var map = this.map;
        if(line.xianluLine){
          map.removeOverlay(line.xianluLine);
        }
        delete line.xianluLine
      },
      createXianlu(busItem,line){        //创建线路｛线｝
        var map = this.map;
        var arrPois = busItem.getPath();
        //alert('checked4')
        //console.log('createXianlu')
        //console.log(arrPois)
        var color =  "rgb(25,131,211)";
        //创建线
        var mapLine = new BMap.Polyline(arrPois, {strokeColor: color,strokeWeight:7,strokeOpacity:0.6});

        //输出 点、线
        map.addOverlay(mapLine);
        line.xianluLine = mapLine;
      },




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
