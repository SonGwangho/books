(function () {
    const DATA_URL = "json/book_info.json";
    const BOOKS_PATH = "books";
    const RESULT_LIMIT = 8;
    const HANGUL_START = 0xac00;
    const HANGUL_END = 0xd7a3;
    const CHOSEONG = [
        "ㄱ",
        "ㄲ",
        "ㄴ",
        "ㄷ",
        "ㄸ",
        "ㄹ",
        "ㅁ",
        "ㅂ",
        "ㅃ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅉ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ",
    ];

    let searchIndex = [];
    let activeIndex = -1;

    function normalize(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");
    }

    function getInitials(value) {
        return Array.from(String(value || ""))
            .map((char) => {
                const code = char.charCodeAt(0);

                if (code < HANGUL_START || code > HANGUL_END) {
                    return normalize(char);
                }

                return CHOSEONG[Math.floor((code - HANGUL_START) / 588)];
            })
            .join("");
    }

    function isSubsequence(query, target) {
        if (!query) {
            return false;
        }

        let queryIndex = 0;

        for (const char of target) {
            if (char === query[queryIndex]) {
                queryIndex += 1;
            }

            if (queryIndex === query.length) {
                return true;
            }
        }

        return false;
    }

    function scoreBook(book, query) {
        if (!query) {
            return 0;
        }

        if (book.normalizedTitle === query) {
            return 100;
        }

        if (book.normalizedTitle.startsWith(query)) {
            return 90;
        }

        if (book.normalizedTitle.includes(query)) {
            return 80;
        }

        if (book.initials === query) {
            return 75;
        }

        if (book.initials.startsWith(query)) {
            return 70;
        }

        if (book.initials.includes(query)) {
            return 65;
        }

        if (isSubsequence(query, book.initials) || isSubsequence(query, book.normalizedTitle)) {
            return 45;
        }

        return 0;
    }

    function searchBooks(query) {
        const normalizedQuery = normalize(query);

        return searchIndex
            .map((book) => ({
                ...book,
                score: scoreBook(book, normalizedQuery),
            }))
            .filter((book) => book.score > 0)
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ko"))
            .slice(0, RESULT_LIMIT);
    }

    function booksFromData(data) {
        const bookData = data && data.book_data;

        if (!bookData) {
            return [];
        }

        if (Array.isArray(bookData.books)) {
            return bookData.books.map((book) => ({
                title: book.title,
                author: book.author || "",
                genres: Array.isArray(book.genres) ? book.genres : [],
            }));
        }

        if (Array.isArray(bookData.book_titles)) {
            return bookData.book_titles.map((title) => ({
                title,
                author: "",
                genres: [],
            }));
        }

        return [];
    }

    function createIndex(books) {
        searchIndex = books
            .filter((book) => book && book.title)
            .map((book) => ({
                title: book.title,
                author: book.author,
                genres: book.genres,
                normalizedTitle: normalize(book.title),
                initials: getInitials(book.title),
            }));
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function viewElement() {
        return document.querySelector(".view.markdown");
    }

    function setViewContent(html) {
        const view = viewElement();

        if (!view) {
            return;
        }

        view.innerHTML = html;
    }

    function showViewMessage(message) {
        setViewContent(`<p class="view-status">${escapeHtml(message)}</p>`);
    }

    function showViewSpinner() {
        setViewContent(`
            <div class="view-loading" aria-label="Loading">
                <span class="view-spinner"></span>
            </div>
        `);
    }

    function bookHtmlUrl(title) {
        return `${BOOKS_PATH}/${encodeURIComponent(title)}.html`;
    }

    function renderGenreTags(book) {
        const genres = Array.isArray(book.genres) ? book.genres.filter(Boolean) : [];

        if (!genres.length) {
            return "";
        }

        return `
            <div class="book-genres" aria-label="장르">
                ${genres.map((genre) => `<span class="book-genre">#${escapeHtml(genre)}</span>`).join("")}
            </div>
        `;
    }

    function resolveBook(query) {
        const normalizedQuery = normalize(query);

        if (!normalizedQuery) {
            return null;
        }

        return searchIndex.find((book) => book.normalizedTitle === normalizedQuery) || searchBooks(query)[0] || null;
    }

    async function loadBookHtml(bookOrTitle) {
        const book = typeof bookOrTitle === "string" ? resolveBook(bookOrTitle) || { title: bookOrTitle, genres: [] } : bookOrTitle;
        const view = viewElement();

        if (view) {
            view.setAttribute("aria-busy", "true");
        }

        showViewSpinner();

        try {
            const response = await fetch(bookHtmlUrl(book.title));

            if (!response.ok) {
                throw new Error(`HTML load failed: ${response.status}`);
            }

            const html = await response.text();
            setViewContent(`${renderGenreTags(book)}${html}`);
        } catch (error) {
            showViewMessage("책 내용을 불러오지 못했습니다.");
            console.error("책 내용을 불러오지 못했습니다.", error);
        } finally {
            if (view) {
                view.removeAttribute("aria-busy");
            }
        }
    }

    function injectStyles() {
        if (document.getElementById("search-manager-style")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "search-manager-style";
        style.textContent = `
            .search-results {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                left: 0;
                z-index: 20;
                display: none;
                max-height: 280px;
                padding: 6px;
                overflow-y: auto;
                overscroll-behavior: contain;
                border: 1px solid var(--line);
                border-radius: 12px;
                background: var(--panel);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                -webkit-overflow-scrolling: touch;
            }

            .search-results.is-open {
                display: block;
            }

            .search-result-item {
                width: 100%;
                min-height: 40px;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
                border: 0;
                border-radius: 8px;
                background: transparent;
                color: var(--text);
                line-height: 1.4;
                text-align: left;
                cursor: pointer;
                touch-action: manipulation;
            }

            .search-result-title {
                font-weight: 500;
                overflow-wrap: anywhere;
            }

            .search-result-author {
                color: var(--muted);
                font-size: 14px;
                overflow-wrap: anywhere;
            }

            .search-result-item:hover,
            .search-result-item.is-active {
                background: var(--input);
            }

            @media (max-width: 820px) {
                .search-results {
                    position: absolute;
                    width: 100%;
                    max-height: min(45vh, 320px);
                    margin-top: 8px;
                    padding: 8px;
                    border-radius: 12px;
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
                }

                .search-result-item {
                    min-height: 48px;
                    padding: 12px 14px;
                    align-items: center;
                    gap: 6px;
                }

                .search-result-author {
                    font-size: 13px;
                }
            }

            @media (hover: none) {
                .search-result-item:hover {
                    background: transparent;
                }

                .search-result-item.is-active {
                    background: var(--input);
                }
            }

        `;
        document.head.appendChild(style);
    }

    function closeResults(results) {
        activeIndex = -1;
        results.classList.remove("is-open");
        results.innerHTML = "";
    }

    function isCoarsePointer() {
        return window.matchMedia("(pointer: coarse)").matches;
    }

    function focusAfterSearch(input, shouldBlur) {
        if (shouldBlur) {
            input.blur();
            return;
        }

        input.focus();
    }

    async function runSearch(input, results, query, shouldBlur) {
        const book = resolveBook(query || input.value);

        if (!book) {
            closeResults(results);
            showViewMessage("검색 결과가 없습니다.");
            focusAfterSearch(input, shouldBlur);
            return;
        }

        input.value = book.title;
        closeResults(results);
        focusAfterSearch(input, shouldBlur);
        await loadBookHtml(book);
    }

    function selectResult(input, results, title, shouldBlur) {
        runSearch(input, results, title, shouldBlur);
    }

    function renderResults(input, results, books) {
        activeIndex = -1;
        results.innerHTML = "";

        if (!input.value.trim()) {
            closeResults(results);
            return;
        }

        if (!books.length) {
            closeResults(results);
            return;
        }

        const fragment = document.createDocumentFragment();

        books.forEach((book) => {
            const button = document.createElement("button");
            button.className = "search-result-item";
            button.type = "button";
            button.dataset.title = book.title;

            const title = document.createElement("span");
            title.className = "search-result-title";
            title.textContent = book.title;
            button.appendChild(title);

            if (book.author) {
                const author = document.createElement("span");
                author.className = "search-result-author";
                author.textContent = `- ${book.author}`;
                button.appendChild(author);
            }

            button.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                selectResult(input, results, book.title, isCoarsePointer());
            });
            fragment.appendChild(button);
        });

        results.appendChild(fragment);
        results.classList.add("is-open");
    }

    function moveActiveResult(results, direction) {
        const items = Array.from(results.querySelectorAll(".search-result-item"));

        if (!items.length) {
            return;
        }

        activeIndex = (activeIndex + direction + items.length) % items.length;
        items.forEach((item, index) => {
            item.classList.toggle("is-active", index === activeIndex);
        });
        items[activeIndex].scrollIntoView({ block: "nearest" });
    }

    function bindSearch(form) {
        const input = form.querySelector('input[type="search"]');

        if (!input) {
            return;
        }

        const results = document.createElement("div");
        results.className = "search-results";
        results.setAttribute("role", "listbox");
        form.appendChild(results);

        input.setAttribute("autocomplete", "off");
        input.setAttribute("inputmode", "search");
        input.setAttribute("enterkeyhint", "search");

        input.addEventListener("input", () => {
            renderResults(input, results, searchBooks(input.value));
        });

        input.addEventListener("focus", () => {
            renderResults(input, results, searchBooks(input.value));
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                moveActiveResult(results, 1);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                moveActiveResult(results, -1);
                return;
            }

            if (event.key === "Enter") {
                const activeItem = results.querySelector(".search-result-item.is-active");

                if (activeItem) {
                    event.preventDefault();
                    selectResult(input, results, activeItem.dataset.title, false);
                }
                return;
            }

            if (event.key === "Escape") {
                closeResults(results);
            }
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            runSearch(input, results, input.value, isCoarsePointer());
        });

        document.addEventListener("click", (event) => {
            if (!form.contains(event.target)) {
                closeResults(results);
            }
        });
    }

    async function initSearchManager() {
        const form = document.querySelector(".search-form");

        if (!form) {
            return;
        }

        injectStyles();

        try {
            const response = await fetch(DATA_URL);
            const data = await response.json();
            createIndex(booksFromData(data));
            bindSearch(form);
        } catch (error) {
            console.error("검색 데이터를 불러오지 못했습니다.", error);
        }
    }

    document.addEventListener("DOMContentLoaded", initSearchManager);

    window.searchManager = {
        getInitials,
        openBook(bookOrTitle) {
            return loadBookHtml(bookOrTitle);
        },
        search: searchBooks,
    };
})();
