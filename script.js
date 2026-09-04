document.addEventListener('DOMContentLoaded', async () => {
    // Load header
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        try {
            const response = await fetch('/header.html');
            const headerHtml = await response.text();
            headerContainer.innerHTML = headerHtml;
            initBurgerMenu();
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }
});

function initBurgerMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !expanded);
            nav.setAttribute('aria-hidden', expanded);
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
            });
        });
    }
}
