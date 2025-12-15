// 星空背景动画（从 stars.html 提取）
(() => {
    const starCanvas = document.getElementById("starCanvas");
    if (!starCanvas) return;

    const starCtx = starCanvas.getContext("2d");
    let starWidth = window.innerWidth;
    let starHeight = window.innerHeight;
    const starMaxStars = 1000; // Reduced count
    const stars = [];
    let starCount = 0;

    // 定义星星颜色类型：淡蓝色、白色、淡金色
    const starTypes = [
        { h: 210, s: 70, l: 80 }, // Pale Blue
        { h: 0, s: 0, l: 100 },   // White
        { h: 45, s: 80, l: 70 }   // Pale Gold
    ];

    // 为每种颜色生成缓存 Canvas
    const starCaches = starTypes.map(type => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 100;
        canvas.height = 100;
        const half = canvas.width / 2;
        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);

        // 核心发光点
        gradient.addColorStop(0.05, "#fff");
        // 主色调
        gradient.addColorStop(0.15, `hsl(${type.h}, ${type.s}%, ${type.l}%)`);
        // 边缘光晕 (更暗)
        gradient.addColorStop(0.3, `hsl(${type.h}, ${type.s}%, 10%)`);
        gradient.addColorStop(0.6, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(half, half, half, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
    });

    const random = (min, max) => {
        if (max === undefined) { max = min; min = 0; }
        if (min > max) [min, max] = [max, min];
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const maxOrbit = (x, y) => {
        const max = Math.max(x, y);
        const diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
    };

    let orbitCap = maxOrbit(starWidth, starHeight);

    const setSize = () => {
        starWidth = window.innerWidth;
        starHeight = window.innerHeight;
        starCanvas.width = starWidth;
        starCanvas.height = starHeight;
        orbitCap = maxOrbit(starWidth, starHeight);
    };

    class Star {
        constructor() {
            this.orbitRadius = random(orbitCap);
            this.radius = random(60, this.orbitRadius) / 12;
            this.orbitX = starWidth / 2;
            this.orbitY = starHeight / 2;
            this.timePassed = random(0, starMaxStars);
            this.speed = random(this.orbitRadius) / 50000;
            this.alpha = random(1, 5) / 20;

            // 随机分配一种颜色缓存
            this.cacheCanvas = starCaches[Math.floor(Math.random() * starCaches.length)];

            starCount++;
            stars[starCount] = this;
        }

        draw() {
            const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
            const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
            const twinkle = random(10);

            if (twinkle === 1 && this.alpha > 0) {
                this.alpha -= 0.025;
            } else if (twinkle === 2 && this.alpha < 0.5) {
                this.alpha += 0.025;
            }

            starCtx.globalAlpha = this.alpha;
            // 使用分配的缓存 Canvas 绘制
            starCtx.drawImage(this.cacheCanvas, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
            this.timePassed += this.speed;
        }
    }

    const initStars = () => {
        stars.length = 0;
        starCount = 0;
        for (let i = 0; i < starMaxStars; i++) {
            new Star();
        }
    };

    const animateStars = () => {
        starCtx.globalCompositeOperation = "source-over";
        starCtx.globalAlpha = 0.5;
        starCtx.fillStyle = "black";
        starCtx.fillRect(0, 0, starWidth, starHeight);

        starCtx.globalCompositeOperation = "lighter";
        for (let i = 1, l = stars.length; i < l; i++) {
            stars[i].draw();
        }

        requestAnimationFrame(animateStars);
    };

    window.addEventListener("resize", () => {
        setSize();
        initStars();
    });

    setSize();
    initStars();
    animateStars();
})();
