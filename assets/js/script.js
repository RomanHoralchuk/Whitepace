document.addEventListener("DOMContentLoaded", function () {
    // ==========================
    // Toggle menu
    // ==========================
    const toggleButton = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (toggleButton && navMenu) {
        toggleButton.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // ==========================
    // Анімація блоків при скролі
    // ==========================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right').forEach(element => {
        observer.observe(element);
    });

    // ==========================
    // Повноекранна заставка (Preloader)
    // ==========================
    window.addEventListener('load', () => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 500);
        }
    });

    // ==========================
    // Динамічний вивід відгуків та Карусель
    // ==========================

    const carousel = document.querySelector(".wt-testimonials-carousel");
    const dotsContainer = document.querySelector(".wt-dots");
    const JSON_PATH = 'assets/data/testimonials.json';

    let items = [];
    let itemsPerView;
    let totalSlides;
    let currentSlide = 0;
    let autoSlide;

    function createTestimonialItem(testimonial) {
        const item = document.createElement("div");
        item.classList.add("wt-testimonial-item");
        item.classList.add(testimonial.theme === 'dark' ? "wt-testimonial-item-dark" : "wt-testimonial-item-light");

        const themeClass = testimonial.theme === 'dark' ? 'dark' : 'light';

        item.innerHTML = `
            <div class="wt-quote-symbol"></div>
            <p class="wt-testimonial-text-${themeClass}">${testimonial.quote}</p>
            <div class="wt-client-details">
                <img src="${testimonial.image_src}" alt="Клієнт ${testimonial.name}">
                <div>
                    <h4 class="wt-client-name-${themeClass}">${testimonial.name}</h4>
                    <p class="wt-client-position-${themeClass}">${testimonial.position}</p>
                </div>
            </div>
        `;
        return item;
    }

    async function loadTestimonials() {
        try {
            const response = await fetch(JSON_PATH);
            const testimonialsData = await response.json();

            carousel.innerHTML = '';

            testimonialsData.forEach(data => {
                const item = createTestimonialItem(data);
                carousel.appendChild(item);
            });

            items = document.querySelectorAll(".wt-testimonial-item");

            initCarousel();

        } catch (error) {
            console.error('Помилка завантаження відгуків:', error);
        }
    }

    function calculateItemsPerView() {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        return 3;
    }

    function setupDots() {
        dotsContainer.innerHTML = "";
        itemsPerView = calculateItemsPerView();

        totalSlides = Math.max(0, items.length - (itemsPerView - 1));

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("span");
            if (i === currentSlide) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentSlide = i;
                updateCarousel();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        if (items.length === 0) return;

        const itemWidth = items[0].offsetWidth;
        const itemStyle = getComputedStyle(items[0]);
        const marginLeft = parseFloat(itemStyle.marginLeft);
        const marginRight = parseFloat(itemStyle.marginRight);
        const itemWidthWithMargin = itemWidth + marginLeft + marginRight;

        const offset = -itemWidthWithMargin * currentSlide;
        carousel.style.transform = `translateX(${offset}px)`;

        const dots = dotsContainer.querySelectorAll("span");
        dots.forEach((d, i) => {
            d.classList.toggle("active", i === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        if (totalSlides > 1) {
            autoSlide = setInterval(nextSlide, 4000);
        }
    }

    function initCarousel() {
        currentSlide = 0;
        setupDots();
        updateCarousel();
        resetAutoSlide();
    }

    loadTestimonials();
    window.addEventListener("resize", initCarousel);
});