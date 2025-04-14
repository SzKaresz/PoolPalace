describe('Rólunk Oldal - Kapcsolatfelvételi Űrlap', () => {
    const baseUrl = Cypress.config('baseUrl');
    it('Kitölti és elküldi a kapcsolatfelvételi űrlapot', () => {
        cy.visit(baseUrl + 'rolunk.php');
        const timestamp = Date.now();
        const testData = {
            nev: `Teszt Küldő ${timestamp}`,
            email: `teszt_kuldo_${timestamp}@example.com`,
            targy: `Teszt Üzenet Tárgya ${timestamp}`,
            uzenet: `Ez egy automatizált teszt üzenet a Rólunk oldalról.\nIdőbélyeg: ${timestamp}`
        };
        cy.get('#nev').type(testData.nev);
        cy.get('#email').type(testData.email);
        cy.get('input[name="email_targya"]').type(testData.targy);
        cy.get('textarea[name="email_szovege"]').type(testData.uzenet);
        cy.get('#adatkez').check();
        cy.solveGoogleReCAPTCHA();
        cy.wait(1000);
        cy.get('#kuldesGomb').click();
        cy.get('.toast-container .toast.text-bg-success', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', 'Az üzenet sikeresen elküldve.');
        cy.get('#nev').should('have.value', '');
        cy.get('#email').should('have.value', '');
        cy.get('input[name="email_targya"]').should('have.value', '');
        cy.get('textarea[name="email_szovege"]').should('have.value', '');
        cy.get('#adatkez').should('not.be.checked');
    });
});