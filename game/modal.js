const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
const { document } = window;
global.document = document;
global.window = window;
global.HTMLElement = window.HTMLElement;
global.navigator = { userAgent: 'node.js' };

// Load the polyfill for custom elements
require('@webcomponents/webcomponentsjs/webcomponents-bundle');

// Mock browser functions that are not present in Node.js
global.window.customElements = {
    define: (name, constructor) => {
        global[name] = constructor;
    }
};

/**
 * ## ModalDialog Web Component
 * Custom dialog components using a Promise-based modal for user interaction.
 *
 * ## Example:
 * ```
 * // Replace the native javascript functions
 * const alert   = modal.alert,
 *       prompt  = modal.prompt,
 *       confirm = modal.confirm;
 *
 * let reset = async () => {
 *     let result = await confirm("Are you sure you want to reset the application? <br /><br /> This will erase all your saved data and cannot be undone.", "Reset Application?");
 *     if (result === true) {
 *         let done = await resetFunction();
 *         if (done) {
 *             alert("This application has been successfully reset!", "Finished!");
 *         } else {
 *             alert("Something went wrong! You're settings remain unchanged.", "Unexpected Error!");
 *         }
 *     } else if (result === false) {
 *         alert("This application was not reset! You're settings remain unchanged", "Reset Canceled!");
 *     }
 * }
 * ```
 */
class ModalDialog extends HTMLElement {
    constructor() {
        super();
        this.build();
    }

    assemble() {
        return `
            <div class="modal-dialog-window">
                <div class="modal-dialog">
                    <div class="modal-dialog-header">Testing Dialogs</div>
                    <div class="modal-dialog-body">
                        <p>
                            This is a test dialog showing the alert
                            functionality.
                        </p>
                    </div>
                    <div class="modal-dialog-footer">
                        <button class="modal-dialog-button">OK</button>
                    </div>
                </div>
            </div>`;
    }

    build() {
        this.attachShadow({ mode: "open" });
        const dialogWindow = document.createElement("div");
        dialogWindow.classList.add("modal-dialog-window");

        const dialog = document.createElement("div");
        const header = document.createElement("div");
        const body = document.createElement("div");
        const footer = document.createElement("div");

        dialog.classList.add("modal-dialog");
        header.classList.add("modal-dialog-header");
        body.classList.add("modal-dialog-body");
        footer.classList.add("modal-dialog-footer");

        body.append(document.createElement("p"));
        dialog.append(header, body, footer);
        dialogWindow.append(dialog);

        const style = document.createElement("style");
        style.textContent = this.setStyle();
        this.shadowRoot.append(style, dialogWindow);
    }

    setStyle(padding = "1em") {
        return `
            .modal-dialog-window {
                user-select: none;
                font-family: inherit;
                font-size: inherit;
                z-index: 999;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: auto;
                position: fixed;
                top: 0;
                left: 0;
            }

            .modal-dialog {
                width: calc(100% - 2em);
                max-width: 400px;
                overflow: hidden;
                box-sizing: border-box;
                box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.5);
                border-radius: 0.3em;
                animation: modal-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
            }

            .modal-dialog.modal-dialog-hide {
                opacity: 0;
                animation: modal-dialog-hide 265ms ease-in;
            }

            @keyframes modal-dialog-show {
                0% {
                    opacity: 0;
                    transform: translateY(-100%);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes modal-dialog-hide {
                0% {
                    opacity: 1;
                    transform: translateX(0);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50%);
                }
            }

            .modal-dialog-header {
                font-family: inherit;
                font-size: 1.25em;
                color: inherit;
                background-color: rgba(0, 0, 0, 0.05);
                padding: 1em;
                border-bottom: solid 1px rgba(0, 0, 0, 0.15);
            }

            .modal-dialog-body {
                color: inherit;
                padding: ${padding};
            }

            .modal-dialog-body > p {
                color: inherit;
                padding: 0;
                margin: 0;
            }

            .modal-dialog-footer {
                color: inherit;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: stretch;
            }

            .modal-dialog-button {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                background-color: rgba(0, 0, 0, 0);
                width: 100%;
                padding: 1em;
                border: none;
                border-top: solid 1px rgba(0, 0, 0, 0.15);
                outline: 0;
                border-radius: 0px;
                transition: background-color 225ms ease-out;
            }

            .modal-dialog-button:focus {
                background-color: rgba(0, 0, 0, 0.05);
            }

            .modal-dialog-button:active {
                background-color: rgba(0, 0, 0, 0.15);
            }

            .modal-dialog-input {
                color: inherit;
                font-family: inherit;
                font-size: inherit;
                width: 100%;
                padding: 0.5em;
                border: solid 1px rgba(0, 0, 0, 0.15);
                margin-top: ${padding};
                outline: 0;
                box-sizing: border-box;
                border-radius: 0;
                box-shadow: 0 0 0 0 rgba(13, 134, 255, 0.5);
                transition: box-shadow 125ms ease-out, border 125ms ease-out;
            }

            .modal-dialog-input:focus {
                border: solid 1px rgba(13, 134, 255, 0.8);
                box-shadow: 0 0 0.1em 0.2em rgba(13, 134, 255, 0.5);
            }

            @media (prefers-color-scheme: dark) {
                .modal-dialog-window {
                    background-color: rgba(31, 31, 31, 0.5);
                }

                .modal-dialog {
                    color: #f2f2f2;
                    background-color: #464646;
                }

                .modal-dialog-input {
                    background-color: #2f2f2f;
                }
            }

            @media (prefers-color-scheme: light) {
                .modal-dialog-window {
                    background-color: rgba(221, 221, 221, 0.5);
                }

                .modal-dialog {
                    color: #101010;
                    background-color: #ffffff;
                }
            }
        `;
    }

    createDialog(content, title = undefined) {
        const header = this.shadowRoot.querySelector(".modal-dialog-header");
        const bodyParagraph = this.shadowRoot.querySelector(".modal-dialog-body > p");

        bodyParagraph.innerHTML = content;

        if (title === undefined) {
            header.remove();
        } else {
            header.innerHTML = title;
        }
    }

    disposeDialog() {
        const dialog = this.shadowRoot.querySelector(".modal-dialog");
        dialog.classList.add("modal-dialog-hide");

        dialog.addEventListener("animationend", function onHideAnimationEnd(event) {
            if (event.animationName === "modal-dialog-hide") {
                dialog.removeEventListener("animationend", onHideAnimationEnd);
                this.remove();
            }
        });
    }
}

// Alert modal component
class ModalAlert extends ModalDialog {
    constructor() {
        super();
        this.setDefault();
    }

    setDefault() {
        const content = this.dataset.content;
        const title = this.dataset.title;
        if (typeof content !== "undefined") {
            this.setAlert(content, title);
        }
    }

    setAlert(content, title) {
        this.createDialog(content, title);

        const footer = this.shadowRoot.querySelector(".modal-dialog-footer");
        const okButton = document.createElement("button");

        okButton.classList.add("modal-dialog-button");
        okButton.innerText = "OK";
        footer.append(okButton);
        okButton.focus();

        return new Promise((resolve) => {
            okButton.addEventListener("click", () => {
                this.disposeDialog();
                resolve(true);
            });
        });
    }
}

// Confirm modal component
class ModalConfirm extends ModalDialog {
    constructor() {
        super();
        this.setDefault();
    }

    setDefault() {
        const content = this.dataset.content;
        const title = this.dataset.title;
        if (typeof content !== "undefined") {
            this.setConfirm(content, title);
        }
    }

    setConfirm(content, title) {
        this.createDialog(content, title);

        const footer = this.shadowRoot.querySelector(".modal-dialog-footer");
        const cancelButton = document.createElement("button");
        const okButton = document.createElement("button");

        cancelButton.classList.add("modal-dialog-button");
        okButton.classList.add("modal-dialog-button");

        cancelButton.innerText = "Cancel";
        okButton.innerText = "OK";

        footer.append(cancelButton, okButton);
        okButton.focus();

        return new Promise((resolve) => {
            cancelButton.addEventListener("click", () => {
                this.disposeDialog();
                resolve(false);
            });

            okButton.addEventListener("click", () => {
                this.disposeDialog();
                resolve(true);
            });
        });
    }
}

// Prompt modal component
class ModalPrompt extends ModalDialog {
    constructor() {
        super();
        this.setDefault();
    }

    setDefault() {
        const content = this.dataset.content;
        const title = this.dataset.title;
        if (typeof content !== "undefined") {
            this.setPrompt(content, title);
        }
    }

    setPrompt(content, title) {
        this.createDialog(content, title);

        const body = this.shadowRoot.querySelector(".modal-dialog-body");
        const footer = this.shadowRoot.querySelector(".modal-dialog-footer");

        const input = document.createElement("input");
        const cancelButton = document.createElement("button");
        const okButton = document.createElement("button");

        input.classList.add("modal-dialog-input");
        cancelButton.classList.add("modal-dialog-button");
        okButton.classList.add("modal-dialog-button");

        input.setAttribute("type", "text");
        cancelButton.innerText = "Cancel";
        okButton.innerText = "OK";

        body.append(input);
        footer.append(cancelButton, okButton);
        input.focus();

        return new Promise((resolve) => {
            cancelButton.addEventListener("click", () => {
                this.disposeDialog();
                resolve(null);
            });

            okButton.addEventListener("click", () => {
                this.disposeDialog();
                resolve(input.value);
            });
        });
    }
}

// Static methods for creating modals
class modal {
    static alert(content, title) {
        return new Promise((resolve) => {
            const alertElement = document.createElement("modal-alert");
            alertElement.dataset.content = content;
            alertElement.dataset.title = title;
            document.body.append(alertElement);
            alertElement.setAlert(content, title).then(resolve);
        });
    }

    static confirm(content, title) {
        return new Promise((resolve) => {
            const confirmElement = document.createElement("modal-confirm");
            confirmElement.dataset.content = content;
            confirmElement.dataset.title = title;
            document.body.append(confirmElement);
            confirmElement.setConfirm(content, title).then(resolve);
        });
    }

    static prompt(content, title) {
        return new Promise((resolve) => {
            const promptElement = document.createElement("modal-prompt");
            promptElement.dataset.content = content;
            promptElement.dataset.title = title;
            document.body.append(promptElement);
            promptElement.setPrompt(content, title).then(resolve);
        });
    }
}

// Define the custom elements
customElements.define("modal-alert", ModalAlert);
customElements.define("modal-confirm", ModalConfirm);
customElements.define("modal-prompt", ModalPrompt);

// Export the modal methods for use in other modules
module.exports = modal;
