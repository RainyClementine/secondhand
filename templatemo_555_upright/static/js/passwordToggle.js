// passwordToggle.js
document.addEventListener('DOMContentLoaded', function() {
    // 为所有切换按钮添加点击事件
    document.querySelectorAll('.toggle-password').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.querySelector(targetId);
            const icon = this.querySelector('i');
            
            // 切换输入框类型
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // 切换图标
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
            
            // 更新提示文字
            this.setAttribute('title', isPassword ? '隐藏密码' : '显示密码');
        });
    });
});