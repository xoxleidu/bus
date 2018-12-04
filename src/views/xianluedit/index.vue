<template>



  <div class="GJ-body">
    <el-row class="GJ-search">
      <!--<div class="infowindow-list" ref="carMarkerWindow" v-if="carMarkerWindow.GPSLng">-->
        <!--<div class="item">-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<strong>线路:</strong>{{lines[lines.dict[carMarkerWindow.RouteId]].LineName}}-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<strong>车牌号:</strong>{{carMarkerWindow.CarCard}}-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<strong>GPS 速度:</strong>{{carMarkerWindow.GPSSpeed}}km/h-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<strong>站点:</strong>-->
          <!--{{getStation(carMarkerWindow)}}-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<strong>下一站:</strong>{{getNextStation(carMarkerWindow)}}-->
        <!--</div>-->
        <!--<div class="item" v-if="carMarkerWindow.GPSTime">-->
          <!--<strong>日期时间:</strong>-->
          <!--{{carMarkerWindow.GPSTime.substring(0,4)}}年{{carMarkerWindow.GPSTime.substring(4,6)}}月{{carMarkerWindow.GPSTime.substring(6,8)}}日{{carMarkerWindow.GPSTime.substring(8,10)}}点{{carMarkerWindow.GPSTime.substring(10,12)}}分{{carMarkerWindow.GPSTime.substring(12,14)}}秒-->
        <!--</div>-->
      <!--</div>-->





      <el-form :inline="true" :model="formInline" >

        <el-form-item>
          <el-date-picker size="small" v-model="formInline.Date" placeholder="开始日期" style="width:135px;"></el-date-picker>
          <!--<el-time-picker size="small" v-model="formInline.StartTime" placeholder="开始时间" style="width:135px;">  </el-time-picker>-->
          <!--到-->
          <!--<el-time-picker size="small" v-model="formInline.EndTime" placeholder="结束时间" style="width:135px;">  </el-time-picker>-->

        </el-form-item>
        <el-form-item>
          <el-select v-model="treelist.lineName" placeholder="请选择线路" @change="searchBusHandler">
            <el-option
              v-for="item in treelist"
              :key="item.runMethod"
              :label="item.lineName"
              :value="item.runMethod">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isTreebuslist">
          <el-select id="selectLine" v-model="treebuslist.vehicleNumber" placeholder="请选择线路" @change="searchHandler">
            <el-option
              v-for="item in treebuslist"
              :key="item.vehicleNumber"
              :label="item.vehicleNumber"
              :value="item.vehicleNumber">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isTreebuslistButton">
          <el-button class="updataLineButton"  size="medium" type="danger" @click="searchHandlerUpdate">确定当前车辆线路为实际线路</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row class="GJ-player"  v-show="dataList.length">
      <el-form :inline="true" :model="formInline" >


        <el-form-item>
          <el-button-group>
            <el-button size="small" type="primary" icon="fa-play-circle" @click="playHandler">播放</el-button>
            <el-button size="small" type="primary" icon="fa-pause-circle" @click="pauseHandler">暂停</el-button>
            <el-button size="small" type="primary" icon="fa-stop-circle" @click="stopHandler">停止</el-button>
          </el-button-group>
        </el-form-item>

        <el-form-item label="速度">
          <el-select  size="small" v-model="player.speed" placeholder="">
            <el-option label="标准" value="1"></el-option>
            <el-option label="2倍" value="2"></el-option>
            <el-option label="4倍" value="4"></el-option>
            <el-option label="6倍" value="6"></el-option>
            <el-option label="8倍" value="8"></el-option>
            <el-option label="10倍" value="10"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="播放进度">
          <el-slider
            :min="1"
            :step="1"
            :max="dataList.length"
            v-model="player.current"
            style="width:200px;">
          </el-slider>
        </el-form-item>
        <el-form-item>
          {{player.current}} / {{dataList.length}}
        </el-form-item>
      </el-form>
    </el-row>




    <div id="GJ-map" class="GJ-map" style="height: 100%;"></div>

  </div>
</template>
<script>


  import { getBusLineList,getBusGuijiEdit,getBusGuijiEditline,updataBusGuijiEditline} from '@/api/table'
  import $ from 'jQuery';
  import { Message } from 'element-ui';

  Date.prototype.Format = function(fmt)
  { //author: meizz
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  };

  export default {
    data() {
      return {
        player:{
          speed:"1",
          timer:2000,//默认延迟
          current:0,//播放第几个数据
          played:false,//是否开始播放
          timerId:0,//setinterval ID 用于清除动画
          played:false
        },
        formInline:{
          License:"",
          StartTime:"",
          EndTime:"",
          Date:new Date()
        },
        carMarkerWindow:{},
        lines:[],
        carInfo:[],
        bus:[],
        dataList:[],
        treelist:[],

        isTreebuslist:false,
        isTreebuslistButton:false,
        treebuslist:[],

        searchData:null,

        updataNewLine:[],

        polyline:null,


        // bzItems:[],
        // zrbzProps: {
        //   value: 'value',
        //   children: 'bzs'
        // },



      }

    },
    watch:{
      "player.current":function(newVal){
        this.renderBus(this.dataList[newVal])
      },
      "player.speed":function(newVal){
        var _played = this.player.played;
        this.pauseHandler();
        this.$set(this.player,"timer",parseInt(2000/newVal));
        if(_played){
          this.playHandler();
        }
      }
    },
    computed:{
      searchParam(){

        var date =  new Date(this.formInline.Date).Format("yyyyMMdd");
        //var startTime = new Date(this.formInline.StartTime).Format("hhmmss");
        //var endTime = new Date(this.formInline.EndTime).Format("hhmmss");
        var param = date;
        return param;

      }
    },
    mounted() {

      var that = this;



      getBusLineList().then(response => {
        if(response.code === '000') {
          //返回线路赋值
          this.$set(this.$data,"treelist",response.result);





        }
        //this.initReq();
      })





      window.mapInit= function(){
        var map = that.map = new BMap.Map('GJ-map');
        map.setCurrentCity("廊坊市")
        map.centerAndZoom(new BMap.Point(116.726509,39.53446), 13);
        that.map.enableScrollWheelZoom(true);
      }
      if(!window.BMap){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=C7kiRgh3qZDHrCbpf9vVGjrN3O9Rf10Q&callback=mapInit";
        document.body.appendChild(script);
      }else{
        mapInit()
      }

    },
    methods: {





      pauseHandler(){
        clearInterval(this.player.timerId);//清除动画
        this.$set(this.player,"played",false);
      },
      stopHandler(){
        this.pauseHandler();
        this.player.current = 0;
        this.renderBus(this.dataList[0]);
      },
      playHandler(){
        if(this.dataList.length){
          this.$set(this.player,"played",true);
          var timerId = setInterval(()=>{
            if(this.dataList.length<=this.player.current){
              clearInterval(this.player.timerId)
              // Message ({
              //   message:"播放完毕",
              //   type:"success"
              // })
            }
            this.player.current+=1;
            var data = this.dataList[this.player.current];
            this.renderBus(data);
          },this.player.timer);
          this.$set(this.player,"timerId",timerId)
        }else{
          // Message ({
          //   message:"请先查询数据!",
          //   type:"warning"
          // })
        }

      },

      searchBusHandler(selVal){
        var that = this;

        this.searchData = {
          'runMethod':selVal,
          'time':this.searchParam
        }



        //console.log(this.searchData)

        getBusGuijiEdit(this.searchData).then(response => {
          console.log(response.result)
          if (response.code === '000') {
            this.isTreebuslist = true;
            this.isTreebuslistButton = false;
            that.map.removeOverlay(this.polyline);
            that.clearMapInfo();
            this.$set(this.$data,"treebuslist",response.result);
            //this.treebuslist=response.result;
            //debugger;
          }
        })



        //测试文件

        // $.getJSON("/static/test.js", function(json){
        //
        //   console.log(json[0].result);
        //
        //   //that.createBus(data);
        //   var data = json[0].result.one
        //   var polylines = [];
        //   var polylinesPromise = [];
        //   var convertor = new BMap.Convertor();
        //   data.map((item)=>{
        //     polylines.push(item.y+","+item.x)
        //   })
        //
        //   for(var i=0,len=Math.ceil(polylines.length/100);i<len;i++){
        //     var a = new Promise((resolve,reject)=>{
        //       $.ajax({
        //         url:"https://api.map.baidu.com/geoconv/v1/",
        //         jsonp: "callback",
        //         dataType:"jsonp",
        //         data:{
        //           coords:polylines.slice(i*100,(i+1)*100).join(";"),
        //           from:1,
        //           to:5,
        //           ak:"C7kiRgh3qZDHrCbpf9vVGjrN3O9Rf10Q"
        //         },
        //         success:function(data){
        //           resolve(data)
        //         }
        //       });
        //     });
        //     polylinesPromise.push(a);
        //
        //   }
        //
        //
        //   Promise.all(polylinesPromise).then(function(points){
        //     var linePoints = [];
        //     points.map((item)=>{
        //       item.result.map((position)=>{
        //         linePoints.push(new BMap.Point(position.x,position.y));
        //       })
        //     })
        //     //console.log(linePoints)
        //     var polyline = new BMap.Polyline(linePoints, {strokeColor:"blue", strokeWeight:5, strokeOpacity:0.5});
        //     that.map.addOverlay(polyline);   //增加折线
        //   })
        //
        // });


      },

      searchHandler(selVal){
        var that = this;

        this.searchData.vehicleNumber = selVal
        this.isTreebuslistButton = false;
        that.map.removeOverlay(this.polyline);
        that.clearMapInfo();
        console.log(this.searchData);


        getBusGuijiEditline(this.searchData).then(response => {
          console.log(response.result)
          if (response.code === '000') {

            var data = response.result.line;
            this.updataNewLine = response.result;
            this.isTreebuslistButton = true;

            this.createBus(data);

            var polylines = [];
            var polylinesPromise = [];
            var convertor = new BMap.Convertor();
            data.map((item)=>{
              polylines.push(item.y+","+item.x)
            })

            for(var i=0,len=Math.ceil(polylines.length/100);i<len;i++){
              var a = new Promise((resolve,reject)=>{
                $.ajax({
                  url:"https://api.map.baidu.com/geoconv/v1/",
                  jsonp: "callback",
                  dataType:"jsonp",
                  data:{
                    coords:polylines.slice(i*100,(i+1)*100).join(";"),
                    from:1,
                    to:5,
                    ak:"C7kiRgh3qZDHrCbpf9vVGjrN3O9Rf10Q"
                  },
                  success:function(data){
                    resolve(data)
                  }
                });
              });
              polylinesPromise.push(a);

            }


            Promise.all(polylinesPromise).then(function(points){
              var linePoints = [];
              points.map((item)=>{
                item.result.map((position)=>{
                  linePoints.push(new BMap.Point(position.x,position.y));
                })
              })
              //console.log(linePoints)
              that.polyline = new BMap.Polyline(linePoints, {strokeColor:"blue", strokeWeight:5, strokeOpacity:0.5});
              that.map.addOverlay(that.polyline);   //增加折线
            })



          }


        })




      },


      getLinesHandler(){

      },

      searchHandlerUpdate(){

        console.log(this.updataNewLine)


        this.$confirm('此操作将保存线路信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {

          updataBusGuijiEditline(this.updataNewLine).then(response => {
            console.log(response.result)
            if (response.code === '000') {

              this.searchData = null;
              this.updataNewLine = [];
              this.isTreebuslist = false;
              this.isTreebuslistButton = false;


            }
          })

          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存'
          });
        });




      },

      clearMapInfo(){
        var that = this;
        that.map.clearOverlays();//清空地图
        that.$set(that.$data,"bus",{});//清空对象
        that.$set(that.$data,"dataList",[]);//清空对象列表
        //that.$set(that.$data,"dataList",data);
        that.$set(that.player,"current",0);
        // that.$set(that.player,"speed","1");
        that.$set(that.player,"played",false);
        clearInterval(that.player.timerId);//清除动画
      },


      createBus(data){
        var that = this;
        //每次查询后创建一个新的bus、需要先清空之前得信息
        that.map.clearOverlays();//清空地图
        that.$set(that.$data,"bus",{});//清空对象
        that.$set(that.$data,"dataList",[]);//清空对象列表
        that.$set(that.$data,"dataList",data);
        that.$set(that.player,"current",0);
        // that.$set(that.player,"speed","1");
        that.$set(that.player,"played",false);
        clearInterval(that.player.timerId);//清除动画
        that.renderBus(data[0]);//默认把第一个位置添加到地图
      },
      renderBus(data){
        var that = this;
        var data = that.formatData(data);
        if(data === false){
          return false;
        }
        var pt = new BMap.Point(data.GPSLng,data.GPSLat);
        var convertor = new BMap.Convertor();
        convertor.translate([pt], 1, 5, function(ptData){
          pt = ptData.points[0];
          if(that.player.GPSSpeed<6){
            that.map.setViewport({center:pt,zoom:that.map.getZoom()})
          }

          that.$set(that,"carMarkerWindow",data)
          // 如果marker存在，更新信息，不存在创建
          if(that.bus.setPosition){
            that.bus.setPosition(pt);
            return false;
          }

          var myIcon = new BMap.Icon("/static/point.svg", new BMap.Size(14,14));
          var label = new BMap.Label(data.CarCard,{position:pt,offset:new BMap.Size(50,-1)});
          label.setZIndex(1);
          label.setStyle({border:"none",background:"none"});
          label.setContent('\
          <div style="background:#FFF;border-radius:5px; fot-size:15px;padding:2px 5px; border:1px solid #007ed2; color:#007ed2;">\
            <div style="position:absolute;left:-38px;top:10px; width:39px; border-bottom:1px solid #007ed2;"></div>\
          '+data.CarCard+'\
          </div>');
          var marker = new BMap.Marker(pt,{icon:myIcon,rotation:data.GPSRotate});  // 创建标注
          marker.parentData = data;
          marker.setLabel(label);

          marker.addEventListener("click", function(){
            var _this = this;
            var infoWindow = new BMap.InfoWindow(that.$refs.carMarkerWindow);
            _this.openInfoWindow(infoWindow); //开启信息窗口
          });

          that.map.addOverlay(marker);
          that.$set(that.$data,"bus",marker);


        })
      },
      formatData(data){
        if(!data){return false };
        var data = {
          //CarCard:this.formInline.License,//车牌号
          CarCard:this.searchData.vehicleNumber,//车牌号
          //GPSTime:String(data.createdTime),//GPS 日期时间
          //GPSTime:data.dateTime,//GPS 日期时间
          GPSLat:data.x,//GPS 纬度
          GPSLng:data.y,//GPS 经度
          GPSRotate:174,//GPS 方向
          GPSSpeed:20,//GPS 速度
          //GPSStatus:data.stateNumber,//GPS 无效定位
          //RouteId:data.runMethod,//线路 ID（跑法号）
          //Updown:data.upDown,//上下行
          //StationNumber:data.stationId,//站点顺序号
        }
        return data;
      },
      // getStation(carMarkerWindow){//获取当前公交站
      //   var name = "";
      //   var _index = 1;
      //   var _line = this.lines[this.lines.dict[carMarkerWindow.RouteId]];
      //   var _dict = _line.SiteList2;
      //   var _updownDict = _dict[carMarkerWindow.Updown];
      //   if(_updownDict){
      //     name = _line.SiteList[_updownDict[carMarkerWindow.StationNumber-_index]].SiteName
      //   }
      //   return name;
      //
      // },
      // getNextStation(carMarkerWindow){//获取下一站
      //   var name = "";
      //   var _line = this.lines[this.lines.dict[carMarkerWindow.RouteId]];
      //   var _dict = _line.SiteList2;
      //   var _updownDict = _dict[carMarkerWindow.Updown];
      //   if(_updownDict){
      //     name = _line.SiteList[_updownDict[carMarkerWindow.StationNumber]].SiteName
      //   }
      //   return name;
      // }

    }
  }

</script>

<style lang="less" scoped>
  .el-form-item{ margin-bottom: 0; }
  .el-tabs--border-card>.el-tabs__content{ padding:0;}
  .el-card__header{ padding: 10px;}
  .el-card__body{padding:0 !important;}
  .el-card{ box-shadow: none !important; border-radius: 0 !important;}
  .GJ-search{

    padding: 20px;
    background: #FFF;
    margin-bottom: 10px;
    border-bottom:1px solid #828790;
    box-sizing: border-box;
    z-index: 2;
  .updataLineButton{
    padding: 12px;
  }}
  .GJ-body{position: absolute;top: 0;bottom:0;left:0;right:0;}
  .GJ-tools{position:absolute; top:0;bottom:0;left:0;right:0;}
  .GJ-table{
    td{height:25px; color:#777;}
  }
  .GJ-player{margin:0px 20px;padding: 5px 10px;position:absolute; top:100px;height:50px;left:0;right:0; z-index: 99; background: rgba(255,255,255,.9); border:1px solid #ddd;}
  .GJ-map{ position: absolute; top:57px; bottom:0; width: 100%;}

  .GJ-body{
    .infowindow-list{ display: none;}
    .GJ-map{
      .infowindow-list{ display: block;}
    }
  }
  .infowindow-list{ font-size:14px;
    .item{ border-bottom:1px dotted #ddd; color:#888; padding:3px 0;
      strong{ color:#333;  padding-right:1em; width:5em; display:inline-block;}
    }
  }


</style>
