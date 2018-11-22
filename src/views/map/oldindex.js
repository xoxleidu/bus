// 搜索
busLineSearch: function (event) {
  this.loadmap(this.busLineName)
},

//地图
loadmap(data){
  const map = new AMap.Map('container', {
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
