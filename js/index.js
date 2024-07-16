document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    const fixedTextContainer = document.getElementById('fixed-text-container');
    const fixedText = document.getElementById('fixedText');
    const lineCanvas = document.getElementById('lineCanvas');
    const rc = rough.canvas(lineCanvas);
    let currentTextIndex = 0;
    let isAnimating = false;  // Flag to track if an animation is in progress
    let lastScrollTop = 0;  // Variable to keep track of the last scroll top position

    function resizeCanvas() {
        console.log("Resizing canvas");
        lineCanvas.width = fixedText.offsetWidth;
        lineCanvas.height = fixedText.offsetHeight;
        console.log(`Canvas size: ${lineCanvas.width}x${lineCanvas.height}`);
    }

    function clearCanvas() {
        console.log("Clearing canvas");
        const context = lineCanvas.getContext('2d');
        context.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    }

    function drawLine() {
        console.log("Drawing lines");
        resizeCanvas();
        const spans = fixedText.querySelectorAll('.strike-through');
        console.log(`Found ${spans.length} strike-through spans`);
        spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const containerRect = fixedText.getBoundingClientRect();
            const children = Array.from(span.childNodes);
            children.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const range = document.createRange();
                    range.selectNodeContents(child);
                    const rects = range.getClientRects();
                    Array.from(rects).forEach(rect => {
                        const startX = rect.left - containerRect.left;
                        const startY = (rect.top + rect.bottom) / 2 - containerRect.top;
                        const endX = rect.right - containerRect.left;
                        const endY = startY;
                        console.log(`Drawing line from (${startX}, ${startY}) to (${endX}, ${endY})`);
                        if (span.id === 'rough-strike') {
                            drawSquigglyLine(startX, startY, endX, endY);
                        }
                        if (span.id === 'straight-strike') {
                            drawStraightLine(startX, startY, endX, endY);
                        }
                    });
                }
            });
        });
    }

    function drawSquigglyLine(startX, startY, endX, endY) {
        console.log("Drawing squiggly line");
        const points = [];
        const segmentCount = 20;
        const frequency = 30;
        const amplitude = 15;
        for (let i = 0; i <= segmentCount; i++) {
            const t = i / segmentCount;
            const x = startX + t * (endX - startX);
            const y = startY + Math.sin(t * Math.PI * frequency) * amplitude;
            points.push([x, y]);
        }
        rc.curve(points, {
            stroke: '#efede4',
            strokeWidth: 14,
            roughness: 3,
        });
    }

    function drawStraightLine(startX, startY, endX, endY) {
        console.log("Drawing straight line");
        rc.line(startX, startY, endX, endY, {
            stroke: '#efede4',
            strokeWidth: 8,
            roughness: 1,
        });
    }

    function initTyped(text) {
        fixedText.innerHTML = ''; 
        clearCanvas(); 
        isAnimating = true;  // Set animation flag to true
        new Typed('#fixedText', {
            typeSpeed: 5,
            strings: [text],
            showCursor: false,
            onComplete: function() {
                setTimeout(function() {
                    drawLine();
                }, 400);
                isAnimating = false;  // Set animation flag to false when complete
            }
        });
    }

    const texts = [
        '<strong>We are Kei.</strong>',
        '<strong>Kei is a difference agency. </strong>',
        '<strong>And so Kei helps organizations make a difference?</strong>', 
        '<strong>Kei helps organizations<span class="unselect-text strike-through" id="rough-strike"> unlock actionable insights, gain competitive edges, seize untapped opportunities, predict future demand, and essentially just figure out what exactly is going on in the world and what can be done about it.?</span></strong>', 
        "<strong>Kei helps organizations discover patterns,<span class='unselect-text strike-through' id='rough-strike'> identify the most effective areas of action, drive transformative impact through cutting-edge strategy and innovative business design solutions, and did we already mention strategy and solutions and innovative and impact and transformative…?</span></strong>",
        "<strong>Kei helps organizations discover patterns, find focus<span class='unselect-text strike-through' id='rough-strike'> ideate, innovate, strategize, execute, conceptualize, optimize, synergize, disrupt, leverage, streamline, gamify, futureproof, blockchain-ify, growth-hack, paradigm-shift, thought-lead, cross-pollinate, mindshare-maximize, holisti-harmonize, quantum-leap, neuro-program, AI-ify, uber-ize, crypto-revolutionize, hyper-personalize, omni-orchestrate, meta-versify, cyber-synthesize, quantum-entangle, hyper-loop, singularity-approach, dark-disrupt, biohack, neuro-enhance, quantum-compute, hologram-project, time-warp, teleport, inter-brainstorm, gravity-defy, wormhole-traverse, multiverse-expand, antimatter-fuel, galactic-innovate, supernova-explode, black-hole-compress, cosmic-ray-infuse, parallel-pivot, big-bangify...</span></strong>",
        "<strong>Kei helps organizations discover patterns, find focus, create experiences,<span class='unselect-text strike-through' id='rough-strike'> and leverage brand synergies, amplify value propositions, drive stakeholder engagement, and nurture brand evangelists through immersive, omni-channel storytelling experiences that quantum-entangle consumer neurons, hyper-loop customer journeys through the metaverse, crypto-revolutionize brand loyalty with NFT-powered empathy tokens, and hologram-project value bombs directly into the limbic systems of target demographics while AI-powered narrative swarms colonize social media mindshare, blockchain-ifying every touchpoint into a singularity of brand love that transcends space-time, disrupts industry paradigms with antimatter-fueled innovation, and telepathically implants USPs into the collective unconscious of the global market, resulting in a supernova of viral engagement that black-hole-compresses sales funnels into instantaneous conversion events...</span></strong>",
        '<strong>Kei is a difference agency. </strong>',
        '<strong>Seriously now, what the hell is a difference agency?</strong> <br><br> Kei helps organizations find different ways of thinking, seeing and doing. Using systems thinking, we help detect patterns, uncover opportunities, create processes, and generally turn elusive ideas into tangible realities that make a difference.',
        '<strong>We make a difference. <br><br> It’s simple, really.</strong> ',
    ];

    document.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        if (!isAnimating) {
            if (scrollPosition > lastScrollTop && currentTextIndex < texts.length - 1) {
                // Scrolling down
                currentTextIndex++;
                initTyped(texts[currentTextIndex]);
            } else if (scrollPosition < lastScrollTop && currentTextIndex > 0) {
                // Scrolling up
                currentTextIndex--;
                initTyped(texts[currentTextIndex]);
            }
            lastScrollTop = scrollPosition;
        }
    });

    // Initial draw call
    initTyped(texts[currentTextIndex]);
});
