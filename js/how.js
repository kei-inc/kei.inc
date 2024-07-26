document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const sections = document.querySelectorAll(".section");
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");
  let isScrolling = false;
  let startY = 0;

  function updateStyles(section) {
    const bgColor = section.dataset.bgColor;
    const textColor = section.dataset.textColor;
    const navColor = section.dataset.navColor;
    const logoColor = section.dataset.logoColor;

    document.body.style.backgroundColor = bgColor;
    header.style.backgroundColor = bgColor;
    logo.style.filter = `invert(${logoColor === "white" ? 1 : 0})`;

    section.style.color = textColor;

    navLinks.forEach((link) => {
      link.style.color = navColor;
    });

    currentNavLink.style.color = navColor;

    const texts = section.querySelectorAll("p");
    texts.forEach((text) => {
      text.style.color = textColor;
    });
  }

  function animateSection(section, focusElements, textElements, direction = 'in') {
    if (currentSection === section && direction === 'in') return;
    currentSection = section;

    updateStyles(section);

    gsap.killTweensOf(textElements);
    gsap.killTweensOf(section);

    if (direction === 'in') {
      gsap.set(section, { autoAlpha: 1 });
      gsap.fromTo(textElements,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
        }
      );
    } else {
      gsap.to(section, { autoAlpha: 0, duration: 0.3 });
    }
  }

  sections.forEach((section, index) => {
    const focusElements = section.querySelectorAll('.focus');
    const textElements = section.querySelectorAll('p');

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => animateSection(section, focusElements, textElements, 'in'),
      onLeave: () => animateSection(section, focusElements, textElements, 'out'),
      onEnterBack: () => animateSection(section, focusElements, textElements, 'in'),
      onLeaveBack: () => animateSection(section, focusElements, textElements, 'out'),
    });

    // Wheel event listener for desktop
    section.addEventListener("wheel", (e) => {
      if (isScrolling) return;
      if (index === sections.length - 1 && e.deltaY > 0) return; // Allow normal scrolling on the last section
      e.preventDefault();
      isScrolling = true;
      if (e.deltaY > 0 && index < sections.length - 1) {
        gsap.to(window, { duration: 0.5, scrollTo: sections[index + 1], onComplete: () => isScrolling = false });
      } else if (e.deltaY < 0 && index > 0) {
        gsap.to(window, { duration: 0.5, scrollTo: sections[index - 1], onComplete: () => isScrolling = false });
      } else {
        isScrolling = false;
      }
    });

    // Touch event listeners for mobile
    section.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
    });

    section.addEventListener("touchend", (e) => {
      if (isScrolling) return;
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      if (index === sections.length - 1 && deltaY > 50) return; // Allow normal scrolling on the last section
      isScrolling = true;
      if (deltaY > 50 && index < sections.length - 1) { // Swipe up
        gsap.to(window, { duration: 0.5, scrollTo: sections[index + 1], onComplete: () => isScrolling = false });
      } else if (deltaY < -50 && index > 0) { // Swipe down
        gsap.to(window, { duration: 0.5, scrollTo: sections[index - 1], onComplete: () => isScrolling = false });
      } else {
        isScrolling = false;
      }
    });
  });

  window.addEventListener('resize', () => {
    if (currentSection) {
      const focusElements = currentSection.querySelectorAll('.focus');
      focusElements.forEach(el => drawUnderline(el));
    }
  });
});
