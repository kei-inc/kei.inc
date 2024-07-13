// index.js
gsap.registerPlugin(TextPlugin);

document.addEventListener('scroll', () => {
    const divs = document.querySelectorAll('.hidden-div');
    const scrollPosition = window.scrollY;

    divs.forEach((div, index) => {
        if (scrollPosition >= index * (messageGap) && scrollPosition < (index + 1) * (messageGap)) {
            if (!div.classList.contains('visible')) {
                div.classList.add('visible');
                callAnimationFunction(div.id);
            }
        }
    });
});

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

function callAnimationFunction(id) {
    switch (id) {
        case 'frame1':
            frame1Function();
            break;
        case 'frame2':
            frame2Function();
            break;
        case 'frame3':
            frame3Function();
            break;
        case 'frame4':
            frame4Function();
            break;
        case 'frame5':
            frame5Function();
            break;
        default:
            console.log('Unknown frame ID');
    }
}

function calculateDuration(textLength) {
    return textLength / typingSpeed;
}

function frame1Function() {
    const div = document.getElementById('frame1');
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    gsap.to(div, {
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

function frame2Function() {
    const div = document.getElementById('frame2');
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    gsap.to(div, {
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

function frame3Function() {
    const div = document.getElementById('frame3');
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    gsap.to(div, {
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

function frame4Function() {
    const div = document.getElementById('frame4');
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    gsap.to(div, {
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

function frame5Function() {
    const div = document.getElementById('frame5');
    const text = div.textContent;
    const duration = calculateDuration(text.length);
    gsap.to(div, {
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
