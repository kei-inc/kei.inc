document.addEventListener("DOMContentLoaded", () => {

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
});
  