document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up events');
  
  // Intersection observer for sticky header
  const header = document.querySelector('.sticky-header');
  const sentinelElement = document.createElement('div');
  sentinelElement.style.height = '50px';
  sentinelElement.style.position = 'absolute';
  sentinelElement.style.top = '0';
  sentinelElement.style.left = '0';
  sentinelElement.style.width = '100%';
  document.body.prepend(sentinelElement);
  
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
    {
      threshold: 0
    }
  );
  
  observer.observe(sentinelElement);
  
  // Lazy loading video with IntersectionObserver
  const video = document.getElementById('background-video');
  const desktopSource = document.getElementById('desktop-video');
  const mobileSource = document.getElementById('mobile-video');
  
  // Set up lazy loading
  function setupLazyVideo() {
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video is in view, load source
            const isMobile = window.innerWidth <= 768;
            const currentSource = isMobile ? mobileSource : desktopSource;
            
            if (!video.src || video.src !== currentSource.dataset.src) {
              video.src = currentSource.dataset.src;
              video.load();
              video.play().catch(error => {
                console.log("Video play failed:", error);
              });
            }
            
            // Don't unobserve so we can restart if needed
          }
        });
      }, {
        threshold: 0.1
      });
      
      videoObserver.observe(video);
    }
  }
  
  setupLazyVideo();
  
  // Get all work containers
  const workContainers = document.querySelectorAll('.workContainer');
  
  if (workContainers.length > 0) {
    workContainers.forEach(container => {
      container.style.display = 'none';
    });
    
    const randomIndex = Math.floor(Math.random() * workContainers.length);
    const selectedContainer = workContainers[randomIndex];
    
    const img = selectedContainer.querySelector('img');
    if (img) {
      const preloadImage = new Image();
      
      preloadImage.onload = () => {
        img.src = img.dataset.src;
        selectedContainer.style.display = 'contents';
      };
      
      preloadImage.src = img.dataset.src;
    } else {
      selectedContainer.style.display = 'contents';
    }
  }
});