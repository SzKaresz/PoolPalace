describe('Kosár és Termék Oldal Folyamatok', () => {
    const baseUrl = Cypress.config('baseUrl');
    let firstPopularProductCikkszam = null;
    let firstDiscountedProductCikkszam = null;
    let firstProductsPageCikkszam = null;

    describe('Termék Kosárba Helyezése', () => {
        it('Kosárba tesz egy népszerű terméket a Kezdőlapról', () => {
            cy.visit(baseUrl + 'index.php');
            cy.get('#kartyak .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
            cy.get('#kartyak .card').first().within(() => {
                cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                    firstPopularProductCikkszam = cikkszam;
                    cy.contains('button', 'Kosárba').click({ force: true });
                });
            });
            cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '1');
        });

        it('Kosárba tesz egy akciós terméket a Kezdőlapról', () => {
            cy.visit(baseUrl + 'index.php');
            cy.get('#akciok .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
            cy.get('#akciok .card').first().within(() => {
                cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                    firstDiscountedProductCikkszam = cikkszam;
                    cy.contains('button', 'Kosárba').click({ force: true });
                });
            });
            cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and(($badge) => {
                const currentCount = parseInt($badge.text());
                expect(currentCount).to.be.at.least(1);
            });
        });

        it('Kosárba tesz egy terméket a Termékek oldalról', () => {
            cy.visit(baseUrl + 'termekek.php');
            cy.get('#kartyak .card', { timeout: 15000 }).should('exist');
            cy.get('#kartyak .card').first().within(() => {
                cy.get('button.add-to-cart').invoke('attr', 'data-id').then((cikkszam) => {
                    firstProductsPageCikkszam = cikkszam;
                    cy.log(`Kosárba tett termék cikkszáma a Termékek oldalról: ${cikkszam}`);
                    cy.contains('button', 'Kosárba').click({ force: true });
                });
            });
            cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and(($badge) => {
                const currentCount = parseInt($badge.text());
                expect(currentCount).to.be.at.least(1);
            });
        });
    });
});