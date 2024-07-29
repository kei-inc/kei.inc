document.addEventListener("DOMContentLoaded", function () {
	
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
	}
	
	function initializeForms() {
		// Add click event listeners to buttons
		for (let i = 1; i <= 4; i++) {
			document.getElementById(`btn${i}`).addEventListener('click', () => showForm(i));
		}
	
		// Show the first form by default
		showForm(1);
	}
	
	// Wait for both the DOM and Typeform embed to load
	window.addEventListener('load', function() {
		setTimeout(initializeForms, 1000); // Adjust this delay if needed
	});
});