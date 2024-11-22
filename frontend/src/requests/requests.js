import handleError from '../utils/handle_error';

export async function responseRequests(request, ...args) {
    try {
        const req = await request(...args);

        if (!req.ok) {
            const errorResponse = await req.json();
            handleError(req.status, errorResponse);
            return;
        }
        const res = await req.json();
        return res;
    } catch (error) {
        handleError(null, error)
        return false;
    }
}

export async function getAccount(token, id) {
    return await fetch(`http://localhost:3000/account/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
    })
}

export async function getAccounts(token) {
    return await fetch('http://localhost:3000/accounts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
    })
}

export async function getNewAccount(token) {
    return await fetch('http://localhost:3000/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
    })
}

export async function getTransferFunds(token, from, to, amount) {
    return await fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
        body: JSON.stringify({
            'from': from,
            'to': to,
            'amount': amount.replace(',', '.')
        })
    })
}

export async function getAllCurrencies() {
    return await fetch('http://localhost:3000/all-currencies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function getCurrencies(token) {
    return await fetch('http://localhost:3000/currencies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
    })
}

export async function getCurrencyBuy(token, from, to, amount) {
    return await fetch('http://localhost:3000/currency-buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Basic ${token}`, },
        body: JSON.stringify({
            'from': from,
            'to': to,
            'amount': amount.replace(',', '.')
        })
    })
}

export async function getBanks() {
    return await fetch('http://localhost:3000/banks', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
}


export async function getCurrencyFeed() {

    const socket = await new WebSocket('ws://localhost:3000/currency-feed');

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    return socket
}

