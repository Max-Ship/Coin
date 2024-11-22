import { el, setChildren } from 'redom';

import { router } from '../../main';
import { deleteCookie } from '../../cookie/cookie'

const wrapButtons = el('nav.header__wrap-buttons#hwb');
const ATMsLink = el('button.header__link#ATM-button', 'Банкоматы');
ATMsLink.addEventListener('click', () => {
    router.navigate('/banks');
})
const billsLink = el('button.header__link#accounts-button', 'Счета');
billsLink.addEventListener('click', () => {
    router.navigate('/accounts');
})
const currencyLink = el('button.header__link#crypto-button', 'Валюта');
currencyLink.addEventListener('click', () => {
    router.navigate('/currencies');
})
const exitLink = el('button.header__link#exit-button', 'Выйти');
exitLink.addEventListener('click', () => {
    deleteCookie('authToken');
    router.navigate('/');
    location.reload();
})

setChildren(wrapButtons, [ATMsLink, billsLink, currencyLink, exitLink]);

export default wrapButtons;