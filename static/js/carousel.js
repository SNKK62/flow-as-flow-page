let currentSlide = 0;
const track = document.querySelector(".video-carousel-track");
const originalSlides = Array.from(document.querySelectorAll(".video-slide"));
const dotsContainer = document.getElementById("carousel-dots");
let autoPlayInterval = null;
const AUTO_PLAY_INTERVAL = 3000;

function getSlidesPerGroup() {
  const width = window.innerWidth;
  if (width >= 768) return 2; // Tablet and PC
  else if (width >= 640) return 1; // Mobile
  else return 1;
}

let slidesPerGroup = getSlidesPerGroup();

window.addEventListener("resize", () => {
  const newSlidesPerGroup = getSlidesPerGroup();
  if (newSlidesPerGroup !== slidesPerGroup) {
    location.reload();
  }
});

// Clone the slides for infinite scrolling
function cloneSlides() {
  const prepend = originalSlides.slice(-slidesPerGroup).map(el => el.cloneNode(true));
  const append = originalSlides.slice(0, slidesPerGroup).map(el => el.cloneNode(true));

  prepend.reverse().forEach(node => track.prepend(node));
  append.forEach(node => track.append(node));
}

cloneSlides();

let totalSlides = document.querySelectorAll(".video-slide").length;
const totalGroups = originalSlides.length;
const maxSlideIndex = totalGroups - 1;
let trueSlideIndex = 0;

// generate dots
for (let i = 0; i < totalGroups; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  dot.addEventListener("click", () => {
    currentSlide = i + slidesPerGroup;
    trueSlideIndex = i;
    updateCarousel();
    updateDots();
  });
  dotsContainer.appendChild(dot);
}

function updateDots() {
  const dots = document.querySelectorAll(".carousel-dots .dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === trueSlideIndex);
  });
}

function updateCarousel(animate = true) {
  if (autoPlayInterval !== null) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);
  }
  const slideWidth = track.clientWidth / slidesPerGroup;
  if (!animate) track.style.transition = "none";
  else track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  updateDots();
}

function nextSlide() {
  currentSlide++;
  trueSlideIndex = (trueSlideIndex + 1) % totalGroups;
  updateCarousel();
  // on reaching the last cloned slide, teleport to the first original slide
  if (currentSlide === totalSlides - slidesPerGroup) {
    setTimeout(() => {
      currentSlide = slidesPerGroup;
      updateCarousel(false);
    }, 500);
  }
}

function prevSlide() {
  currentSlide--;
  trueSlideIndex = (trueSlideIndex - 1 + totalGroups) % totalGroups;
  updateCarousel();
  // teleport to the last original slide when reaching the first cloned slide
  if (currentSlide === 0) {
    setTimeout(() => {
      currentSlide = originalSlides.length;
      updateCarousel(false);
    }, 500);
  }
}

// initial setup
window.addEventListener("resize", () => updateCarousel(false));
window.addEventListener("DOMContentLoaded", () => {
  currentSlide = slidesPerGroup;
  updateCarousel(false);
  updateDots();
});

autoPlayInterval = setInterval(() => {
  nextSlide();
}, AUTO_PLAY_INTERVAL);
