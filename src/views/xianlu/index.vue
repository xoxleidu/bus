<template>
  <div class="xianlu-body">
    <div class="XL-tree">
      <el-tree
        ref="leftTree"
        :data="stationList"
        :props="props"
        show-checkbox
        node-key="name"
        :render-content="renderContent"
        @check-change="handleCheckChange">
      </el-tree>
    </div>
    <div class="XL-group">
      <el-checkbox-button v-model="showAllLine" class="line-show-all">显示所有线路</el-checkbox-button>
      <el-checkbox-group v-model="lineGroupsChecked" class="line-group">
        <el-checkbox-button v-for="lineGroup,key in lineGroups" :label="key" :key="lineGroup.name">{{lineGroup.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="XL-resize" draggable="true"></div>
    <div class="XL-map">
      <div id="allmap" style="height:90%;"></div>
    </div>

  </div>
</template>
<script>
  import {getStreetPoints} from "@/API/"
  import { Loading } from 'element-ui';
  import $ from 'jQuery';
  export default {
    data() {
      return {
        showAllLine:false,
        lineGroupsTimer:0,
        lineGroups:{
          siheng:{
            name:"横线",
            line:[]
          },
          sizong:{
            name:"纵线",
            line:[]
          },
          yihuan:{
            name:"环线",
            line:[]
          },
          fushe:{
            name:"辐射线",
            line:[]
          },
          quyu:{
            name:"区域",
            line:[]
          }
        },
        lineGroupsChecked:[],
        stationList: [
          // {
          //   'name': '1路',
          //   children:[
          //     {
          //       name:"1路A线",
          //       played:false
          //     },
          //     {
          //       name:"1路B线",
          //       played:false
          //     }
          //   ]
          // },
          {
            'name': '1路',
            value: '1路A线',
            played:false
          },
          {
            'name': '2路',
            played:false
          },
          {
            'name': '3路',
            played:false
          },
          {
            'name': '4路',
            played:false
          },
          {
            'name': '6路',
            played:false
          },
          {
            'name': '7路',
            played:false
          },
          {
            'name': '8路',
            played:false
          },
          {
            'name': '9路',
            played:false
          },
          {
            'name': '10路',
            played:false
          },
          {
            'name': '11路',
            played:false
          },
          {
            'name': '12路',
            played:false
          },
          {
            'name': '13路',
            played:false
          },
          {
            'name': '14路',
            played:false
          },
          {
            'name': '15路',
            played:false
          },
          {
            'name': '16路',
            played:false
          },
          {
            'name': '17路',
            played:false
          },
          {
            'name': '18路',
            played:false
          },
          {
            'name': '19路',
            played:false
          },
          {
            'name': '20路',
            played:false
          },
          {
            'name': '21路',
            played:false
          },
          {
            'name': '22路',
            played:false
          },
          {
            'name': '23路',
            played:false
          },
          {
            'name': '24路',
            played:false
          },
          {
            'name': '25路',
            played:false
          },
          {
            'name': '26路',
            played:false
          },
          {
            'name': '27路',
            played:false
          },
          {
            'name': '28路',
            played:false
          },
          {
            'name': '29路',
            played:false
          },
          {
            'name': '30路',
            played:false
          },
          {
            'name': '31路',
            played:false
          },
          {
            'name': '32路',
            played:false
          },
          {
            'name': '33路',
            played:false
          },
          {
            'name': '34路',
            played:false
          },
          {
            'name': '35路',
            played:false
          },
          {
            'name': '36路',
            played:false
          }
        ],
        stationMakerList:[
          // {name:"廊坊站",referrer:1}  //引用数量，如果为0，删除
        ],
        props: {
          label: 'name',
          children: 'children'
        },
        map:{}
      }

    },
    watch:{
      showAllLine(){
        // var this.stationList.map()
        if(this.showAllLine){
          var loadingInstance = Loading.service({ fullscreen: true,text:"载入数据"});
          this.stationList.map(item=>{
            this.$refs.leftTree.setChecked(item,true,true);
          })
          setTimeout(()=>{
            loadingInstance.close();
          },8000)

        }else{
          this.stationList.map(item=>{
            this.$refs.leftTree.setChecked(item,false,true);
          })
        }

      },
      lineGroupsChecked(){
        for(var key in this.lineGroups){
          this.lineGroups[key].line.map(line=>{
            this.map.removeOverlay(line);
          })

        }
        this.lineGroupsChecked.map((key)=>{
          this.lineGroups[key].line.map(line=>{
            this.map.addOverlay(line);
            // var _path = $(line.V); //获取到当前svg中对应得path
          })
        });
        clearInterval(this.lineGroupsTimer);
        var opacity = 100;
        var step = 2;
        this.lineGroupsTimer = setInterval(()=>{
          if(opacity<=30){step = 2;}
          if(opacity>=100){step = -2;}
          opacity+=step;
          this.lineGroupsChecked.map((key)=>{
            this.lineGroups[key].line.map(line=>{
              line.setStrokeOpacity(opacity/100);
            })
          })

        },18);
      }
    },
    mounted() {

      $(".XL-resize").on("drag",function(e){
        if(e.pageX!=0&&e.pageX>200){
          $(".XL-map").css({left:e.pageX+10});
          $(this).css({left:e.pageX});
          $(".XL-tree").css({width:e.pageX})
        }
      })


      var that = this;
      window.mapInit= function(){
        // 百度地图API功能

        function _init(){

          that.map = new BMap.Map('allmap');
          that.map.setCurrentCity("廊坊市");
          that.map.centerAndZoom(new BMap.Point(116.726509,39.53446), 13);
          that.map.enableScrollWheelZoom(true);             // 开启滚轴缩放
          // var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例
          // that.map.addTileLayer(traffic);                    // 将图层添加到地图上

          ["永兴路","银河路","新华路","新开路","和平路"].map(name=>{
            var _arr =  getStreetPoints(name).points.map(item=>{
              return new BMap.Point(item.lng,item.lat);
            })
            var polyline = new BMap.Polyline(_arr, {strokeColor:"#0bb700", strokeWeight:7, strokeOpacity:1});   //纵线
            that.lineGroups.sizong.line.push(polyline)
          });

          ["光明道","金光道","爱民道","广阳道"].map(name=>{
            var _arr =  getStreetPoints(name).points.map(item=>{
              return new BMap.Point(item.lng,item.lat);
            })
            var polyline = new BMap.Polyline(_arr, {strokeColor:"#bc111d", strokeWeight:7, strokeOpacity:1});   //横线
            that.lineGroups.siheng.line.push(polyline)
          });

          ["环线"].map(name=>{
            var _arr =  getStreetPoints(name).points.map(item=>{
              return new BMap.Point(item.lng,item.lat);
            })
            var polyline = new BMap.Polyline(_arr, {strokeColor:"#1047a9", strokeWeight:7, strokeOpacity:1});   //环线
            that.lineGroups.yihuan.line.push(polyline)
          });

          ["左上辐射1","左上辐射2","左上辐射3","右上辐射1","右上辐射2","右上辐射3","右上辐射4","右上辐射5","右上辐射6","右上辐射7","右下辐射1","右下辐射2","右下辐射3","右下辐射4"].map(name=>{
            var _arr =  getStreetPoints(name).points.map(item=>{
              return new BMap.Point(item.lng,item.lat);
            })
            var polyline = new BMap.Polyline(_arr, {strokeColor:"#ff3c00", strokeWeight:7, strokeOpacity:1});   //辐射
            that.lineGroups.fushe.line.push(polyline)
          });

          ["区域左上","区域右上","区域左下","区域右下"].map(name=>{
            var _arr =  getStreetPoints(name).points.map(item=>{
              return new BMap.Point(item.lng,item.lat);
            })
            var Polygon = new BMap.Polygon(_arr, {strokeColor:"#10786f",fillColor:"#0ab0a2", strokeWeight:3, strokeOpacity:1});   //区域
            that.lineGroups.quyu.line.push(Polygon)
            Polygon.addEventListener('click',getAttr)
            function getAttr(){
              // var p = marker.getPosition();       //获取marker的位置
              // alert("marker的位置是" + p.lng + "," + p.lat);
              //alert(1111)
            }
          });




        }
        if(window.BMapLib&&BMapLib.LuShu){
          _init();
        }else{
          $.getScript("static/LuShu.js",_init)
        }
      }

      if(!window.BMap){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=GQwMBW7GulaMd4k3nHoL5M7xZNqF8Y3B&callback=mapInit";
        document.body.appendChild(script);
      }else{
        mapInit();
      }


    },
    methods: {

      playBus(node,data){ //播放/暂停 线路
        var that = this;
        if(!data.lushu){
          that.createBusLine(data,true).then((lushu)=>{
            that.$refs.leftTree.setChecked(data,true);
            lushu.beginLushu.start({loop:true});
            lushu.endLushu.start({loop:true});
            that.$set(data,"played",true);
            data.lushuMaker = lushu.beginLushu._marker;
            data.lushu = lushu;
          })
        }else{
          if(data.played == true){
            data.lushu.beginLushu.pause();
            data.lushu.endLushu.pause();
            that.$set(data,"played",false);
          }else{
            data.lushu.beginLushu.start({loop:true});
            data.lushu.endLushu.start({loop:true});
            that.$set(data,"played",true);
          }
        }
      },
      stopBus(node,data){ //停止线路
        if(data.lushu){
          this.$set(data,"played",false);
          data.lushu.beginLushu.stop();
          data.lushu.endLushu.stop();
        }
      },
      handleCheckChange(data, checked, indeterminate) { //树形菜单改变状态
        if(!data.children){
          if(checked){
            this.createBusLine(data);
          }else{
            this.removeBusLine(data);
          }
        }
      },
      createBusLine(station,isCreateLuShu){        //创建线路

        var that = this;
        return new Promise(function(resolve,reject){
          var busLineSearch  = new BMap.BusLineSearch("廊坊市",{
            onGetBusLineComplete:function(busItem){
              if(!station.xianluLine){
                that.createXianlu(busItem,station);//创建线路｛线、点｝
              }
              if(!station.lushuMaker&&isCreateLuShu){
                that.createLushu(busItem,station,resolve);//创建路书
              }
            },
            onGetBusListComplete:function(busList){
              var busItem = busList.getBusListItem(0);
              busLineSearch.getBusLine(busItem);
            }
          });
          busLineSearch.getBusList(station.value||station.name);
        });
      },
      removeBusLine(station){        //删除线路
        var map = this.map;
        if(station.xianluLine){
          map.removeOverlay(station.xianluLine);
        }
        if(station.lushu){
          station.lushu.beginLushu.stop();
          try{station.lushu.beginLushu.hideInfoWindow()}catch(e){}
          station.lushu.endLushu.stop();
          try{station.lushu.endLushu.hideInfoWindow()}catch(e){}
          station.played = false;
          map.removeOverlay(station.lushu.beginLushu._marker);
          map.removeOverlay(station.lushu.endLushu._marker);
        }
        station.xianluMarker.map((item)=>{
          map.removeOverlay(item);
          this.checkStationMakerList(item.stationName,false)
        });
        delete station.lushu
        delete station.lushuMaker
        delete station.xianluMarker
        delete station.xianluLine
      },
      createXianlu(busItem,station){        //创建线路｛线、点｝
        var map = this.map;
        var arrPois = busItem.getPath();
        station.xianluMarker = [];
        // var color = '#'+Math.floor(Math.random()*0xFF9999).toString(16);
        var color =  "rgb(25,131,211)";

        //创建点（marker）
        for(var i = 0,len=busItem.getNumBusStations();i<len;i++){

          var _busStation = busItem.getBusStation(i);
          var _lng = _busStation.position.lng;
          var _lat = _busStation.position.lat;
          var point = new BMap.Point(_lng,_lat);
          var icon;
          if(!this.checkStationMakerList(busItem.getBusStation(i).name,true,busItem.name)){
            icon = new BMap.Icon("./static/point.svg",new BMap.Size(0,0));
          }else{
            icon = new BMap.Icon("./static/point.svg",new BMap.Size(14,14));
            window.xx = window.xx || 0;
            window.xx+=1;
          }
          var marker = new BMap.Marker(point,{icon:icon});        // 创建标注
          marker.stationName = _busStation.name;
          map.addOverlay(marker);
          $(marker.Yc).html('\
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"  >\
              <g>\
                <ellipse ry="5" rx="5" cx="7" cy="7" stroke-opacity="0.8" stroke-width="3" stroke="'+color+'" fill="#FFFFFF" />\
              </g>\
            </svg>');



          marker.addEventListener("click", (function(point,_busStation){
            var title = _busStation.name;
            var content = "";


            return function (){
              var opts = {
                width : 150,     // 信息窗口宽度
                //height: 50,     // 信息窗口高度
                title : title, // 信息窗口标题
                enableMessage:true,//设置允许信息窗发送短息
              }
              var infoWindow = new BMap.InfoWindow("", opts);  // 创建信息窗口对象
              alert(_busStation.name)
              switch(_busStation.name){
                case "明珠大厦":
                  infoWindow.setHeight = "200";
                  infoWindow.setContent("10路 11路 13路B线 14路 15路B线 1路A线 2路 32路 33路 37路 3路 5路 6路 7路 8路/8路A线");
                  break;
                case "万达广场" :
                  infoWindow.setHeight = "300";
                  infoWindow.setContent("13路A线 13路B线 14路 15路A线 15路B线 18路 1路A线 1路B线 23路 29路 30路A线 30路B线 33路 37路 38路A线内环 38路B线外环 3路 5路 6路 7路 8路/8路A线");
                  break;
                case "廊坊北站东广场" :
                  infoWindow.setHeight = "200";
                  infoWindow.setContent("12路 21路 2路 37路 3路 4路 4路空港专线 5路 8路/8路A线 9路");
                  break;
                case "廊坊北站" :
                  infoWindow.setHeight = "200";
                  infoWindow.setContent("11路 14路 15路A线 15路B线 16路 1路A线 1路B线 28路 32路 4路 4路空港专线 9路");
                  break;
                case "廊坊站" :
                  infoWindow.setHeight = "200";
                  infoWindow.setContent("14路 19路 24路 26路A线 26路B线 28路 35路");
                  break;
                case "人民公园" :
                  infoWindow.setHeight = "200";
                  infoWindow.setContent("13路A线 13路B线 14路 15路A线 15路B线 1路A线 1路B线 31路 7路 8路/8路A线");
                  break;


              }

              map.openInfoWindow(infoWindow,point);

            }//开启信息窗口
          }(point,_busStation)));

          station.xianluMarker.push(marker)
        }

        //创建线
        var line = new BMap.Polyline(arrPois, {strokeColor: '#0d8377',strokeWeight:7,strokeOpacity:0.6});

        //输出 点、线
        map.addOverlay(line);
        // map.setViewport(arrPois);
        station.xianluLine = line;
      },
      checkStationMakerList(stationName,status,busItemName){
        //接收一个站点名称，检测如果没有重复就加入到 stationMakerList,并返回true， 如果重复返回false,并且referrer引用+1， 直到引用为0时 删除该对象
        // status  true添加   false删除
        var _result = true;
        var val = status?1:-1;
        this.stationMakerList.map((item)=>{
          if(stationName == item.stationName){
            item.referrer +=  val;
            if(val&&item.stationName=="明珠大厦"){
              // item.rotateList.push(busItemName)
              window.xxx = window.xxx||[];
              window.xxx.push(busItemName)
              console.log(window.xxx)
            }
            if(item.referrer<=0){
              var _index = this.stationMakerList.indexOf(item);
              this.stationMakerList.splice(_index,1);
            }
            _result = false;
          }
        })
        if(_result === true){
          this.stationMakerList.push({stationName:stationName,referrer:1,rotateList:[]})
        }
        return _result;

      },
      createLushu(busItem,station,resolve){        //创建路书
        var map = this.map;
        var icon =  new BMap.Icon('http://api.map.baidu.com/library/LuShu/1.2/examples/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)});
        var arrPois = busItem.getPath();
        //创建停留站
        var landmarkPois = [];
        for(var i = 0,len=busItem.getNumBusStations();i<len;i++){
          var _busStation = busItem.getBusStation(i);
          var _lng = _busStation.position.lng;
          var _lat = _busStation.position.lat;
          landmarkPois.push({
            lng:_lng,
            lat:_lat,
            html:_busStation.name,
            pauseTime:0
          })
        }
        var beginLushu = new BMapLib.LuShu(map,arrPois,{
          defaultContent:busItem.name,
          speed:1000,
          icon:icon,
          enableRotation:true,
          landmarkPois: landmarkPois
        });
        var endLushu = new BMapLib.LuShu(map,$.extend(true,[],arrPois).reverse(),{
          defaultContent:busItem.name,
          speed:1000,
          icon:icon,
          enableRotation:true,
          landmarkPois: $.extend(true,[],landmarkPois).reverse()
        });
        station.lushu = {
          beginLushu:beginLushu,
          endLushu:endLushu
        };
        resolve(station.lushu);
      },
      renderContent(h, { node, data, store }){ //自定义渲染tree
        return (
          <span>
            <span class="name">{node.label}</span>
            <div class="controller">
              <el-button-group>
                <el-button class={data.children?'hide':'psbusbutton'} on-click={()=>{this.playBus(node,data)}} type="success" icon={!data.played?"fa fa-play-circle":"fa fa-pause-circle"} size="mini"></el-button>
                <el-button class={data.children?'hide':'psbusbutton'} on-click={()=>{this.stopBus(node,data)}} type="success" icon="fa fa-stop-circle" size="mini"></el-button>
              </el-button-group>
            </div>
          </span>
      );
      }



    }
  }

</script>

<style lang="less">
  @import url("../../../static/font-awesome-4.7.0/less/font-awesome");
  /*.xianlu-body{*/
    /*height: 50%;*/
  /*}*/
  .el-tree-node{ position:relative;background: #efefef;
    .el-tree-node__content{ height:32px; line-height: 32px; font-size:14px; border-bottom:1px dotted #e8e8e8; color:#324157;}
    .el-checkbox__input{ line-height: 32px;}
    .el-checkbox__inner{ width: 16px; height:16px; border:1px solid #888;}
  }
  .hide{ display: none;}
  .XL-tree{position:absolute;left:0;top:0;bottom:0;width:200px; overflow-y:auto;  z-index: 3;
    .controller{position:absolute; right:10px; top:-2px;
      .el-button-group{}
    }
  }
  .admin-header{box-sizing: border-box; position: relative; z-index: 99;}
  .XL-resize{position:absolute; top:-1px;bottom:-1px;left:200px; width:10px; cursor: w-resize; z-index: 4; box-sizing: border-box; background: #f0f0f0;   border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0; border-left:1px solid #828790; border-right:1px solid #828790;}
  .XL-map{position:absolute;right:0;left:210px;top:0;bottom:0;}

  .XL-group{position:absolute; right:0; top:60px; z-index: 22; background:rgba(0,0,0,0.5); color: #FFF;}

  .line-show-all{ display: block;
    span{ display: block;border: none;border-radius: 0 !important;background:rgba(0,0,0,0.5);color: #FFF;}
  }
  .line-group{
    .el-checkbox-button__inner{border-radius: 0 !important;background:rgba(0,0,0,0.5);color: #FFF;}
  }
  .psbusbutton{
    background-color: #2d3a4b;
    border: none;
  }

</style>
