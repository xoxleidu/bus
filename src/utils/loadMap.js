export function MP(key) {
  const p1 =  new Promise(function (resolve, reject) {
    window.init = function () {
      console.log('script1-------onload');
      resolve(AMap)
    };
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//webapi.amap.com/maps?v=1.4.6&key="+key+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  });
  const p2 = new Promise(function (resolve,reject) {
    let script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//webapi.amap.com/ui/1.0/main-async.js";
    script2.onerror = reject;
    script2.onload = function(su){
      console.log('script2-------onload',su);
      resolve('success')
    };
    document.head.appendChild(script2);
  });
  return Promise.all([p1,p2])
    .then(function (result) {
      console.log('result----------->',result);
      return result[0]
    }).catch(e=>{
      console.log(e);})
};
