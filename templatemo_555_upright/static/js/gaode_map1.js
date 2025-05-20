// 这个地图是发布页面的地图设置
// 还有提交发布物品到后端的交互
let currentPosition = null; // 当前经纬度

// 初始化高德地图并获取定位
var map = new AMap.Map('amap-container-1', {
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
    console.log('完整定位结果:', result);
    } else {
    console.error('定位失败：', result);
    alert('定位失败，请检查浏览器权限或网络');
    }
});
});

// 拦截“发布”按钮提交事件
document.getElementById('btn-submit').addEventListener('click', async function (e) {
    e.preventDefault(); // 阻止默认表单提交

    if (!currentPosition) {
        alert('正在获取定位信息，请稍候再试');
        return;
    }

    const form = document.getElementById('contact-form'); 
    const formData = new FormData(form); 
    
    // 附加经纬度信息
    formData.append('longitude', currentPosition.lng);
    formData.append('latitude', currentPosition.lat);

    try {
        const response = await fetch('/post_item', {
            method: 'POST',
            body: formData
        });

        if (response.status === 200) {
            // 成功提交
            alert('发布成功！');
           
        } 
        else if (response.status === 403) {
            // 未登录
            alert('请先登录！');
            window.location.href = '/login_user'; // 跳转到登录页
        }
        else {
            // 其他错误
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.message || '发布失败，请重试';
            alert(errorMsg);
        }
    } 
    catch (error) {
        console.error('网络错误：', error);
        alert('网络错误，无法发布');
    }
});
// let currentPosition = null; // 当前经纬度

// // WGS-84 to GCJ-02 坐标转换函数
// function wgs84ToGcj02(lng, lat) {
//     // 定义常量
//     const PI = 3.14159265358979324;
//     const a = 6378245.0;
//     const ee = 0.00669342162296594323;
    
//     if (outOfChina(lng, lat)) {
//         return { lng, lat };
//     }
    
//     let dLat = transformLat(lng - 105.0, lat - 35.0);
//     let dLng = transformLng(lng - 105.0, lat - 35.0);
    
//     const radLat = lat / 180.0 * PI;
//     let magic = Math.sin(radLat);
//     magic = 1 - ee * magic * magic;
    
//     const sqrtMagic = Math.sqrt(magic);
//     dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
//     dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
    
//     return {
//         lat: lat + dLat,
//         lng: lng + dLng
//     };
// }

// // 判断坐标是否在中国范围外
// function outOfChina(lng, lat) {
//     if (lng < 72.004 || lng > 137.8347) {
//         return true;
//     }
//     if (lat < 0.8293 || lat > 55.8271) {
//         return true;
//     }
//     return false;
// }

// // 转换纬度
// function transformLat(x, y) {
//     let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
//     ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
//     ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
//     return ret;
// }

// // 转换经度
// function transformLng(x, y) {
//     let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
//     ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
//     ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
//     return ret;
// }

// // 初始化高德地图并获取定位
// var map = new AMap.Map('amap-container-1', {
//     zoom: 14,
//     center: [116.397428, 39.90923]
// });

// AMap.plugin('AMap.Geolocation', function () {
//     var geolocation = new AMap.Geolocation({
//         enableHighAccuracy: true,
//         timeout: 10000,
//         showMarker: true,
//         showCircle: true,
//         panToLocation: true,
//         zoomToAccuracy: true
//     });
    
//     map.addControl(geolocation);
    
//     geolocation.getCurrentPosition(function (status, result) {
//         if (status === 'complete') {
//             // 检查是否已经转换为GCJ-02坐标
//             if (result.isConverted === false) {
//                 // 需要将WGS-84坐标转换为GCJ-02坐标
//                 const convertedCoords = wgs84ToGcj02(result.position.lng, result.position.lat);
//                 currentPosition = {
//                     lng: convertedCoords.lng,
//                     lat: convertedCoords.lat
//                 };
//                 console.log('原始GPS坐标(WGS-84):', result.position);
//                 console.log('转换后坐标(GCJ-02):', currentPosition);
//             } else {
//                 // 已经是GCJ-02坐标，无需转换
//                 currentPosition = {
//                     lng: result.position.lng,
//                     lat: result.position.lat
//                 };
//             }
//             console.log('定位成功：', currentPosition);
//             console.log('完整定位结果:', result);
//         } else {
//             console.error('定位失败：', result);
//             alert('定位失败，请检查浏览器权限或网络');
//         }
//     });
// });

// // 拦截"发布"按钮提交事件
// document.getElementById('btn-submit').addEventListener('click', async function (e) {
//     e.preventDefault(); // 阻止默认表单提交
    
//     if (!currentPosition) {
//         alert('正在获取定位信息，请稍候再试');
//         return;
//     }
    
//     const form = document.getElementById('contact-form');
//     const formData = new FormData(form);
    
//     // 附加经纬度信息
//     formData.append('longitude', currentPosition.lng);
//     formData.append('latitude', currentPosition.lat);
    
//     try {
//         const response = await fetch('/post_item', {
//             method: 'POST',
//             body: formData
//         });
        
//         if (response.status === 200) {
//             // 成功提交
//             alert('发布成功！');
//         } else if (response.status === 403) {
//             // 未登录
//             alert('请先登录！');
//             window.location.href = '/login_user'; // 跳转到登录页
//         } else {
//             // 其他错误
//             const errorData = await response.json().catch(() => null);
//             const errorMsg = errorData?.message || '发布失败，请重试';
//             alert(errorMsg);
//         }
//     } catch (error) {
//         console.error('网络错误：', error);
//         alert('网络错误，无法发布');
//     }
// });