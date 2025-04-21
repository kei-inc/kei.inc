document.addEventListener('DOMContentLoaded', () => {
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