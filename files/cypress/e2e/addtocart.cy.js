describe('Kosárba helyezés', () => {
    const baseUrl = Cypress.config('baseUrl');
    let firstPopularProductCikkszam = null;
    let firstDiscountedProductCikkszam = null;
    let firstProductsPageCikkszam = null;

    it('Több terméket helyez a kosárba különböző oldalakról', () => {
        cy.visit(baseUrl + 'index.php');
        cy.get('#kartyak .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
        cy.get('#kartyak .card').first().within(() => {
            cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                firstPopularProductCikkszam = cikkszam;
                cy.log(`Kosárba tesz (népszerű): ${cikkszam}`);
                cy.contains('button', 'Kosárba').click({ force: true });
            });
        });
        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '1');


        cy.get('#akciok .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
        cy.get('#akciok .card').first().within(() => {
            cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                firstDiscountedProductCikkszam = cikkszam;
                cy.log(`Kosárba tesz (akciós): ${cikkszam}`);
                cy.get('button.add-to-cart').click({ force: true });
            });
        });
        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '2');

        
        cy.visit(baseUrl + 'termekek.php');
        cy.get('#kartyak-container .card', { timeout: 15000 }).should('exist');
        cy.get('#kartyak-container .card').first().within(() => {
            cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                firstProductsPageCikkszam = cikkszam;
                cy.log(`Kosárba tesz (termekek.php): ${cikkszam}`);
                cy.get('button.add-to-cart').click({ force: true });
            });
        });
        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '3');
    });
});