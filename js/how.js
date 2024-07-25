document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const sections = document.querySelectorAll(".section");
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");

  let isScrolling = false;
  let startY = 0;

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateStyles(section),
      onLeave: () => section.classList.remove("fadein-visible"),
      onEnterBack: () => updateStyles(section),
      onLeaveBack: () => section.classList.remove("fadein-visible"),
    });

    // Wheel event listener for desktop
    section.addEventListener("wheel", (e) => {
      if (isScrolling) return;
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

  function updateStyles(section) {
    const bgColor = section.dataset.bgColor;
    const textColor = section.dataset.textColor;
    const navColor = section.dataset.navColor;
    const logoColor = section.dataset.logoColor;

    document.body.style.backgroundColor = bgColor;
    header.style.backgroundColor = bgColor;
    logo.style.filter = `invert(${logoColor === "white" ? 1 : 0})`;

    section.style.color = textColor;
    section.classList.add("fadein-visible");

    navLinks.forEach((link) => {
      link.style.color = navColor;
    });

    currentNavLink.style.color = navColor;

    const texts = section.querySelectorAll("p");
    texts.forEach((text) => {
      text.style.color = textColor;
    });
  }
});
