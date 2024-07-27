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
    const { bgColor, textColor, navColor, logoColor } = section.dataset;

    document.body.style.backgroundColor = bgColor;
    header.style.backgroundColor = bgColor;
    logo.style.filter = `invert(${logoColor === "white" ? 1 : 0})`;

    section.style.color = textColor;
    section.classList.add("fadein-visible");

    navLinks.forEach(link => link.style.color = navColor);
    currentNavLink.style.color = navColor;

    section.querySelectorAll("p").forEach(text => text.style.color = textColor);
  }

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;

    const target = sections[index];
    const offset = index === sections.length - 1 ? target.offsetTop - 200 : target.offsetTop;

    gsap.to(window, {
      duration: 0.5,
      scrollTo: { y: offset, autoKill: false },
      onComplete: () => {
        isScrolling = false;
        updateStyles(target);
      }
    });
  }

  function handleScroll(e, index) {
    if (isScrolling) return;
    if (index === sections.length - 1) return; // Allow normal scrolling on the last section
    e.preventDefault();
    if (e.deltaY > 0 && index < sections.length - 1) {
      scrollToSection(index + 1);
    } else if (e.deltaY < 0 && index > 0) {
      scrollToSection(index - 1);
    }
  }

  function handleTouchStart(e) {
    startY = e.touches[0].clientY;
  }

  function handleTouchEnd(e, index) {
    if (isScrolling) return;
    if (index === sections.length - 1) return; // Allow normal scrolling on the last section
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;

    if (deltaY > 50 && index < sections.length - 1) {
      scrollToSection(index + 1);
    } else if (deltaY < -50 && index > 0) {
      scrollToSection(index - 1);
    }
  }

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

    section.addEventListener("wheel", e => handleScroll(e, index));
    section.addEventListener("touchstart", handleTouchStart);
    section.addEventListener("touchend", e => handleTouchEnd(e, index));
  });
});
