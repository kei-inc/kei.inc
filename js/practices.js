document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('background-video');
  const loader = document.getElementById('video-loader');
  
  if (!video || !loader) return;
  
  // Function to remove spinner
  function removeSpinner() {
	loader.classList.add('hidden');
	// Remove from DOM after animation completes
	setTimeout(() => {
	  if (loader && loader.parentNode) {
		loader.parentNode.removeChild(loader);
	  }
	}, 300);
  }
  
  // Handle video events
  video.addEventListener('playing', () => {
	removeSpinner();
  });
  
  video.addEventListener('loadeddata', () => {
	// Try to play the video if it hasn't started playing yet
	if (video.paused) {
	  video.play().catch(error => {
		console.log("Video play failed:", error);
	  });
	}
  });
  
  video.addEventListener('error', (e) => {
	console.error('Error loading video:', e);
	removeSpinner();
  });
  
  // Initial attempt to play
  const playPromise = video.play();
  
  if (playPromise !== undefined) {
	playPromise.catch(error => {
	  console.log("Initial video play failed:", error);
	  // Try to play again on user interaction
	  document.addEventListener('click', () => {
		video.play().catch(error => {
		  console.log("Video play failed after click:", error);
		});
	  }, { once: true });
	});
  }
  
  // Debug video state
  setInterval(() => {
	if (loader && loader.parentNode) {
	  console.log('Video state:', {
		readyState: video.readyState,
		paused: video.paused,
		currentTime: video.currentTime,
		duration: video.duration,
		spinnerExists: !!loader.parentNode,
		spinnerHidden: loader.classList.contains('hidden')
	  });
	} else {
	  console.log('Video state:', {
		readyState: video.readyState,
		paused: video.paused,
		currentTime: video.currentTime,
		duration: video.duration,
		spinnerExists: false
	  });
	}
  }, 5000);
});