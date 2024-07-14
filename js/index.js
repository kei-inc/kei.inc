// index.js
gsap.registerPlugin(TextPlugin, ScrollTrigger);

let typingSpeed = 50; // default typing speed
let messageGap = 200; // default gap between messages and bottom padding

// Control panel functionality
const typingSpeedSlider = document.getElementById('typingSpeed');
const messageGapInput = document.getElementById('messageGap');
const typingSpeedValue = document.getElementById('typingSpeedValue');
const messageGapValue = document.getElementById('messageGapValue');

// Event listener for typing speed slider
typingSpeedSlider.addEventListener('input', function() {
    typingSpeed = parseInt(this.value);
    typingSpeedValue.textContent = this.value;
    console.log(`Updated typing speed: ${typingSpeed}`);
});

// Event listener for message gap input
messageGapInput.addEventListener('input', function() {
    messageGap = parseInt(this.value);
    messageGapValue.textContent = this.value;
    document.querySelectorAll('.hidden-div').forEach(div => {
        div.style.paddingBottom = `${messageGap}px`;
    });
    console.log(`Updated message gap and bottom padding: ${messageGap} pixels`);
});

function calculateDuration(textLength) {
    return textLength / typingSpeed;
}

function frameFunction(frameId) {
    const div = document.getElementById(frameId);
    const text = div.textContent; // Use textContent for typing effect
    const duration = calculateDuration(text.length);
    console.log(`Animating frame ${frameId} with duration ${duration}`);
    gsap.to(div, {
        y: -50,
        opacity: 1,
        duration: duration,
        text: {
            value: text,
            newClass: "visible-text",
            ease: "none"
        },
        scrollTrigger: {
            trigger: div,
            start: "top center",
            end: "bottom center",
            once: true, // Run the animation only once
            onEnter: () => console.log(`Entering ${frameId}`),
            onLeave: () => console.log(`Leaving ${frameId}`),
            onComplete: () => {
                console.log(`Animation completed for ${frameId}`);
            }
        }
    });
}

function callAnimationFunction(id) {
    frameFunction(id);
}

// Apply ScrollTrigger to all frames
document.querySelectorAll('.hidden-div').forEach(div => {
    callAnimationFunction(div.id);
});

// Hide the initial "Hello World" frame
document.getElementById('frame1').classList.add('hidden');

