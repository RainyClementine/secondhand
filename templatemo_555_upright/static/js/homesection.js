document.addEventListener('DOMContentLoaded', function () {
    // 获取轮播元素
    const carousel = document.querySelector('.tm-carousel');
    const items = document.querySelectorAll('.tm-carousel-item');
    const prevBtn = document.querySelector('.tm-carousel-control.prev');
    const nextBtn = document.querySelector('.tm-carousel-control.next');
    const indicatorsContainer = document.querySelector('.tm-carousel-indicators');

    let currentIndex = 0;
    let itemWidth;
    let itemsPerView;
    let maxIndex;

    // 根据视口宽度设置每次显示的数量
    function updateCarouselLayout() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth >= 1200) {
            itemsPerView = 4; // 大屏幕显示4个
        } else if (viewportWidth >= 992) {
            itemsPerView = 3; // 中等屏幕显示3个
        } else if (viewportWidth >= 768) {
            itemsPerView = 2; // 小屏幕显示2个
        } else {
            itemsPerView = 1; // 超小屏幕显示1个
        }

        // 计算每个项目的宽度
        const carouselViewport = carousel.parentElement;
        const carouselWidth = carouselViewport.clientWidth;
        const gap = viewportWidth <= 767 ? 0 : (viewportWidth <= 991 ? 15 : 20);

        // 考虑间隔的宽度计算
        const totalGapWidth = gap * (itemsPerView - 1);
        itemWidth = (carouselWidth - totalGapWidth) / itemsPerView;

        // 设置每个项目的宽度
        items.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
            item.style.flex = `0 0 ${itemWidth}px`;
        });

        // 更新最大索引
        maxIndex = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);

        // 重新设置轮播位置
        goToSlide(Math.min(currentIndex, maxIndex));

        // 更新指示器
        updateIndicators();
    }

    // 滑动到特定索引
    function goToSlide(index) {
        if (index < 0) {
            index = maxIndex;
        } else if (index > maxIndex) {
            index = 0;
        }

        currentIndex = index;

        // 计算位移值 (考虑间隔)
        const gap = window.innerWidth <= 767 ? 0 : (window.innerWidth <= 991 ? 15 : 20);
        const slideWidth = itemWidth + gap;
        const translateX = -1 * currentIndex * itemsPerView * slideWidth;

        carousel.style.transform = `translateX(${translateX}px)`;

        // 更新指示器状态
        updateIndicatorState();
    }

    // 更新指示器数量
    function updateIndicators() {
        // 清空现有指示器
        indicatorsContainer.innerHTML = '';

        // 创建新指示器
        for (let i = 0; i <= maxIndex; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'tm-carousel-indicator';
            if (i === currentIndex) {
                indicator.classList.add('active');
            }
            indicator.setAttribute('data-index', i);
            indicator.addEventListener('click', function () {
                goToSlide(parseInt(this.getAttribute('data-index')));
            });
            indicatorsContainer.appendChild(indicator);
        }
    }

    // 更新指示器状态
    function updateIndicatorState() {
        const indicators = document.querySelectorAll('.tm-carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 下一张幻灯片
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // 上一张幻灯片
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 初始化轮播
    updateCarouselLayout();

    // 绑定按钮事件
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 自动轮播
    let autoplayInterval = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动轮播
    const carouselContainer = document.querySelector('.tm-carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        // 暂停自动轮播
        clearInterval(autoplayInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        // 恢复自动轮播
        autoplayInterval = setInterval(nextSlide, 5000);
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动，显示下一项
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动，显示上一项
            prevSlide();
        }
    }

    // 监听窗口大小变化
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // 添加防抖动功能，避免频繁调整布局
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarouselLayout, 250);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const newsItems = document.querySelectorAll('.tm-news-item');
    
    newsItems.forEach(item => {
      item.addEventListener('mousemove', function(e) {
        // Calculate mouse position relative to the item
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS variables to store mouse position
        this.style.setProperty('--mouse-x', x + 'px');
        this.style.setProperty('--mouse-y', y + 'px');
      });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 创建自定义光标元素
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    
    // 获取所有新闻项目
    const newsItems = document.querySelectorAll('.tm-news-item');
    
    // 为每个新闻项目添加事件监听器
    newsItems.forEach(item => {
        // 获取该项目对应的光标图片路径
        const cursorImage = item.getAttribute('data-cursor-image');
        
        // 当鼠标进入新闻项目时
        item.addEventListener('mouseenter', function() {
            // 设置自定义光标的背景图片
            if (cursorImage) {
                customCursor.style.backgroundImage = `url('${cursorImage}')`;
            } else {
                // 默认图标，如果未指定图片
                customCursor.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>')`;
            }
            customCursor.classList.add('active');
        });
        
        // 当鼠标离开新闻项目时
        item.addEventListener('mouseleave', function() {
            customCursor.classList.remove('active');
        });
        
        // 跟踪鼠标在新闻项目上的移动
        item.addEventListener('mousemove', function(e) {
            // 偏移量使光标位于鼠标中心
            customCursor.style.left = (e.clientX - 24) + 'px';
            customCursor.style.top = (e.clientY - 24) + 'px';
        });
    });
});