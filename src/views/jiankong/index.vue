<template>
  <div class="jiankong-body">
    <div class="infowindow-list" ref="carMarkerWindow" v-if="carMarkerWindow.RouteId">
      <div class="item">
        <strong>线路:</strong>{{lines[lines.dict[carMarkerWindow.RouteId]].LineName}}
      </div>
      <div class="item">
        <strong>车牌号:</strong>{{carMarkerWindow.CarCard}}
      </div>
      <div class="item">
        <strong >GPS 速度:</strong><span :style="carMarkerWindow.GPSSpeed >=40 ? 'color:red':''">{{carMarkerWindow.GPSSpeed}}km/h</span> <el-tag type="danger" v-if="carMarkerWindow.GPSSpeed >=40">超速</el-tag>
      </div>
      <div class="item">
        <strong>上下行:</strong>{{carMarkerWindow.UpDown == 1?"下行":"上行"}}</div>
      <div class="item">
        <strong>站点:</strong>{{getStation(carMarkerWindow)}}</div>
      <div class="item">
        <strong>下一站:</strong>{{getNextStation(carMarkerWindow)}}
      </div>
      <div class="item">
        <strong>日期时间:</strong>
        {{String(carMarkerWindow.GPSTime).substring(0,4)}}年{{String(carMarkerWindow.GPSTime).substring(4,6)}}月{{String(carMarkerWindow.GPSTime).substring(6,8)}}日{{String(carMarkerWindow.GPSTime).substring(8,10)}}点{{String(carMarkerWindow.GPSTime).substring(10,12)}}分{{String(carMarkerWindow.GPSTime).substring(12,14)}}秒
      </div>
    </div>




    <div class="JK-tree">
      <div class="line-list" v-for="line in lineList"  :key="line.treeId">
        <div class="tree-node">
          <h2 @click="(e)=>{treeToggle(e,line)}">
            <span class="el-tree-node__expand-icon"></span>
            <input type="checkbox" @click.stop="" @change="(e)=>{treeLineCheck(e,line)}">
            {{line.LineName}}
            &#x3000;
            <i class="el-icon-fa-level-down"></i> {{line.children.filter((car)=>{return car.UpDown==1}).length}}
            /
            <i class="el-icon-fa-level-up"></i> {{line.children.filter((car)=>{return car.UpDown!=1}).length}}
            <span class="badge">{{line.children.length}}</span>
          </h2>
          <div class="children" v-if="line.show">
            <div class="tree-node" v-for="car,index in line.children"   :id="'id'+car.CarSign" :key="index">
              <h2 @dblclick="(e)=>{positionCar(e,car)}"  :class="car.checked?'selected':''" :style="{color:car.GPSSpeed>=40?'red':'green'}"><span @click="(e)=> {treeToggle(e)}"  class="el-tree-node__expand-icon"></span> <input type="checkbox" @change="(e)=>{treeCheck(e,car)}" @click.stop="" /> <i :class="(car.UpDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ') + 'updown'"></i>  <i class="el-icon-fa-bus"></i> {{car.CarCard}}  {{car.GPSSpeed}}km/h</h2>
              <div class="children video-list">
                <h3 v-for="i in 8"><input type="checkbox" @change.navtive="(e)=>{viedeoCheck(e,car,i)}" />
                  <i class="el-icon-fa-video-camera"></i> 摄像头{{i}}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="offLineCarList tree-node">
        <h2 @click="(e)=>{offlineShow = treeToggle(e)}"><span class="el-tree-node__expand-icon"></span> 离线  <span class="badge">{{offLineCarCount}}</span></h2>
        <div class="children" v-if="offlineShow">
          <div class="tree-node" v-for="car in carList" :key="car.treeId" v-if="!car.online">
            <h2 @dblclick="(e)=>{positionCar(e,car)}"><input type="checkbox" @change="(e)=>{treeCheck(e,car)}" /> <i :class="(car.UpDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ') + 'updown'"></i> {{car.CarCard}}</h2>
          </div>
        </div>
      </div>




    </div>

    <div class="JK-map">

      <div class="status-window" :style="{bottom:showOverSpeedList?0:'auto'}">
        <!-- 运营总量：{{carList.length}}<br>
        运行车辆：<span style="color:#007ad4;">{{onlineCount}}</span><br>
        离线车辆：<span style="color:#999;">{{offLineCarCount}}</span><br> -->

        运营总量：739<br>
        运行车辆：<span style="color:#007ad4;">{{onlineCount}}</span><br>
        离线车辆：<span style="color:#999;">{{739-onlineCount}}</span><br>
        超速车辆：<span style="color:red;">{{overSpeedList.length}}</span> <a href="javascript:;" @click="showOverSpeedList = !showOverSpeedList">[显示详细]</a>

        <ul v-if="showOverSpeedList">
          <li v-for="car in overSpeedList">
            <div class="overspeed-title">
              <span>{{car.CarCard}}</span> {{car.GPSSpeed}} km/h

              <div class="overspeed-right">
                <a href="javascript:;" @click="car.showOverSpeed = !car.showOverSpeed" >详细</a>
                <a href="javascript:;" @click="()=>{showOverSpeedCar(car)}" >定位</a>
              </div>

            </div>

            <div v-if="car.showOverSpeed" class="overspeed-info">
              <div class="item">
                <strong>线路:</strong>{{lines[lines.dict[car.RouteId]].LineName}}
              </div>
              <div class="item">
                <strong>车牌号:</strong>{{car.CarCard}}
              </div>
              <div class="item">
                <strong>GPS 速度:</strong>{{car.GPSSpeed}}km/h
              </div>
              <div class="item">
                <strong>上下行:</strong>{{car.UpDown == 1?"下行":"上行"}}</div>
              <div class="item">
                <strong>站点:</strong>{{getStation(car)}}</div>
              <div class="item">
                <strong>下一站:</strong>{{getNextStation(car)}}
              </div>
            </div>
          </li>
        </ul>

      </div>




      <div id="JK-map" style="height:100%;" :style="{height:'90%',visibility:$route.name=='jiankong'?'visible':'hidden'}"></div>


      <transition-group tag="div" name="JK-video" :class="$route.name=='shipin'?'shipin-video':'JK-video'">
        <div class="JK-video-item"
             v-for="(video,index) in videoList"
             :style="
          $route.name=='shipin'?
          {top:(Math.floor(index/4)*33.33)+'%',left:(parseInt(index%4)*25)+'%'}:{bottom:(parseInt(index%3)*33.33)+'%',right:(parseInt(index/3)*50)+'%'}
          "
             v-bind:key="video.id">
          <div class="JK-video-container">
            <div class="video-item">
              <object :id="'v'+video.id" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" name="showvideo" style="width:100%;height:100%;">
                <param name="_Version" value="65536">
                <param name="_ExtentX" value="10583">
                <param name="_ExtentY" value="9260">
                <param name="_StockProps" value="0">
              </object>
            </div>
            <el-button class="close" @click="removeVideo(video)" type="primary" icon="fa-times" size="small"></el-button>
            <div class="info">
              {{video.videoName}}
            </div>
          </div>
        </div>
      </transition-group>



    </div>

    <div class="JK-resize" draggable="true"></div>


    <div class="warning-tips">
      <el-row :gutter="24">
        <el-col :span="8">
          <dl>
            <dt>大间距</dt>
            <dd>
              <span v-for="lineId,lineName in warningData.dajianju">
               <router-link :to="'/jiankong-line/'+lineName.replace('路',1)">{{lineName}}</router-link>
              </span>

            </dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl>
            <dt>双车</dt>
            <dd>
              <span v-for="lineId,lineName in warningData.shuangche">
                <router-link :to="'/jiankong-line/'+lineName.replace('路',1)">{{lineName}}</router-link>
              </span>
            </dd>

          </dl>
        </el-col>

        <el-col :span="8" >
          <dl>
            <dt>滞站</dt>
            <dd style="height:45px;overflow-y:auto;">
              <span v-for="item in warningData.zhizhan">
                <router-link :to="'/jiankong-line/'+item.lineName.replace('路',1)">
                {{item.lineName}}
                {{item.stationName}}
                {{item.carCard}}
              </router-link>
              </span>
            </dd>

          </dl>
        </el-col>



      </el-row>


    </div>
  </div>
</template>
<script>

  import Vue from 'vue';
  import {god} from "../../API/jiankong-line.js"
  import { Loading } from 'element-ui';
  import { Message } from 'element-ui';
  import $ from 'jQuery';
  import { Notification } from 'element-ui';
  export default {
    data() {
      return {
        showOverSpeedList:false,
        warningData:{
          dajianju:{},
          shuangche:[]
        },
        // lineData:Object.freeze(lineData),
        map:{},
        offlineShow:false,
        carList:[//车列表

          // {
          //   City:"廊坊市",//车辆登记城市
          //   DataId:"11111",//数据源 ID
          //   CarSign:"111",//车辆标识
          //   CarCard:"冀R1111",//车牌号
          //   CarType:" ",//车辆类型
          //   GPSTime:" ",//GPS 日期时间
          //   GPSLat:" ",//GPS 经度
          //   GPSLng:" ",//GPS 纬度
          //   GPSRotate:" ",//GPS 方向
          //   GPSSpeed:" ",//GPS 速度
          //   GPSStatus:" ",//GPS 无效定位
          //   RouteId:"11",//线路 ID（跑法号）
          //   RouteVersion:" ",//线路版本
          //   UpDown:" ",//上下行
          //   StationNumber:" ",//站点顺序号
          //   // ??:" ",//进出站状态
          //   // ??:" ",//空调车标记
          //   // ??:" ",//运营状态
          //   OnLine:false
          // }

        ],
        lockDict:{},
        carList2:[],
        lines:[],
        carSignx:"",
        videoList:[],
        carMarkerWindow:{},
        offLineCarCount:0,
        defaultProps: {
          children:"children",
          label:(data,node)=>{
            return data.name
          }
        },
        lineList:[],
        count: 1
      }
    },
    computed:{
      onlineCount:function(){
        var count =  this.carList.length - this.offLineCarCount;
        count = count>=0?count:0;
        return count;
      },
      overSpeedList:function(){
        var list = [];
        this.lines.map((line)=>{
          if(line.children){
            list = list.concat(line.children.filter((car)=>{
              return car.GPSSpeed>=40;
            }));
          }
        })
        return list
      }
    },
    beforeCreate(){
      var that = this;
//报警**********
      god.warningList ={
        dajianju:{},
        shuangche:{},
        zhizhan:{}
      };
      god.warning = function(type,lineName,line,station,bus){
        if(type=="dajianju"){
          var dajianju = god.warningList.dajianju;
          dajianju[lineName] = dajianju[lineName] ||[]
          if(dajianju[lineName].indexOf(line.data.LineId) == -1){
            dajianju[lineName].push(line.data.LineId);
          }
        }

        if(type=="shuangche"){
          var shuangche = god.warningList.shuangche;
          shuangche[lineName] = shuangche[lineName] || [];
          if(shuangche[lineName].indexOf(line.data.LineId) == -1){
            shuangche[lineName].push(line.data.LineId);
          }
        }

        if(type=="zhizhan"){
          god.warningList.zhizhan[bus.CarSign] = {
            line:line,
            station:station,
            bus:bus,
            lineName:line.data.LineName,
            stationName:station.name,
            carCard:bus.CarCard
          }
          // setTimeout(function(){
          //   Notification.warning({
          //     title:line.data.LineName+"滞站",
          //     message:"位于"+line.data.LineName + bus.CarCard + station.name,
          //     duration:5000
          //   })
          // },parseInt(Math.random()*1000));
        }


      }
      setInterval(function(){
        //每2秒检测列表中的线路是否依然存在大间距
        for(var lineName in god.warningList.dajianju){
          var lineIds = god.warningList.dajianju[lineName];
          lineIds.map(lineId=>{
            if(god.lines[lineId].checkDajianju() == false){
              var pos = lineIds.indexOf(lineId);
              lineIds.splice(pos,1);
              if(lineIds.length == 0){
                delete god.warningList.dajianju[lineName];
              }
            }
          })
        }


        //每2秒检测列表中的线路是否依然存在双车
        for(var lineName in god.warningList.shuangche){
          var lineIds = god.warningList.shuangche[lineName];
          lineIds.map(lineId=>{
            if(god.lines[lineId].checkShuangche() == false){
              var pos = lineIds.indexOf(lineId);
              lineIds.splice(pos,1);
              if(lineIds.length == 0){
                delete god.warningList.shuangche[lineName];
              }
            }
          })
        }

        for(var key in god.warningList.zhizhan){
          var item = god.warningList.zhizhan[key];
//      var currentTime = new Date().getTime();
          var station = item.station;
          var isInStation = false;
          station.bus.map((bus)=>{
            if(bus.CarSign == item.bus.CarSign){
              isInStation = true;
            }
          })
          if(station.bus.length==0 || isInStation == false){
            delete god.warningList.zhizhan[key];
          }
        }



        that.warningData = god.warningList;
        // god.warningList={
        //   dajianju:[],
        //   shuangche:[]
        // };
      },2000);



      var that = this;
      //let loadingInstance = Loading.service({ fullscreen: true,text:"载入11数据"});

      //加载基础信息｛线路基础信息、车辆基础信息｝
      //var loadLines = '';
      var loadLines =$.ajax({
        url: window.GJCONFIG.localhost+"/Service1.svc/GetData",
        data: { 'value': 1 },
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success:function(data){
          var rdata = [{
            'List1': [{
              'LineId': 11,
              'LineName': '1路',
              'LineVersion': '1708311606',
              'Time': ['05:00', '23:00', '05:00', '23:00', ],
              'SiteList': [{
                'SiteName': '武警学院',
                'Lon': 39.123456,
                'Lat': 116.123456,
              }, {
                'SiteName': '武警学院',
                'Lon': 39.123456,
                'Lat': 116.123456,
              }],
              'SiteList2': [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 0],
                []
              ]
            }, {
              'LineId': 12,
              'LineName': '1路',
              'LineVersion': '1708311606',
              'Time': ['05:00', '23:00', '05:00', '23:00', ],
              'SiteList': [{
                'SiteName': '武警学院',
                'Lon': 39.123456,
                'Lat': 116.123456,
              }, {
                'SiteName': '武警学院',
                'Lon': 39.123456,
                'Lat': 116.123456,
              }],
              'SiteList2': [
                [],
                [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 30]
              ]
            }],
            'List2': {
              '11': 0,
              '12': 1,
            }
          }];
          god.init(JSON.parse(rdata),true);
          window.god = god;
          loadingInstance.setText("载入线路数据");
        }
      });

      //var loadCars = '';
      var loadCars = $.ajax({
        url: window.GJCONFIG.localhost+"/PositionService.svc/GetLoadData",
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success:function(){
          loadingInstance.setText("载入车辆数据");
        }
      });


      var loadBase = Promise.all([loadLines,loadCars]);
      loadBase.catch(function(){
        Message ({
          message:"接口配置不正确！",
          type:"warning"
        })
        loadingInstance.close()
      })
      loadBase.then(function(resultObj){
        //添加基础信息到data
        loadingInstance.setText("渲染线路&车辆数据");
        //线路信息
        loadLines = JSON.parse(resultObj[0]);
        loadLines.List1 = loadLines.List1.map((item)=>{
          // console.log(item.SiteList)
          item.SiteList = JSON.parse(item.SiteList);
          item.SiteList2 = JSON.parse(item.SiteList2);
          return item;
        });

        var lines = [];
        lines = loadLines.List1;
        lines.dict = JSON.parse(loadLines.List2);
        that.$set(that,"lines",lines);

        var _NameDict = [];
        that.lines.map((item,index)=>{
          if(_NameDict.indexOf(item.LineName)===-1){
            item.treeId = index;
            that.$set(item,"children",[]);
            that.lineList.push(item)
            _NameDict.push(item.LineName)
          }
        })
        that.lineList._NameDict = _NameDict;

        //车辆信息


        loadCars = JSON.parse(resultObj[1]);

        that.$set(that.$data,"carList",loadCars);
        var carListDict = {};
        that.carList.map((item,index)=>{
          item.treeId="car"+index;
          carListDict[item.CarSign] = index;
        })
        that.carList.dict  = carListDict;
        that.offLineCarCount = that.carList.length;
        loadingInstance.setText("初始化数据");
        setTimeout(()=>{loadingInstance.close()},1000);

        that.wsInit();


      })

    },

    mounted() {
      var that = this;
      window.mapInit= function(){
        var map = that.map = new BMap.Map('JK-map');
        map.setCurrentCity("廊坊市");
        map.centerAndZoom(new BMap.Point(116.726509,39.53446), 13);
        that.map.enableScrollWheelZoom(true);
        var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例
        map.addTileLayer(traffic);                    // 将图层添加到地图上

      }
      if(!window.BMap){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=C7kiRgh3qZDHrCbpf9vVGjrN3O9Rf10Q&callback=mapInit";
        document.body.appendChild(script);
      }else{
        mapInit()
      }

      $(".JK-resize").on("drag",function(e){//左侧调整大小
        if(e.pageX!=0&&e.pageX>240){
          $(".JK-map").css({left:e.pageX+10});
          $(this).css({left:e.pageX});
          $(".JK-tree").css({width:e.pageX})
        }
      })



    },
    methods: {
      wsInit(){//初始化socket

        var that = this;
        if(!window.ws){
          window.ws = new WebSocket(window.GJCONFIG.ws);
        }
        setInterval(()=>{
          ws.send("heart");
        },30000);
        // ws.onclose = function(evt){console.log("断线重连");ws = new WebSocket("ws://192.168.88.123:5555");};
        ws.onerror = function(evt){
          Message ({
            message:"Socket连接错误！",
            type:"warning"
          })
        };

        ws.addEventListener("message", function(evt){


          var _obj = that.formatData(evt.data);//格式化数据
// if(_obj.CarCard == "冀R63850"){
//   console.log(_obj)
// ws.close();
// }


          //报警*******
          try{
            god.message(_obj);
          }catch(err){

          }






          if(that.lines[that.lines.dict[_obj.RouteId]] == undefined){//当没有该线路时
            return false;
          }

          var currentCar  =  that.carList[that.carList.dict[_obj.CarSign]];//当前车
          var currentLineName = that.lines[that.lines.dict[_obj.RouteId]].LineName;//根据socket数据的 跑法号 获取线路名
          var lineListIndex = that.lineList._NameDict.indexOf(currentLineName);//下标位置
          var currentLine = that.lineList[lineListIndex];//当前车得线路
          if(currentCar!=undefined){
            if(!currentCar.online){
              that.$set(currentCar,"online",true);
              that.offLineCarCount = that.offLineCarCount-1;
            }

          }else{
            //如果车辆列表没有当前车辆
            that.carList.push(_obj);//当前车辆加入到车辆列表
            that.carList.dict[_obj.CarSign] = that.carList.length;//当前车辆加入到车辆列表得下标 记录到字典
          }

          if(!currentCar){
            return false;
          }

          if(currentCar.currentLine && currentCar.currentLine != currentLine){//判断车跑法号是否对应当前的线路
            var _index = currentCar.currentLine.children.dict[_obj.CarSign] ;
            currentCar.currentLine.children.splice(_index,1);
          }

          that.$set(currentCar,"currentLine",currentLine);//设置当前车对应得线路

          var dict = currentLine.children.dict||[];

          if(dict.indexOf(_obj.CarSign) === -1){//添加车辆
            currentLine.children.dict = currentLine.children.dict||[];//根据车辆标识简建立集合，防止重复
            currentLine.children.dict.push(_obj.CarSign)//把车辆标识加入字典
            _obj.parent = currentLine.children;
            _obj.online = true;
            _obj.timer = new Date();
            currentLine.children.push(_obj);
          }else{//更新车辆

            //  if(!currentLine.show){
            //   return false;
            // }
            _obj.timer = new Date();
            var marker = currentLine.children[currentLine.children.dict.indexOf(_obj.CarSign)].marker;
            if(marker){//更新车辆位置
              var convertor = new BMap.Convertor();
              var pointArr = [];
              pointArr.push(new BMap.Point(_obj.GPSLng,_obj.GPSLat));
              convertor.translate(pointArr, 1, 5, function(item){
                marker.setPosition(item.points[0]);
                marker.setRotation(_obj.GPSRotate);
              })
            }
            var _car = currentLine.children[currentLine.children.dict.indexOf(_obj.CarSign)];
            that.$set(_car,"GPSTime",_obj.GPSTime);
            that.$set(_car,"timer",new Date());
            that.$set(_car,"GPSLat",_obj.GPSLat);
            that.$set(_car,"GPSLng",_obj.GPSLng);
            that.$set(_car,"GPSRotate",_obj.GPSRotate);
            that.$set(_car,"GPSSpeed",_obj.GPSSpeed);
            that.$set(_car,"GPSStatus",_obj.GPSStatus);
            that.$set(_car,"UpDown",_obj.UpDown);
            that.$set(_car,"StationNumber",_obj.StationNumber);
            that.$set(_car,"online",true);
          }
        });

        setInterval(()=>{//检测离线
          that.lineList.map((lineItem)=>{
            lineItem.children.map((car)=>{
              if(car.timer&& new Date() - car.timer > 170000){
                car.parent.splice(car.parent.indexOf(car),1);
                car.parent.dict.splice(car.parent.dict.indexOf(car.CarSign),1);
                if(that.carList[that.carList.dict[car.CarSign]].online){
                  that.offLineCarCount += 1;
                  that.$set(that.carList[that.carList.dict[car.CarSign]],"online",false);
                }
              }
            })

          })

        },5000)



      },
      formatData(str){//格式化socket数据
        var result = {};
        var _arr = str.replace("^G||","").replace("$","").split("|");
        result = {
          City:_arr[0],//车辆登记城市
          DataId:_arr[1],//数据源 ID
          CarSign:_arr[2],//车辆标识
          CarCard:_arr[3],//车牌号
          CarType:_arr[4],//车辆类型
          GPSTime:_arr[5],//GPS 日期时间
          GPSLng:_arr[6],//GPS 经度
          GPSLat:_arr[7],//GPS 纬度
          GPSRotate:_arr[8],//GPS 方向
          GPSSpeed:_arr[9],//GPS 速度
          GPSStatus:_arr[10],//GPS 无效定位
          RouteId:_arr[11],//线路 ID（跑法号）
          RouteVersion:_arr[12],//线路版本
          UpDown:_arr[13],//上下行
          StationNumber:_arr[14],//站点顺序号
          InOut:_arr[15],//进出站状态
          Air:_arr[16],//空调车标记
          YunYing:_arr[17],//运营状态
        }
        if(_arr[15]){
          result.InOut = _arr[15]
        }

        result.StationNumber = result.StationNumber-1<0?0:result.StationNumber-1;
        if(result.CarCard){
          if(result.CarCard.length<7){
            result.CarCard = "冀R"+result.CarCard
          }else if(result.CarCard.length<6){
            result.CarCard = "冀"+result.CarCard
          }
        }
        return result
      },
      getStation(carMarkerWindow){//获取当前公交站
        var name = "";
        var _index = 0;
        var _line = this.lines[this.lines.dict[carMarkerWindow.RouteId]];
        var _dict = _line.SiteList2;
        var _updownDict = _dict[carMarkerWindow.UpDown];
        //console.log(_line,carMarkerWindow)
        if(_updownDict){
          name = _line.SiteList[_updownDict[carMarkerWindow.StationNumber-_index]].SiteName
        }
        return name;
      },
      getNextStation(carMarkerWindow){//获取下一站
        var name = "";
        var _line = this.lines[this.lines.dict[carMarkerWindow.RouteId]];
        var _dict = _line.SiteList2;
        var _updownDict = _dict[carMarkerWindow.UpDown];
        if(_updownDict){
          name = _line.SiteList[_updownDict[carMarkerWindow.StationNumber+1]].SiteName
        }
        return name;
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
      removeCar(data){
        this.map.removeOverlay(data.marker);
        delete data.marker
      },
      createCar(data){
        if(!data||data.show){  return false;}
        var that = this;
        var convertor = new BMap.Convertor();
        var pt = new BMap.Point(data.GPSLng,data.GPSLat);
        convertor.translate([pt], 1, 5, function(item){
          pt = item.points[0];
          if(data.marker){
            data.marker.setRotation(data.GPSRotate)
            data.marker.setPosition(pt)
          }else{
            var myIcon = new BMap.Icon("/static/point.svg", new BMap.Size(14,14));
            var label = new BMap.Label(data.CarCard,{position:pt,offset:new BMap.Size(50,-1)});
            label.setZIndex(1);
            label.setStyle({border:"none",background:"none"});
            label.setContent('\
          <div style="background:#FFF;border-radius:5px; fot-size:15px;padding:2px 5px; border:1px solid #007ed2; color:#007ed2;">\
            <div style="position:absolute;left:-38px;top:10px; width:39px; border-bottom:1px solid #007ed2;"></div><i class="'+(data.UpDown==1?'el-icon-fa-level-down ':'el-icon-fa-level-up ')+' updown"></i>\
          '+that.lines[that.lines.dict[data.RouteId]].LineName+'\
          </div>');
            var marker = new BMap.Marker(pt,{title:data.CarCard,icon:myIcon,rotation:data.GPSRotate});  // 创建标注
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
      removeVideo(data,$el){
        //删除指定得视频

        var _index = this.videoList.indexOf(data);
        if(_index !=-1){
          var _video = this.videoList.splice(_index,1);
          _video[0].$el.prop("checked",false);
        }
      },
      createVideo(data,$el){
        //添加视频数据到videoList
        data.$el = $el;
        var maxVideo = 12;
        // if(this.$route.name == "shipin"){
        //   maxVideo = 12
        // }
        if(this.videoList.length==maxVideo){//如果超过6个，删除最后一个
          var delVideo = this.videoList.shift();
          delVideo.$el.trigger("click");
        }
        this.videoList.push(data);
        this.$nextTick(()=>{
          setTimeout(()=>{
            var _l = 5-data.CarSign.length;
            var _CarSign = data.CarSign;
            for(var i=0;i<_l;i++){
              _CarSign = "0"+_CarSign;
            }

            $("#v"+data.id)[0].SetDeviceInfo(123, "", _CarSign, 5556, window.GJCONFIG.videoIp, window.GJCONFIG.videoPort, "", "");
            setTimeout(()=>{
              $("#v"+data.id)[0].OpenVideo(data.i,1)
            },1000);
          },1000)
        })


      },
      viedeoCheck(e,data,i){

        data[data.CarSign+i] = data[data.CarSign+i] || {
          id:data.CarSign+i,
          CarSign:data.CarSign,
          i:i,
          videoName:data.CarCard+"摄像头"+i
        }

        if($(e.target).prop("checked")){
          this.createVideo(data[data.CarSign+i],$(e.target));
        }else{
          this.removeVideo(data[data.CarSign+i]);
        }
      },
      treeCheck(e,data){
        if($(e.target).prop("checked")){
          this.createCar(data);
        }else{
          this.removeCar(data);
        }

      },
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
      treeToggle(e,data){
        $(e.target).closest(".tree-node").toggleClass("active");
        var reslult = $(e.target).closest(".tree-node").hasClass("active");
        if(data){
          this.$set(data,"show",true);
        }
        return reslult;
      },
      positionCar(e,car){
        var that = this;
        var convertor = new BMap.Convertor();
        var pt = new BMap.Point(car.GPSLng,car.GPSLat);
        convertor.translate([pt], 1, 5, function(item){//转换坐标后定位
          pt = item.points[0];
          //定位
          that.map.centerAndZoom(pt, 16);
          //创建Car
          $(e.target).children("input[type=checkbox]").prop("checked","checked");
          that.createCar(car);
        });

      },
      showOverSpeedCar(car){//定位超速车辆
        var that = this;
        var line = this.lines[this.lines.dict[car.RouteId]];
        this.$set(line,"show",true);
        this.$nextTick(function(){
          var $dom = $("#id"+car.CarSign).find("h2>input[type=checkbox]");
          if(!$dom.prop("checked")){
            $dom.trigger("click");
            var convertor = new BMap.Convertor();
            var pt = new BMap.Point(car.GPSLng,car.GPSLat);
            convertor.translate([pt], 1, 5, function(item){//转换坐标后定位
              pt = item.points[0];
              //定位
              that.map.centerAndZoom(pt, 19);
              setTimeout(function(){
                $(car.marker.V).trigger("click");
              },100)
            });


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
          var searchName = line.LineName;
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

        var color =  "rgb(25,131,211)";
        //创建线
        var mapLine = new BMap.Polyline(arrPois, {strokeColor: color,strokeWeight:7,strokeOpacity:0.6});

        //输出 点、线
        map.addOverlay(mapLine);
        line.xianluLine = mapLine;
      }
    }
  }

</script>

<style lang="less">
  @baseColor:#007ad4;
  a{ color:inherit;}
  .JK-tree{font-size:13px;position:absolute;left:0;top:0;bottom:0;width:240px; background: #FFF; border-right:1px solid #828790; box-sizing: border-box; overflow-y:auto;
  }
  .JK-map{position:absolute;right:0;left:250px;top:0;bottom:0;}
  .JK-video{ position: absolute;    right: 0;    bottom: 0;    width: 600px;    top: 0;
    .JK-video-item{ width:50%; height:33.33%;position:absolute;}
    .JK-video-container{position:absolute; width: 100%;height:100%;

    }
  }
  .video-item{position:absolute; width: 100%;top:30px;bottom:0; background: #000;}
  .JK-video-item{ position:absolute; z-index:0;  border-bottom:1px solid rgba(255,255,255,.3); width: 300px; height:250px; background:#fff;}
  .JK-video-container{ text-align: center;
    .close{position:absolute; z-index:3;right:0;top:0; background:rgba(255,255,255,.2); color:#FFF; border:none; border-radius:0; opacity:0;transition:all .2s;z-index:200; height:30px;
      &:hover{ background:rgba(255,255,255,.3);}
    }
    .info{position:absolute;z-index:3; height:30px; line-height:30px;background:rgba(0,0,0,.5); color:rgba(255,255,255,.7); text-align:center; top:0;left:0; right:0;}
    &:hover{
      .close{opacity:1;}
    }
  }
  .el-tree-node__content{
    .video-span{width:100%;box-sizing:border-box;padding-left:50px;left:0;top:0;bottom:1px;background: #FFF;position: absolute;}
  }
  .el-tree-node__content:hover{
    .video-span{background:#e4e8f1;}
  }

  .JK-fade-enter-active {
    transition: all .3s ease;
  }
  .JK-fade-leave-active {
    transition: all .3s ease;
  }
  .JK-fade-enter, .JK-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100px);
    opacity: 0;
  }
  .videoshow{
    .JK-map{right:40%;}
  }

  /*监控拖动改变大小*/
  .JK-resize{position:absolute; top:-1px;bottom:-1px;left:240px; width:10px; cursor: w-resize; z-index: 4; box-sizing: border-box; background: #f0f0f0;   border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;  border-right:1px solid #828790;}


  .JK-video-item {
    transition: all .5s;
  }
  .JK-video-enter, .JK-video-leave-to
    /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .JK-video-leave-active {
    position: absolute;
  }

  .infowindow-list{ font-size:14px;
    .item{ border-bottom:1px dotted #ddd; color:#888; padding:3px 0;
      strong{ color:#333;  padding-right:1em; width:5em; display:inline-block;}
    }
  }
  .offline .el-checkbox__label{ color:#888;}
  .online .el-checkbox__label{ color:#09a215;}
  .line-list{
    .children .tree-node{
      h2{ color:green;}
    }
  }
  .tree-node{ height:30px; overflow:hidden; color:#48576a; border-top:1px solid #c8d8e4;
    .badge{ background:@baseColor; color:#fff;position:absolute; right:5px;top:4px; border-radius:100%; width:20px; height:20px; line-height:20px; text-align:center; font-size:12px;}
    h2{ font-weight:normal;font-size:14px; margin:0; height:30px; line-height:30px; cursor:pointer;position:relative;
      input[type=checkbox]{vertical-align:-.15em;}
    }
    h2:hover,h2.selected{ background:@baseColor; color:#FFF !important;}
    h2,h3{padding:0;margin:0;}
    .video-list{
      h3{ font-weight:normal; padding-left:34px; height:30px; line-height: 30px; font-size:12px; border-top:1px dotted #c8d8e4;}
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

  .shipin-video{
    .JK-video-item{ width:25%; height:33.3333%;}
  }
  .updown{ background: @baseColor; color:#FFF; display: inline-block; width:14px; height:14px; line-height: 14px; text-align: center; border-radius: 3px;}
  .jiankong-body{ position:absolute;left:0;right:0;top:0;bottom:75px;}
  .warning-tips{position:fixed; z-index: 10; bottom:0; background: #FFF; height:80px;  border: 1px solid #828790;left:7px;right:7px;
    dl,dt,dd{margin:0;padding:0;}
    dl{padding:10px;}
    dd{padding-top:8px;}
    dd span{ background:#ffcd40; border-radius: 3px; font-size:14px; display: inline-block; padding:1px 3px; margin-right:3px;}
  }

  .status-window{border-right:1px solid #999;border-bottom:1px solid #999;position:absolute; z-index:999; background:#FFF;left:0;top:0;bottom:0;overflow:auto; padding:10px; font-size:12px;
    a{color:@baseColor;}
    ul,li{list-style-type: none;padding:0;}
    ul{}
    .overspeed-info{background:#ddd; padding:8px;}
    .overspeed-title{ position:relative; width:215px; border-bottom:1px solid #ddd;padding: 2px 0;
      span{ display: inline-block; width:90px;}
      .overspeed-right{position:absolute;right:0; top:2px;}

    }
  }
</style>
