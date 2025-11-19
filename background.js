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
const graphs = 5;

// Track animation progress (0 to 1)
let animationProgress = 0;
const animationDuration = 300; // frames

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function getScale() {
    return Math.min(width, height) / 3 * Math.min(animationProgress * 2, 1);
}

function getPoint(graphIndex, theta) {
    const scale = getScale();
    let a, r, n;
    
    switch(graphIndex) {
        case 0: // Butterfly Curve
            a = (Math.exp(Math.cos(theta)) - 2 * Math.cos(4*theta) + Math.pow(Math.sin(theta/12), 5)) * scale;
            return {x: a * Math.cos(theta), y: a * Math.sin(theta)};
            
        case 1: // Rose Curve
            n = 5;
            a = (35 + 25 * Math.sin(time/100)) * (scale / 50);
            r = a * Math.sin(n * theta);
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
            
        case 2: // Cardioid
            a = (30 + 20 * Math.sin(time/80)) * (scale / 50);
            r = a * (1 + Math.cos(theta));
            return {x: r * Math.cos(theta), y: r * Math.sin(theta)};
            
        case 3: // Astroid
            a = (40 + 30 * Math.cos(time/120)) * (scale / 50);
            return {x: a * Math.pow(Math.cos(theta), 3), y: a * Math.pow(Math.sin(theta), 3)};
            
        case 4: // Lissajous Curve
            a = scale * 0.8;
            const A = 2, B = 3;
            return {
                x: a * Math.sin(A * theta + time/200),
                y: a * Math.sin(B * theta)
            };
            
        default:
            return {x: 0, y: 0};
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    // Clear with fade effect
    ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    
    // Start from bottom-right corner and move to center
    const startX = width * 0.8;
    const startY = height * 0.8;
    const endX = width / 2;
    const endY = height / 2;
    
    const currentX = lerp(startX, endX, animationProgress);
    const currentY = lerp(startY, endY, animationProgress);
    
    ctx.translate(currentX, currentY);
    
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
    
    // Graph styling with reduced opacity
    const opacity = 0.4 + 0.2 * Math.sin(time/50);
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
    ctx.stroke();
    
    ctx.restore();
    
    time += 1;
    transition += transitionSpeed;
    
    // Update animation progress
    if (animationProgress < 1) {
        animationProgress += 1 / animationDuration;
    }
    
    if (transition >= 1) {
        transition = 0;
        currentGraph = (currentGraph + 1) % graphs;
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
