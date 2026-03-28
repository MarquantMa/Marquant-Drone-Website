document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. Scroll Indicator Click ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const galleryContainer = document.querySelector('.gallery-container');
    
    scrollIndicator.addEventListener('click', () => {
        galleryContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // --- 4. Fetch and Render Portfolio ---
    const grid = document.getElementById('portfolio-grid');

    async function loadPortfolio() {
        try {
            // Fetch configuration JSON
            const response = await fetch('portfolio.json');
            if (!response.ok) throw new Error('Failed to load portfolio.json');
            const data = await response.json();
            
            // Build gallery HTML
            data.forEach((item, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                // Delay animation slightly based on index for a cascading effect
                galleryItem.style.transitionDelay = `${(index % 3) * 0.1}s`;
                
                galleryItem.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${item.src}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="gallery-overlay">
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-location">${item.location}</p>
                    </div>
                `;
                
                grid.appendChild(galleryItem);
            });
            
            // Setup Intersection Observer for scroll animations
            setupScrollAnimations();
            
        } catch (error) {
            console.error('Error loading portfolio:', error);
            grid.innerHTML = '<p style="text-align:center; width:100%;">Failed to load portfolio images. Make sure portfolio.json exists and is formatted correctly.</p>';
        }
    }

    // --- 5. Scroll Animations for Gallery Items ---
    function setupScrollAnimations() {
        const items = document.querySelectorAll('.gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once animated in
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of item is visible
            rootMargin: '0px 0px -50px 0px'
        });
        
        items.forEach(item => observer.observe(item));
    }

    // Initialize
    loadPortfolio();
});
