describe('Currency Exchange Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');

        cy.get('#login').type('developer');
        cy.get('#password').type('skillbox');
        cy.get('#btn-submit').click();
    });

    it('should navigate to the Currency Exchange page', () => {
        cy.get('#crypto-button').click();
        cy.wait(5000); // Для начала получения данных с вебсокета!

        cy.url().should('include', '/currencies');
        // Проверяем отрисовку основных элементов
        cy.contains('Валютный обмен').should('be.visible');
        // "Ваши валюты"
        cy.get('.currencies__currencies-accounts-title').should('be.visible');
        cy.get('.currencies__currencies-box#currencies-accounts-box').should('be.visible');
        // "Обмен валюты"
        cy.get('.currencies__exchange-title').should('be.visible');
        cy.get('.currencies__descr-from').should('be.visible');
        cy.get('.currencies__input-from.custom-select').should('be.visible');
        cy.get('.currencies__descr-to').should('be.visible');
        cy.get('.currencies__input-to.custom-select').should('be.visible');
        cy.get('.currencies__descr-amount').should('be.visible');
        cy.get('.currencies__input-amount#currencies-amount').should('be.visible');
        cy.get('.btn.currencies__exchange-currencies').should('be.visible');
        // "Изменение курсов в реальном времени"
        cy.get('.currencies__crypto-currencies-title').should('be.visible');
        cy.get('.currencies__change-crypto-currencies-box#change-crypto-currencies-box').should('be.visible');
    });

    it('should exchange currency successfully', () => {
        let btcAmountBefore;
        let eurAmountBefore;
        let btcAmountAfter;
        let eurAmountAfter;
        const transferAmount = 10;

        cy.get('#crypto-button').click();
        cy.wait(3000);
        // Получаем сумму BTC до перевода
        cy.get('.currencies__crypto-currency-account').within(() => {
            cy.contains('.currencies__currency-descr', 'BTC').then(($btcDescr) => {
                cy.wrap($btcDescr).closest('.currencies__crypto-currency-account').find('.currencies__currency-amount-descr')
                    .invoke('text')
                    .then((amount) => {
                        btcAmountBefore = parseFloat(amount.trim());
                        cy.log(`BTC Amount Before: ${btcAmountBefore}`);
                    });
            });
        });
        // Получаем сумму EUR до перевода
        cy.get('.currencies__crypto-currency-account').within(() => {
            cy.contains('.currencies__currency-descr', 'EUR').then(($eurDescr) => {
                cy.wrap($eurDescr).closest('.currencies__crypto-currency-account').find('.currencies__currency-amount-descr')
                    .invoke('text')
                    .then((amount) => {
                        eurAmountBefore = parseFloat(amount.trim());
                        cy.log(`EUR Amount Before: ${eurAmountBefore}`);
                    });
            });
        });
        // Выбираем BTC
        cy.get('#selected-from').click();
        cy.get('.option[data-value="BTC"]:visible')
            .should('have.length', 1)
            .first()
            .click();
        // Выбираем EUR
        cy.get('#selected-to').click();
        cy.get('.option[data-value="EUR"]:visible')
            .should('have.length', 1)
            .first()
            .click();
        // Заполняем сумму
        cy.get('#currencies-amount')
            .clear()
            .type(transferAmount.toString());

        cy.get('#btn-transfer-crypto').click();
        cy.wait(3000)

        // Получаем сумму BTC после перевода и проверяем уменьшение суммы
        cy.get('.currencies__crypto-currency-account').within(() => {
            cy.contains('.currencies__currency-descr', 'BTC').then(($btcDescr) => {
                cy.wrap($btcDescr).closest('.currencies__crypto-currency-account').find('.currencies__currency-amount-descr')
                    .invoke('text')
                    .then((amount) => {
                        btcAmountAfter = parseFloat(amount.trim());
                        cy.log(`BTC Amount Before: ${btcAmountAfter}`);

                        expect(btcAmountAfter).to.eq(btcAmountBefore - transferAmount);
                    });
            });
        });
        // Получаем сумму EUR после перевода и проверяем увеличение суммы
        cy.get('.currencies__crypto-currency-account').within(() => {
            cy.contains('.currencies__currency-descr', 'EUR').then(($eurDescr) => {
                cy.wrap($eurDescr).closest('.currencies__crypto-currency-account').find('.currencies__currency-amount-descr')
                    .invoke('text')
                    .then((amount) => {
                        eurAmountAfter = parseFloat(amount.trim());
                        cy.log(`EUR Amount Before: ${eurAmountAfter}`);
                        expect(eurAmountAfter).to.be.greaterThan(eurAmountBefore);
                    });
            });
        });
    });
});