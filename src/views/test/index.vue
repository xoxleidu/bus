<template>
<el-container>
  <el-header>
    <el-row>
      <el-col :span="4">按
        <el-radio-group v-model="busSearchName">
          <el-radio-button label="0">线路</el-radio-button>
          <el-radio-button label="1">站点</el-radio-button>
        </el-radio-group>查询
      </el-col>
      <el-col :span="2">
        <el-input v-model="busSearchVal" placeholder="请输入内容" @keyup.enter.native="busLineSearch"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="busLineSearch">搜索</el-button>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside width="200px" style="background-color:#1f2d3d;">
      <el-tree
        :props="treebus"
        lazy
        show-checkbox
        @check-change="handleCheckChange"
        style="background-color: #f2f6fc ">
      </el-tree>
    </el-aside>
    <el-main>
      <div id="container" class="mymap"></div>
    </el-main>
  </el-container>
  <el-footer>Footer</el-footer>
</el-container>

</template>
<script>

  import AMap from 'AMap';   //在页面中引入高德地图

  export default {
    data () {
      return {
        AMapUI: null,
        AMap: null,
        MapKey: '',
        MapCityName: '',
        busSearchVal: null,
        busSearchName: 0,

        AmapLinesearch: null,

        treebus: {
          label: 'name',
          children: 'zones'
        },
        treeCount: 1
      }
    },
    mounted(){
      this.loadmap();     //加载地图和相关组件
    },
    methods: {

      //tree
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      treebusNode1(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.treeCount++
            }, {
              name: 'zone' + this.treeCount++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      },

      // 搜索
      busLineSearch: function (event) {
        this.loadmap()
      },

      //地图
      loadmap(){
        const map = new AMap.Map('container', {
          resizeEnable: true,
          //center: [centerl,centerr],
          center: [116.706887,39.522123],
          zoom: 12,
          cityName: '廊坊',
        });

        if(!this.busSearchVal) { return false }

        //let linesearch;

        AMap.plugin(["AMap.LineSearch"], function() {
          //alert('路'+data)
          let busLineName = this.busSearchVal
          //let busLineName = '17';
          if(!busLineName) return;
          //实例化公交线路查询类，只取回一条路线
          if(!this.AmapLinesearch){
            this.AmapLinesearch = new AMap.LineSearch({
              pageIndex: 1,
              city: '廊坊',
              pageSize: 1,
              extensions: 'all'
            });
          }
          //搜索相关公交线路
          this.AmapLinesearch.search(busLineName, function(status, result) {
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
    }
  }
</script>
<style scoped>
  .mymap{
    width: 100%;
    height: 600px;
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
