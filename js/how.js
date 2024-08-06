document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const sections = document.querySelectorAll(".section");
  const footer = document.querySelector("footer"); // Assuming your footer is the last element
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const mobileMenu = header.querySelector(".dropdown");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");

  let isScrolling = false;
  let startY = 0;
  let currentSection = null;

  function updateStyles(section) {
    const bgColor = section.dataset.bgColor;
    const textColor = section.dataset.textColor;
    const navColor = section.dataset.navColor;
    const logoColor = section.dataset.logoColor;
    const mobileMenuColor = section.dataset.logoColor;
    // document.querySelector("meta[name='theme-color']").setAttribute("content", bgColor);

    document.body.style.backgroundColor = bgColor;
    header.style.backgroundColor = bgColor;

    logo.style.filter = `invert(${logoColor === "white" ? 1 : 0})`;
    mobileMenu.style.filter = `invert(${mobileMenuColor === "white" ? 1 : 0})`;

    section.style.color = textColor;

    navLinks.forEach((link) => {
      link.style.color = navColor;
    });

    currentNavLink.style.color = navColor;

    const texts = section.querySelectorAll("p");
    texts.forEach((text) => {
      text.style.color = textColor;
    });
    //document.body.style.backgroundColor = bgColor;
  }

  function drawUnderline(element, progress = 1) {
    const container = document.getElementById("how-text");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const canvas = document.querySelector(".rough-underline-canvas");
    if (!canvas) return;

    const rc = rough.canvas(canvas);

    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = range.getClientRects();

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const startX = rect.left - containerRect.left;
      const endX = rect.right - containerRect.left;
      const y = rect.bottom - containerRect.top - rect.height * 0.1;

      const lineLength = (endX - startX) * progress;

      rc.line(startX, y, startX + lineLength, y, {
        roughness: 2,
        strokeWidth: 2,
        stroke: "#E2725B",
        bowing: 1,
      });

      if (
        i < rects.length - 1 &&
        rects[i + 1].left > rect.right &&
        progress === 1
      ) {
        const nextStartX = rects[i + 1].left - containerRect.left;
        const connectingY = y + rect.height * 0.3;

        rc.line(endX, y, nextStartX, connectingY, {
          roughness: 2,
          strokeWidth: 2,
          stroke: "#E2725B",
          bowing: 1,
        });
      }
    }
  }

  function setupCanvas() {
    const container = document.getElementById("how-text");
    if (!container) return;

    let canvas = container.querySelector(".rough-underline-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "rough-underline-canvas";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1";
      container.style.position = "relative";
      container.appendChild(canvas);
    }
    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    return canvas;
  }

  function clearCanvas() {
    const canvas = document.querySelector(".rough-underline-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function animateSection(
    section,
    focusElements,
    textElements,
    direction = "in"
  ) {
    if (currentSection === section && direction === "in") return;

    currentSection = section;

    updateStyles(section);
    setupCanvas();
    clearCanvas();

    gsap.killTweensOf(textElements);
    gsap.killTweensOf(section);

    if (direction === "in") {
      gsap.set(section, { autoAlpha: 1 });
      gsap.fromTo(
        textElements,
        { opacity: 0 },
        {
          opacity: 1,
          duration: .75,
          onUpdate: function () {
            clearCanvas();
            focusElements.forEach((el) => drawUnderline(el, this.progress()));
          },
          onComplete: () => {
            focusElements.forEach((el) => drawUnderline(el, 1));
          },
        }
      );
    } else {
      gsap.to(section, {
        autoAlpha: 0,
        duration: 0.75,
        onComplete: clearCanvas,
      });
    }
  }

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;
    const scrollToPosition =
      index === sections.length - 1
        ? { y: sections[index], offsetY: 200 }
        : sections[index];
    gsap.to(window, {
      duration: 0.8,
      scrollTo: scrollToPosition,
      autoKill: false,
      onComplete: () => {
        isScrolling = false;
        const focusElements = sections[index].querySelectorAll(".focus");
        const textElements = sections[index].querySelectorAll("p");
        animateSection(sections[index], focusElements, textElements, "in");
      },
    });
  }

  function handleWheel(e, index) {
    if (isScrolling) return;
    if (index === sections.length - 1 && e.deltaY > 0) return; // Allow normal scrolling on the last section
    if (index === sections.length - 1 && e.deltaY < 0) return; // Allow normal scrolling on the last section
    e.preventDefault();
    if (e.deltaY > 20 && index < sections.length - 1) {
      scrollToSection(index + 1);
    } else if (e.deltaY < -20 && index > 0) {
      scrollToSection(index - 1);
    }
  }

  function handleTouch(e, index) {
    if (isScrolling) return;
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;
    if (index === sections.length - 1 && deltaY > 0) return; // Allow normal scrolling on the last section
    if (index === sections.length - 1 && deltaY < 0) return; // Allow normal scrolling on the last section
    e.preventDefault();
    if (deltaY > 20 && index < sections.length - 1) {
      // Swipe up
      scrollToSection(index + 1);
    } else if (deltaY < -20 && index > 0) {
      // Swipe down
      scrollToSection(index - 1);
    }
  }

  sections.forEach((section, index) => {
    const focusElements = section.querySelectorAll(".focus");
    const textElements = section.querySelectorAll("p");

    ScrollTrigger.create({
      trigger: section,
      start: "top 50%", // Dynamic start point
      end: "bottom 50%", // Dynamic end point
      onEnter: () => {
        animateSection(section, focusElements, textElements, "in");
      },
      onLeave: () => {
        if (index !== sections.length - 1) {
          animateSection(section, focusElements, textElements, "out");
        }
      },
      onEnterBack: () => {
        animateSection(section, focusElements, textElements, "in");
      },
      onLeaveBack: () => {
        if (index !== sections.length - 1) {
          animateSection(section, focusElements, textElements, "out");
        }
      },
      scrub: 2,
    });

    section.addEventListener("wheel", (e) => handleWheel(e, index));
    section.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );
    section.addEventListener("touchend", (e) => handleTouch(e, index), {
      passive: true,
    });
  });

  // Snap back to the second-to-last section when scrolling up at the top of the final section
  const lastSection = sections[sections.length - 1];
  const secondLastSection = sections[sections.length - 2];

  ScrollTrigger.create({
    trigger: lastSection,
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onLeaveBack: () => {
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: secondLastSection},
        ease: "power1.inOut",
      });
    },
    scrub: true,
  });

  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: "top top",
      end: "bottom bottom",
      onEnter: () => {
        gsap.set(lastSection, { autoAlpha: 1 });
      },
      onLeaveBack: () => {
        gsap.set(lastSection, { autoAlpha: 1 });
      },
    });
  }

  window.addEventListener("resize", () => {
    setupCanvas();
    clearCanvas();
    ScrollTrigger.refresh();
    if (currentSection) {
      const focusElements = currentSection.querySelectorAll(".focus");
      focusElements.forEach((el) => drawUnderline(el));
    }
  });

  // Initial setup
  setupCanvas();
  clearCanvas();
  if (currentSection) {
    const focusElements = currentSection.querySelectorAll(".focus");
    focusElements.forEach((el) => drawUnderline(el));
  }
});
