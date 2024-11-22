import { el, setChildren } from 'redom';
import spinnerBit from '../../public/img/spinner.gif';

export function loader(containerID, pageBlock) {
    const container = document.getElementById(`${containerID}`);

    const existingLoader = document.getElementById('wrapper-loader');
    if (existingLoader) {
        existingLoader.remove();
    }

    const wrapperLoader = el('div.loader-wrap#wrapper-loader');
    let loader;
    if (pageBlock === 'graph') {
        loader = el(`span.loader-${pageBlock}`)
        const innerOne = el('span.inner.one');
        const innerTwo = el('span.inner.two');
        const innerThree = el('span.inner.three');
        setChildren(loader, [innerOne, innerTwo, innerThree]);
    } else if (pageBlock === 'bitcoin') {
        loader = el('img.loader-bitcoin', { src: spinnerBit });
    } else {
        loader = el(`span.loader-${pageBlock}`);
    }
    setChildren(wrapperLoader, loader);
    container.append(wrapperLoader);
}

export function deleteLoader() {
    const loader = document.getElementById('wrapper-loader');
    if (loader) loader.remove();
}


