const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let time = 0;
let currentGraph = 0;
let transition = 0;
const transitionSpeed = 0.004;
const graphs = 10;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function getScale() {
    return Math.min(width, height) / 4;
}

function getPoint(graphIndex, theta) {
    const scale = getScale();
    let a, r, n;
    
    switch(graphIndex) {
        case 0:
            a = (Math.exp(Math.cos(theta)) - 2 * Math.cos(4*theta) + Math.pow(Math.sin(theta/12), 5)) * scale;
            return {x: a * Math.cos(theta), y: a * Math.sin(theta)};
        case 1:
            n = 5;
            a = (35 + 25 * Math.sin(time/100)) * (scale / 50);
            r = a * Math.sin(n * theta);
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 2:
            a = (30 + 20 * Math.sin(time/80)) * (scale / 50);
            r = a * (1 + Math.cos(theta));
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 3:
            a = (40 + 30 * Math.cos(time/120)) * (scale / 50);
            return {x: a * Math.pow(Math.cos(theta), 3), y: a * Math.pow(Math.sin(theta), 3)};
        case 4:
            a = scale * 0.8;
            const A = 2, B = 3;
            return {
                x: a * Math.sin(A * theta + time/200),
                y: a * Math.sin(B * theta)
            };
        case 5:
            a = scale * 0.6;
            const k = 3.5;
            r = a * (k + 1) * Math.cos(theta) - a * Math.cos((k + 1) * theta);
            const r2 = a * (k + 1) * Math.sin(theta) - a * Math.sin((k + 1) * theta);
            return {x: r, y: r2};
        case 6:
            a = 0.1;
            r = scale * 0.3 * Math.exp(a * theta);
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 7:
            a = scale * 0.7;
            const R = 5, r_val = 3, d = 5;
            r = (R - r_val) * Math.cos(theta) + d * Math.cos(((R - r_val) / r_val) * theta);
            const r3 = (R - r_val) * Math.sin(theta) - d * Math.sin(((R - r_val) / r_val) * theta);
            return {x: r * 0.1, y: r3 * 0.1};
        case 8:
            a = scale * 0.4;
            r = a * Math.sin(theta) / theta;
            if (!isFinite(r)) r = a;
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 9:
            a = scale * 0.5;
            r = a * Math.pow(Math.sin(theta), 2) / (2 + Math.cos(theta));
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        default:
            return {x: 0, y: 0};
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    // Clear with more transparency
    ctx.fillStyle = 'rgba(5, 5, 16, 0.08)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    
    // Fixed position - emerges from bottom-right corner
    const offsetX = width * 0.3;
    const offsetY = height * 0.3;
    ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
    
    ctx.beginPath();
    const steps = 600;
    
    for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const p1 = getPoint(currentGraph, theta);
        const p2 = getPoint((currentGraph + 1) % graphs, theta);
        
        const x = lerp(p1.x, p2.x, transition);
        const y = lerp(p1.y, p2.y, transition);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    // Reduced opacity
    ctx.strokeStyle = `rgba(0, 255, 255, 0.4)`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
    ctx.stroke();
    
    ctx.restore();
    
    time += 1;
    transition += transitionSpeed;
    
    if (transition >= 1) {
        transition = 0;
        currentGraph = (currentGraph + 1) % graphs;
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
