document.addEventListener('DOMContentLoaded', function() {
    // Initialize Font Awesome SVG with JavaScript
    const fas = document.querySelector('link[href*="all.css"]');
    if (fas) {
        const faScript = document.createElement('script');
        faScript.src = 'https://kit.fontawesome.com/your-kit-code.js';
        faScript.crossOrigin = 'anonymous';
        document.head.appendChild(faScript);
    }
});
