import { el, setChildren } from 'redom';
import plus from '/public/img/plus.svg';
import mark from '/public/img/mark.svg';

import { getCookie } from '../../cookie/cookie';
import { getNewAccount, getAccounts, responseRequests } from '../../requests/requests';

import createAccount from '../../utils/create_account';
import { displayAccounts } from '../../utils/display_accounts';
import { sortedAccounts } from '../../utils/function_custom_sort_select';
import { loader, deleteLoader } from '../../spinners/spinners';

export default function renderAccounts(dataAccounts) {
    let data = dataAccounts;
    const APP = document.getElementById('app');
    APP.classList.remove('main-auth');

    const containerAccounts = el('div.container.accounts.accounts__container');
    const accountsTitle = el('h2.accounts__title', 'Ваши счета');
    const sortSelect = el('div.accounts__select-sort.custom-select#custom-select', { tabindex: "0" });
    const selectMain = el('div.#selected.selected', 'Сортировка');
    const wrapOption = el('div.#options.options');
    const selectNumber = el('div.option', { 'data-value': 'number' }, 'По номеру', el('object.accounts__mark-svg', { type: 'image/svg+xml', data: mark, width: "18", height: "13" }));
    const selectBalance = el('div.option', { 'data-value': 'balance' }, 'По балансу', el('object.accounts__mark-svg', { type: 'image/svg+xml', data: mark, width: "18", height: "13" }));
    const selectLastTr = el('div.option', { 'data-value': 'last_tr' }, 'По последней транзакции', el('object.accounts__mark-svg', { type: 'image/svg+xml', data: mark, width: "18", height: "13" }));

    const newAccount = el('button.btn.accounts__link-new-acc#new-acc', el('object.accounts__svg', { type: 'image/svg+xml', data: plus, width: "16", height: "16" }), 'Создать новый счёт');
    newAccount.addEventListener('click', async () => {
        const token = getCookie('authToken');
        loader('accounts', 'bitcoin');
        try {
            const dataCreateAccount = await responseRequests(getNewAccount, token);
            if (dataCreateAccount.payload) {
                createAccount(dataCreateAccount.payload);
                let newData = await responseRequests(getAccounts, token);
                if (newData.payload) data = newData.payload
            };
        } finally { deleteLoader(); }

    });

    const wrapperTop = el('div.accounts__wrap-top');
    const wrapperAccounts = el('div.accounts__wrap-accounts#accounts');

    displayAccounts(data, wrapperAccounts);

    [selectNumber, selectBalance, selectLastTr].forEach(option => {
        option.addEventListener('click', () => {
            sortedAccounts(data, option, wrapperAccounts);
        });
    });

    setChildren(wrapOption, [selectNumber, selectBalance, selectLastTr]);
    setChildren(sortSelect, [selectMain, wrapOption]);
    setChildren(wrapperTop, [accountsTitle, sortSelect, newAccount]);
    setChildren(containerAccounts, [wrapperTop, wrapperAccounts]);

    return containerAccounts;
}


