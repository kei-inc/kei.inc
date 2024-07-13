gsap.registerPlugin(TextPlugin);

document.addEventListener('scroll', () => {
    const divs = document.querySelectorAll('.hidden-div');
    const scrollPosition = window.scrollY;

    divs.forEach((div, index) => {
        if (scrollPosition >= index * 200 && scrollPosition < (index + 1) * 200) {
            if (!div.classList.contains('visible')) {
                div.classList.add('visible');
                callAnimationFunction(div.id);
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
    const text = document.getElementById('frame1').textContent;
    console.log(text); // This will log the text "Hello World" from the strong tag inside frame1
    gsap.to(div, { speed: 10, y:-100, opacity: 1,
        text: {
            value: text,
            newClass: "visible-text",
            delay: 20,
            duration:1,
            ease: "none",}
    });
    // Add custom logic here
}

function frame2Function() {
    const div = document.getElementById('frame2');
    const text = document.getElementById('frame2').textContent;
    console.log(text); // This will log the text "Hello World" from the strong tag inside frame1
    gsap.to(div, { speed: 10, y:-100, opacity: 1,
        text: {
            value: text,
            newClass: "visible-text",
            delay: 20,
            duration:1,
            ease: "none",}
    });
    // Add custom logic here
}


function frame3Function() {
    const div = document.getElementById('frame3');
    const text = document.getElementById('frame3').textContent;
    console.log(text); // This will log the text "Hello World" from the strong tag inside frame1
    gsap.to(div, { speed: 10, y:-100, opacity: 1,
        text: {
            value: text,
            newClass: "visible-text",
            delay: 20,
            duration:1,
            ease: "none",}
    });
    // Add custom logic here
}

function frame4Function() {
    const div = document.getElementById('frame4');
    const text = document.getElementById('frame4').textContent;
    console.log(text); // This will log the text "Hello World" from the strong tag inside frame1
    gsap.to(div, { speed: 10, y:-100, opacity: 1,
        text: {
            value: text,
            newClass: "visible-text",
            delay: 20,
            duration:1,
            ease: "none",}
    });
    // Add custom logic here
}

function frame5Function() {
    const div = document.getElementById('frame5');
    const text = document.getElementById('frame5').textContent;
    console.log(text); // This will log the text "Hello World" from the strong tag inside frame1
    gsap.to(div, { speed: 10, y:-100, opacity: 1,
        text: {
            value: text,
            newClass: "visible-text",
            delay: 20,
            duration:1,
            ease: "none",}
    });
    // Add custom logic here
}
