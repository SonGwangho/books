(function () {
    const STORAGE_KEY = "books-theme";
    const DARK_STYLE_ID = "theme-setting-dark-style";
    const THEMES = {
        light: {
            label: "light",
            iconLabel: "Toggle dark mode",
        },
        dark: {
            label: "dark",
            iconLabel: "Toggle light mode",
        },
    };

    const darkModeCss = `
        :root[data-theme="dark"] {
            color-scheme: dark;
            --page: #0b1c30;
            --panel: #213145;
            --text: #eaf1ff;
            --muted: #c4c7c9;
            --line: #464555;
            --primary: #c3c0ff;
            --input: #0f2238;
            --shadow: 0 10px 25px rgba(0, 0, 0, 0.28);
        }

        :root[data-theme="dark"] .search-form svg,
        :root[data-theme="dark"] .icon-button {
            color: var(--text);
        }

        :root[data-theme="dark"] .search-form input::placeholder {
            color: #c4c7d5;
        }

        :root[data-theme="dark"] .site-footer {
            color: var(--muted);
        }

        :root[data-theme="dark"] .footer-links {
            color: var(--text);
        }

        :root[data-theme="dark"] .search-form input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(195, 192, 255, 0.18);
        }
    `;

    const moonIcon = `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M20.5 14.2A8.1 8.1 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    const sunIcon = `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V2M12 22v-2M20 12h2M2 12h2M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41M17.66 17.66l1.41 1.41M4.93 4.93l1.41 1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            return;
        }
    }

    function clearSavedTheme() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            return;
        }
    }

    function normalizeTheme(theme) {
        return theme === THEMES.dark.label ? THEMES.dark.label : THEMES.light.label;
    }

    function preferredTheme() {
        return normalizeTheme(getSavedTheme() || (systemTheme.matches ? THEMES.dark.label : THEMES.light.label));
    }

    function injectDarkModeCss() {
        if (document.getElementById(DARK_STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = DARK_STYLE_ID;
        style.textContent = darkModeCss;
        document.head.appendChild(style);
    }

    function themeButton() {
        return document.querySelector('[aria-label="Toggle theme"], [aria-label="Toggle dark mode"], [aria-label="Toggle light mode"], .theme-toggle');
    }

    function updateButton(theme) {
        const button = themeButton();

        if (!button) {
            return;
        }

        const isDark = theme === THEMES.dark.label;
        button.setAttribute("aria-label", isDark ? THEMES.dark.iconLabel : THEMES.light.iconLabel);
        button.setAttribute("aria-pressed", String(isDark));
        button.innerHTML = isDark ? sunIcon : moonIcon;
    }

    function applyTheme(theme, shouldSave) {
        const nextTheme = normalizeTheme(theme);

        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;
        updateButton(nextTheme);

        if (shouldSave) {
            saveTheme(nextTheme);
        }

        return nextTheme;
    }

    function setTheme(theme) {
        return applyTheme(theme, true);
    }

    function getTheme() {
        return normalizeTheme(document.documentElement.dataset.theme || preferredTheme());
    }

    function toggleTheme() {
        return setTheme(getTheme() === THEMES.dark.label ? THEMES.light.label : THEMES.dark.label);
    }

    function bindThemeButton() {
        const button = themeButton();

        if (!button) {
            return;
        }

        button.addEventListener("click", toggleTheme);
        updateButton(getTheme());
    }

    injectDarkModeCss();
    applyTheme(preferredTheme(), false);

    document.addEventListener("DOMContentLoaded", bindThemeButton);
    systemTheme.addEventListener("change", (event) => {
        if (!getSavedTheme()) {
            applyTheme(event.matches ? THEMES.dark.label : THEMES.light.label, false);
        }
    });

    window.themeSetting = {
        getTheme,
        setTheme,
        toggleTheme,
        clearTheme() {
            clearSavedTheme();
            return applyTheme(preferredTheme(), false);
        },
    };
})();
