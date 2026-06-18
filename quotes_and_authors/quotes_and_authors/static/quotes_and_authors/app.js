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
(() => {
    const searchInput = document.querySelector("#quoteSearch");
    const clearButton = document.querySelector("[data-clear-quotes-search]");
    const quoteCards = Array.from(document.querySelectorAll("[data-quote-card]"));
    const filterButtons = document.querySelectorAll("[data-quote-filter]");
    const noResults = document.querySelector("[data-quotes-no-results]");

    if (!searchInput || quoteCards.length === 0) {
        return;
    }

    const normalize = (value) => value.toLowerCase().trim();

    const applyFilter = (rawValue) => {
        const value = normalize(rawValue);
        let visibleCount = 0;

        quoteCards.forEach((card) => {
            const text = normalize(card.dataset.searchText || "");
            const isVisible = value === "" || text.includes(value);

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    };

    searchInput.addEventListener("input", () => {
        applyFilter(searchInput.value);
    });

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            applyFilter("");
            searchInput.focus();
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            searchInput.value = button.dataset.quoteFilter || "";
            applyFilter(searchInput.value);
            searchInput.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
    });
})();