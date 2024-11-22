import { el, setChildren } from 'redom';

export default function renderATM(data) {
    const containerATM = el('div.container.atm.atm__container.');
    const titleATMs = el('h2.atm__title', 'Карта банкоматов');
    const map = el('div.atm__map#map');

    setChildren(containerATM, [titleATMs, map]);

    return containerATM
}



