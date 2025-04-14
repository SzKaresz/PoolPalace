describe('Kezdőlap - Tippek Szekció és Tippek Oldal', () => {
    const baseUrl = Cypress.config('baseUrl');
    it('Navigál a Tippek oldalra és ellenőrzi a tartalmat', () => {
        cy.visit(baseUrl + 'index.php');
        cy.get('section.tippek a').first().click();
        cy.url().should('include', '/php/tipp.php');
        cy.get('.container.my-5 .row.my-5').should('have.length', 5);
        cy.get('.container.my-5 .row.my-5').each(($row) => {
            cy.wrap($row).find('h2').should('exist').and('be.visible');
            cy.wrap($row).find('p').should('exist').and('be.visible');
            cy.wrap($row).find('img.img-fluid')
                .should('exist')
                .and('be.visible')
                .and(($img) => {
                    expect($img[0].naturalWidth).to.be.greaterThan(0);
                });
        });
    });
});