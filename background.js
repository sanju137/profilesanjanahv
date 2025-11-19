const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let time = 0;
let currentGraph = 0;
let transition = 0;
const graphs = 4;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function getScale() {
    return Math.min(width, height) / 3;
}

function getPoint(graphIndex, theta) {
    const scale = getScale();
    let a, r;
    
    switch(graphIndex) {
        case 0:
            // Butterfly curve
            a = (Math.exp(Math.cos(theta)) - 2 * Math.cos(4*theta)) * scale;
            return {x: a * Math.cos(theta), y: a * Math.sin(theta)};
        case 1:
            // Rose curve
            a = (40 + 30 * Math.sin(time/100)) * (scale / 50);
            r = a * Math.sin(5*theta);
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 2:
            // Cardioid
            a = (35 + 25 * Math.sin(time/80)) * (scale / 50);
            r = a * (1 + Math.cos(theta));
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
        case 3:
            // Astroid
            a = (45 + 35 * Math.cos(time/120)) * (scale / 50);
            return {x: a * Math.pow(Math.cos(theta), 3), y: a * Math.pow(Math.sin(theta), 3)};
        default:
            return {x:0, y:0};
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    ctx.beginPath();
    const steps = 500;
    
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
    
    // Graph lines remain CYAN
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.stroke();
    ctx.restore();
    
    time += 1;
    transition += 0.005;
    
    if (transition >= 1) {
        transition = 0;
        currentGraph = (currentGraph + 1) % graphs;
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
