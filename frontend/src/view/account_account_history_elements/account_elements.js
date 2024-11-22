import { el, setChildren } from 'redom';

import { router } from '../../main';

import arrow from '../../../public/img/arrow.svg';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, BarController);

export function topBlock(data, block, navigate) {
    //Счет и баланс на странице
    const wrapTop = el(`div.${block}__block-top`);

    const divAccount = el(`div.${block}__wrap-account`);
    const accountTitle = el(`h2.${block}__title`, 'Просмотр счета');
    const accountNumber = el(`h3.${block}__account-number`, `№ ${data["account"]}`);
    setChildren(divAccount, [accountTitle, accountNumber]);
    const divBalance = el(`div.${block}__wrap-balance`);
    const wrapWN = el(`div.${block}__wrap-WN`);
    const balance = el(`p.${block}__balance`, 'Баланс');
    const balanceNumber = el(`p.${block}__balance-number#balance-account`, `${data["balance"].toFixed(2)} ₽`)
    const buttonGoBack = el(`button.btn.${block}__button-accounts-back`, el(`object.${block}__arrow-svg`, { type: 'image/svg+xml', data: arrow, width: "16", height: "12" }), 'Вернуться назад');
    buttonGoBack.addEventListener('click', () => {
        router.navigate(navigate);
    });
    setChildren(wrapWN, [balance, balanceNumber]);
    setChildren(divBalance, [buttonGoBack, wrapWN]);

    setChildren(wrapTop, [divAccount, divBalance]);
    return wrapTop
}

export function listTransfers(data, block, counter = false) {
    const wrapDown = el(`div.account__block-down.history#history`);

    const historyTile = el(`h3.account__history-title`, 'История переводов');
    const divHeaderHisrory = el(`div.${block}__history-header#link-HH`);

    const senderAccountHeader = el(`p.account__history-sender-descr-header`, 'Счёт отправителя');
    const recipientAccountHeader = el(`p.account__history-recipient-descr-header`, 'Счёт получателя');
    const amountHeader = el(`p.account__history-amount-descr-header`, 'Сумма');
    const dateHeader = el(`p.account__history-date-descr-header`, 'Дата');
    setChildren(divHeaderHisrory, [senderAccountHeader, recipientAccountHeader, amountHeader, dateHeader]);

    const historyContainer = el(`div.${block}__history-container#history-transfers`);
    historyTransfer(data, counter, historyContainer);

    setChildren(wrapDown, [historyTile, divHeaderHisrory, historyContainer]);
    return wrapDown;
}

export function historyTransfer(data, counter, wrap, clearWrap = false) {
    const historyContainer = wrap;
    let counterTr;
    counter ? counterTr = 0 : counterTr = null;

    if (clearWrap) historyContainer.innerHTML = '';

    for (let i = data["transactions"].length - 1; i >= 0; i--) {
        const tr = el(`div.account__tr-history`);
        const trAccountSender = el(`p.account__tr-history-account-sender`, `${data["transactions"][i]["from"]}`);
        const trAccountRecipient = el(`p.account__tr-history-account-recipient`, `${data["transactions"][i]["to"]}`);
        const trAmount = el(`p.account__tr-history-amount`);
        if (Number(data["transactions"][i]["from"]) === Number(data["account"])) {
            trAmount.style.color = 'red';
            trAmount.textContent = `- ${data["transactions"][i]["amount"]}`
        } else {
            trAmount.style.color = 'green';
            trAmount.textContent = `+ ${data["transactions"][i]["amount"]}`
        }

        let day = data["transactions"][i]["date"].slice(8, 10);
        let month = data["transactions"][i]["date"].slice(5, 7);
        let year = data["transactions"][i]["date"].slice(0, 4);
        const trDate = el(`p.account__tr-history-date`, `${day}.${month}.${year}`);
        setChildren(tr, [trAccountSender, trAccountRecipient, trAmount, trDate]);
        historyContainer.append(tr);
        if (counter) {
            counterTr += 1;
            if (counterTr === counter) break;
        }
    }
}

export function graph(data, block, title, countMonth, ratio = false) {
    const divWrapChart = el(`div.${block}__block-chart`);
    const chartTitle = el(`h3.account__chart-title`, title);
    const chart = el(`div.${block}__chart-balance`);
    // Подготовка данных для графика
    const labels = [];
    const dataPoints = Array(countMonth).fill(0);
    const dataExpenPoints = Array(countMonth).fill(0);
    // Получаем текущую дату
    const currentDate = new Date();

    for (let i = 0; i < countMonth; i++) {
        // Получаем дату для каждого из последних 6 месяцев
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
        const monthLabel = monthDate.toLocaleString('default', { month: 'long' });

        labels.unshift(monthLabel.slice(0, 3));
        // Суммируем приходы и расходы за каждый месяц
        data["transactions"].forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getFullYear() === monthDate.getFullYear() &&
                transactionDate.getMonth() === monthDate.getMonth() &&
                transaction.amount > 0 && Number(data["account"]) !== Number(transaction["from"])) {
                dataPoints[countMonth - i - 1] += transaction.amount;
            } else if (transactionDate.getFullYear() === monthDate.getFullYear() &&
                transactionDate.getMonth() === monthDate.getMonth() &&
                transaction.amount > 0 && Number(data["account"]) === Number(transaction["from"])) {
                dataExpenPoints[countMonth - i - 1] += transaction.amount;
            }
        });
    }

    let insurance = 0;
    let maxAmount = Math.max(...dataPoints).toFixed(2);
    let maxExpen = Math.max(...dataExpenPoints).toFixed(2);
    let maxValueNumber = Math.max(maxAmount, maxExpen).toFixed(2);
    let difference = maxAmount - maxExpen // Разница в доходах и расходах
    // Инициализация графика только если есть данные
    if (dataPoints.some(point => point > 0)) {
        // Убираем все пустые месяцы с лева на право до первого не пустого месяца
        while (insurance < countMonth) {
            let i = 0
            if (dataPoints[i] === 0) {
                dataPoints.shift();
                labels.shift();
                dataExpenPoints.shift();
                insurance += 1;
            } else { break }
        }

        if (ratio) { // График с соотношением приход/расход
            const chartCanvasRatio = el(`canvas.${block}__chart-canvas-ratio`, { tabindex: '0' });

            new ChartJS(chartCanvasRatio.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Расход денег',
                        data: dataExpenPoints,
                        backgroundColor: 'rgb(253, 78, 93)',
                        borderColor: 'rgb(253, 78, 93)',
                        borderWidth: 1
                    }, {
                        label: 'Приход денег',
                        data: dataPoints,
                        backgroundColor: 'rgb(118, 202, 102)',
                        borderColor: 'rgb(118, 202, 102)',
                        borderWidth: 1
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            position: 'right',
                            stacked: true,
                            min: 0,
                            max: maxValueNumber,
                            ticks: {
                                callback: function (value, index, ticks) {
                                    if (value === maxValueNumber || value === 0) {
                                        return value + ' ₽'
                                    }
                                    else if (index === Math.floor(ticks.length / 2)) {
                                        return difference.toFixed(2) + ' ₽'
                                    }
                                },
                                font: {
                                    size: window.innerWidth < 567 ? 8 : 12
                                }
                            },
                            grid: {
                                display: false
                            },
                            beginAtZero: true,
                            title: {
                                display: false,
                            }
                        },
                        x: {
                            stacked: true,
                            grid: {
                                display: false
                            },
                            title: {
                                display: false,
                            },
                            ticks: {
                                font: {
                                    size: window.innerWidth < 567 ? 8 : 12
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            setChildren(chart, [chartCanvasRatio]);
            setChildren(divWrapChart, [chartTitle, chart]);
        } else { // Обычный график с поступлением денег
            const chartCanvasAmount = el(`canvas.${block}__chart-canvas-amount#link-canvas`, { tabindex: '0' });

            new ChartJS(chartCanvasAmount.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Приход денег',
                        data: dataPoints,
                        backgroundColor: 'rgb(17, 106, 204)',
                        borderColor: 'rgb(17, 106, 204)',
                        borderWidth: 1
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            position: 'right',
                            min: 0,
                            max: maxAmount,
                            ticks: {
                                callback: function (value) {
                                    if (value === maxAmount || value === 0) return value + ' ₽';
                                },
                                font: {
                                    size: window.innerWidth < 567 ? 8 : 12
                                }
                            },
                            grid: {
                                display: false
                            },
                            beginAtZero: true,
                            title: {
                                display: false,
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            title: {
                                display: false,
                            },
                            ticks: {
                                font: {
                                    size: window.innerWidth < 567 ? 8 : 12
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            setChildren(chart, [chartCanvasAmount]);
            setChildren(divWrapChart, [chartTitle, chart]);
        }

    } else {
        const noDataMessage = el('p.no-data-message', 'Нет данных для отображения.');
        setChildren(chart, [noDataMessage]);
        setChildren(divWrapChart, [chartTitle, chart]);
    }

    return divWrapChart
}

