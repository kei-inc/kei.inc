document.addEventListener("DOMContentLoaded", function () {
    const textContainers = document.querySelectorAll(".text-container");
    const observerThreshold = .9; // Adjust this value to change when the animation triggers
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fadein-visible");
        }
      });
    }, { threshold: observerThreshold });
  
    textContainers.forEach((container) => {
      observer.observe(container);
    });
  });
  