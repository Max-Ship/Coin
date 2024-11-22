import { el, setChildren } from "redom";

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