describe('Elfelejtett Jelszó Oldal', () => {
    const baseUrl = Cypress.config('baseUrl');
    it('Kitölti az elfelejtett jelszó űrlapot és elküldi', () => {
        cy.visit(baseUrl + 'elfelejtett_jelszo.php');
        cy.get('#email').type('szautnerkaroly@gmail.com');
        cy.solveGoogleReCAPTCHA();
        cy.wait(1000);
        cy.get('#kuldes').click();
        cy.get('#toast-container .toast.text-bg-success', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', 'Sikeres küldés!');
    });
});