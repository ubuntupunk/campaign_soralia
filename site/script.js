// The header is inlined in each page so it paints with the document.
// This wires up the mobile menu and the grouped navigation dropdowns.
document.addEventListener('DOMContentLoaded', initNavigation);

function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const groups = Array.from(document.querySelectorAll('.nav-group'));
    const mobile = window.matchMedia('(max-width: 768px)');

    function setGroup(group, open) {
        const trigger = group.querySelector('.nav-trigger');
        if (!trigger) return;
        trigger.setAttribute('aria-expanded', String(open));
        group.classList.toggle('is-open', open);
    }

    function closeGroups(except) {
        groups.forEach(group => {
            if (group !== except) setGroup(group, false);
        });
    }

    function syncNav() {
        if (!nav || !burger) return;
        if (mobile.matches) {
            const open = burger.getAttribute('aria-expanded') === 'true';
            nav.setAttribute('aria-hidden', String(!open));
            if (!open) closeGroups();
        } else {
            nav.removeAttribute('aria-hidden');
            burger.setAttribute('aria-expanded', 'false');
        }
    }

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', String(!expanded));
            nav.setAttribute('aria-hidden', String(expanded));
            if (expanded) closeGroups();
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
                closeGroups();
            });
        });
    }

    groups.forEach(group => {
        const trigger = group.querySelector('.nav-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const open = trigger.getAttribute('aria-expanded') !== 'true';
            closeGroups(group);
            setGroup(group, open);
        });

        group.addEventListener('focusout', event => {
            if (!group.contains(event.relatedTarget)) setGroup(group, false);
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.nav-group')) closeGroups();
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;

        const open = groups.find(group =>
            group.querySelector('.nav-trigger')?.getAttribute('aria-expanded') === 'true'
        );

        if (open) {
            closeGroups();
            open.querySelector('.nav-trigger').focus();
        } else if (burger && burger.getAttribute('aria-expanded') === 'true') {
            burger.setAttribute('aria-expanded', 'false');
            if (nav) nav.setAttribute('aria-hidden', 'true');
            closeGroups();
            burger.focus();
        }
    });

    if (typeof mobile.addEventListener === 'function') {
        mobile.addEventListener('change', syncNav);
    }

    syncNav();
}
