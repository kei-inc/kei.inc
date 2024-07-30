document.addEventListener("DOMContentLoaded", function () {
	let firstClick = true;
	
	function scrollToAnchor() {
		const anchor = document.getElementById('button-anchor');
		const headerHeight = document.querySelector('.sticky-header').offsetHeight;
		const yOffset = anchor.getBoundingClientRect().top + window.pageYOffset - headerHeight;
		window.scrollTo({top: yOffset, behavior: 'smooth'});
	}
	
	function showForm(formNumber) {
		const forms = document.querySelectorAll('.contactContainers > div');
		forms.forEach(form => form.classList.remove('active'));
		document.getElementById(`contact${formNumber}`).classList.add('active');
	
		// Update button states
		const buttons = document.querySelectorAll('.button-container button');
		buttons.forEach((btn, index) => {
			if (index + 1 === formNumber) {
				btn.classList.remove('inactive');
			} else {
				btn.classList.add('inactive');
			}
		});
	
		if (firstClick) {
			scrollToAnchor();
			firstClick = false;
		}
	}
	
	function initializeForms() {
		// Add click event listeners to buttons
		const buttons = document.querySelectorAll('.button-container button');
		buttons.forEach((btn, index) => {
			btn.addEventListener('click', () => showForm(index + 1));
		});
	
		// Show the first form by default without scrolling
		const forms = document.querySelectorAll('.contactContainers > div');
		forms.forEach(form => form.classList.remove('active'));
		document.getElementById('contact1').classList.add('active');
		document.getElementById('btn1').classList.remove('inactive');
	}
	
	// Wait for both the DOM and Typeform embed to load
	window.addEventListener('load', function() {
		setTimeout(initializeForms, 1000); // Adjust this delay if needed
	});});