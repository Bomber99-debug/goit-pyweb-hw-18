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
(() => {
    const form = document.querySelector("[data-add-quote-form]");

    if (!form) {
        return;
    }

    const quoteInput = form.querySelector("textarea");
    const authorField = form.querySelector(".add-quote-author-field select");
    const tagInputs = Array.from(form.querySelectorAll(".add-quote-tags input[type='checkbox']"));
    const counter = document.querySelector("[data-quote-counter]");
    const tagsCounter = document.querySelector("[data-tags-counter]");
    const previewText = document.querySelector("[data-quote-preview-text]");
    const previewAuthor = document.querySelector("[data-quote-preview-author]");
    const previewTags = document.querySelector("[data-quote-preview-tags]");
    const submitButton = document.querySelector("[data-add-quote-submit]");

    const emptyQuoteText = "Your quote will appear here.";
    const emptyAuthorText = "Select an author";
    const emptyTagsText = "No tags selected";

    const getSelectedAuthorText = () => {
        if (!authorField || !authorField.selectedOptions.length) {
            return emptyAuthorText;
        }

        const authorText = authorField.selectedOptions[0].textContent.trim();

        return authorText || emptyAuthorText;
    };

    const getSelectedTags = () => {
        return tagInputs
            .filter((input) => input.checked)
            .map((input) => {
                const label = input.closest("label");
                const labelText = label ? label.textContent.trim() : "";

                return labelText.replace(/\s+/g, " ");
            })
            .filter(Boolean);
    };

    const renderPreviewTags = (tags) => {
        if (!previewTags) {
            return;
        }

        previewTags.innerHTML = "";

        if (tags.length === 0) {
            const emptyTag = document.createElement("span");
            emptyTag.textContent = emptyTagsText;
            previewTags.append(emptyTag);
            return;
        }

        tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.textContent = `#${tag}`;
            previewTags.append(tagElement);
        });
    };

    const updatePreview = () => {
        const quoteValue = quoteInput ? quoteInput.value.trim() : "";
        const selectedTags = getSelectedTags();

        if (counter) {
            const quoteLength = quoteInput ? quoteInput.value.length : 0;
            counter.textContent = `${quoteLength} characters`;
        }

        if (tagsCounter) {
            tagsCounter.textContent = `${selectedTags.length} selected`;
        }

        if (previewText) {
            previewText.textContent = quoteValue || emptyQuoteText;
        }

        if (previewAuthor) {
            previewAuthor.textContent = getSelectedAuthorText();
        }

        renderPreviewTags(selectedTags);
    };

    if (quoteInput) {
        quoteInput.addEventListener("input", updatePreview);
    }

    if (authorField) {
        authorField.addEventListener("change", updatePreview);
    }

    tagInputs.forEach((input) => {
        input.addEventListener("change", updatePreview);
    });

    form.addEventListener("submit", () => {
        if (submitButton) {
            submitButton.classList.add("is-submitting");
            submitButton.textContent = "Saving...";
        }
    });

    updatePreview();
})();
(() => {
    const searchInput = document.querySelector("#authorSearch");
    const clearButton = document.querySelector("[data-clear-authors-search]");
    const authorCards = Array.from(document.querySelectorAll("[data-author-card]"));
    const authorLinks = Array.from(document.querySelectorAll("[data-author-link]"));
    const noResults = document.querySelector("[data-authors-no-results]");

    if (!searchInput || authorCards.length === 0) {
        return;
    }

    const normalize = (value) => value.toLowerCase().trim();

    const setActiveLink = (visibleCard) => {
        const activeId = visibleCard ? visibleCard.id : "";

        authorLinks.forEach((link) => {
            const linkId = link.getAttribute("href").replace("#", "");
            link.classList.toggle("is-active", linkId === activeId);
        });
    };

    const applyFilter = (rawValue) => {
        const value = normalize(rawValue);
        let visibleCount = 0;
        let firstVisibleCard = null;

        authorCards.forEach((card) => {
            const text = normalize(card.dataset.searchText || "");
            const isVisible = value === "" || text.includes(value);

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;

                if (!firstVisibleCard) {
                    firstVisibleCard = card;
                }
            }
        });

        authorLinks.forEach((link) => {
            const targetId = link.getAttribute("href").replace("#", "");
            const targetCard = document.getElementById(targetId);

            link.hidden = targetCard ? targetCard.hidden : false;
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }

        setActiveLink(firstVisibleCard);
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

    authorLinks.forEach((link) => {
        link.addEventListener("click", () => {
            authorLinks.forEach((item) => item.classList.remove("is-active"));
            link.classList.add("is-active");
        });
    });

    applyFilter("");
})();
(() => {
    const form = document.querySelector("[data-add-author-form]");

    if (!form) {
        return;
    }

    const nameInput = form.querySelector(".add-author-name-field input");
    const dateInput = form.querySelector(".add-author-date-field input");
    const locationInput = form.querySelector(".add-author-location-field input");
    const bioInput = form.querySelector(".add-author-description-field textarea");
    const bioCounter = document.querySelector("[data-author-bio-counter]");
    const previewAvatar = document.querySelector("[data-author-preview-avatar]");
    const previewName = document.querySelector("[data-author-preview-name]");
    const previewDate = document.querySelector("[data-author-preview-date]");
    const previewLocation = document.querySelector("[data-author-preview-location]");
    const previewBio = document.querySelector("[data-author-preview-bio]");
    const submitButton = document.querySelector("[data-add-author-submit]");

    const emptyName = "Author name";
    const emptyDate = "Birth date";
    const emptyLocation = "Birth location";
    const emptyBio = "Biography preview will appear here.";

    const updatePreview = () => {
        const name = nameInput ? nameInput.value.trim() : "";
        const date = dateInput ? dateInput.value.trim() : "";
        const location = locationInput ? locationInput.value.trim() : "";
        const bio = bioInput ? bioInput.value.trim() : "";

        if (previewAvatar) {
            previewAvatar.textContent = name ? name[0] : "A";
        }

        if (previewName) {
            previewName.textContent = name || emptyName;
        }

        if (previewDate) {
            previewDate.textContent = date || emptyDate;
        }

        if (previewLocation) {
            previewLocation.textContent = location || emptyLocation;
        }

        if (previewBio) {
            previewBio.textContent = bio || emptyBio;
        }

        if (bioCounter) {
            const length = bioInput ? bioInput.value.length : 0;
            bioCounter.textContent = `${length} characters`;
        }
    };

    [nameInput, dateInput, locationInput, bioInput].forEach((input) => {
        if (input) {
            input.addEventListener("input", updatePreview);
            input.addEventListener("change", updatePreview);
        }
    });

    form.addEventListener("submit", () => {
        if (submitButton) {
            submitButton.classList.add("is-submitting");
            submitButton.textContent = "Saving...";
        }
    });

    updatePreview();
})();