import { el, setChildren } from 'redom';

export default function appendUserCurrAccount(data, newData = false) {
    const currenciesBox = document.getElementById('currencies-accounts-box');
    if (newData) currenciesBox.innerHTML = '';

    const arrayData = Object.values(data);

    arrayData.forEach(account => {
        const accountCrypto = el('div.currencies__crypto-currency-account');
        const cryptoCurrency = el('p.currencies__currency-descr', account.code);
        const dots = el('span.dots');
        const cryptoAmount = el('p.currencies__currency-amount-descr', account.amount);
        setChildren(accountCrypto, [cryptoCurrency, dots, cryptoAmount]);
        currenciesBox.append(accountCrypto);
    })
}