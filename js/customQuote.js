(function () {
    class CustomQuote extends HTMLElement {
        static get observedAttributes() {
            return ["progress"];
        }

        constructor() {
            super();
            this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback() {
            if (this.isConnected) {
                this.render();
            }
        }

        render() {
            const progress = this.getAttribute("progress") || "";

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                    }

                    div {
                        margin: 0 0 1.5rem;
                    }

                    p {
                        margin: 0;
                        margin-left: 20px;
                        color: var(--text, #0b1c30);
                        font-size: 1.2rem;
                        line-height: 1.7;
                    }

                    span {
                        margin-left: 0.45rem;
                        color: var(--muted, #747481);
                        font-size: 0.9em;
                        white-space: nowrap;
                    }
                </style>
                <div>
                    <p>
                        <slot></slot>
                        ${progress ? `<span>${this.escapeHtml(progress)}</span>` : ""}
                    </p>
                </div>
            `;
        }

        escapeHtml(value) {
            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    if (!customElements.get("custom-quote")) {
        customElements.define("custom-quote", CustomQuote);
    }
})();
