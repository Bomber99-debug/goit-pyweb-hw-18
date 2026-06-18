(() => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".qa-nav-link[href]");

    navLinks.forEach((link) => {
        const linkPath = new URL(link.href, window.location.origin).pathname;

        if (linkPath === currentPath) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        }
    });

    const messages = document.querySelectorAll(".qa-message");

    messages.forEach((message) => {
        message.setAttribute("role", "status");

        window.setTimeout(() => {
            message.classList.add("is-hiding");
        }, 4500);
    });
})();