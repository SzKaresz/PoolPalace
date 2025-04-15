describe('Pénztár/Megrendelés Folyamat (Vendég)', () => {
    const baseUrl = Cypress.config('baseUrl');
    const termekekUrl = baseUrl + 'termekek.php';
    const kosarUrl = baseUrl + 'kosar.php';
    const megrendelesUrl = baseUrl + 'megrendeles.php';
    let tesztTermek = {
        id: null,
        name: null,
        price: null,
        quantity: 1
    };

    const setupCheckoutWithItem = () => {
        cy.intercept('POST', '**/kosarMuvelet.php').as('cartAction');
        cy.visit(termekekUrl);

        cy.get('#kartyak .card', { timeout: 15000 })
            .should('have.length.greaterThan', 0)
            .first()
            .within(() => {
                cy.get('.add-to-cart')
                  .invoke('attr', 'data-id')
                  .then(id => { tesztTermek.id = id; });
                cy.get('.card-title').invoke('text').then(name => { tesztTermek.name = name.trim(); });
             })
            .then(() => {
                cy.log(`Termék hozzáadása: ${tesztTermek.id}`);
                cy.get(`#kartyak .card .add-to-cart[data-id="${tesztTermek.id}"]`).click();
                cy.wait('@cartAction');
                cy.get('#cart-count', { timeout: 5000 }).should('contain.text', tesztTermek.quantity);
                cy.wait(150);
            });

        cy.log(`Navigálás ide: ${megrendelesUrl}`);
        cy.visit(megrendelesUrl);

        cy.url({ timeout: 5000 }).should('eq', megrendelesUrl);
        cy.log('URL ellenőrzés sikeres, a megrendeles.php oldalon vagyunk.');

        cy.contains('h2', 'Megrendelés adatai', { timeout: 10000 }).should('be.visible');
        cy.get('#place-order-btn', { timeout: 10000 }).should('be.visible');
        cy.log('Statikus elemek (cím, gomb) betöltődtek.');

        cy.get('#kosar-container', { timeout: 10000 }).should('be.visible');
        cy.log('Összesítő (#kosar-container) megtalálva és látható.');
    };

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
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

    context('Űrlap Validáció (Vendég)', () => {
        beforeEach(() => {
            setupCheckoutWithItem();
        });

        it('Üres mezők - Hibaüzenetek megjelenítése a kötelező mezőknél', () => {
             // Nyissuk ki az accordionokat, hogy a validáció látható legyen
             cy.get('[data-bs-target="#shippingCollapse"]').click();
             cy.get('#shippingCollapse').should('be.visible');
             cy.get('[data-bs-target="#billingCollapse"]').click();
             cy.get('#billingCollapse').should('be.visible');

            cy.get('#place-order-btn').click();

            cy.get('#name').should('have.class', 'is-invalid');
            cy.get('#name').focus();
            cy.get('#name').should('have.attr', 'data-bs-original-title').and('contain', 'Legalább 6 karakter, 1 szóköz, 2 nagybetű.');

            cy.get('#email').should('have.class', 'is-invalid');
            cy.get('#email').focus();
            cy.get('#email').should('have.attr', 'data-bs-original-title').and('contain', 'Érvényes e-mail cím szükséges.');

            cy.get('#phone').should('have.class', 'is-invalid');
            cy.get('#phone').focus();
            cy.get('#phone').should('have.attr', 'data-bs-original-title').and('contain', 'Formátum: +36.. vagy 06.. (11 számjegy).');

            cy.get('#shipping-postal_code').should('have.class', 'is-invalid');
            cy.get('#shipping-postal_code').focus();
            cy.get('#shipping-postal_code').should('have.attr', 'data-bs-original-title').and('contain', '4 jegyű szám.');

            cy.get('#shipping-city').should('have.class', 'is-invalid');
            cy.get('#shipping-city').focus();
            cy.get('#shipping-city').should('have.attr', 'data-bs-original-title').and('contain', 'Minimum 2 karakter.');

            cy.get('#shipping-address').should('have.class', 'is-invalid');
            cy.get('#shipping-address').focus();
            cy.get('#shipping-address').should('have.attr', 'data-bs-original-title').and('contain', 'Min. 8 kar., 2 szóköz, 1 szám.');

            cy.get('#billing-postal_code').should('have.class', 'is-invalid');
            cy.get('#billing-postal_code').focus();
            cy.get('#billing-postal_code').should('have.attr', 'data-bs-original-title').and('contain', '4 jegyű szám.');

             cy.get('#billing-city').should('have.class', 'is-invalid');
            cy.get('#billing-city').focus();
            cy.get('#billing-city').should('have.attr', 'data-bs-original-title').and('contain', 'Minimum 2 karakter.');

            cy.get('#billing-address').should('have.class', 'is-invalid');
            cy.get('#billing-address').focus();
            cy.get('#billing-address').should('have.attr', 'data-bs-original-title').and('contain', 'Min. 8 kar., 2 szóköz, 1 szám.');

        });

        it('Érvénytelen email formátum - Hibaüzenet megjelenítése', () => {
            cy.get('#email').type('invalid-email');
            cy.get('#place-order-btn').click();
            cy.get('#email').should('have.class', 'is-invalid');
             cy.get('#email').focus();
            cy.get('#email').should('have.attr', 'data-bs-original-title').and('contain', 'Érvényes e-mail cím szükséges.');
        });

        it('Érvénytelen telefon formátum - Hibaüzenet megjelenítése', () => {
            cy.get('#phone').type('invalid-phone');
            cy.get('#place-order-btn').click();
            cy.get('#phone').should('have.class', 'is-invalid');
            cy.get('#phone').focus();
            cy.get('#phone').should('have.attr', 'data-bs-original-title').and('contain', 'Formátum: +36.. vagy 06.. (11 számjegy).');
        });

        it('Érvénytelen irányítószám formátum - Hibaüzenet megjelenítése', () => {
            cy.get('[data-bs-target="#shippingCollapse"]').click();
            cy.get('#shippingCollapse').should('be.visible');

            cy.get('#shipping-postal_code').type('123');
            cy.get('#place-order-btn').click();
            cy.get('#shipping-postal_code').should('have.class', 'is-invalid');
            cy.get('#shipping-postal_code').focus();
            cy.get('#shipping-postal_code').should('have.attr', 'data-bs-original-title').and('contain', '4 jegyű szám.');

            cy.get('#shipping-postal_code').clear().type('12345');
            cy.get('#place-order-btn').click();
            cy.get('#shipping-postal_code').should('have.class', 'is-invalid');
            cy.get('#shipping-postal_code').focus();
            cy.get('#shipping-postal_code').should('have.attr', 'data-bs-original-title').and('contain', '4 jegyű szám.');

            cy.get('#shipping-postal_code').clear().type('abcd');
            cy.get('#place-order-btn').click();
            cy.get('#shipping-postal_code').should('have.class', 'is-invalid');
            cy.get('#shipping-postal_code').focus();
            cy.get('#shipping-postal_code').should('have.attr', 'data-bs-original-title').and('contain', '4 jegyű szám.');
        });

         it('Szállítási és fizetési mód nincs kiválasztva - (Toast üzenet ellenőrzése kihagyva)', () => {
            cy.get('[data-bs-target="#shippingCollapse"]').click();
            cy.get('#shippingCollapse').should('be.visible');
            cy.get('[data-bs-target="#billingCollapse"]').click();
            cy.get('#billingCollapse').should('be.visible');

            cy.get('#name').type('Teszt Elek Teszt');
            cy.get('#email').type('teszt@elek.hu');
            cy.get('#phone').type('+36301234567');
            cy.get('#shipping-postal_code').type('8200');
            cy.get('#shipping-city').type('Veszprém');
            cy.get('#shipping-address').type('Teszt utca 10.');
            cy.get('#billing-postal_code').type('8200');
            cy.get('#billing-city').type('Veszprém');
            cy.get('#billing-address').type('Teszt utca 10.');

            cy.get('#place-order-btn').click();

            cy.get('#name').should('not.have.class', 'is-invalid');
            cy.get('#email').should('not.have.class', 'is-invalid');
            cy.get('#phone').should('not.have.class', 'is-invalid');
            cy.get('#shipping-postal_code').should('not.have.class', 'is-invalid');
            cy.get('#shipping-city').should('not.have.class', 'is-invalid');
            cy.get('#shipping-address').should('not.have.class', 'is-invalid');
            cy.get('#billing-postal_code').should('not.have.class', 'is-invalid');
            cy.get('#billing-city').should('not.have.class', 'is-invalid');
            cy.get('#billing-address').should('not.have.class', 'is-invalid');

            cy.url().should('eq', megrendelesUrl);
        });
    });

    context('Rendelés Összesítő és Mód választás (Vendég)', () => {
         beforeEach(() => {
            setupCheckoutWithItem();
         });

         it('Rendelés összesítő - Megjeleníti a helyes terméket és végösszeget', () => {
             cy.get('#cart-items li.list-group-item', { timeout: 10000 }).should('have.length', 1);
             cy.get('#cart-items li.list-group-item').first().within(() => {
                cy.get('.cart-product').should('contain.text', tesztTermek.name);
                cy.get('.text-muted').first().should('contain.text', tesztTermek.id);
                cy.get('.text-muted').last().should('contain.text', `${tesztTermek.quantity} x`);
             });

             cy.get('#total-price').should(($span) => {
                 const priceText = $span.text().replace(/\s|Ft/g, '');
                 expect(parseInt(priceText, 10)).to.be.greaterThan(0);
             });
         });

        it('Szállítási mód kiválasztása', () => {
            cy.log('Szállítási mód választás teszt kihagyva (nincs elem a formban).');
        });

         it('Fizetési mód kiválasztása', () => {
            cy.get('#payment-card').should('be.checked');

            cy.get('label[for="payment-cash"]').click();
            cy.get('#payment-cash').should('be.checked');
            cy.get('#payment-card').should('not.be.checked');
            cy.get('#payment-transfer').should('not.be.checked');

            cy.get('label[for="payment-transfer"]').click();
            cy.get('#payment-transfer').should('be.checked');
            cy.get('#payment-cash').should('not.be.checked');
            cy.get('#payment-card').should('not.be.checked');
         });
    });
});