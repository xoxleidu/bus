<template>
  <el-container>
    <el-header>
          <el-row>
            <el-col :span="2" class="line">按路线查询公交</el-col>
            <el-col :span="2">
              <el-input v-model="busLineName" placeholder="请输入内容" @keyup.enter.native="busLineSearch"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="busLineSearch">主要按钮</el-button>
            </el-col>
          </el-row>
    </el-header>
    <el-main>
      <div id="js-container" class="map">正在加载数据 ...</div>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'



  export default {
    data () {
      return {
        AMapUI: null,
        AMap: null,
        MapKey: '',
        MapCityName: '',
      }
    },
    async created () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      if (window.AMap && window.AMapUI) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.4.10&key=${MapKey}`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    },
    methods: {
      // 搜索
      busLineSearch: function (event) {
        this.initMap(this.busLineName)
      },
      // 实例化地图
      initMap (data) {
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap

        let map = new AMap.Map('js-container', {
          resizeEnable: true,
          //center: [centerl,centerr],
          center: [116.706887,39.522123],
          zoom: 12,
          cityName: '廊坊',
        });

        if(!data) { return false }

        let linesearch;

        AMap.plugin(["AMap.LineSearch"], function() {
          //alert('路'+data)
          let busLineName = data.toString();
          //let busLineName = '17';
          if(!busLineName) return;
          //实例化公交线路查询类，只取回一条路线
          if(!linesearch){
            linesearch = new AMap.LineSearch({
              pageIndex: 1,
              city: '廊坊',
              pageSize: 1,
              extensions: 'all'
            });
          }
          //搜索相关公交线路
          linesearch.search(busLineName, function(status, result) {
            map.clearMap()
            if (status === 'complete' && result.info === 'OK') {
              lineSearch_Callback(result);
            } else {
              alert(JSON.stringify(result));
            }
          });

        })

        /*公交路线查询服务返回数据解析概况*/
        function lineSearch_Callback(data) {
          let lineArr = data.lineInfo;
          let lineNum = data.lineInfo.length;
          if (lineNum == 0) {
          } else {
            for (var i = 0; i < lineNum; i++) {
              let pathArr = lineArr[i].path;
              let stops = lineArr[i].via_stops;
              let startPot = stops[0].location;
              let endPot = stops[stops.length - 1].location;
              if (i == 0) //作为示例，只绘制一条线路
                drawbusLine(startPot, endPot, pathArr);
            }
          }
        }
        /*绘制路线*/
        function drawbusLine(startPot, endPot, BusArr) {
          //绘制起点，终点
          new AMap.Marker({
            map: map,
            position: startPot, //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10
          });
          new AMap.Marker({
            map: map,
            position: endPot, //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10
          });
          //绘制乘车的路线
          busPolyline = new AMap.Polyline({
            map: map,
            path: BusArr,

            strokeColor: "#09f",//线颜色
            strokeOpacity: 0.8,//线透明度
            isOutline:true,
            outlineColor:'white',
            strokeWeight: 6//线宽
          });
          map.setFitView();
        }
      }
    },
    /*async created () {
      // 已载入高德地图API，则直接初始化地图
      if (window.AMap && window.AMapUI) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.4.10&key=${MapKey}`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    }*/
  }
</script>

<style lang="css">
  #js-container {
    height: 100%;
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
    height: 600px;
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


</style>
