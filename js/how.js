document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");
  const triggerPosition = 0.5; // Adjust this value to control the appearance position

  const handleScroll = () => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

      if (rect.top <= windowHeight * triggerPosition && rect.bottom > windowHeight * triggerPosition) {
        console.log(`Section in view: ${section.dataset.bgColor}, ${section.dataset.textColor}, ${section.dataset.navColor}, ${section.dataset.logoColor}`);

        document.body.style.backgroundColor = section.dataset.bgColor;
        section.style.color = section.dataset.textColor;
        header.style.backgroundColor = section.dataset.bgColor;
        logo.style.filter = `invert(${section.dataset.logoColor === 'white' ? 1 : 0})`;

        navLinks.forEach(link => {
          link.style.color = section.dataset.navColor;
        });

        currentNavLink.style.color = section.dataset.navColor; // Set the current-page link color
        section.classList.add("fadein-visible");

        // Change the color of all text within the section
        const texts = section.querySelectorAll('p');
        texts.forEach(text => {
          text.style.color = section.dataset.textColor;
        });

      } else {
        section.classList.remove("fadein-visible");
      }
    });
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
});
