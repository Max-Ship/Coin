import { el, setChildren } from 'redom';

export function getTranferError(error, wrapperID) {
    const wrapperBlock = document.getElementById(wrapperID);

    if (wrapperBlock.contains(document.getElementById('transfer-error-wrapper'))) document.getElementById('transfer-error-wrapper').remove();

    const wrapperError = el('div.transfer-error-wrapper#transfer-error-wrapper');
    const err = el('span.transfer-error', error);
    const button = el('button.btn', 'OK');
    button.addEventListener('click', () => {
        const error = document.getElementById('transfer-error-wrapper');
        if (error) error.remove();
    })
    setChildren(wrapperError, err, button)
    wrapperBlock.append(wrapperError)
}

export function getButton(button1, button2, button3) {
    document.getElementById(button1[0]).disabled = button1[1];
    document.getElementById(button2[0]).disabled = button2[1];
    document.getElementById(button3[0]).disabled = button3[1];
}

export function appendHeader(wrapButtons, auth = false) {
    const headerContainer = document.getElementById('header-app');

    if (auth && headerContainer.contains(wrapButtons)) {
        wrapButtons.remove();
        return
    }

    if (!headerContainer.contains(wrapButtons) && auth === false) {
        headerContainer.append(wrapButtons);
    }
}
