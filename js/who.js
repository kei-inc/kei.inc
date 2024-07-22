document.addEventListener("DOMContentLoaded", function () {
  const textContainers = document.querySelectorAll(".text-container");
  const triggerPosition = 0.5; // Adjust this value to control the appearance position

  const handleScroll = () => {
    textContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
      
      if (rect.top <= windowHeight * triggerPosition) {
        container.classList.add("fadein-visible");
      }
    });
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
});
