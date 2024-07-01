document.addEventListener('DOMContentLoaded', function() {
    const fixedText = document.getElementById('fixedText');
    const lineCanvas = document.getElementById('lineCanvas');
    const rc = rough.canvas(lineCanvas);
    resizeCanvas();
    let currentTextIndex = -1;

    // Define texts with <ignore> tags
    const texts = [
        "Initializing…",
        "Hello world.",
        "Hello world. We are Kei?",
        "...world. We are Kei?←",
        "... are Kei?←",
        "Kei?",
        "Kei?",
        "Kei.",
        "· · ·",
        "Purpose-led.",
        "Kei.",
        "Kei helps organizations.",
        "Kei helps→→ organizations.",
        "Kei helps purpose-led organizations...",
        "· · ·",
        "Cutting the crap.",
        "Kei helps purpose-led organizations unlock actionable insights, gain competitive edges, seize untapped opportunities, predict future demand, and essentially just figure out what exactly is going on in the world and what on earth can be done about it",
        "Kei helps purpose-led organizations discover patterns, identify the most effective areas of action, drive transformative impact through cutting-edge strategy and innovative business design solutions, and did we already mention strategy and solutions and innovative and impact and transformative?",
        "Kei helps purpose-led organizations discover patterns, find focus, ideate, innovate, strategize, execute, conceptualize, optimize, synergize, disrupt, leverage, streamline, gamify, futureproof, blockchain-ify, growth-hack, paradigm-shift, thought-lead, cross-pollinate, mindshare-maximize, holisti-harmonize, quantum-leap, neuro-program, AI-ify, uber-ize, crypto-revolutionize, hyper-personalize, omni-orchestrate, meta-versify, cyber-synthesize, quantum-entangle, hyper-loop, singularity-approach, dark-disrupt, biohack, neuro-enhance, quantum-compute, hologram-project, time-warp, teleport, inter-brainstorm, gravity-defy, wormhole-traverse, multiverse-expand, antimatter-fuel, galactic-innovate, supernova-explode, black-hole-compress, cosmic-ray-infuse, parallel-pivot, big-bangify...",
        "Kei helps purpose-led organizations discover patterns, find focus, create experiences, and leverage brand synergies, amplify value propositions, drive stakeholder engagement, and nurture brand evangelists through immersive, omni-channel storytelling experiences that quantum-entangle consumer neurons, hyper-loop customer journeys through the metaverse, crypto-revolutionize brand loyalty with NFT-powered empathy tokens, and hologram-project value bombs directly into the limbic systems of target demographics while AI-powered narrative swarms colonize social media mindshare, blockchain-ifying every touchpoint into a singularity of brand love that transcends space-time, disrupts industry paradigms with antimatter-fueled innovation, and telepathically implants USPs into the collective unconscious of the global market, resulting in a supernova of viral engagement that black-hole-compresses sales funnels into instantaneous conversion events...",
        "Kei helps purpose-led organizations discover patterns, find focus, create experiences, and inspire audiences.",
        "There’s just one more thing.",
        "Kei helps purpose-led organizations apply systems thinking to discover patterns, find focus, create experiences, and inspire audiences.",
        "It’s simple, really.",
        "Would you like to know more?",
        "We work with organizations that want bright futures, for themselves and for the rest of us on this planet. We help them conjure up the things that let them make it happen.",
        "We believe that people who think solutions can be found are more likely to find them than those who don’t. As strategists, designers, futurists, researchers, storytellers, technologists, engineers, and entrepreneurs, we’ve helped some of the world’s best organizations grow, scale and amplify.",
        "Being optimistic doesn’t mean we aren’t realistic. We’ve been around. We understand the constraints — material, technological, logistical, social, and so on — faced by the brave and crazy people who hire us to help them make little dents in the universe. We understand growth, scale, and amplification. We’ve been there ourselves. The world is complicated, but that’s what we’re here for.",
        "Who we are"
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
        startDelay: 1000,
        loop: true,
        onComplete: function() {
            const ignoredElements = fixedText.querySelectorAll('.ignore');
            ignoredElements.forEach(el => el.style.display = 'none');
            drawLine();
        }
    });
});
