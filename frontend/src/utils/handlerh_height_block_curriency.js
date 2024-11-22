import { el } from "redom";

export default function handlerCurrencyHeightBlcok() {
    function hasScroll(element) {
        return element.scrollHeight > element.clientHeight;
    }

    const blockAccountsCurrency = document.querySelector('.currencies__currencies-accounts');
    const boxAccountsCurrency = document.getElementById('currencies-accounts-box');
    if (window.innerWidth < 768) {
        const buttoUnfold = el('button.btn#btn-unfold', { style: 'margin-top: 15px;padding: 8px 14px' }, 'Развернуть');
        buttoUnfold.addEventListener('click', () => {
            const button = document.getElementById('btn-unfold');
            if (blockAccountsCurrency && button) {
                button.remove();
                boxAccountsCurrency.style.height = "auto";
                blockAccountsCurrency.style.height = "auto";
                blockAccountsCurrency.append(buttoFold);
            }
        })
        const buttoFold = el('button.btn#btn-fold', { style: 'margin-top: 15px;padding: 8px 14px' }, 'Свернуть');
        buttoFold.addEventListener('click', () => {
            const button = document.getElementById('btn-fold');
            button.remove();
            boxAccountsCurrency.style.height = "250px";
            blockAccountsCurrency.style.height = "380px";
            blockAccountsCurrency.append(buttoUnfold);
        });

        if (boxAccountsCurrency) {
            if (hasScroll(boxAccountsCurrency)) {
                blockAccountsCurrency.append(buttoUnfold);
            }
        }
    } else if (window.innerWidth >= 768) {
        const buttoUnfold = document.getElementById('btn-unfold');
        const buttonFold = document.getElementById('btn-fold');
        if (buttoUnfold) buttoUnfold.remove();
        if (buttonFold) buttonFold.remove();
        boxAccountsCurrency.style.height = "auto";
        blockAccountsCurrency.style.height = "auto";
    }
}