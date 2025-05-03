
let currentPosition = null; // 当前经纬度

// 初始化高德地图并获取定位
var map = new AMap.Map('amap-container', {
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
map.addControl(geolocation);

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

// 拦截“发布”按钮提交事件
document.getElementById('contact-form').addEventListener('submit', function (e) {
e.preventDefault(); // 阻止默认表单提交

if (!currentPosition) {
    alert('正在获取定位信息，请稍候再试');
    return;
}

const formData = new FormData(this);

// 附加经纬度信息
formData.append('longitude', currentPosition.lng);
formData.append('latitude', currentPosition.lat);

// 替换为你后端接收接口地址（例如 /api/post_item）
fetch('/api/post_item', {
    method: 'POST',
    body: formData
})
.then(response => {
    if (response.ok) {
    alert('发布成功！');
    this.reset(); // 重置表单
    } else {
    alert('发布失败，请重试');
    }
})
.catch(error => {
    console.error('网络错误：', error);
    alert('网络错误，无法发布');
});
});

