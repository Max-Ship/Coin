import { el, setChildren } from "redom";

import { router } from "../main";

export default function createAccount(data) {
    const wrapperAccounts = document.getElementById('accounts');

    const account = el('div.accounts__account');
    const accountNumber = el('h3.accounts__num-title', `${data["account"]}`);
    const balance = el('p.accounts__balance', `${data["balance"]} ₽`);
    const lasttTansaction = el('h4.accounts__last-tr', `Последняя транзакция: `);
    const transactionDate = el('span.accounts__date', '-');

    lasttTansaction.append(transactionDate);

    const button = el(`button.btn.accounts__link-account#${accountNumber.textContent}`, 'Открыть');
    button.addEventListener('click', () => {
        router.navigate(`/account/${button.id}`);
    });

    setChildren(account, [accountNumber, balance, lasttTansaction, button]);

    wrapperAccounts.append(account);
}

