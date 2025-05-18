document.addEventListener('DOMContentLoaded', function() {
    const portraitContainer = document.querySelector('.portrait-container');
    const transitionLine = document.querySelector('.transition-line');
    const portraitAfter = document.querySelector('.portrait-after');
    
    function updateTransition() {
        const containerHeight = portraitContainer.offsetHeight;
        const rect = portraitContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        let progress = 1 - (rect.bottom / viewportHeight);
        progress = Math.max(0, Math.min(1, progress*1.4));
        
        const linePosition = progress * containerHeight;
        transitionLine.style.transform = `translateY(${linePosition}px)`;
        portraitAfter.style.clipPath = `polygon(0 0, 100% 0, 100% ${linePosition}px, 0 ${linePosition}px)`;
    }
    
    updateTransition();
    window.addEventListener('scroll', updateTransition);
    window.addEventListener('resize', updateTransition);
});

document.addEventListener('DOMContentLoaded', function() {
    const portraitContainer = document.querySelector('.portrait-container');
    const portraitAfter = document.querySelector('.portrait-after');
    const transitionLine = document.querySelector('.transition-line');
    
    if (portraitContainer && portraitAfter && transitionLine) {
        portraitContainer.addEventListener('mousemove', function(e) {
            const containerRect = portraitContainer.getBoundingClientRect();
            const offsetY = e.clientY - containerRect.top;
            const heightPercentage = offsetY / containerRect.height * 100;
            
            portraitAfter.style.clipPath = `polygon(0 0, 100% 0, 100% ${heightPercentage}%, 0 ${heightPercentage}%)`;
            transitionLine.style.transform = `translateY(${offsetY}px)`;
        });
    }
    
    const recycleIcons = document.querySelectorAll('.recycle-icon');
    const probability = 0.25; 
    // 每秒有p的概率触发旋转
    function maybeRotateIcon(icon) {
        if (Math.random() < probability) {
            icon.classList.add('rotating');
            
            
            setTimeout(() => {
                icon.classList.remove('rotating');
            }, 400);
        }
    }

    
    setInterval(() => {
        recycleIcons.forEach(icon => {
            maybeRotateIcon(icon);
        });
    }, 1000);
});