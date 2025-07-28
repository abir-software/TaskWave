// UI interaction logic for TaskWave
// UI Utility Functions

// Show toast notification
export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Change icon based on type
    const icon = toast.querySelector('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle mr-2 text-green-400';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle mr-2 text-red-400';
            break;
        case 'info':
            icon.className = 'fas fa-info-circle mr-2 text-blue-400';
            break;
        default:
            icon.className = 'fas fa-check-circle mr-2 text-green-400';
    }
    
    // Animate in
    gsap.to(toast, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    // Animate out after 3 seconds
    setTimeout(() => {
        gsap.to(toast, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in'
        });
    }, 3000);
}

// Initialize UI animations
export function initUIAnimations() {
    // Hero section animations
    gsap.from('.hero h2', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero p', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });
    
    gsap.from('.hero button', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.9,
        stagger: 0.2
    });
    
    // Feature cards animations
    gsap.from('.feature-card', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 1.2,
        stagger: 0.2
    });
    
    // Button hover animations
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const background = document.getElementById('3d-background');
        
        if (background) {
            background.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initUIAnimations);