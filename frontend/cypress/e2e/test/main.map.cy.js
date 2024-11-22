describe('Navigation to Banks Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');

        cy.get('#login').type('developer');
        cy.get('#password').type('skillbox');
        cy.get('#btn-submit').click();
    });

    it('should navigate to the Banks page when the Banks button is clicked', () => {
        cy.get('#ATM-button').should('be.visible').click();
        cy.wait(1000);
        // Проверяем отрисовку основных элементов
        cy.url().should('include', '/banks');

        cy.contains('Карта банкоматов');

        cy.url().should('include', '/banks');

        cy.get('[class*="ymaps"][class*="placemark"]')
            .should('exist')
            .and('have.length.greaterThan', 0);
    });
});