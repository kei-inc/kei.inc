document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const sections = document.querySelectorAll(".section");
  const header = document.querySelector(".sticky-header");
  const logo = header.querySelector(".logo img");
  const navLinks = header.querySelectorAll("nav a");
  const currentNavLink = document.querySelector("nav .current-page");

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      delay: 1,
      onEnter: () => updateStyles(section),
      onLeave: () => section.classList.remove("fadein-visible"),
      onEnterBack: () => updateStyles(section),
      onLeaveBack: () => section.classList.remove("fadein-visible"),
    });

    if (index < sections.length - 1) {
      section.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (e.deltaY > 0 && index < sections.length - 1) {
          gsap.to(window, { duration: 1, scrollTo: sections[index + 1] });
        } else if (e.deltaY < 0 && index > 0) {
          gsap.to(window, { duration: 1, scrollTo: sections[index - 1] });
        }
      });
    }
  });

  function updateStyles(section) {
    const bgColor = section.dataset.bgColor;
    const textColor = section.dataset.textColor;
    const navColor = section.dataset.navColor;
    const logoColor = section.dataset.logoColor;

    document.body.style.backgroundColor = bgColor;
    header.style.backgroundColor = bgColor;
    logo.style.filter = `invert(${logoColor === "white" ? 1 : 0})`;

    section.style.color = textColor;
    section.classList.add("fadein-visible");

    navLinks.forEach((link) => {
      link.style.color = navColor;
    });

    currentNavLink.style.color = navColor;

    const texts = section.querySelectorAll("p");
    texts.forEach((text) => {
      text.style.color = textColor;
    });

    // Ensure vertical alignment consistency
    sections.forEach(sec => {
      sec.style.display = "flex";
      sec.style.alignItems = "center";
      sec.style.justifyContent = "center";
      sec.style.height = "100vh";
    });
  }
});
