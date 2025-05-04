// 这个地图是查看附近的物品的地图设置！
// 不要和另一个地图js搞混了
// 这个js里的map的名称叫map2 不要和另一个地图js里的map名称搞混


let currentPosition2 = null; // 当前经纬度

// 初始化高德地图并获取定位
var map2 = new AMap.Map('amap-container-2', {
zoom: 14,
center: [116.397428, 39.90923]
});

AMap.plugin('AMap.Geolocation', function () {
var geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    showMarker: true,
    showCircle: true,
    panToLocation: true,
    zoomToAccuracy: true
});
map2.addControl(geolocation);

geolocation.getCurrentPosition(function (status, result) {
    if (status === 'complete') {
    currentPosition = {
        lng: result.position.lng,
        lat: result.position.lat
    };
    console.log('定位成功：', currentPosition);
    } else {
    console.error('定位失败：', result);
    alert('定位失败，请检查浏览器权限或网络');
    }
});
});


var data = [
    {
      position: [116.397428, 39.90923],
      info: '这是北京'
    },
    {
      position: [121.4737, 31.2304],
      info: '这是上海'
    },
    {
      position: [113.2644, 23.1291],
      info: '这是广州'
    }
  ];

  var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30)
  });
  
  data.forEach(function (item) {
    var marker = new AMap.Marker({
      position: item.position,
      map: map2 // 注意是map2
    });
  
    marker.on('mouseover', function () {
      infoWindow.setContent(item.info);
      infoWindow.open(map2, marker.getPosition()); // 注意是map2
    });
  
    marker.on('mouseout', function () {
      infoWindow.close();
    });
  });