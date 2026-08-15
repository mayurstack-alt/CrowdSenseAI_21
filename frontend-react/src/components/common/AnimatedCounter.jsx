import { useEffect, useRef } from 'react';

export default function AnimatedCounter({ target, duration = 1500, style = {} }) {
    const ref = useRef(null);
    const animated = useRef(false);

    useEffect(() => {
        if (animated.current || !ref.current) return;
        const num = parseFloat(target);
        if (isNaN(num)) { ref.current.textContent = target; return; }
        animated.current = true;
        const startTime = performance.now();
        function step(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            ref.current.textContent = Math.floor(eased * num).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else ref.current.textContent = num.toLocaleString();
        }
        requestAnimationFrame(step);
    }, [target, duration]);

    return <span ref={ref} style={style}>{typeof target === 'number' ? '0' : target}</span>;
}
