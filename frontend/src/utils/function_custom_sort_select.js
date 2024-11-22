import { displayAccounts } from "./display_accounts";

export function sortedAccounts(data, option, container) {
    let sortedData;
    switch (option.getAttribute('data-value')) {
        case 'number':
            sortedData = [...data].sort((a, b) => a.account.localeCompare(b.account));
            break;
        case 'balance':
            sortedData = [...data].sort((a, b) => b.balance - a.balance);
            break;
        case 'last_tr':
            sortedData = [...data].sort((a, b) => {
                if (!a.transactions[0] && !b.transactions[0]) return 0;
                if (!a.transactions[0]) return 1;
                if (!b.transactions[0]) return -1;
                return new Date(b.transactions[0].date) - new Date(a.transactions[0].date);
            });
            break;
        default:
            sortedData = data;
            break;
    }
    displayAccounts(sortedData, container, true);
}


