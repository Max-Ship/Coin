import { el, setChildren } from 'redom';

import letter from '../../../public/img/letter.svg';

import { getTransferFunds, getAccount, responseRequests } from '../../requests/requests';

import { getCookie } from '../../cookie/cookie';

import { topBlock, listTransfers, historyTransfer, graph } from '../account_account_history_elements/account_elements';

import { getTranferError } from '../../utils/transfer_error';

import { loader, deleteLoader } from '../../spinners/spinners';


export default function renderAccount(data) {
    const containerAccount = el('div.container.account.account__container');
    //Верхний блок
    const wrapTop = topBlock(data, 'account', '/accounts')
    //Средний блок
    const wrapMiddle = el('div.account__block-middle');
    //Переводы 
    const divTr = el('div.account__block-transfers#transfers');
    const trTitle = el('h3.account__tr-title', 'Новый перевод');
    const wrapRec = el('div.account__wrap-rec#wrap-rec');
    const descrInputRec = el('p.account__descr-recipient-input', 'Номер счёта получателя');
    const inputNumberAccountRec = el('input.account__number-account-rec#account-recipient', { type: 'text', placeholder: 'Введите счет' });
    setChildren(wrapRec, [descrInputRec, inputNumberAccountRec]);
    const wrapAmount = el('div.account__wrap-amount');
    const descrInputAmount = el('p.account__descr-amount-input', 'Сумма перевода');
    const inputNumberAmount = el('input.account__number-amount#amount-number', { type: 'text', placeholder: 'Введите сумму' });
    setChildren(wrapAmount, [descrInputAmount, inputNumberAmount]);
    const buttonTransfer = el('button.btn.account__button-transfer#btn-transfers', el('object.account__letter-svg', { type: 'image/svg+xml', data: letter, width: "24", height: "24" }), 'Отправить')
    buttonTransfer.addEventListener('click', () => {
        const accountFrom = `${data["account"]}`
        let inputAccountTo = document.getElementById('account-recipient');
        let inputAmount = document.getElementById('amount-number');
        if (inputAccountTo.value.length === 0) {
            getTranferError('Введите счет!', 'transfers');
        } else if (inputAmount.value.length === 0) {
            getTranferError('Введите сумму!', 'transfers');
        } else if (inputAccountTo.value.length !== 0 && inputAmount.value.length !== 0) {
            const token = getCookie('authToken');
            loader('transfers', 'graph');
            try {
                responseRequests(getTransferFunds, token, accountFrom, inputAccountTo.value, inputAmount.value).
                    then(res => {
                        if (res.error) getTranferError(res.error, 'transfers');
                        if (!res.error) if (document.getElementById('tr-err')) document.getElementById('tr-err').remove();
                    });
                responseRequests(getAccount, token, data["account"]).then((res) => {
                    const wrap = document.getElementById('history-transfers');
                    const balance = document.getElementById('balance-account');
                    if (res.payload.balance) balance.innerHTML = `${res.payload.balance} ₽`
                    if (res.payload.transactions) {
                        historyTransfer(res.payload, 10, wrap, true)
                    }
                })
            } finally { deleteLoader(); }

            inputAccountTo.value = '';
            inputAmount.value = '';
            if (document.getElementById('img-card')) document.getElementById('img-card').remove();
        }
    })
    setChildren(divTr, [trTitle, wrapRec, wrapAmount, buttonTransfer]);
    //График
    const divWrapChart = graph(data, 'account', 'Динамика баланса', 6, false);
    setChildren(wrapMiddle, [divTr, divWrapChart]);
    //история переводов - нижний блок
    const wrapDown = listTransfers(data, 'account', 10);
    ///////////////////////////  
    setChildren(containerAccount, [wrapTop, wrapMiddle, wrapDown]);
    return containerAccount
}


