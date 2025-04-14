document.addEventListener('DOMContentLoaded', function() {
	const container = document.querySelector('.pricingMatrix');
	const cards = container.querySelectorAll('div');
	const dots = document.querySelectorAll('.card-indicator .marker');
	
	// Set first dot as active initially
	dots[0].classList.add('active');
	
	// Update active dot when scrolling
	container.addEventListener('scroll', function() {
		// Calculate which card is most visible
		const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
		const scrollPosition = container.scrollLeft;
		const activeIndex = Math.round(scrollPosition / cardWidth);
		
		// Update dots
		dots.forEach((dot, index) => {
			dot.classList.toggle('active', index === activeIndex);
		});
	});
	
	// Optional: Make dots clickable to navigate to cards
	dots.forEach((dot, index) => {
		dot.addEventListener('click', function() {
			const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
			container.scrollTo({
				left: index * cardWidth,
				behavior: 'smooth'
			});
			
			// Update active dot
			dots.forEach((d, i) => {
				d.classList.toggle('active', i === index);
			});
		});
	});
});