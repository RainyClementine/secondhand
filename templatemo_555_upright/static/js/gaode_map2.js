// 这个地图是查看附近的物品的地图设置！
// 不要和另一个地图js搞混了
// 这个js里的map的名称叫map2 不要和另一个地图js里的map名称搞混

// 存储地图上的所有标记点
let markers = [];

// 初始化高德地图并获取定位
let currentPosition2 = null; // 当前经纬度
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
            currentPosition2 = {
                lng: result.position.lng,
                lat: result.position.lat
            };
            console.log('定位成功：', currentPosition2);
        } else {
            console.error('定位失败：', result);
            alert('定位失败，请检查浏览器权限或网络');
        }
    });
});

// 清除地图上所有标记
function clearAllMarkers() {
    if (markers.length > 0) {
        markers.forEach(marker => {
            map2.remove(marker);
        });
        markers = [];
    }
}

// 在地图上添加物品标记
function addItemsToMap(items) {
    // 先清除现有标记
    clearAllMarkers();
    
    // 为每个物品添加标记
    items.forEach(item => {
        // 创建标记
        let marker = new AMap.Marker({
            position: [item.longitude, item.latitude],
            title: item.name,
            map: map2
        });
        
        // 创建信息窗体
        let infoWindow = new AMap.InfoWindow({
            content: `<div>
                        <h4>${item.name}</h4>
                        <p>价格: ¥${item.price}</p>
                      </div>`,
            offset: new AMap.Pixel(0, -30)
        });
        
        // 点击标记时显示信息窗体
        marker.on('click', function() {
            infoWindow.open(map2, marker.getPosition());
        });
        
        // 将标记存储到数组中
        markers.push(marker);
    });
    
    // 如果有物品，将地图视图调整到包含所有标记的区域
    if (markers.length > 0) {
        map2.setFitView(markers);
    }
}

// 监听按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-map').addEventListener('click', function() {
        // 获取筛选条件
        const minPrice = document.getElementById('price_min').value || 0;
        const maxPrice = document.getElementById('price_max').value || 10000000;
        const kindSelect = document.getElementById('contact-select-2');
        // id = contact-select-2 是为了和发布页面的那个类别输入框区分
        
        
        const kind = kindSelect.value === "all" ? ["elec", "cloth", "book", "run"] : [kindSelect.value] ;
        console.log("ooo",kindSelect)
        console.log("ooo",kind)
        // 准备发送到后端的数据
        const filterData = {
            minprice: minPrice,
            maxprice: maxPrice,
            kindlist: kind 
        };
        
        // 使用Fetch API发送POST请求到后端
        fetch('/get_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filterData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('获取到物品:', data.items);
                // 在地图上显示物品
                addItemsToMap(data.items);
            } else {
                console.error('请求成功但返回错误:', data);
                alert('获取物品数据失败');
            }
        })
        .catch(error => {
            console.error('请求错误:', error);
            alert('请求错误: ' + error.message);
        });
    });
});


// let currentPosition2 = null; // 当前经纬度

// // 初始化高德地图并获取定位
// var map2 = new AMap.Map('amap-container-2', {
// zoom: 14,
// center: [116.397428, 39.90923]
// });

// AMap.plugin('AMap.Geolocation', function () {
// var geolocation = new AMap.Geolocation({
//     enableHighAccuracy: true,
//     timeout: 10000,
//     showMarker: true,
//     showCircle: true,
//     panToLocation: true,
//     zoomToAccuracy: true
// });
// map2.addControl(geolocation);

// geolocation.getCurrentPosition(function (status, result) {
//     if (status === 'complete') {
//     currentPosition = {
//         lng: result.position.lng,
//         lat: result.position.lat
//     };
//     console.log('定位成功：', currentPosition);
//     } else {
//     console.error('定位失败：', result);
//     alert('定位失败，请检查浏览器权限或网络');
//     }
// });
// });


// var data = [
    
// ];

// var infoWindow = new AMap.InfoWindow({
// offset: new AMap.Pixel(0, -30)
// });

// data.forEach(function (item) {
// var marker = new AMap.Marker({
//     position: item.position,
//     map: map2 // 注意是map2
// });

// marker.on('mouseover', function () {
//     infoWindow.setContent(item.info);
//     infoWindow.open(map2, marker.getPosition()); // 注意是map2
// });

// marker.on('mouseout', function () {
//     infoWindow.close();
// });
// });


// document.getElementById('btn-map').addEventListener('click', async function (e) {
//     e.preventDefault();

//     try {
//         const response = await fetch('/get_items', { method: 'GET' });
//         const data = await response.json();

//         if (data.success) {
//             const items = data.items;

//             const infoWindow = new AMap.InfoWindow({
//                 offset: new AMap.Pixel(0, -30)
//             });

//             items.forEach(function (item) {
//                 const marker = new AMap.Marker({
//                     position: [item.longitude, item.latitude],
//                     map: map2
//                 });

//                 marker.on('mouseover', function () {
//                     const content = `名称：${item.name}<br>价格：${item.price}元`;
//                     infoWindow.setContent(content);
//                     infoWindow.open(map2, marker.getPosition());
//                 });

//                 marker.on('mouseout', function () {
//                     infoWindow.close();
//                 });
//             });

//             alert('物品已加载到地图！');
//         } else {
//             alert('物品加载失败，请稍后重试。');
//         }
//     } catch (error) {
//         console.error('获取物品失败：', error);
//         alert('网络错误，无法加载物品');
//     }
// });
