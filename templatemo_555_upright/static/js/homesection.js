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
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    
    const newsItems = document.querySelectorAll('.tm-news-item');
    
    newsItems.forEach(item => {
        const cursorImage = item.getAttribute('data-cursor-image');
        
        // Mouse enter event - show the cursor image
        item.addEventListener('mouseenter', function() {
            console.log(item, "enter");
            customCursor.style.backgroundImage = `url(${cursorImage})`;
            customCursor.style.backgroundSize = 'cover';
            customCursor.classList.remove('leaving');
            customCursor.classList.add('active');
        });
        
        // Mouse leave event - hide the cursor image with animation
        item.addEventListener('mouseleave', function() {
            console.log(item, "leave");
            customCursor.classList.remove('active');
            customCursor.classList.add('leaving');
            customCursor.style.display = 'none';
            // Hide the cursor after animation completes
            setTimeout(() => {
                if (customCursor.classList.contains('leaving')) {
                    customCursor.style.display = 'none';
                }
            }, 300); // Match the animation duration (0.3s)
        });
        
        // Mouse move event - position the cursor
        item.addEventListener('mousemove', function(e) {
            customCursor.style.left = (e.clientX - 75) + 'px'; // Center horizontally
            customCursor.style.top = (e.clientY - 30) + 'px';  // Center vertically
            customCursor.style.display = 'block';
        });
    });
});

// 一下是3d tilt效果



document.addEventListener('DOMContentLoaded', function() {
// 选择所有需要添加3D倾斜效果的卡片
const cards = document.querySelectorAll('.js-tilt');

// 为每个卡片添加鼠标移动事件监听器
cards.forEach(card => {
    // 设置卡片的初始变换状态
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    
    // 添加鼠标移入事件
    card.addEventListener('mouseenter', function() {
        // 获取卡片中的子元素
        const icon = this.querySelector('.tm-feature-icon');
        const heading = this.querySelector('h4');
        const paragraph = this.querySelector('p');
        
        // 将子元素向前推
        if (icon) icon.style.transform = 'translateZ(60px)';
        if (heading) heading.style.transform = 'translateZ(40px)';
        if (paragraph) paragraph.style.transform = 'translateZ(20px)';
    });
    
    // 添加鼠标移出事件
    card.addEventListener('mouseleave', function() {
        // 重置卡片的变换状态
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        
        // 获取卡片中的子元素
        const icon = this.querySelector('.tm-feature-icon');
        const heading = this.querySelector('h4');
        const paragraph = this.querySelector('p');
        
        // 重置子元素的变换状态
        if (icon) icon.style.transform = 'translateZ(40px)';
        if (heading) heading.style.transform = 'translateZ(30px)';
        if (paragraph) paragraph.style.transform = 'translateZ(20px)';
    });
    
    // 添加鼠标移动事件
    card.addEventListener('mousemove', function(e) {
        // 计算鼠标在卡片上的相对位置
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // 鼠标在卡片上的X坐标
        const y = e.clientY - rect.top;  // 鼠标在卡片上的Y坐标
        
        // 计算卡片的中心点
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // 计算鼠标位置与中心点的差值，并归一化为-1到1之间
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // 计算倾斜角度，最大倾斜角度为12度
        const tiltX = deltaY * 12;
        const tiltY = -deltaX * 12;
        
        // 应用3D变换
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        
        // 添加光泽效果
        const glare = this.querySelector('.tm-glare');
        if (glare) {
            // 计算光泽效果的位置
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
        }
    });
});
});