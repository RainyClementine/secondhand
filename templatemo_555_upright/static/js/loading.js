const loading = {
    container: document.querySelector(".loading"),
    in(target, direction) {
        if (direction === 'right') {
            this.container.classList.remove('slide-from-left', 'slide-center');
            this.container.classList.add('slide-from-right');
            
            // 缩短延迟时间从50ms到20ms
            setTimeout(() => {
                this.container.classList.remove('slide-from-right');
                this.container.classList.add('slide-center');
                
                // 缩短动画等待时间从1000ms到500ms
                setTimeout(() => {
                    window.location.href = target + '?slide=left';
                }, 500); // 原为1000
            }, 20); // 原为50
        } else {
            this.container.classList.remove('slide-from-right', 'slide-center');
            this.container.classList.add('slide-from-left');
            
            setTimeout(() => {
                this.container.classList.remove('slide-from-left');
                this.container.classList.add('slide-center');
                
                setTimeout(() => {
                    window.location.href = target + '?slide=right';
                }, 500); // 原为1000
            }, 20); // 原为50
        }
    },
    out() {
        const urlParams = new URLSearchParams(window.location.search);
        const slideDirection = urlParams.get('slide');
        
        if (slideDirection === 'left') {
            this.container.classList.remove('slide-center', 'slide-from-right');
            this.container.classList.add('slide-from-left');
        } else if (slideDirection === 'right') {
            this.container.classList.remove('slide-center', 'slide-from-left');
            this.container.classList.add('slide-from-right');
        } else {
            this.container.classList.remove('slide-center', 'slide-from-left');
            this.container.classList.add('slide-from-right');
        }
    }
};

window.addEventListener("load", () => {
    // 缩短初始加载延迟从500ms到300ms
    setTimeout(() => {
        loading.out();
    }, 500); // 原为500
})