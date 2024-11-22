import { el, setChildren } from 'redom';

import { topBlock, listTransfers, graph } from '../account_account_history_elements/account_elements';

export default function renderHistory(data) {
    const containerAccount = el('div.container.account.account__container');
    //Счет и баланс на странице
    const wrapTop = topBlock(data, 'account', `/account/${data["account"]}`);

    const grafTr = graph(data, 'history', 'Динамика баланса', 12, false);
    const grafRatio = graph(data, 'history', 'Соотношение входящих исходящих транзакций', 12, true);

    const historyTr = listTransfers(data, 'history');

    setChildren(containerAccount, [wrapTop, grafTr, grafRatio, historyTr]);

    return containerAccount;
}


