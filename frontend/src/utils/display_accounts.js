import { el, setChildren } from 'redom';
import month from '../utils/months'

import { router } from '../main';

export function displayAccounts(data, container, sort = false) {

    if (sort === true) {
        setChildren(container, []);
    }

    for (let i = 0; i < data.length; i++) {
        const account = el('div.accounts__account');
        const accountNumber = el('h3.accounts__num-title', `${data[i]["account"]}`);
        const balance = el('p.accounts__balance', `${data[i]["balance"].toFixed(2)} ₽`);
        const lasttTansaction = el('h4.accounts__last-tr', `Последняя транзакция: `);
        let date;
        let transactionDate;
        if (data[i]["transactions"][0]) {
            date = data[i]["transactions"][0]["date"].substring(0, 11);
            transactionDate = el('span.accounts__date', `${date.slice(8, 10)} ${month[date.slice(5, 7)]} ${date.slice(0, 4)}`);
        } else {
            transactionDate = el('span.accounts__date', '-');
        }

        lasttTansaction.append(transactionDate);
        const button = el(`button.btn.accounts__link-account#${accountNumber.textContent}`, 'Открыть');
        button.addEventListener('click', async () => {
            router.navigate(`/account/${button.id}`);
        })

        setChildren(account, [accountNumber, balance, lasttTansaction, button]);
        container.append(account);
    }
}
