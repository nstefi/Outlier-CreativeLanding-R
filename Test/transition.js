// Add transition functionality
document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.querySelector('.explore-btn');
    const splashScreen = document.querySelector('.splash-screen');
    const mainContent = document.querySelector('.main-content');

    exploreBtn.addEventListener('click', () => {
        // Add exit class to splash screen
        splashScreen.classList.add('exit');
        
        // Show main content after splash screen animation
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 1000); // Match this timing with the CSS transition duration
    });
});