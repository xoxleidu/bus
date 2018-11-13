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
    <div class="XL-resize" draggable="true"></div>
    <div class="XL-map">
      <div id="allmap" style="height:100%;"></div>
    </div>

  </div>
</template>
<script>
import {getStreetPoints} from "@/API/"
import $ from 'jQuery';
export default {
  data() {
    return {
       stationList: [
          {
            'name': '1路',
            children:[
              {
                name:"1路A线",
                played:false
              },
              {
                name:"1路B线",
                played:false
              }
            ]
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



        var _arrEdit = [];
        var options = {
            size: BMAP_POINT_SIZE_NORMAL,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#d340c3'
        }

          var removeMarker = function(e,ee,marker){
            _arrEdit = _arrEdit.filter(item=>{
                if(item.lat == marker.IA.lat && item.lng == marker.IA.lng){
                    return false
                }
                return true;
            })
            that.map.removeOverlay(marker);
            console.log(_arrEdit)
            renderMap();
          }
          var dragIndex = null;
          var markerDragstart = function(e,ee,marker){
            _arrEdit.filter((item,index)=>{
                if(item.lat == this.IA.lat && item.lng == this.IA.lng){
                    dragIndex = index;
                }
            })

          }

          var markerDragend = function(obj){
            _arrEdit[dragIndex] = obj.point;
            renderMap();
          }

          that.map.addEventListener("click",function(e){
            var point = new BMap.Point(e.point.lng,e.point.lat);
            _arrEdit.push(point);
            renderMap();
          });

        function renderMap(){
          that.map.clearOverlays();
          _arrEdit.map(item=>{
          //创建右键菜单
          var markerMenu=new BMap.ContextMenu();
          markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
          var marker = new BMap.Marker(item);
          that.map.addOverlay(marker);
          marker.addContextMenu(markerMenu);
          marker.enableDragging();
          marker.addEventListener("dragstart",markerDragstart.bind(marker))
          marker.addEventListener("dragend",markerDragend.bind(marker))

        })

        var polyline = new BMap.Polyline(_arrEdit, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});   //创建折线
          that.map.addOverlay(polyline);
        }





            // ["西昌路","永兴路","银河路","新华路","新开路","和平路","东安路"].map(name=>{

            //     var _arr =  getStreetPoints(name).points.map(item=>{
            //   return new BMap.Point(item.lng,item.lat);
            // })

            // var polyline = new BMap.Polyline(_arr, {strokeColor:"blue", strokeWeight:10, strokeOpacity:0.5});   //创建折线
            // that.map.addOverlay(polyline);

            // })



        // var local = new BMap.LocalSearch("廊坊市", {
        //   renderOptions:{map: that.map},
        //   onSearchComplete:function(){
        //     var _arr = [local.getResults().vr[0].point,local.getResults().vr[0].point,local.getResults().vr[0].point];
        //     window.polyline = new BMap.Polyline(_arr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
        //     polyline.enableEditing();
        //     that.map.addOverlay(polyline);
        //   }
        // });
        // local.search("东安路",{
        //   forceLocal:true//限制当前城市
        // })



      }
      if(window.BMapLib&&BMapLib.LuShu){
        _init();
      }else{
        $.getScript("/static/LuShu.js",_init)
      }
    }

    if(!window.BMap){
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://api.map.baidu.com/api?v=2.0&ak=eYf9sA6yVTFHlh9ytU4a0EYY&callback=mapInit";
      document.body.appendChild(script);
    }else{
      mapInit();
    }


  },
  methods: {
      playBus(node,data){ //播放/暂停 线路
        var that = this;
        if(!data.lushu){
            that.createBusLine(data).then((lushu)=>{
              that.$refs.leftTree.setChecked(data,true);
              lushu.beginLushu.start({loop:true});
              lushu.endLushu.start({loop:true});
              that.$set(data,"played",true);
              data.lushuMaker = lushu.beginLushu._marker;
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
      createBusLine(station){        //创建线路

        var that = this;
        return new Promise(function(resolve,reject){
          var busLineSearch  = new BMap.BusLineSearch("廊坊市",{
            onGetBusLineComplete:function(busItem){
              if(!station.xianluLine){
                that.createXianlu(busItem,station);//创建线路｛线、点｝
              }
              if(!station.lushuMaker){
                that.createLushu(busItem,station,resolve);//创建路书
              }
            },
            onGetBusListComplete:function(busList){
              var busItem = busList.getBusListItem(0);
              busLineSearch.getBusLine(busItem);
            }
          });
          busLineSearch.getBusList(station.name);
        });
      },
      removeBusLine(station){        //删除线路
        var map = this.map;
         map.removeOverlay(station.xianluLine);
         if(station.lushuMaker){
           map.removeOverlay(station.lushuMaker);
           station.lushu.beginLushu.stop();
           station.lushu.beginLushu.hideInfoWindow();
           station.lushu.endLushu.stop();
           station.lushu.endLushu.hideInfoWindow();
         }
         station.xianluMarker.map((item)=>{
           map.removeOverlay(item);
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
          if(!this.checkStationMakerList(busItem.getBusStation(i).name)){
            continue;
          }
          var _busStation = busItem.getBusStation(i);
          var _lng = _busStation.position.lng;
          var _lat = _busStation.position.lat;
          var point = new BMap.Point(_lng,_lat);
          var icon = new BMap.Icon("./static/point.svg",new BMap.Size(14,14));
          var marker = new BMap.Marker(point,{icon:icon});        // 创建标注

          map.addOverlay(marker);
          $(marker.Yc).html('\
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"  >\
              <g>\
                <ellipse ry="5" rx="5" cx="7" cy="7" stroke-opacity="0.8" stroke-width="3" stroke="'+color+'" fill="#FFFFFF" />\
              </g>\
            </svg>');



          marker.addEventListener("click", (function(point,_busStation){
           return function (){
              var opts = {
              width : 150,     // 信息窗口宽度
              height: 50,     // 信息窗口高度
              title : _busStation.name, // 信息窗口标题
              enableMessage:true,//设置允许信息窗发送短息
            }
            var infoWindow = new BMap.InfoWindow("", opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point);

            }//开启信息窗口
          }(point,_busStation)));

          station.xianluMarker.push(marker)
        }

        //创建线
        var line = new BMap.Polyline(arrPois, {strokeColor: color,strokeWeight:7,strokeOpacity:0.6});

        //输出 点、线
         map.addOverlay(line);
         map.setViewport(arrPois);
         station.xianluLine = line;
      },
      checkStationMakerList(stationName){
        //接收一个站点名称，检测如果没有重复就加入到 stationMakerList,并返回true， 如果重复返回false
        var _result = true;
        this.stationMakerList.map(function(item){
          if(stationName == item.stationName){
            item.referrer +=  1;
            _result = false;
          }
        })
        if(_result === true){
          this.stationMakerList.push({stationName:stationName,referrer:1})
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
        debugger;
        return (
          <span>
            <span class="name">{node.label}</span>

            <div class="controller">

            <el-button-group>
              <el-button class={data.children?'hide':''} on-click={()=>{this.playBus(node,data)}} type="primary" icon={!data.played?"fa-play-circle":"fa-pause-circle"} size="mini"></el-button>
              <el-button class={data.children?'hide':''} on-click={()=>{this.stopBus(node,data)}} type="primary" icon="fa-stop-circle" size="mini"></el-button>
              </el-button-group>
            </div>
          </span>
        );
      }



  }
}

</script>

<style lang="less">
  .hide{ display: none;}
  .XL-tree{position:absolute;left:0;top:0;bottom:0;width:200px; background: #FFF;overflow-y:auto;  z-index: 3;
    .controller{position:absolute; right:10px; top:-2px;
      // .el-button-group{transform:scale(.8,.8);
      //   // i{transform:scale(.8,.8);}
      // }
    }
  }
  .admin-header{box-sizing: border-box; position: relative; z-index: 99;}
  .XL-resize{position:absolute; top:-1px;bottom:-1px;left:200px; width:10px; cursor: w-resize; z-index: 4; box-sizing: border-box; background: #f0f0f0;   border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0; border-left:1px solid #828790; border-right:1px solid #828790;}
  .XL-map{position:absolute;right:0;left:210px;top:0;bottom:0;}

</style>
