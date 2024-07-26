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
    
    
    /* --- vibrant planet carousel --- */
    const imageSlides = document.querySelectorAll('.image-container .slide');
    const textSlides = document.querySelectorAll('.text-content .slide');
    let currentSlide = 0;
    
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');
    
    function updateSlide() {
      imageSlides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.classList.add('active');
          textSlides[index].classList.add('active');
        } else {
          slide.classList.remove('active');
          textSlides[index].classList.remove('active');
        }
      });
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % imageSlides.length;
      updateSlide();
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + imageSlides.length) % imageSlides.length;
      updateSlide();
    }
    
    nextArrow.addEventListener('click', nextSlide);
    prevArrow.addEventListener('click', prevSlide);
  });
  