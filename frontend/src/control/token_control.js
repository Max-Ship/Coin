import { el } from 'redom';
import handleError from '../utils/handle_error';

export default class Control {
    constructor(login = null, password = null) {
        this._login = login;
        this._password = password;
        this._token = null;
        this._loginLenValid = false;
        this._passwordLenValid = false;
    }

    async _getDataUser() {
        const url = 'http://localhost:3000/login';
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'login': this._login,
                    'password': this._password
                })
            });

            if (!res.ok) {
                const errorResponse = await req.json();
                handleError(req.status, errorResponse);
                return;
            }

            return res.json();
        } catch (error) {
            handleError(null, error);
        }
    }

    async _addError(err) {
        const errorImg3 = await import("../../public/img/error3.png");
        const errorWrapperBlock = document.getElementById('authorization');
        const imgError = el('img.error-img', { src: errorImg3.default });
        if (errorWrapperBlock.contains(document.getElementById('auth-error-wrapper'))) document.getElementById('auth-error-wrapper').remove();

        const errorWrapper = el('div.auth-error-wrapper#auth-error-wrapper');
        const error = el('span.auth__error', err);
        const button = el('button.btn.auth-error-btn', 'OK');
        button.addEventListener('click', () => {
            const error = document.getElementById('auth-error-wrapper');
            error.classList.add('delete-error')
            if (error) error.remove();
        });

        errorWrapper.append(imgError, error, button);
        errorWrapperBlock.append(errorWrapper);
    }

    loginLenValid() {
        const login = document.getElementById('login');

        login.addEventListener('blur', () => {
            if (login.value.trim().length < 5 || /\s/.test(login.value)) {
                this._loginLenValid = false;
                this._addError('Логин меньше 6 символов или с пробелами');
            } else if (!login.value.trim().length < 5 && !/\s/.test(login.value)) {
                this._loginLenValid = true;
            }
        })
    }

    passwordLenValid() {
        const pass = document.getElementById('password');

        pass.addEventListener('blur', () => {
            if (pass.value.trim().length < 5 || /\s/.test(pass.value)) {
                this._addError('Пароль меньше 6 символов или с пробелами');
                this._passwordLenValid = false;
            } else if (!pass.value.trim().length < 5 && !/\s/.test(pass.value)) {
                this._passwordLenValid = true;
            }
        })
    }

    async validation() {
        if (this._loginLenValid && this._passwordLenValid) {
            const result = await this._getDataUser();
            if (!result) return false;
            if (result.error) {
                this._addError(result.error);
                return false;
            } else if (result.payload) {
                this._token = result.payload.token;
                return true
            }
        } else return false;
    }

    get token() {
        return this._token
    }

    set login(value) {
        this._login = value;
    }

    set password(value) {
        this._password = value;
    }
}






