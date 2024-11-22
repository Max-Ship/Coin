import IMask from 'imask';
import valid from 'card-validator';
import { el } from 'redom';

import visa from '../../public/img/visa.png';
import mastercard from '../../public/img/mastercard.png';
import maestro from '../../public/img/maestro.png';
import mir from '../../public/img/mir.png';
import alert from '../../public/img/alert.png'

export function maskInput(inputID, status = 'account', wrapID = 'wrap-rec', minNum = null, scaleNum = null) {
    const input = document.getElementById(inputID);
    let maskOptions;

    if (status === 'account') {
        input.addEventListener('blur', () => {
            removeImgCard();
            const wrap = document.getElementById(wrapID);
            let resultValid = valid.number(input.value);
            let img = el('img.img-card#img-card');

            input.value.length === 0 ?
                input.style.border = '1px solid rgb(186, 0, 0)' : input.style.border = '1px solid rgb(118, 202, 102)';
            if (resultValid.card && resultValid.isValid) {
                img.src = setLogo(`${resultValid.card.type}`);
                img.alt = `${resultValid.card.type}`;
                wrap.append(img);
            } else if (input.value.length !== 0) {
                img.src = setLogo(``);
                img.alt = 'Убедитесь в корректности счета или номера карты!';
                wrap.append(img);
            }
        })
        maskOptions = {
            mask: /^\d*$/,
            prepare: (value) => value.replace(/\D/g, ''),
            commit: (value) => value
        }
    } else if (status === 'amount') {
        input.addEventListener('blur', () => {
            input.value.length === 0 ?
                input.style.border = '1px solid rgb(186, 0, 0)' : input.style.border = '1px solid rgb(118, 202, 102)';
        });
        maskOptions = {
            mask: Number,
            signed: false,
            thousandsSeparator: '',
            padFractionalZeros: false
        }
        if (minNum !== null) {
            maskOptions.min = minNum;
        }
        if (scaleNum !== null) {
            maskOptions.scale = scaleNum;
        }
    }
    IMask(input, maskOptions);
}

//Определение картинки-логотипа банка
function setLogo(type) {
    switch (type) {
        case 'visa':
            return visa;
        case 'mastercard':
            return mastercard;
        case 'mir':
            return mir;
        case 'maestro':
            return maestro;
        default:
            return alert;
    }
}
//Для удаления иконки карты, при событиях(исправление, отправка формы и т.д)
function removeImgCard() {
    const img = document.getElementById('img-card');
    if (img) {
        img.remove();
    }
}