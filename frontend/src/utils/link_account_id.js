import { router } from '../main';

export default function linksAccountID(accountID) {
    const graphLink = document.getElementById('link-canvas');
    const historyHeaderLink = document.getElementById('link-HH');
    [graphLink, historyHeaderLink].forEach(elem => {
        if (elem) elem.addEventListener('click', () => { router.navigate(`/account/${accountID}/history`) })
    })
}