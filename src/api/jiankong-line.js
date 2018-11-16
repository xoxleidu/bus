var god = {};
/***站点构造函数***/
function Station(name,line){
  this.name = name;
  this.bus = [];
  this.nextBus = [];//出站车辆
  this.line = line;
  //this.warningCallback = warningCallback||function(){};
}
//进站
Station.prototype.in = function(bus){
  var isInList = false;

  //根据进出站 加入进站数组或者出站数组
  if(bus.InOut == 1){
    this.bus.map(function(_bus){
      if(_bus.CarSign == bus.CarSign){
        //_bus.inTimer = bus.inTimer;//如果已经存在，更新bus的时间，用做滞站判断（不需要更新nextbus的时间，因为不参与滞站判断）
        _bus.updateTimer = bus.updateTimer;
        isInList = true;
      }
    });

    if(isInList == false){
      this.bus.push(bus);
    }
    if(this.bus.length >= 2 && !this.isFirst){
      this.line.warning("shuangche" , this);
    }
  }else{

    this.nextBus.map(function(_bus){
      if(_bus.CarSign == bus.CarSign){
        isInList = true;
      }
    });

    if(isInList == false){
      this.nextBus.push(bus);
    }
    if(this.nextBus.length >= 2 && !this.isFirst){
      this.line.warning("shuangche" , this);
    }

  }

}

Station.prototype.checkShuangche = function(){
  var result = false;
  if((this.bus.length >= 2  || this.nextBus.length >= 2) && !this.isFirst){
    result = true;
  }
  return result;
}

// //出站
// Station.prototype.out = function(outBus){
//   this.bus = this.bus.filter((bus)=>{
//     if(bus.CarSign ==outBus.CarSign){
//       return false;
//     }
//   })
// }



/***线路构造函数***/
function Line(data,isWatch){
  this.isWatch = isWatch;
  this.stations = [];//站点列表
  data.SiteList2 = JSON.parse(data.SiteList2);
  data.SiteList = JSON.parse(data.SiteList);
  this.data = data;//记录站点数据
  this.busMap = {};//车辆所属站点，用于快速获取车辆在哪个站点
  this.init();
    // setInterval(()=>{
    //   if(GJCONFIG.setting.StagnantStop != "0" && isWatch){//滞站检测
    //     this.checkZhizhan();
    //   }
    //   this.checkOffline();
    // },2000);
}
Line.prototype.init = function(){
  this.data.SiteList.map((item,index)=>{
    this.stations.push(new Station(item.SiteName,this));
  });

  //每条线路的终点站和始发站做标记
  var up = this.data.SiteList2[0];//上行
  var down = this.data.SiteList2[1];//下行
  if(up.length){
    var uFirst = up[0]==0 ? 0:up[0];//上行第一个站点
    var uEnd = up[up.length-1]==0?0:up[up.length-1]; //上行最后一个站点
    var uEnd1 = up[up.length-2]==0?0:up[up.length-2]; //倒数第二个站点不检测双车
    this.stations[uFirst].isFirst = true;
    this.stations[uEnd].isFirst = true;
    this.stations[uEnd1].isFirst = true;//倒数第二个站点不检测双车
  }
  if(down.length){
    var dFirst = down[0]==0?0:down[0]; //下行第一个站点
    var dEnd = down[down.length-1]==0?0:down[down.length-1]; //下行最后一个站点
    if(uFirst == dEnd){//处理环线的倒数第二个站点
      var dEnd1 = down[down.length-3]==0?0:down[down.length-3]; //倒数第二个站点不检测双车
    }else{
      var dEnd1 = down[down.length-2]==0?0:down[down.length-2]; //倒数第二个站点不检测双车
    }
    this.stations[dFirst].isFirst = true;
    this.stations[dEnd].isFirst = true;
    this.stations[dEnd1].isFirst = true;
  }

}


Line.prototype.warning = function(type,station,bus){
  //"zhizhan" //滞站
  //"dajianju" //大间距
  //"shuangche" //双车
  if(type != "zhizhan"){
    god.warning(type,this.data.LineName,this,station);
  }else{
    //如果滞站，传入type(报警类型) LineName（线路名） Line（滞站线路） Station（滞站站点） Bus（滞站车辆）
    god.warning(type,this.LineName,this,station,bus);
  }
}
Line.prototype.in = function(bus){

  //bus.StationNumber = bus.StationNumber-1<0?0:bus.StationNumber-1;
  bus.inTimer = bus.updateTimer = new Date().getTime();//更新进站时间和数据更新时间
  var dict = this.data.SiteList2[bus.UpDown];
  var station = this.stations[dict[bus.StationNumber]];


  //保证车辆只存在一个站点中
  var newPosition = this.data.SiteList2[bus.UpDown][bus.StationNumber];
  var currentPosition = this.busMap[bus.CarSign];


  if(currentPosition!=undefined &&  this.stations[currentPosition]){
    var  busList = this.stations[currentPosition].bus;//进站车辆
    var  nextBusList = this.stations[currentPosition].nextBus; //出站车辆
    busList.map((item,index)=>{
      if(item.CarSign == bus.CarSign){
        busList.splice(index,1);//在之前的站点中删除该车
      }
    });
    nextBusList.map((item,index)=>{
      if(item.CarSign == bus.CarSign){
        nextBusList.splice(index,1);//在之前的站点中删除该车
      }
    });
  }
  //重新记录进站车辆位置

  station.in(bus);
  this.busMap[bus.CarSign] = newPosition;

  //大间距
  if(window.GJCONFIG.setting.Spacing !="0" && this.isWatch){
    this.checkDajianju();
  }
}

//检测双车
Line.prototype.checkShuangche = function(){
  var result = false;
  this.stations.map(station=>{
    if(station.checkShuangche()){
      result = true;
    }
  });
  return result;
}

//检测滞站
Line.prototype.checkZhizhan = function(){
   for(var key in this.busMap){
        var station = this.stations[this.busMap[key]];
        var currentTime = new Date().getTime();
        if(!station.isFirst){
          station.bus.map((bus)=>{//只检测进站所有的车辆的停留时长
            if(currentTime - bus.inTimer > GJCONFIG.setting.StagnantStop*60000){
              //console.log("zhizhan",this.data.LineName,station.name,bus.CarCard,bus.inTimer,bus);
              this.warning("zhizhan",station,bus);
              //bus.inTimer = new Date().getTime();//提示以后更新时间
            }
          });
        }
      }
}



//检测离线
Line.prototype.checkOffline = function(){
   for(var key in this.busMap){
        var station = this.stations[this.busMap[key]];
        var currentTime = new Date().getTime();
        if(!station.isFirst){
          station.bus.map((bus,index)=>{
            if(currentTime - bus.updateTimer > 180000){//3分钟没有收到定位数据、删除车辆
              station.bus.splice(index,1);
              delete this.busMap[key];
            }
          });
        }
      }
}



//大间距检测
Line.prototype.checkDajianju = function(callback){
  var result = false;//false=无大间距，true为有大间距
  this.data.SiteList2.map((updown,index)=>{//上下行分别检测
      var busPosition = [];
      updown.map((item,i)=>{
         var station = this.stations[i];
         if(station.bus.length || station.nextBus.length){
          busPosition.push(i);
         }
      });
      busPosition.map((a,index)=>{
        if(busPosition[index+1] && Math.abs(a-busPosition[index+1])>window.GJCONFIG.setting.Spacing){
          result = true;
        }
      });
  });
  if(result){
    this.warning("dajianju");
    if(typeof callback === "function"){
      callback(this.data.LineName);
    }
  }
  return result;
}


function formatTime(timeStr){
  //"20180205135130" to "2018-02-05 13:51:30"
  if(timeStr.length === 14){
    return timeStr.slice(0,4)+"-"+timeStr.slice(4,6)+"-"+timeStr.slice(6,8)+" "+timeStr.slice(8,10)+":"+timeStr.slice(10,12)+":"+timeStr.slice(12,14);
  }

}



/***初始化***/
god.lines = {};
import {lineData} from "@/API/"
god.init = function(lineData,isWatch){
  //isWatch 是否监控
lineData.List2 = JSON.parse(lineData.List2);
  lineData.List1.map(function(item){
    if(item.LineId <= 382){//只循环显示到38路
      god.lines[item.LineId] = new Line(item,isWatch);
    }
  });

  setInterval(()=>{
    for(var lineId in god.lines){
      var line = god.lines[lineId];
      if(GJCONFIG.setting.StagnantStop != "0" && isWatch){//滞站检测
        line.checkZhizhan();
      }
      line.checkOffline();
    }

  },2000);


}

god.message = function(bus){
  var line = god.lines[bus.RouteId];
  line.in(bus);
}
export {god}
