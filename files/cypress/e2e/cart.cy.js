describe('Kosár Funkciók Tesztelése (Vendég)', () => {
    const baseUrl = Cypress.config('baseUrl');
    const termekekUrl = baseUrl + 'termekek.php';
    const kosarUrl = baseUrl + 'kosar.php';
    let elsoTermekCikkszam = null;
    let masodikTermekCikkszam = null;

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();

        cy.visit(termekekUrl);
        cy.get('#kartyak .card .add-to-cart', { timeout: 15000 })
            .should('have.length.greaterThan', 0)
            .first()
            .invoke('attr', 'data-id')
            .then((cikkszam) => {
                elsoTermekCikkszam = cikkszam;
                cy.log(`Első teszt termék cikkszáma: ${elsoTermekCikkszam}`);
            });

        cy.get('#kartyak .card .add-to-cart').then($buttons => {
            if ($buttons.length > 1) {
                masodikTermekCikkszam = $buttons.eq(1).attr('data-id');
                cy.log(`Második teszt termék cikkszáma: ${masodikTermekCikkszam}`);
            }
        });
        cy.get('#kartyak .card', { timeout: 15000 }).should('have.length.greaterThan', 0);

        cy.log('Ellenőrzés és explicit kosárürítés, ha szükséges...');
        cy.intercept('POST', '**/kosarMuvelet.php').as('cartActionBefore');
        cy.visit(kosarUrl);
        cy.get('body').then($body => {
            if ($body.find('.delete-btn:visible').length > 0) {
                cy.log('Kosár nem üres, ürítés kezdeményezése...');
                cy.get('.delete-btn').click();
                cy.get('#clearCartModal', { timeout: 5000 }).should('be.visible');
                cy.get('#confirmClearCart').click();
                cy.wait('@cartActionBefore');
                cy.get('.empty-cart-message', { timeout: 5000 }).should('be.visible');
                cy.log('Kosár sikeresen kiürítve a beforeEach-ben.');
            } else {
                cy.log('Kosár már üres, nincs szükség ürítésre.');
                cy.get('.empty-cart-message', { timeout: 5000 }).should('be.visible');
            }
        });
    });

    it('1. Termék hozzáadása a terméklistáról és a darabszám ellenőrzése', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('addToCart');
        cy.visit(termekekUrl);

        cy.get('#cart-count').should('not.exist');
        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait('@addToCart');
        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '1');

        if (masodikTermekCikkszam) {
            cy.get(`#kartyak .card .add-to-cart[data-id="${masodikTermekCikkszam}"]`).click();
            cy.wait('@addToCart');
            cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '2');
        }
    });

    it('2. Kosár oldal megtekintése és tartalom ellenőrzése', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('addToCart');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait('@addToCart');
        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and('contain.text', '1');

        cy.visit(kosarUrl);

        cy.get('.cart-table tbody tr').should('have.length', 1);
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"]`).should('exist');
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .cart-name`).should('not.be.empty');
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-input`).should('have.value', '1');
        cy.get('.cart-summary h3.osszesen', { timeout: 10000 })
            .invoke('text')
            .should('match', /Összesen: [1-9]\d*(\s?\d+)*\s+Ft$/);

        cy.get('.empty-cart-message').should('not.be.visible');
    });

     it('3. Mennyiség növelése és csökkentése a kosár oldalon', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('updateCart');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait(500);

        cy.visit(kosarUrl);
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"]`, { timeout: 10000 }).should('exist');

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-btn.plus`).click();
        cy.wait('@updateCart');
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-input`).should('have.value', '2');
        cy.get('#cart-count', { timeout: 5000 }).should('contain.text', '2');

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-btn.minus`).click();
        cy.wait('@updateCart');
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-input`).should('have.value', '1');
        cy.get('#cart-count', { timeout: 5000 }).should('contain.text', '1');
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-btn.minus`).should('be.disabled');
    });

     it('4. Mennyiség manuális beírása a kosár oldalon', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('updateCart');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait(500);

        cy.visit(kosarUrl);
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"]`, { timeout: 10000 }).should('exist');
        cy.get('.cart-table tbody tr').should('have.length', 1);

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-input`)
            .clear()
            .type('3')
            .blur();

        cy.wait('@updateCart');

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .quantity-input`).should('have.value', '3');
        cy.get('#cart-count', { timeout: 5000 }).should('contain.text', '3');
    });

    it('5. Termék eltávolítása a kosárból', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('cartAction');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait('@cartAction');
        if (masodikTermekCikkszam) {
            cy.get(`#kartyak .card .add-to-cart[data-id="${masodikTermekCikkszam}"]`).click();
            cy.wait('@cartAction');
        }
        const expectedInitialCount = masodikTermekCikkszam ? '2' : '1';
        cy.get('#cart-count', { timeout: 5000 }).should('contain.text', expectedInitialCount);

        cy.visit(kosarUrl);
        const expectedInitialRows = masodikTermekCikkszam ? 2 : 1;
        cy.get('.cart-table tbody tr', { timeout: 10000 }).should('have.length', expectedInitialRows);

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"] .remove-btn`).click();
        cy.wait('@cartAction');

        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"]`).should('not.exist');
        const expectedFinalRows = masodikTermekCikkszam ? 1 : 0;
        cy.get('.cart-table tbody tr').should('have.length', expectedFinalRows);

        if (!masodikTermekCikkszam) {
             cy.get('body').then(($body) => {
                if ($body.find('#cart-count').length > 0) {
                  cy.get('#cart-count').should('contain.text', '0');
                } else {
                  cy.get('#cart-count').should('not.exist');
                }
             });
             cy.get('.empty-cart-message').should('be.visible');
        } else {
             cy.get('#cart-count', { timeout: 5000 }).should('contain.text', '1');
        }
    });

    it('6. Kosár kiürítése gombbal', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('cartAction');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait('@cartAction');
        if (masodikTermekCikkszam) {
            cy.get(`#kartyak .card .add-to-cart[data-id="${masodikTermekCikkszam}"]`).click();
            cy.wait('@cartAction');
        }

        cy.visit(kosarUrl);
        cy.get('.cart-table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);

        cy.get('.delete-btn').click();
        cy.get('#clearCartModal').should('be.visible');
        cy.get('#confirmClearCart').click();
        cy.wait('@cartAction');
        cy.wait(200);

        cy.get('.cart-table tbody tr').should('have.length', 0);
        cy.get('.empty-cart-message').should('be.visible');
        cy.get('#cart-count', { timeout: 5000 }).should('contain.text', '0');
    });

    it('7. Navigáció a megrendelés oldalra', () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('addToCart');
        cy.visit(termekekUrl);

        cy.get(`#kartyak .card .add-to-cart[data-id="${elsoTermekCikkszam}"]`).click();
        cy.wait('@addToCart');

        cy.visit(kosarUrl);
        cy.get(`.cart-table tbody tr[data-id="${elsoTermekCikkszam}"]`, { timeout: 10000 }).should('exist');

        cy.get('.checkout-btn').click();

        cy.url().should('include', '/php/megrendeles.php');
        cy.contains('h2', 'Megrendelés adatai').should('be.visible');
    });

    it('8. Üres kosár üzenet megjelenítése', () => {
        cy.visit(kosarUrl);
        cy.get('.cart-table tbody tr').should('have.length', 0);
        cy.get('.empty-cart-message').should('be.visible');
        cy.get('.cart-summary').should('not.exist');
        cy.get('.delete-btn').should('not.exist');
        cy.get('.checkout-btn').should('not.exist');
    });

});