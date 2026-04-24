const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const stickyCta = document.querySelector(".sticky-cta");
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const hero = document.querySelector(".hero");
let ticking = false;

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const heroHeight = hero ? hero.offsetHeight : 1;
  const progress = Math.min(scrollY / heroHeight, 1);

  if (stickyCta) {
    stickyCta.classList.toggle("is-visible", scrollY > heroHeight * 0.42);
  }

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.2);
      const y = scrollY * speed * -1;
      const glow = 1 + progress * 0.3;
      item.style.transform = `translate3d(0, ${y}px, 0) scale(${glow})`;
    });

    document.documentElement.style.setProperty("--scroll-glow", String(progress));
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollEffects();

document.querySelectorAll(".bundle-panel article").forEach((bundle) => {
  bundle.addEventListener("click", () => {
    document.querySelectorAll(".bundle-panel article").forEach((item) => {
      item.classList.remove("selected");
    });
    bundle.classList.add("selected");
  });
});
