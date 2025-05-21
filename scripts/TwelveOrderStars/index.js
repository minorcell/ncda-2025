import { HeaderController } from "../common/HeaderController.js";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');

    new HeaderController(header);
})