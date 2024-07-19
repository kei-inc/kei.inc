document.addEventListener("DOMContentLoaded", function () {
    const textContainers = document.querySelectorAll(".text-container");
    const observerThreshold = 0.1; // Adjust this value to change when the animation triggers
    let currentAnimatingIndex = -1;
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(textContainers).indexOf(entry.target);
          if (currentAnimatingIndex === -1 || currentAnimatingIndex === index - 1) {
            playAnimation(index);
          }
        }
      });
    }, { threshold: observerThreshold });
  
    function playAnimation(index) {
      if (index >= textContainers.length) return;
      currentAnimatingIndex = index;
      const container = textContainers[index];
      container.classList.add("fadein-visible");
  
      container.addEventListener("animationend", () => {
        currentAnimatingIndex = -1;
        if (index + 1 < textContainers.length) {
          const nextContainer = textContainers[index + 1];
          if (nextContainer.getBoundingClientRect().top < window.innerHeight) {
            playAnimation(index + 1);
          }
        }
      }, { once: true });
    }
  
    textContainers.forEach((container) => {
      observer.observe(container);
    });
  });
  