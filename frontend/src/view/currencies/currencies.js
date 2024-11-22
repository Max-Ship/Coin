import { el, setChildren } from 'redom';

import { getCurrencyBuy, responseRequests } from '../../requests/requests';
import { getCookie } from '../../cookie/cookie';

import customCryptoSelect from '../../utils/create_custom_select_currencies';
import appendUserCurrAccount from '../../utils/append_currencies_accounts';
import { getTranferError } from '../../utils/transfer_error';
import { loader, deleteLoader } from '../../spinners/spinners';

export default function renderCurrencies(dataCurrencies) {
    const currenciesContainer = el('div.container.currencies.currencies__container');
    const titleCurrencies = el('h2.currencies__title', 'Валютный обмен');

    const left = el('div.currencies__left-block#left-block');
    const rigth = el('div.currencies__rigth-block#rigth-block');

    const divCurrenciesAccounts = el('div.currencies__currencies-accounts');
    const titleCurrenciesAccounts = el('h3.currencies__currencies-accounts-title', 'Ваши валюты');
    const currenciesBox = el('div.currencies__currencies-box#currencies-accounts-box')
    setChildren(divCurrenciesAccounts, [titleCurrenciesAccounts, currenciesBox]);

    const divExchange = el('div.currencies__exchange#exchange-block');
    const titleExchange = el('h3.currencies__exchange-title', 'Обмен валюты');
    const wrapInputCurrencies = el('div.currencies__wrap-input-currencies');
    const from = el('p.currencies__descr-from', 'Из');
    const to = el('p.currencies__descr-to', 'в');
    const inputFrom = customCryptoSelect(dataCurrencies, 'currencies__input-from.custom-select', 'selected-from');
    const inputTo = customCryptoSelect(dataCurrencies, 'currencies__input-to.custom-select', 'selected-to');
    setChildren(wrapInputCurrencies, [from, inputFrom, to, inputTo]);
    const wrapInputAmount = el('div.currencies__wrap-input-amount');
    const descrAmount = el('p.currencies__descr-amount', 'Сумма');
    const inputAmount = el('input.currencies__input-amount#currencies-amount', { type: 'text', placeholder: 'Сумма' });
    setChildren(wrapInputAmount, [descrAmount, inputAmount]);
    const wrapInputs = el('div.currencies__wrap-all-inputs');
    setChildren(wrapInputs, [wrapInputCurrencies, wrapInputAmount]);
    const buttonCurrencies = el('button.btn.currencies__exchange-currencies#btn-transfer-crypto', 'Обменять');
    buttonCurrencies.addEventListener('click', () => {
        const token = getCookie('authToken');
        const from = document.getElementById('selected-from');
        const to = document.getElementById('selected-to');
        const amount = document.getElementById('currencies-amount');
        if (amount.value === '0' || amount.value === '') {
            getTranferError('Введите сумму', 'exchange-block');
            return
        } else if (amount.value !== '' && amount.value !== '0') {
            loader('exchange-block', 'accounts');
            const dataUserCurrencies = responseRequests(getCurrencyBuy, token, from.getAttribute('data-value'), to.getAttribute('data-value'), amount.value);
            deleteLoader();
            dataUserCurrencies.then(res => {
                if (res.error) {
                    getTranferError(res.error, 'exchange-block')
                } else {
                    appendUserCurrAccount(res.payload, true);
                    if (document.getElementById('tr-err')) document.getElementById('tr-err').remove();
                    amount.value = '';
                }
            })
        }
    })
    const containerBlock = el('div.currencies__container-blok-exchange');
    setChildren(containerBlock, [wrapInputs, buttonCurrencies])
    setChildren(divExchange, [titleExchange, containerBlock]);
    setChildren(left, [divCurrenciesAccounts, divExchange]);

    const titleCryptoCurrencies = el('h3.currencies__crypto-currencies-title', 'Изменение курсов в реальном времени');
    const wrapCryptoCurrencies = el('div.currencies__change-crypto-currencies-box#change-crypto-currencies-box')
    setChildren(rigth, [titleCryptoCurrencies, wrapCryptoCurrencies]);

    const containerData = el('div.currencies__container-data');

    setChildren(containerData, [left, rigth])

    setChildren(currenciesContainer, [titleCurrencies, containerData]);

    return currenciesContainer
}
