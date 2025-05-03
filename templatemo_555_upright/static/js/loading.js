const loading = {
    container: document.querySelector(".loading"),
    in(target, direction) {
        // 从指定方向滑入中央
        if (direction === 'right') {
            this.container.classList.remove('slide-from-left', 'slide-center');
            this.container.classList.add('slide-from-right');
            
            // 短暂延迟后滑入中央
            setTimeout(() => {
                this.container.classList.remove('slide-from-right');
                this.container.classList.add('slide-center');
                
                // 等待动画完成后跳转，并在URL中添加动画方向信息
                setTimeout(() => {
                    // 跳转时传递信息：loading应该从哪个方向滑出
                    window.location.href = target + '?slide=left';
                }, 1000);
            }, 50);
        } else {
            this.container.classList.remove('slide-from-right', 'slide-center');
            this.container.classList.add('slide-from-left');
            
            setTimeout(() => {
                this.container.classList.remove('slide-from-left');
                this.container.classList.add('slide-center');
                
                setTimeout(() => {
                    window.location.href = target + '?slide=right';
                }, 1000);
            }, 50);
        }
    },
    out() {
        // 检查URL参数，决定从哪个方向滑出
        const urlParams = new URLSearchParams(window.location.search);
        const slideDirection = urlParams.get('slide');
        
        if (slideDirection === 'left') {
            this.container.classList.remove('slide-center', 'slide-from-right');
            this.container.classList.add('slide-from-left');
        } else if (slideDirection === 'right') {
            this.container.classList.remove('slide-center', 'slide-from-left');
            this.container.classList.add('slide-from-right');
        } else {
            // 默认情况下，初始加载时向右滑出
            this.container.classList.remove('slide-center', 'slide-from-left');
            this.container.classList.add('slide-from-right');
        }
    }
};

window.addEventListener("load", () => {
    // 短暂延迟后执行滑出动画
    setTimeout(() => {
        loading.out();
    }, 500);
});