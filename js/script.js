
// navegação suave
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

// animação de fade-in ao fazer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// efeito no header ao fazer scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// adicionar partículas flutuantes no hero
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: float 6s linear infinite;
        left: ${Math.random() * 100}%;
        top: 100%;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-particles]')) {
        style.setAttribute('data-particles', 'true');
        document.head.appendChild(style);
    }
    
    document.querySelector('.hero').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

// criar partículas periodicamente
setInterval(createParticle, 300);

// Funcionalidade do Carrossel de Projetos

// Array para rastrear o slide atual de cada carrossel
let currentSlides = [];

// Inicializar carrosséis
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.project-carousel');
    currentSlides = new Array(carousels.length).fill(0);
    
    // Adicionar navegação por teclado
    document.addEventListener('keydown', handleKeyboardNavigation);
});

// Função para mudar de slide
function changeSlide(carouselIndex, direction) {
    const carousel = document.querySelectorAll('.project-carousel')[carouselIndex];
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    
    // Remover classe active do slide atual
    slides[currentSlides[carouselIndex]].classList.remove('active');
    indicators[currentSlides[carouselIndex]].classList.remove('active');
    
    // Calcular novo índice
    currentSlides[carouselIndex] += direction;
    
    // Loop circular
    if (currentSlides[carouselIndex] >= slides.length) {
        currentSlides[carouselIndex] = 0;
    } else if (currentSlides[carouselIndex] < 0) {
        currentSlides[carouselIndex] = slides.length - 1;
    }
    
    // Adicionar classe active ao novo slide
    slides[currentSlides[carouselIndex]].classList.add('active');
    indicators[currentSlides[carouselIndex]].classList.add('active');
}

// Função para ir diretamente para um slide específico
function goToSlide(carouselIndex, slideIndex) {
    const carousel = document.querySelectorAll('.project-carousel')[carouselIndex];
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    
    // Remover classe active do slide atual
    slides[currentSlides[carouselIndex]].classList.remove('active');
    indicators[currentSlides[carouselIndex]].classList.remove('active');
    
    // Atualizar índice
    currentSlides[carouselIndex] = slideIndex;
    
    // Adicionar classe active ao novo slide
    slides[currentSlides[carouselIndex]].classList.add('active');
    indicators[currentSlides[carouselIndex]].classList.add('active');
}

// Navegação por teclado (setas)
function handleKeyboardNavigation(e) {
    const carousels = document.querySelectorAll('.project-carousel');
    
    // Encontrar qual carrossel está em foco
    carousels.forEach((carousel, index) => {
        const rect = carousel.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                changeSlide(index, -1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                changeSlide(index, 1);
            }
        }
    });
}

// Navegação por toque para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.project-carousel');
    
    carousels.forEach((carousel, carouselIndex) => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carouselIndex);
        }, false);
        
        function handleSwipe(index) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - próximo slide
                    changeSlide(index, 1);
                } else {
                    // Swipe right - slide anterior
                    changeSlide(index, -1);
                }
            }
        }
    });
});