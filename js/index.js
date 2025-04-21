document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up events');

  // Add background to header when scrolling
  window.addEventListener('scroll', function() {
    console.log('Scroll event fired');
    const header = document.querySelector('.sticky-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Video source switching for mobile
  const video = document.getElementById('background-video');
  const desktopSource = document.getElementById('desktop-video');
  const mobileSource = document.getElementById('mobile-video');
  
  function updateVideoSource() {
    const isMobile = window.innerWidth <= 768;
    const currentSource = isMobile ? mobileSource : desktopSource;
    const otherSource = isMobile ? desktopSource : mobileSource;
    
    // Remove the unused source to prevent preloading
    if (otherSource.parentNode) {
      otherSource.parentNode.removeChild(otherSource);
    }
    
    // Set the video source
    video.src = currentSource.src;
    video.load();
    
    // Attempt to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Video play failed:", error);
        // Try to play again on user interaction
        document.addEventListener('click', function playVideo() {
          video.play().catch(() => {});
          document.removeEventListener('click', playVideo);
        }, { once: true });
      });
    }
  }

  // Initial check
  updateVideoSource();

  // Update on resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateVideoSource, 250);
  });

  // Video debugging
  video.addEventListener('loadeddata', function() {
    console.log('Video loaded successfully');
  });

  video.addEventListener('error', function(e) {
    console.error('Error loading video:', e);
  });

  // Additional video debugging
  video.addEventListener('playing', function() {
    //console.log('Video is playing');
  });

  video.addEventListener('waiting', function() {
    //console.log('Video is waiting');
  });

  // Get all work containers
  const workContainers = document.querySelectorAll('.workContainer');
  
  if (workContainers.length > 0) {
    // Hide all containers first
    workContainers.forEach(container => {
      container.style.display = 'none';
    });
    
    // Select a random container
    const randomIndex = Math.floor(Math.random() * workContainers.length);
    const selectedContainer = workContainers[randomIndex];
    
    // Get the image element
    const img = selectedContainer.querySelector('img');
    if (img) {
      // Create a new image for preloading
      const preloadImage = new Image();
      
      // When the image is loaded, show the container
      preloadImage.onload = () => {
        // Set the src attribute only after preloading
        img.src = img.dataset.src;
        // Show the container
        selectedContainer.style.display = 'contents';
      };
      
      // Start loading the image
      preloadImage.src = img.dataset.src;
    } else {
      // If no image, just show the container
      selectedContainer.style.display = 'contents';
    }
  }
}); 