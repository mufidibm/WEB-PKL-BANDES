document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
  }
});

 class CustomCarousel {
        constructor(element) {
          this.carousel = element;
          this.track = element.querySelector('#carouselTrack');
          this.slides = element.querySelectorAll('.carousel-slide');
          this.indicators = element.querySelectorAll('.carousel-indicator');
          this.prevBtn = element.querySelector('#prevBtn');
          this.nextBtn = element.querySelector('#nextBtn');
          this.progressBar = element.querySelector('#progressBar');
          
          this.currentSlide = 0;
          this.totalSlides = this.slides.length;
          this.isTransitioning = false;
          this.autoPlayInterval = null;
          this.progressInterval = null;
          this.autoPlayDuration = 5000;
          
          this.init();
        }

        init() {
          this.setupEventListeners();
          this.startAutoPlay();
          this.setupTouchGestures();
          this.setupKeyboardNavigation();
        }

        setupEventListeners() {
          // Navigation buttons
          this.prevBtn.addEventListener('click', () => this.prevSlide());
          this.nextBtn.addEventListener('click', () => this.nextSlide());

          // Indicators
          this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
          });

          // Pause on hover (desktop only)
          if (window.innerWidth > 768) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
          }

          // Visibility API for performance
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
              this.pauseAutoPlay();
            } else {
              this.startAutoPlay();
            }
          });
        }

        setupTouchGestures() {
          let startX = 0;
          let endX = 0;
          let startY = 0;
          let endY = 0;

          this.carousel.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
            this.pauseAutoPlay();
          });

          this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            endY = e.changedTouches[0].screenY;
            this.handleSwipe(startX, endX, startY, endY);
            this.startAutoPlay();
          });
        }

        setupKeyboardNavigation() {
          document.addEventListener('keydown', (e) => {
            if (this.carousel.matches(':hover') || this.carousel.contains(document.activeElement)) {
              if (e.key === 'ArrowLeft') this.prevSlide();
              if (e.key === 'ArrowRight') this.nextSlide();
              if (e.key >= '1' && e.key <= this.totalSlides.toString()) {
                this.goToSlide(parseInt(e.key) - 1);
              }
            }
          });
        }

        handleSwipe(startX, endX, startY, endY) {
          const swipeThreshold = 50;
          const diffX = startX - endX;
          const diffY = Math.abs(startY - endY);
          
          // Only handle horizontal swipes
          if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold) {
            if (diffX > 0) {
              this.nextSlide();
            } else {
              this.prevSlide();
            }
          }
        }

        goToSlide(slideIndex, direction = 'next') {
          if (this.isTransitioning || slideIndex === this.currentSlide) return;
          
          this.isTransitioning = true;
          
          // Update slides
          this.slides[this.currentSlide].classList.remove('active');
          this.slides[slideIndex].classList.add('active');
          
          // Add animation class
          const animationClass = direction === 'next' ? 'slide-enter-right' : 'slide-enter-left';
          this.slides[slideIndex].classList.add(animationClass);
          
          // Update indicators
          this.indicators[this.currentSlide].classList.remove('active');
          this.indicators[slideIndex].classList.add('active');
          
          // Move track
          const translateX = -(slideIndex * (100 / this.totalSlides));
          this.track.style.transform = `translateX(${translateX}%)`;
          
          this.currentSlide = slideIndex;
          
          // Reset progress
          this.resetProgress();
          
          // Clean up animation
          setTimeout(() => {
            this.slides[slideIndex].classList.remove(animationClass);
            this.isTransitioning = false;
          }, 600);
        }

        nextSlide() {
          const nextIndex = (this.currentSlide + 1) % this.totalSlides;
          this.goToSlide(nextIndex, 'next');
        }

        prevSlide() {
          const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
          this.goToSlide(prevIndex, 'prev');
        }

        startAutoPlay() {
          this.pauseAutoPlay(); // Clear any existing intervals
          this.startProgress();
          
          this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
          }, this.autoPlayDuration);
        }

        pauseAutoPlay() {
          if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
          }
          this.pauseProgress();
        }

        startProgress() {
          this.resetProgress();
          let progress = 0;
          
          this.progressInterval = setInterval(() => {
            progress += 100 / (this.autoPlayDuration / 100);
            this.progressBar.style.width = `${Math.min(progress, 100)}%`;
          }, 100);
        }

        pauseProgress() {
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }
        }

        resetProgress() {
          this.progressBar.style.width = '0%';
          this.pauseProgress();
        }
      }

      // Initialize carousel when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        const carousel = new CustomCarousel(document.getElementById('carousel'));
      });


      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Lazy loading optimization
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      } 