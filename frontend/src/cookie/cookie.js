export function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; Secure`;
}

export function getCookie(name) {
    return document.cookie.split('; ').reduce((r, c) => {
        const [key, val] = c.split('=');
        return key === name ? decodeURIComponent(val) : r;
    }, '');
}

export function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/; Secure`;
}