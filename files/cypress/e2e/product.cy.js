describe('Termék Oldal Funkciók', () => {
    const baseUrl = Cypress.config('baseUrl');
    const testCikkszam = '010003';

    beforeEach(() => {
        cy.visit(`${baseUrl}termekOldal.php?cikkszam=${testCikkszam}`);
        cy.get('.product-title', { timeout: 10000 }).should('be.visible');
    });

    it('Megjeleníti a termék alapvető adatait', () => {
        cy.get('.product-title').should('not.be.empty');
        cy.get('.product-meta span').should('contain.text', `Cikkszám: ${testCikkszam}`);
        cy.get('.price-section').should('be.visible');
        cy.get('.stock-status').should('contain.text', 'Raktáron').and('have.class', 'text-success');
    });

    it('Működik a kép carousel (ha több kép van)', () => {
        cy.get('body').then($body => {
            if ($body.find('.carousel-thumbnails .thumbnail-item').length > 1) {
                cy.log('Több kép található, carousel tesztelése...');
                cy.get('#productCarousel .carousel-item').first().should('have.class', 'active');
                cy.get('.carousel-thumbnails .thumbnail-item').first().should('have.class', 'active');

                cy.get('.carousel-control-next').should('be.visible').click();
                cy.get('#productCarousel .carousel-item').eq(1).should('have.class', 'active');
                cy.get('.carousel-thumbnails .thumbnail-item').eq(1).should('have.class', 'active');

                cy.get('.carousel-control-prev').should('be.visible').click();
                cy.get('#productCarousel .carousel-item').first().should('have.class', 'active');
                cy.get('.carousel-thumbnails .thumbnail-item').first().should('have.class', 'active');

                cy.get('.carousel-thumbnails .thumbnail-item').eq(1).click();
                cy.get('#productCarousel .carousel-item').eq(1).should('have.class', 'active');
                cy.get('.carousel-thumbnails .thumbnail-item').eq(1).should('have.class', 'active');

            } else {
                cy.log('Csak egy kép van, carousel navigáció nem tesztelhető.');
                cy.get('.carousel-control-next').should('not.exist');
                cy.get('.carousel-thumbnails').should('not.exist');
            }
        });
    });

    it('Működik a kép nagyítás', () => {
        cy.get('#productCarousel .carousel-item.active .zoomable-image')
            .should('be.visible').click();
        cy.get('#imageZoomModal').should('be.visible');
        cy.get('#zoomedImage').should('be.visible')
            .and('have.attr', 'src')
            .and('not.be.empty');
        cy.get('#imageZoomModal .btn-close').click();
        cy.get('#imageZoomModal').should('not.be.visible');
    });

    it('Működik a mennyiség választó (raktáron lévő terméknél)', () => {
        cy.get('.stock-status').should('contain.text', 'Raktáron');
        cy.get('.quantity-input').should('have.value', '1');
        cy.get('.quantity-btn.minus').should('be.disabled');
        cy.get('.quantity-btn.plus').click();
        cy.get('.quantity-input').should('have.value', '2');
        cy.get('.quantity-btn.minus').should('not.be.disabled');
        cy.get('.quantity-btn.minus').click();
        cy.get('.quantity-input').should('have.value', '1');
        cy.get('.quantity-btn.minus').should('be.disabled');

        cy.get('.quantity-input').invoke('attr', 'max').then((maxStr) => {
            const max = parseInt(maxStr);
            if (max && max > 1) {
                cy.log(`Maximum készlet tesztelése (${max} db)`);
                cy.get('.quantity-input').clear().type(max.toString()).blur();
                cy.get('.quantity-input').should('have.value', max.toString());
                cy.get('.quantity-btn.plus').should('be.disabled');
                cy.get('.quantity-input').clear().type((max + 1).toString()).blur();
                cy.get('.quantity-input').should('have.value', max.toString());
                cy.get('.quantity-input').clear().type('1').blur();
                cy.get('.quantity-btn.minus').should('be.disabled');
                cy.get('.quantity-btn.plus').should('not.be.disabled');

            } else {
                cy.log('Maximum készlet 1 vagy nem meghatározott, további teszt kihagyva.');
                cy.get('.quantity-btn.plus').should('be.disabled');
            }
        });
    });

    it('Sikeresen kosárba helyez egy terméket', () => {
        cy.get('.stock-status').should('contain.text', 'Raktáron');

        let initialCartCount = 0;
        cy.get('body').then($body => {
            if ($body.find('#cart-count').length > 0) {
                cy.get('#cart-count').invoke('text').then(text => {
                    initialCartCount = parseInt(text) || 0;
                });
            } else {
                initialCartCount = 0;
            }
        });

        cy.get('.quantity-input').should('have.value', '1');
        cy.get('.quantity-btn.plus').click();
        cy.get('.quantity-input').should('have.value', '2');

        cy.get('button.add-to-cart')
            .should('be.visible')
            .click();

        cy.get('#toast-container .toast', { timeout: 10000 }).should('be.visible');

        cy.get('#cart-count', { timeout: 5000 }).should('be.visible').and($badge => {
            const newCount = parseInt($badge.text());
            expect(newCount).to.eq(initialCartCount + 2);
        });

        cy.get('.quantity-input').should('have.value', '1');
        cy.get('.quantity-btn.minus').should('be.disabled');
    });

    it('Működik a termékleírás accordion', () => {
        cy.get('#collapseOne').should('not.be.visible');
        cy.get('#descriptionAccordion .accordion-button')
            .should('exist')
            .click();
        cy.get('#collapseOne').should('be.visible');
        cy.get('#collapseOne .accordion-body').should('be.visible');
        cy.get('#descriptionAccordion .accordion-button').click();
        cy.get('#collapseOne').should('not.be.visible');
    });
});