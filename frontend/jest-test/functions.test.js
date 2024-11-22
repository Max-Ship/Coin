import { getTranferError, getButton, appendHeader } from './functions';

// Тесты для getTranferError
describe('getTranferError', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="wrapper">
                <div id="transfer-error-wrapper"></div>
            </div>
        `;
    });

    it('should add error message to the wrapper', () => {
        getTranferError('An error occurred', 'wrapper');

        const errorWrapper = document.getElementById('transfer-error-wrapper');

        // Проверяем, что wrapperError существует
        expect(errorWrapper).toBeTruthy();

        const errorSpan = errorWrapper.querySelector('span.transfer-error');
        expect(errorSpan).toBeTruthy(); // Убедитесь, что span существует
        expect(errorSpan.textContent).toBe('An error occurred'); // Проверяем текст ошибки

        const button = errorWrapper.querySelector('button.btn');
        expect(button).toBeTruthy(); // Убедитесь, что кнопка существует
        expect(button.textContent).toBe('OK'); // Проверяем текст кнопки
    });

    it('should remove existing error message before adding a new one', () => {
        getTranferError('First error', 'wrapper');
        getTranferError('Second error', 'wrapper');

        const errorWrapper = document.getElementById('transfer-error-wrapper');
        const errorSpan = errorWrapper.querySelector('span.transfer-error');
        expect(errorSpan.textContent).toBe('Second error'); // Проверяем текст ошибки - должен быть 'Second error'
    });

    it('should remove the error message when button is clicked', () => {
        getTranferError('An error occurred', 'wrapper');

        const button = document.querySelector('#transfer-error-wrapper button');
        button.click();

        const errorWrapper = document.getElementById('transfer-error-wrapper');
        expect(errorWrapper).toBeFalsy(); // Проверяем, что элемент был удален
    });
});

// Тесты для getButton
describe('getButton', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="button1">Button 1</button>
            <button id="button2">Button 2</button>
            <button id="button3">Button 3</button>
        `;
    });

    it('should disable buttons based on input parameters', () => {
        getButton(['button1', true], ['button2', false], ['button3', true]);

        expect(document.getElementById('button1').disabled).toBe(true); // Кнопка 1 отключена
        expect(document.getElementById('button2').disabled).toBe(false);
        expect(document.getElementById('button3').disabled).toBe(true); // Кнопка 3 отключена
    });
});

// Тесты для appendHeader
describe('appendHeader', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="header-app"></div>
        `;
    });
    const wrapButtons = document.createElement('div');

    it('should append wrapButtons if not authenticated', () => {
        appendHeader(wrapButtons, false);
        const headerApp = document.getElementById('header-app');
        expect(headerApp.contains(wrapButtons)).toBe(true); // Проверяем, что wrapButtons добавлен
    });

    it('should not append wrapButtons if already present', () => {
        appendHeader(wrapButtons, false); // Сначала добавляем
        appendHeader(wrapButtons, false); // Пытаемся добавить снова

        const headerApp = document.getElementById('header-app');
        expect(headerApp.children.length).toBe(1); // Проверяем, что wrapButtons не добавлен повторно
    });

    it('should remove wrapButtons if authenticated and already present', () => {
        appendHeader(wrapButtons, false); // Сначала добавляем
        appendHeader(wrapButtons, true);  // Затем вызываем с auth = true

        const headerApp = document.getElementById('header-app');
        expect(headerApp.contains(wrapButtons)).toBe(false); // Проверяем, что wrapButtons был удален
    });

    it('should do nothing if authenticated and wrapButtons is not present', () => {
        appendHeader(wrapButtons, true); // Вызываем с auth = true, когда wrapButtons еще нет

        const headerApp = document.getElementById('header-app');
        expect(headerApp.contains(wrapButtons)).toBe(false); // Проверяем, что ничего не изменилось
    });
});