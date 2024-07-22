document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 768; // Adjust the width as needed for your definition of mobile
    const images = document.querySelectorAll('.case-study-image');
  
    if (isMobile) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Adjust threshold value as needed
      };
  
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          } else {
            entry.target.classList.remove('reveal');
          }
        });
      }, observerOptions);
  
      images.forEach(image => {
        observer.observe(image);
      });
    } else {
      images.forEach(image => {
        image.addEventListener('mouseover', () => {
          image.style.filter = 'unset';
        });
  
        image.addEventListener('mouseout', () => {
          image.style.filter = 'grayscale(100%)';
        });
      });
    }
  });
  