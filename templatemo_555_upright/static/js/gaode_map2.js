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
        
        // 构建信息窗体内容
        // 构建信息窗体内容 - 完全无白边版本
let infoContent = `
    <div style="
        padding: 15px; 
        min-width: 220px; 
        max-width: 280px;
        background: linear-gradient(135deg,rgb(13, 152, 156) 0%,rgb(202, 194, 86) 100%);
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        font-family: 'Arial', sans-serif;
        color: white;
        position: relative;
        overflow: hidden;
        margin: 0 !important;
        border: none !important;
    ">
        <!-- 装饰性背景元素 -->
        <div style="
            position: absolute;
            top: -50px;
            right: -50px;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        "></div>
        
        <!-- 头部信息区域 -->
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            position: relative;
            z-index: 2;
        ">
            <div style="flex: 1; margin-right: 10px;">
                <h4 style="
                    margin: 0 0 8px 0; 
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    line-height: 1.3;
                ">${item.name}</h4>
                <p style="
                    margin: 0; 
                    font-weight: bold; 
                    color: #FFE066;
                    font-size: 15px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                ">¥${item.price}</p>
            </div>
            
            <!-- 圆形查看详情按钮 -->
            <button onclick="viewItemDetails()" 
                    style="
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        background: linear-gradient(45deg,rgb(137, 171, 229),rgb(239, 244, 250));
                        border: 2px solid rgba(255,255,255,0.3);
                        color: white;
                        cursor: pointer;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(255,107,107,0.4);
                        flex-shrink: 0;
                    "
                    onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(255,107,107,0.6)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(255,107,107,0.4)';"
                    title="查看详情">
                →
            </button>
        </div>
`;

// 如果有图片URL，添加图片显示
if (item.image_url && item.image_url.trim() !== '') {
    infoContent += `
        <div style="
            margin: 10px 0 0 0;
            position: relative;
            z-index: 2;
        ">
            <img src="${item.image_url}" 
                 alt="${item.name}" 
                 style="
                     width: 100%;
                     max-height: 120px;
                     object-fit: cover;
                     border-radius: 8px;
                     box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                     transition: transform 0.3s ease;
                 "
                 onmouseover="this.style.transform='scale(1.02)'"
                 onmouseout="this.style.transform='scale(1)'"
                 onerror="this.parentElement.style.display='none'">
        </div>
    `;
}

// 关闭div标签
infoContent += `
    </div>
`;
        // 创建信息窗体
        // let infoWindow = new AMap.InfoWindow({
        //     content: infoContent,
        //     offset: new AMap.Pixel(0, -30)
        // });
        let infoWindow = new AMap.InfoWindow({
    isCustom: true,  // 使用完全自定义模式
    content: infoContent,
    offset: new AMap.Pixel(0, -30),
    closeWhenClickMap: true
});

// 添加全局CSS样式来确保无白边
const style = document.createElement('style');
style.textContent = `
    .amap-info-window {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    
    .amap-info-window .amap-info-window-content {
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 0 !important;
    }
`;
document.head.appendChild(style);



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

function viewItemDetails() {
    window.location.href = '/details2';
}

// 监听按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-map').addEventListener('click', function() {
        // 获取筛选条件
        const minPrice = document.getElementById('price_min').value || 0;
        const maxPrice = document.getElementById('price_max').value || 10000000;
        const kindSelect = document.getElementById('contact-select-2');
        // id = contact-select-2 是为了和发布页面的那个类别输入框区分
        
        const kind = kindSelect.value === "all" ? ["elec", "cloth", "book", "run"] : [kindSelect.value];
        
        
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