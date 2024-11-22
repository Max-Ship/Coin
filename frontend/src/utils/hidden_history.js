import { el } from "redom";

export function visibleHistoryTransfers() {
    const VISIBLE_TRANSFER = 25;
    const HEIGHT_TRANSFER = 73;
    const wrapHistory = document.getElementById('history-transfers');
    const blockHistory = document.getElementById('history');
    const arr = document.querySelectorAll('.account__tr-history');
    let countTr = arr.length;
    const ratioElements = Math.floor(countTr / VISIBLE_TRANSFER);

    if (countTr > VISIBLE_TRANSFER) {
        let count = 2;

        Object.assign(wrapHistory.style, {
            height: `${VISIBLE_TRANSFER * HEIGHT_TRANSFER}px`,
            overflowY: 'hidden',
        });
        const button = el('button.btn', 'Показать еще');

        Object.assign(button.style, {
            marginTop: '25px',
            alignSelf: 'center',
            padding: '10px 30px'
        });

        button.addEventListener('click', () => {
            if (count <= ratioElements) {
                wrapHistory.style.height = `${count * (VISIBLE_TRANSFER * HEIGHT_TRANSFER)}px`
            } else {
                wrapHistory.style.height = 'auto';
                button.remove();
            }
            count += 1
        })

        blockHistory.append(button);

    }
}