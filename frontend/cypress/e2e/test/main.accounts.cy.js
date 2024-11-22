describe('Accounts Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');

        cy.get('#login').type('developer');
        cy.get('#password').type('skillbox');
        cy.get('#btn-submit').click();
    });

    it('should load accounts and check specific account', () => {
        const accountNumber = '74213041477477406320783754';
        cy.wait(500);

        cy.get('.accounts__container')
            .should('be.visible');

        cy.get('.accounts__account')
            .contains(accountNumber)
            .should('exist')
            .then(($account) => {
                const buttonId = `#${accountNumber}`;
                cy.wrap($account).parent()
                    .find(buttonId)
                    .should('exist')
                    .and('be.visible')
                    .click();
            });

        cy.wait(500);
        cy.url().should('include', `/account/${accountNumber}`);
        // Проверяем отрисовку основных элементов на странице
        cy.get('h3.account__account-number')
            .should('exist')
            .and('contain.text', accountNumber);

        cy.get('p.account__balance')
            .should('exist');

        cy.get('div#transfers.account__block-transfers')
            .should('exist');

        cy.get('canvas#link-canvas.account__chart-canvas-amount')
            .should('exist');

        cy.get('div#history.account__block-down.history')
            .should('exist');

        cy.get('h3.account__history-title')
            .should('exist')
            .and('contain.text', 'История переводов');
        // Переходим по графику-ссылке на страницу истории
        cy.get('canvas#link-canvas.account__chart-canvas-amount').click();

        cy.wait(500);
        cy.url().should('include', `/account/${accountNumber}/history`);
        // Проверяем отрисовку основных элементов на странице
        cy.get('h3.account__account-number')
            .should('exist')
            .and('contain.text', accountNumber);

        cy.get('p.account__balance')
            .should('exist');

        cy.get('canvas.history__chart-canvas-amount')
            .should('exist');

        cy.get('canvas.history__chart-canvas-ratio')
            .should('exist');

        cy.get('div#history.account__block-down.history')
            .should('exist');
        // Проверяем что при клике на кнопку 'Показать еще' история увеличилась
        cy.get('div#history.account__block-down.history')
            .invoke('outerHeight')
            .then((initialHeight) => {
                cy.get('div#history.account__block-down.history').find('button.btn')
                    .contains('Показать еще')
                    .should('exist')
                    .click();

                cy.get('div#history.account__block-down.history')
                    .invoke('outerHeight')
                    .should('be.greaterThan', initialHeight);
            });
        // Проверяем кноаку 'Вернуться назад'
        cy.get('button.btn.account__button-accounts-back')
            .should('exist')
            .click();

        cy.wait(500);
        cy.url().should('include', `/account/${accountNumber}`);
        // Проверяем кноаку 'Вернуться назад'
        cy.get('button.btn.account__button-accounts-back')
            .should('exist')
            .click();

        cy.wait(500);
        cy.url().should('include', `/accounts`);
        // Кнопка 'Счета' на одноименной странице отключена
        cy.get('#accounts-button')
            .should('exist')
            .and('be.disabled');
    });
});




