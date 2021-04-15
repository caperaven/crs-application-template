class Component extends HTMLElement {
    connectedCallback() {
        this.textContent = "Hello World";
    }
}

customElements.define("my-component", Component)