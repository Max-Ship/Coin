import { el, setChildren } from 'redom';
import UP from '../../public/img/change_up.svg';
import DOWN from '../../public/img/change_down.svg';

let isWindowWidthSmall = false;

export default function appendChangeCurrency(data) {
    const currenciesBox = document.getElementById('change-crypto-currencies-box');

    if (window.innerWidth < 768) {
        if (!isWindowWidthSmall) {
            isWindowWidthSmall = true;
            let boxChangeCurrency = document.getElementById('change-crypto-currencies-box');
            if (boxChangeCurrency) boxChangeCurrency.innerHTML = ``;
        }
    } else { isWindowWidthSmall = false }

    if (data === "Данные временно не доступны!") {
        const error = el('p.currencies__ error', data);
        if (currenciesBox) currenciesBox.append(error);
    }

    if (data.type === 'EXCHANGE_RATE_CHANGE') {
        const changeCurrenciesWrap = el('div.currencies__change-currencies-wrap');
        const cryptoCurrencysChange = el('p.currencies__currencies-change-descr', data.from + '/' + data.to);
        const dots = el('span.dots');
        const cryptoChangeAmount = el('p.currencies__change-amount-descr', data.rate);
        const statusRate = data.change;
        const statusRateImg = el('object.currencies__status-rate-svg', { type: 'image/svg+xml', width: "20", height: "10" });

        if (statusRate === 1) {
            dots.classList.add('up');
            statusRateImg.data = UP;
        } else if (statusRate === -1) {
            dots.classList.add('down');
            statusRateImg.data = DOWN;
        }
        setChildren(changeCurrenciesWrap, [cryptoCurrencysChange, dots, cryptoChangeAmount, statusRateImg]);

        controlHeightBlock();
        if (currenciesBox) currenciesBox.append(changeCurrenciesWrap);
    }
}

function controlHeightBlock() {
    let boxChangeCurrency = document.getElementById('change-crypto-currencies-box');
    let blockChangeCurrency = document.getElementById('rigth-block');
    let HEIGHT_APPEND_DATA = 49;
    let PADDING = 100;
    let HEIGHT_TITLE = 48;

    if (window.innerWidth < 768) {
        if (boxChangeCurrency) {
            HEIGHT_APPEND_DATA = 27;
            PADDING = 40;
            HEIGHT_TITLE = 29;
        }
    }

    if (boxChangeCurrency && blockChangeCurrency) {
        let heightBox = boxChangeCurrency.getBoundingClientRect().height;
        let heightBlock = blockChangeCurrency.getBoundingClientRect().height;

        let ELEMS_HEIGHT = heightBox + HEIGHT_APPEND_DATA + PADDING + HEIGHT_TITLE;

        if (heightBlock < ELEMS_HEIGHT) {
            if (boxChangeCurrency.firstElementChild) boxChangeCurrency.firstElementChild.remove();
        }
    } else return
}