// Параллакс для плавающих иллюстраций в Hero-секции.
// Обычный скрипт (не ES-модуль) — подключается через <script src="...">,
// поэтому работает и при открытии страницы напрямую из файловой системы
// (file://), где ES-модули браузер блокирует по CORS.

window.SumrovJS = window.SumrovJS || {};

window.SumrovJS.initHeroParallax = function initHeroParallax(layer) {
    if (!layer) {
        return { dispose() { } };
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return { dispose() { } };
    }

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function tick() {
        current.x += (target.x - current.x) * 0.06;
        current.y += (target.y - current.y) * 0.06;
        const items = layer.querySelectorAll('[data-depth]');
        items.forEach((el) => {
            const d = Number(el.dataset.depth ?? 20);
            el.style.transform = `translate3d(${current.x * d}px, ${current.y * d}px, 0)`;
        });
        raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);

    return {
        dispose() {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
        },
    };
};
