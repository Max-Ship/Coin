describe('Accounts Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');

        cy.get('#login').type('developer');
        cy.get('#password').type('skillbox');
        cy.get('#btn-submit').click();
    });

    it('should verify balances for the existing account', () => {
        const amountTransfer = 1111;
        let accountTo;
        let amountAccountToBefore;
        const accountFrom = '74213041477477406320783754';
        let amountAccountFromBefore;

        // Получаем баланс исходного счета перед операцией
        cy.get('#accounts .accounts__account')
            .contains(accountFrom)
            .closest('.accounts__account')
            .within(() => {
                cy.get('.accounts__balance')
                    .invoke('text')
                    .then((text) => {
                        amountAccountFromBefore = parseFloat(text.slice(0, -2).trim());
                        cy.log(`Баланс счета ${accountFrom} перед операцией: ${amountAccountFromBefore}`);
                    });
            });

        // Создаем новый счет
        cy.get('#new-acc').click();
        cy.wait(500);

        // Получаем информацию о новом счете
        cy.get('#accounts .accounts__account')
            .last()
            .within(() => {
                cy.get('h3.accounts__num-title')
                    .invoke('text')
                    .then((text) => {
                        accountTo = text;
                        cy.log(`Новый счет: ${accountTo}`);
                    });

                cy.get('.accounts__balance')
                    .invoke('text')
                    .then((text) => {
                        amountAccountToBefore = parseFloat(text.slice(0, -2).trim());
                        expect(amountAccountToBefore).to.eq(0);
                        cy.log(`Баланс счета ${accountTo} перед операцией: ${amountAccountToBefore}`);
                    });
            });
        // Переходим к переводу средств
        cy.get('.accounts__account')
            .contains(accountFrom)
            .should('exist')
            .then(($account) => {
                const buttonId = `#${accountFrom}`;
                cy.wrap($account).closest('.accounts__account')
                    .find(buttonId)
                    .should('exist')
                    .and('be.visible')
                    .click();
            });

        cy.wait(500);
        cy.url().should('include', `/account/${accountFrom}`);

        // Указываем получателя и сумму перевода
        cy.get('#account-recipient').then(($input) => {
            $input.val(accountTo);
            cy.wrap($input).trigger('input');
        });

        cy.get('#amount-number').then(($input) => {
            $input.val(amountTransfer);
            cy.wrap($input).trigger('input');
        });
        // Выполняем перевод
        cy.get('#btn-transfers').click();
        cy.reload();
        cy.wait(1000); // Для корректной отрисовки элементов

        // Проверяем историю переводов
        cy.get('#history-transfers')
            .find('.account__tr-history')
            .first()
            .then(($firstHistory) => {
                cy.wrap($firstHistory).within(() => {
                    cy.get('.account__tr-history-account-sender').should('contain.text', accountFrom);
                    cy.get('.account__tr-history-account-recipient').should('contain.text', accountTo);
                    cy.get('.account__tr-history-amount').should('contain.text', `- ${amountTransfer}`);

                    const currentDate = new Date().toLocaleDateString('ru-RU');
                    cy.get('.account__tr-history-date').should('contain.text', currentDate);
                });
            });

        // Возвращаемся на страницу аккаунтов
        cy.get('button.btn.account__button-accounts-back')
            .should('exist')
            .click();

        cy.wait(500);
        cy.url().should('include', `/accounts`);

        // Проверяем новый баланс исходного счета после перевода
        cy.get('#accounts .accounts__account')
            .contains(accountFrom)
            .closest('.accounts__account')
            .within(() => {
                cy.get('.accounts__balance')
                    .invoke('text')
                    .then((text) => {
                        let newBalanceFrom = parseFloat(text.slice(0, -2).trim());
                        cy.log(newBalanceFrom)
                        expect(newBalanceFrom).to.eq(amountAccountFromBefore - amountTransfer); // Проверка уменьшения баланса
                        cy.log(`Баланс счета ${accountFrom} после операции: ${newBalanceFrom}`);
                    });
            });
        // Проверяем новый баланс нового счета после перевода
        cy.get('#accounts .accounts__account')
            .last() // Получаем последний элемент аккаунта
            .within(() => {
                cy.get('.accounts__balance')
                    .invoke('text')
                    .then((text) => {
                        let newBalanceTo = parseFloat(text.slice(0, -2).trim());
                        expect(newBalanceTo).to.eq(amountAccountToBefore + amountTransfer);
                        cy.log(`Баланс счета ${accountTo} после операции: ${newBalanceTo}`);
                    });

                cy.get('button')
                    .contains('Открыть')
                    .click()
                    .then(() => {
                        cy.wait(500);
                        cy.url().should('include', `/account/${accountTo}`);
                    });
            });
        // Проверяем историю переводов
        cy.get('#history-transfers')
            .find('.account__tr-history')
            .first()
            .then(($firstHistory) => {
                cy.wrap($firstHistory).within(() => {
                    cy.get('.account__tr-history-account-sender').should('contain.text', accountFrom);
                    cy.get('.account__tr-history-account-recipient').should('contain.text', accountTo);
                    cy.get('.account__tr-history-amount').should('contain.text', `+ ${amountTransfer}`);

                    const currentDate = new Date().toLocaleDateString('ru-RU');
                    cy.get('.account__tr-history-date').should('contain.text', currentDate);
                });
            });
    });
});