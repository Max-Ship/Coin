import { el, setChildren } from 'redom';

export default function customCryptoSelect(dataCrypoCurr, classElem, idElem) {
    const customSelect = el(`div.${classElem}`, { tabindex: 0 });
    const selected = el(`div.#${idElem}.selected`);
    const optionsContainer = el('div.#options.options');

    dataCrypoCurr.forEach(currency => {
        const option = el('div.option', { 'data-value': currency }, currency);
        optionsContainer.append(option);
    });

    selected.textContent = dataCrypoCurr[0];
    selected.setAttribute('data-value', dataCrypoCurr[0])
    setChildren(customSelect, [selected, optionsContainer]);

    selected.addEventListener('click', () => {
        const isOpen = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isOpen ? 'none' : 'block';
        customSelect.classList.toggle('open', !isOpen);
    });

    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.textContent = option.textContent;
            selected.setAttribute('data-value', option.getAttribute('data-value'));
            optionsContainer.style.display = 'none';
            customSelect.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            optionsContainer.style.display = 'none';
            customSelect.classList.remove('open');
        }
    });

    return customSelect
}

