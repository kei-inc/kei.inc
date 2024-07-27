document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const sections = document.querySelectorAll(".section");
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");
  let isScrolling = false;
  let startY = 0;
  let currentSection = null;

  /**
   * Updates the styles of the header, body, and section based on data attributes.
   *
   * @param {Element} section - The current section element.
   */
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

  /**
   * Draws an underline below the text elements.
   *
   * @param {Element} element - The element to underline.
   * @param {number} [progress=1] - The progress of the underline animation.
   */
  function drawUnderline(element, progress = 1) {
    const containerRect = document
      .getElementById("who-text")
      .getBoundingClientRect();
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

  /**
   * Sets up the canvas for drawing underlines.
   *
   * @returns {HTMLCanvasElement} - The canvas element.
   */
  function setupCanvas() {
    const container = document.getElementById("who-text");
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

  /**
   * Clears the canvas.
   */
  function clearCanvas() {
    const canvas = document.querySelector(".rough-underline-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Animates the section when entering or leaving the viewport.
   *
   * @param {Element} section - The section to animate.
   * @param {NodeListOf<Element>} focusElements - The elements to focus on.
   * @param {NodeListOf<Element>} textElements - The text elements to animate.
   * @param {string} [direction='in'] - The direction of the animation ('in' or 'out').
   */
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
          top: 0,
          opacity: 1,
          duration: 0.3,
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
        duration: 0.3,
        onComplete: clearCanvas,
      });
    }
  }

  /**
   * Scrolls to the specified section.
   *
   * @param {number} index - The index of the section to scroll to.
   */
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;
    const scrollToPosition =
      index === sections.length - 1
        ? { y: sections[index], offsetY: 140 }
        : sections[index];
    gsap.to(window, {
      duration: 0.5,
      scrollTo: scrollToPosition,
      onComplete: () => {
        isScrolling = false;
        const focusElements = sections[index].querySelectorAll(".focus");
        const textElements = sections[index].querySelectorAll("p");
        animateSection(sections[index], focusElements, textElements, "in");
      },
    });
  }

  /**
   * Handles the wheel event for scrolling between sections.
   *
   * @param {WheelEvent} e - The wheel event.
   * @param {number} index - The index of the current section.
   */
  function handleWheel(e, index) {
    if (isScrolling) return;
    if (index === sections.length - 1 && e.deltaY > 0) return; // Allow normal scrolling on the last section
    if (index === sections.length - 1 && e.deltaY < 0) return; // Allow normal scrolling on the last section

    e.preventDefault();
    if (e.deltaY > 0 && index < sections.length - 1) {
      scrollToSection(index + 1);
    } else if (e.deltaY < 0 && index > 0) {
      scrollToSection(index - 1);
    }
  }

  /**
   * Handles the touch event for scrolling between sections.
   *
   * @param {TouchEvent} e - The touch event.
   * @param {number} index - The index of the current section.
   */
  function handleTouch(e, index) {
    if (isScrolling) return;
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;
    if (index === sections.length - 1 && deltaY > 0) return; // Allow normal scrolling on the last section
    if (deltaY > 50 && index < sections.length - 1) {
      // Swipe up
      scrollToSection(index + 1);
    } else if (deltaY < -50 && index > 0) {
      // Swipe down
      scrollToSection(index - 1);
    }
  }

  sections.forEach((section, index) => {
    const focusElements = section.querySelectorAll(".focus");
    const textElements = section.querySelectorAll("p");

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => animateSection(section, focusElements, textElements, "in"),
      onLeave: () =>
        animateSection(section, focusElements, textElements, "out"),
      onEnterBack: () =>
        animateSection(section, focusElements, textElements, "in"),
      onLeaveBack: () =>
        animateSection(section, focusElements, textElements, "out"),
    });

    section.addEventListener("wheel", (e) => handleWheel(e, index));
    section.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
    });
    section.addEventListener("touchend", (e) => handleTouch(e, index));
  });

  setupCanvas();

  window.addEventListener("resize", () => {
    setupCanvas();
    clearCanvas();
    if (currentSection) {
      const focusElements = currentSection.querySelectorAll(".focus");
      focusElements.forEach((el) => drawUnderline(el));
    }
  });
});