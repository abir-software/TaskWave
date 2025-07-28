// Theme switching logic for TaskWave
// Theme switching functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const html = document.documentElement;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        html.classList.remove('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('theme', 'light');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
        
        // Dispatch event for other components to react to theme change
        document.dispatchEvent(new CustomEvent('themeChanged'));
        
        // Animate the toggle button
        gsap.to(themeToggle, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initTheme);

// Export for use in other modules
export function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}