import { setChildren, el } from "redom";

import { router } from "../main";
import { deleteCookie } from "../cookie/cookie";
import errorImg1 from "../../public/img/error1.png";
import errorImg2 from "../../public/img/error2.png";
import errorImg3 from "../../public/img/error3.png";

export default function handleError(status, errorResponse) {
    if (!document.getElementById('error-wrapper')) {
        const imgs = [errorImg1, errorImg2, errorImg3];
        const randomIndex = Math.floor(Math.random() * imgs.length);
        const img = el('img.error-img', { src: imgs[randomIndex] });
        const container = document.getElementById('app');
        const textError = el('p.error-text');
        const errorResponseText = el('p.error-respnse-text');
        errorResponseText.textContent = errorResponse;
        if (status === null) {
            textError.textContent = `Ошибка сети. Проверте соединение с интернетом`
        } else {
            switch (status.toString().charAt(0)) {
                case '4':
                    textError.textContent = `Ошибка 400: Неверный запрос. 
                ${el('span.error-descr',
                        'Пожалуйста, проверьте введенные данные или обратитесь в службу поддержки!')}`
                    break;
                case '5':
                    textError.textContent = `Ошибка 500: Внутренняя ошибка сервера. 
                ${el('span.error-descr',
                        'На сервере произошла ошибка. Попробуйте зайти позже или обратитесь в службу поддержки!')}`
                    break;
                default:
                    textError.textContent = `Ошибка ${status}: ${errorResponse}`;
            }
        }

        const wrapperError = el('div.error-wrapper#error-wrapper');
        const button = el('button.btn', 'Выйти');
        const errorForm = el('form.error-form');
        errorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            deleteCookie('authToken');
            router.navigate('/');
            location.reload();
        });
        setChildren(errorForm, [img, textError, errorResponseText, button]);
        setChildren(wrapperError, errorForm);
        container.append(wrapperError)
    }
}
