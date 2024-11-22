describe('Authorization', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000');
    });

    it('should show an error message with invalid credentials', () => {
        cy.get('#login').type('invalidUsername');
        cy.get('#password').type('invalidPassword');

        cy.get('#btn-submit').click();
        cy.wait(100);

        cy.get('#auth-error-wrapper')
            .should('be.visible');

        cy.get('.auth__error')
            .should('be.visible')
            .and('contain', 'No such user');

        cy.get('.auth-error-btn').click();
        cy.wait(100);

        cy.get('#auth-error-wrapper')
            .should('not.exist')
    });

    it('should successfully log in with valid credentials', () => {
        cy.get('#login').type('developer');
        cy.get('#password').type('skillbox');

        cy.get('#btn-submit').click();
        cy.wait(100);

        cy.url().should('include', '/accounts');
    });
});