document.addEventListener('DOMContentLoaded', function() {
    const tooltipContainer = document.querySelector('.tooltip-container');
    const tooltipContent = document.querySelector('.tooltip-content');
    
    tooltipContainer.addEventListener('mouseenter', function() {
        tooltipContent.style.visibility = 'visible';
        tooltipContent.style.opacity = '1';
    });
    
    tooltipContainer.addEventListener('mouseleave', function() {
        tooltipContent.style.visibility = 'hidden';
        tooltipContent.style.opacity = '0';
    });
});