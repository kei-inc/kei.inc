document.addEventListener('DOMContentLoaded', function() {
    const fixedText = document.getElementById('fixedText');
    const lineCanvas = document.getElementById('lineCanvas');
    resizeCanvas();
    const rc = rough.canvas(lineCanvas);
    let currentTextIndex = -1;

    function resizeCanvas() {
        lineCanvas.width = fixedText.offsetWidth;
        lineCanvas.height = fixedText.offsetHeight;
    }

    function drawLine(text) {
        resizeCanvas();
        const context = lineCanvas.getContext('2d');
        context.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        const spans = fixedText.querySelectorAll('.strike-through');
        spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const containerRect = fixedText.getBoundingClientRect();
            const startX = spanRect.left - containerRect.left;
            const startY = (spanRect.top + spanRect.bottom) / 2 - containerRect.top ;
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
        const segmentCount = 30; // Increase the number of segments for smoother squiggles
        const frequency = 20; // Adjust frequency for more or fewer curves
        const amplitude = 20; // Adjust amplitude for larger or smaller squiggles
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

    function drawStraightLine(text) {
        resizeCanvas();
        const context = lineCanvas.getContext('2d');
        context.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        const spans = fixedText.querySelectorAll('.strike-through');
        spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const containerRect = fixedText.getBoundingClientRect();
            const startX = spanRect.left - containerRect.left ;
            const startY = (spanRect.top + spanRect.bottom) / 2 - containerRect.top;
            const endX = spanRect.right - containerRect.left ;
            const endY = startY;
            rc.line(startX, startY, endX, endY, {
                stroke: 'white',
                strokeWidth: 6,
                roughness: 2,
            });
        });
    }

    document.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const texts = [
            '<strong>Hello World.</strong>',  
            'Hello World. <strong>We are Kei?</strong>',
            'world. <strong>We are Kei?</strong>',
            '<strong>We are Kei?</strong>',
            '<strong> are Kei?</strong>',
            '<strong>Kei<span class="unselect-text">?</span></strong>', 
            '<strong>Kei<span class="unselect-text strike-through" id="straight-strike">?</span></strong>', 
            "<strong>Kei.</strong>",
            "<strong>Kei</strong> helps organizations.",
            '<span class="strike-through" id="straight-strike">What is</span>&nbsp;Kei<span class="strike-through" id="straight-strike">?</span>',
            'Kei',
            'Kei is',
            'Kei is a',
            'Kei is a <span class="highlight">Swiss Army knife. </span>',
            'Kei is a <span class="strike-through highlight" id="rough-strike">Swiss Army knife.</span>',
            'Kei is a',
            'Kei is a <span class="highlight">force multiplier.</span>',
            'Kei is a <span class="strike-through highlight" id="rough-strike">force multiplier.</span>',
            'Kei is a <span class="highlight">full-service agency</span>',
            'Kei is a full-service agency <span class="highlight">designed to accelerate the pace and scale </span>',
            'Kei is a full-service agency designed to accelerate the pace and scale <span class="highlight">of purpose-led organizations. </span>',
            'Kei is a full-service agency designed to accelerate the pace and scale of purpose-led organizations. <br> <br><span class="highlight"> We help purpose-led organizations </span>',
            'Kei is a full-service agency designed to accelerate the pace and scale of purpose-led organizations. <br> <br> We help purpose-led organizations <span class="highlight"> identify trends, competitive context, opportunities, and potential demand through customer, cultural and market research </span>',
            ];
        const index = Math.floor(scrollPosition / 300);

        if (index < texts.length) {
            if (index !== currentTextIndex) {
                fixedText.innerHTML = texts[index];
                currentTextIndex = index;
                drawLine();
            }
        } else {
            if (currentTextIndex !== texts.length - 1) {
                fixedText.innerHTML = texts[texts.length - 1];
                currentTextIndex = texts.length - 1;
                drawLine();
            }
        }
    });
});

