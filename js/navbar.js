function loadNavbar(currentPage, isWhite) {
  const navbarHTML = `
	<ul class="menu">
	  <li><a href="/who.html" data-text="About Kei"${currentPage === 'who' ? ' class="current-page"' : ''}>About Kei</a></li>
	  <!--<li><a href="/how.html" data-text="How We Work"${currentPage === 'how' ? ' class="current-page"' : ''}>How We Work</a></li>-->
	  <li class="has-dropdown">
		<a href="/practices/" data-text="Practice Areas"${currentPage === 'practices' ? ' class="current-page"' : ''}>Practice Areas</a>
		<div class="practice-dropdown">
		  <div class="practice-dropdown-content">
			<a href="/practices/future-opportunities.html" data-text="Defining Future Opportunities">Defining Future Opportunities</a>
			<a href="/practices/brand-belief-systems.html" data-text="Building Brand Belief Systems">Building Brand Belief Systems</a>
			<a href="/practices/next-gen.html" data-text="Creating Next-Generation Experiences">Creating Next-Generation Experiences</a>
			<a href="/practices/places.html" data-text="Shaping Places & Communities">Shaping Places & Communities</a>
			<a href="/practices/sustained-change.html" data-text="Enabling Sustained Change">Enabling Sustained Change</a>
		  </div>
		</div>
	  </li>
	  <li><a href="/case-studies/" data-text="Our Work"${currentPage === 'work' ? ' class="current-page"' : ''}>Our Work</a></li>
	  <li><a href="/ai_engine/" data-text="AI Insight Engine"${currentPage === 'ai' ? ' class="current-page"' : ''}>AI Insight Engine</a></li>
	  <li><a href="/workshop/the_difference/" data-text="The Difference"${currentPage === 'difference' ? ' class="current-page"' : ''}>The Difference</a></li>
	  <li><a href="/contact.html" data-text="Contact"${currentPage === 'contact' ? ' class="current-page"' : ''}>Contact</a></li>
	</ul>
	<div class="dropdown">
	  <img src="/images/mobile-menu${isWhite ? '-white' : ''}.png" alt="Menu" class="dropbtn">
	  <div class="dropdown-content">
		<a href="/who.html"${currentPage === 'who' ? ' class="current-page"' : ''}>About Kei</a>
		<a href="/practices/"${currentPage === 'practices' ? ' class="current-page"' : ''}>Practice Areas</a>
		<a href="/case-studies/"${currentPage === 'work' ? ' class="current-page"' : ''}>Our Work</a>
		<a href="/ai_engine/"${currentPage === 'ai' ? ' class="current-page"' : ''}>AI Insight Engine</a>
		<a href="/workshop/the_difference/"${currentPage === 'difference' ? ' class="current-page"' : ''}>The Difference</a>
		<a href="/contact.html"${currentPage === 'contact' ? ' class="current-page"' : ''}>Contact</a>
	  </div>
	</div>
  `;
  
  const headerElement = document.querySelector('nav');
  if (headerElement) {
	headerElement.innerHTML = navbarHTML;
  }
}