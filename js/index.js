// index.js
gsap.registerPlugin(TextPlugin);

let typingSpeed = 50; // default typing speed
let messageGap = 200; // default gap between messages and bottom padding

// Control panel functionality
const typingSpeedSlider = document.getElementById('typingSpeed');
const messageGapInput = document.getElementById('messageGap');
const typingSpeedValue = document.getElementById('typingSpeedValue');

// Event listener for typing speed slider
typingSpeedSlider.addEventListener('input', function() {
    typingSpeed = parseInt(this.value);
    typingSpeedValue.textContent = this.value;
    console.log(`Updated typing speed: ${typingSpeed}`);
});

// Event listener for message gap input
messageGapInput.addEventListener('input', function() {
    messageGap = parseInt(this.value);
    document.querySelectorAll('.hidden-div').forEach(div => {
        div.style.paddingBottom = `${messageGap}px`;
    });
    console.log(`Updated message gap and bottom padding: ${messageGap} pixels`);
});

const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
        document.addEventListener('scroll', onScroll);
    }
});

function calculateDuration(textLength) {
    return textLength / typingSpeed;
}

function frameFunction(frameId) {
    const div = document.getElementById(frameId);
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    tl.to(div, {
        y: -100,
        opacity: 1,
        duration: duration,
        text: {
            value: text,
            newClass: "visible-text",
            ease: "none"
        }
    });
}

function callAnimationFunction(id) {
    frameFunction(id);
}

function onScroll() {
    const svgOverlay = document.getElementById('svg-overlay');
    svgOverlay.classList.add('hidden');

    const divs = document.querySelectorAll('.hidden-div');
    const scrollPosition = window.scrollY;

    tl.clear(); // Clear any previous animations
    divs.forEach((div, index) => {
        if (scrollPosition >= index * (messageGap) && scrollPosition < (index + 1) * (messageGap)) {
            if (!div.classList.contains('visible')) {
                div.classList.add('visible');
                document.removeEventListener('scroll', onScroll);
                callAnimationFunction(div.id);
                tl.play();
            }
        }
    });
}

document.addEventListener('scroll', onScroll);
