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
            const startX = spanRect.left - containerRect.left + getRandomOffset();
            const startY = (spanRect.top + spanRect.bottom) / 2 - containerRect.top + getRandomOffset();
            const endX = spanRect.right - containerRect.left + getRandomOffset();
            const endY = startY + getRandomOffset();
            rc.line(startX, startY, endX, endY, {
                stroke: 'white',
                strokeWidth: 5,
                roughness: 3
            });
        });
    }

    function getRandomOffset() {
        return Math.random() * 10 - 5; 
    }

    document.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const texts = [
            'What is Kei?</span>',
            '<span class="strike-through">What is</span>&nbsp;Kei<span class="strike-through">?</span>',
            'Kei',
            'Kei is',
            'Kei is a',
            'Kei is a <span class="highlight">Swiss Army knife. </span>',
            'Kei is a <span class="strike-through highlight">Swiss Army knife.</span>',
            'Kei is a',
            'Kei is a <span class="highlight">force multiplier.</span>',
            'Kei is a <span class="strike-through highlight">force multiplier.</span>',
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

