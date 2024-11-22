import { el, setChildren } from 'redom';

export default function renderAuthorization() {
    const APP = document.getElementById('app');
    APP.classList.add('main-auth');
    const container = el('div.container.auth.auth__container');
    const form = el('form.auth__form.auth-form#authorization');
    const mainTitle = el('h2.auth-form__title', 'Вход в аккаунт');
    const labelLogin = el('p.auth-form__label-login', 'Логин');
    const loginWrap = el('div.auth-form__login-wrap#wrap-login');
    const labelPass = el('p.auth-form__label-pass', 'Пароль')
    const passWrap = el('div.auth-form__pass-wrap#wrap-pass');
    const inputLogin = el('input.auth-form__input-login#login', { type: 'text', placeholder: 'Логин' });
    const inputPass = el('input.auth-form__input-pass#password', { type: 'text', placeholder: 'Пароль' });
    const formButton = el('button.btn.auth-form__button#btn-submit', 'Войти');

    setChildren(loginWrap, [labelLogin, inputLogin]);
    setChildren(passWrap, [labelPass, inputPass]);
    setChildren(form, [mainTitle, loginWrap, passWrap, formButton]);
    setChildren(container, form);

    return container;
}
