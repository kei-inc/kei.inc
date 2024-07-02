document.addEventListener('DOMContentLoaded', function() {
    const fixedText = document.getElementById('fixedText');
    const lineCanvas = document.getElementById('lineCanvas');
    const rc = rough.canvas(lineCanvas);
    resizeCanvas();
    let currentTextIndex = -1;

    const texts = [
        '<span class="strike-through" id="rough-strike">Hello World.</span> <strong>We are Kei?</strong>',
        '<strong>We are Kei?</strong>',
        '<strong>Kei<span class="unselect-text strike-through" id="straight-strike">?</span></strong>', 
        "<strong>Kei.</strong>",
        "<strong>Kei</strong> helps ",
        "<strong>Kei</strong> helps <span class='focus-text'>organizations</span>.",
        "<strong>Kei</strong> helps <span class='focus-text'>purpose-led</span> organizations.",
    ];

    function resizeCanvas() {
        lineCanvas.width = fixedText.offsetWidth;
        lineCanvas.height = fixedText.offsetHeight;
    }

    function drawLine() {
        resizeCanvas();
        const context = lineCanvas.getContext('2d');
        context.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        const spans = fixedText.querySelectorAll('.strike-through');
        spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const containerRect = fixedText.getBoundingClientRect();
            const startX = spanRect.left - containerRect.left;
            const startY = (spanRect.top + spanRect.bottom) / 2 - containerRect.top;
            const endX = spanRect.right - containerRect.left;
            const endY = startY;
            if (span.id === 'rough-strike'){
                drawSquigglyLine(startX, startY, endX, endY);
            }
            if (span.id === 'straight-strike') {
                drawStraightLine(startX, startY, endX, endY);
            }
        });
    }

    function drawSquigglyLine(startX, startY, endX, endY) {
        const points = [];
        const segmentCount = 30; 
        const frequency = 20; 
        const amplitude = 20; 
        for (let i = 0; i <= segmentCount; i++) {
            const t = i / segmentCount;
            const x = startX + t * (endX - startX);
            const y = startY + Math.sin(t * Math.PI * frequency) * amplitude; 
            points.push([x, y]);
        }
        rc.curve(points, {
            stroke: 'white',
            strokeWidth: 8,
            roughness: 2
        });
    }

    function drawStraightLine(startX, startY, endX, endY) {
        rc.line(startX, startY, endX, endY, {
            stroke: 'white',
            strokeWidth: 6,
            roughness: 2,
        });
    }
    
    // Initialize Typed.js
    const typed = new Typed('#fixedText', {
        strings: texts,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 2000,
        startDelay: 2000,
        smartbackspace: true,
        loop: false,
        onStringTyped: function() {
            drawLine();
        }
    });
});
