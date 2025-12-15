// 独立的按钮点击逻辑：负责离场动画并跳转到主页面
window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("openButton");
    if (!button) return;

    button.addEventListener("click", (e) => {
        e.preventDefault();
        const overlay = document.querySelector(".overlay");
        if (overlay) {
            overlay.classList.add("exiting");
        }

        // 背景淡出动画
        document.body.style.transition = "opacity 1.5s ease";
        document.body.style.opacity = "0";

        setTimeout(() => {
            window.location.href = "wish.html";
        }, 1200);
    });
});
