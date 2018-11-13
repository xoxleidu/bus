<template>
  <div class="jiankong-line">
    <ul class="jiankong-line-list" v-show="!showLineView">
      <li v-for="line in lineList" @click="showLine(line)" class="jiankong-line-item">
        {{line.LineName}} {{currentLine.LineName}}
      </li>
    </ul>
    <warning :currentLine="currentLine" v-if="showLineView" @close="hanlderClose"></warning>
  </div>
</template>
<script>
  import warning from '../../components/layout/warning.vue'
  import {lineData} from "@/API/"
  import {god} from "../../API/jiankong-line.js"
  import $ from 'jQuery';
  export default {
    components:{warning:warning},
    watch:{
      "$route":function(){
        try{
          var lineId = this.$route.path.replace("/jiankong-line/","");
          this.routeView(lineId);
        }catch(err){

        }
      }
    },
    data() {
      return {
        showLineView:false,
        currentLine:{
          children:[],
          LineName:"",
          round:false
        },
        warningData:{},
        lineData:Object.freeze(lineData),
        lineList:[]
      }
    },
    created() {
      var that = this;
      /***解析数据****/
      function formatData(str){//格式化socket数据
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
      }



      if(window.god){
        that.initGod();
      }else{
        $.ajax({
          url: window.GJCONFIG.localhost+"/Service1.svc/GetData",
          data: { 'value': 1 },
          type: 'GET',
          dataType: "jsonp",
          jsonp: "callback",
          success:function(data){
            god.init(JSON.parse(data));
            that.initGod();

          }
        });
      }


      if(!window.ws){
        window.ws = new WebSocket(window.GJCONFIG.ws);
      }

      ws.addEventListener("message", function(evt){
        try{
          god.message(formatData(evt.data));
        }catch(err){

        }
      })




    },
    methods:{
      initGod:function(){
        var that = this;
        var lineListDict = {};
        for(var key in god.lines){

          var data = god.lines[key].data;
          if(data.LineId <=400){
            if(lineListDict[data.LineName] != undefined){
              var _data = that.lineList[lineListDict[data.LineName]];
              _data.round = true;
              _data.lineList = [_data.LineId,data.LineId];

            }else{
              that.lineList.push({LineName:data.LineName,LineId:data.LineId});
              lineListDict[data.LineName] = that.lineList.length-1;
            }
          }
        }

        that.routeView(that.$route.params.line);
      },
      routeView:function(newVal){
        if(newVal == "all"){
          this.showLineView = false;
        }else{
          this.lineList.map((line)=>{
            if(line.LineId == newVal){
              this.showLine(line);
            }
          })
        }
      },
      hanlderClose:function(){
        this.showLineView = false;
        window.location.hash = "/jiankong-line/all";
      },
      showLine:function(line){
        //window.location.hash = "/jiankong-line/"+line.LineId;
        var that = this;
        try{
          this.showLineView = true;
          if(line.round){
            //如果是环线
            this.currentLine.children = [god.lines[line.lineList[0]],god.lines[line.lineList[1]]]
            this.$set(this.currnetLine,"children");
          }else{
            //如果不是环线
            this.currentLine.children = [god.lines[line.LineId]]
            this.$set(this.currnetLine,"children");
          }
        }catch(err){

        }


      }

    }
  }

</script>

<style lang="less">
  a{ color:inherit;}
  .jiankong-line{overflow-y:auto;background: #FFF; position:absolute;left:0;right:0;top:0;bottom:0;}
  .jiankong-line{
    ul,li{ list-style-type: none; margin:0;padding:0;}
    .jiankong-line-item{ cursor: pointer; background: #FFF; border-bottom:1px solid #ddd; height:40px; line-height: 40px; padding-left:20px;}
    .line-list{ position:relative; top:0;left:0; }

  }


  // .warning-tips{position:fixed; bottom:0; background: #FFF; height:80px;  border: 1px solid #828790;left:7px;right:7px;
  //     dl,dt,dd{margin:0;padding:0;}
  //     dl{padding:10px;}
  //     dd{padding-top:8px;}
  //     dd span{ background:#ffcd40; border-radius: 3px; font-size:14px; display: inline-block; padding:1px 3px; margin-right:3px;}
  // }
</style>
