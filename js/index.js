gsap.registerPlugin(TextPlugin, ScrollTrigger);

document.addEventListener('scroll', () => {
    const divs = document.querySelectorAll('.hidden-div');
    const scrollPosition = window.scrollY;

    divs.forEach((div, index) => {
        if (scrollPosition >= index * 300 && scrollPosition < (index + 1) * 300) {
            if (!div.classList.contains('visible')) {
                div.classList.add('visible');
                callAnimationFunction(div.id);
            }
        } else {
            if (div.classList.contains('visible')) {
                div.classList.remove('visible');
                gsap.to(div, { duration: 1, opacity: 0 });
            }
        }
    });
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

function frame1Function() {
    const div = document.getElementById('frame1');
    const text = div.getAttribute('data-text');
    const target = div.querySelector('p strong');
    gsap.to(div, { duration: 1, opacity: 1 });
    gsap.to(target, { duration: text.length * 0.1, text: text, ease: "none" });
}

function frame2Function() {
    const div = document.getElementById('frame2');
    const text = div.getAttribute('data-text');
    const target = div.querySelector('p strong');
    gsap.to(div, { duration: 1, opacity: 1 });
    gsap.to(target, { duration: text.length * 0.1, text: text, ease: "none" });
}

function frame3Function() {
    const div = document.getElementById('frame3');
    const text = div.getAttribute('data-text');
    const target = div.querySelector('p strong');
    gsap.to(div, { duration: 1, opacity: 1 });
    gsap.to(target, { duration: text.length * 0.1, text: text, ease: "none" });
}

function frame4Function() {
    const div = document.getElementById('frame4');
    const text = div.getAttribute('data-text');
    const target = div.querySelector('p strong');
    gsap.to(div, { duration: 1, opacity: 1 });
    gsap.to(target, { duration: text.length * 0.1, text: text, ease: "none" });
}

function frame5Function() {
    const div = document.getElementById('frame5');
    const text = div.getAttribute('data-text');
    const target = div.querySelector('p strong');
    gsap.to(div, { duration: 1, opacity: 1 });
    gsap.to(target, { duration: text.length * 0.1, text: text, ease: "none" });
}
