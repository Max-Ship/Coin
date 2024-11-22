import { setChildren } from "redom";

export default async function renderPage(data) {
    const APP = document.getElementById('app');
    APP.innerHTML = '';
    setChildren(APP, data);
}
