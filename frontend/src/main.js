import Navigo from 'navigo';
//Куки
import { setCookie, getCookie } from './cookie/cookie';
//Стили и отрисовка
import './view/main.scss';
import renderAuthorization from './view/authorization/authorization';
import renderAccounts from './view/accounts/accounts';
import renderAccount from './view/account/account';
import renderHistory from './view/history/history';
import renderCurrencies from './view/currencies/currencies';
import renderATM from './view/ATMs/ATMs';
//Контроль токена
import Control from './control/token_control';
//Реквесты
import { getAccounts, getAccount, getBanks, getAllCurrencies, getCurrencies, getCurrencyFeed, responseRequests } from './requests/requests';
//Утилиты
import renderPage from './utils/render_page';
import startCustomSortSelect from './utils/start_custom_sort_select';
import appendHeader from './utils/append_header';
import closeGlobalSocet from './utils/close_socket';
import linksAccountID from './utils/link_account_id';
import appendUserCurrAccount from './utils/append_currencies_accounts';
import appendChangeCurrency from './utils/append_change_crypto_currencies';
import handlerCurrencyHeightBlcok from './utils/handlerh_height_block_curriency';
import { visibleHistoryTransfers } from './utils/hidden_history';
import { banks } from './utils/banks';
import { getButton } from './utils/disabled_button';
import { maskInput } from './utils/functionality_inputs';

import { loader, deleteLoader } from './spinners/spinners';

const router = new Navigo('/');
export { router };

let globalSocket = null;

router.on('/', () => {
    closeGlobalSocet(globalSocket);
    renderPage(renderAuthorization());
    appendHeader(true);
    let userControl = new Control();
    userControl.loginLenValid();
    userControl.passwordLenValid();

    const authorization = document.getElementById('authorization');

    authorization.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login');
        const password = document.getElementById('password');
        userControl.login = login.value;
        userControl.password = password.value;

        if (await userControl.validation()) {
            setCookie('authToken', userControl.token);
            router.navigate('/accounts');
            userControl = null;
        }
    });
});

router.on('/accounts', async () => {
    closeGlobalSocet(globalSocket);
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, выполните вход.');
        router.navigate('/');
        return;
    }

    loader('app', 'bitcoin');
    const res = await responseRequests(getAccounts, token);

    if (res.payload) {
        appendHeader();
        getButton(['ATM-button', false], ['accounts-button', true], ['crypto-button', false]);
        renderPage(renderAccounts(res.payload));
        deleteLoader();
        startCustomSortSelect();
    }
});

router.on(`/account/:id`, async (param) => {
    closeGlobalSocet(globalSocket);
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, выполните вход.');
        router.navigate('/');
        return;
    }

    loader('app', 'graph');
    const res = await responseRequests(getAccount, token, param.data.id);

    if (res.payload) {
        appendHeader();
        getButton(['ATM-button', false], ['accounts-button', false], ['crypto-button', false]);
        renderPage(renderAccount(res.payload));
        deleteLoader();
        maskInput('account-recipient');
        maskInput('amount-number', 'amount', 'wrap-rec', 0.01, 2);
        linksAccountID(param.data.id)
    }
});

router.on(`/account/:id/history`, async (param) => {
    closeGlobalSocet(globalSocket);
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, выполните вход.');
        router.navigate('/');
        return;
    }

    loader('app', 'graph');
    const res = await responseRequests(getAccount, token, param.data.id);

    if (res.payload) {
        appendHeader();
        getButton(['ATM-button', false], ['accounts-button', false], ['crypto-button', false]);
        deleteLoader();
        renderPage(renderHistory(res.payload));
        visibleHistoryTransfers();
    }
});

router.on(`/currencies`, async () => {
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, выполните вход.');
        router.navigate('/');
        return;
    }

    loader('app', 'accounts');
    const allCurrencies = await responseRequests(getAllCurrencies);
    const dataUserCurrencies = await responseRequests(getCurrencies, token);

    if (allCurrencies.payload && dataUserCurrencies.payload) {
        appendHeader();
        getButton(['ATM-button', false], ['accounts-button', false], ['crypto-button', true]);
        deleteLoader();
        renderPage(renderCurrencies(allCurrencies.payload));
        maskInput('currencies-amount', 'amount', null, null, 100);
        appendUserCurrAccount(dataUserCurrencies.payload);
        globalSocket = await getCurrencyFeed();
        (await globalSocket).onmessage = (event) => {
            let data = JSON.parse(event.data);
            event.data && data.type === 'EXCHANGE_RATE_CHANGE' ? appendChangeCurrency(data) : appendChangeCurrency("Данные временно не доступны!")
        }
        handlerCurrencyHeightBlcok();
    }
});

router.on('/banks', async () => {
    closeGlobalSocet(globalSocket);

    loader('app', 'map');
    const res = await responseRequests(getBanks);

    if (res.payload) {
        appendHeader();
        getButton(['ATM-button', true], ['accounts-button', false], ['crypto-button', false]);
        renderPage(renderATM());
        deleteLoader();
        banks(res.payload)
    }
});

router.resolve();

