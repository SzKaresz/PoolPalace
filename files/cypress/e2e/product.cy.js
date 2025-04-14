describe('Termék Oldal Tesztelése', () => {
    const baseUrl = Cypress.config('baseUrl');
    const validCikkszam = '010001';
    const invalidCikkszam = '999999';
    const productPageUrl = (cikkszam) => `${baseUrl}termekOldal.php?cikkszam=${cikkszam}`;
  
    it('Sikeresen betölti a termékoldalt érvényes cikkszámmal', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('.product-title').should('exist').and('not.be.empty');
      cy.get('.price-section').should('exist');
      cy.get('.stock-status').should('exist');
      cy.get('#productCarousel').should('be.visible');
      cy.get('.add-to-cart-section').should('exist');
      cy.get('.breadcrumb').should('be.visible');
      cy.get('#descriptionAccordion').should('exist');
    });
  
    it('Hibaüzenetet jelenít meg érvénytelen cikkszámnál (vagy átirányít)', () => {
      cy.request({
        url: productPageUrl(invalidCikkszam),
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          cy.visit(productPageUrl(invalidCikkszam));
          cy.contains('A termék nem található.', { timeout: 10000 }).should('be.visible');
        } else if (response.status === 302 || response.status === 301) {
          cy.log('Átirányítás történt, ami várható érvénytelen cikkszámnál.');
          expect(response.redirectedToUrl).to.include('termekek.php');
        } else {
           cy.visit(productPageUrl(invalidCikkszam), {failOnStatusCode: false});
           cy.contains('A termék nem található.', { timeout: 10000 }).should('be.visible');
        }
      });
    });
  
    it('Megjeleníti a termék képeit és a bélyegképeket', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('#productCarousel .carousel-item img').first()
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
      cy.get('.carousel-thumbnails .thumbnail-item').should('have.length.at.least', 1);
      cy.get('.carousel-thumbnails .thumbnail-item').first().should('have.class', 'active');
    });
  
    it('Működik a mennyiségválasztó (+/- gombok és beviteli mező)', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('.add-to-cart-section').then($section => {
        if ($section.find('.quantity-input').length > 0) {
          cy.get('.quantity-input').should('have.value', '1');
          cy.get('.quantity-btn.plus').click();
          cy.get('.quantity-input').should('have.value', '2');
          cy.get('.quantity-btn.minus').click();
          cy.get('.quantity-input').should('have.value', '1')
          cy.get('.quantity-btn.minus').should('be.disabled');
          cy.get('.quantity-input').clear().type('5').blur();
          cy.get('.quantity-input').should('have.value', '5');
          cy.get('.quantity-input').invoke('attr', 'max').then(max => {
            const maxNum = parseInt(max);
            cy.get('.quantity-input').clear().type((maxNum + 1).toString()).blur();
            cy.get('.quantity-input').should('have.value', maxNum.toString());
            cy.get('.quantity-btn.plus').should('be.disabled');
          });
        } else {
          cy.log('Nincs készleten, mennyiségválasztó nem tesztelhető.');
        }
      });
    });
  
    it('Hozzáadja a terméket a kosárhoz', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('.add-to-cart-section').then($section => {
        if ($section.find('button.add-to-cart').length > 0) {
          cy.get('.quantity-input').clear().type('1');
          cy.get('button.add-to-cart').click();
          cy.get('#cart-count', { timeout: 10000 }).should('be.visible').and(($badge) => {
            const currentCount = parseInt($badge.text());
            expect(currentCount).to.be.at.least(1);
          });
        } else {
          cy.log('Nincs készleten, kosárba helyezés nem tesztelhető.');
        }
      });
    });
  
    it('Megjeleníti a "Nincs készleten" üzenetet, ha a termék nincs raktáron', () => {
      const outOfStockCikkszam = '080110';
      cy.request({ url: productPageUrl(outOfStockCikkszam), failOnStatusCode: false }).then((response) => {
        if (response.status === 200 && response.body.includes('Nincs készleten')) {
          cy.visit(productPageUrl(outOfStockCikkszam));
          cy.get('.stock-status').should('contain.text', 'Nincs készleten');
          cy.get('.add-to-cart-section .quantity-input').should('not.exist');
          cy.get('.add-to-cart-section button.add-to-cart').should('not.exist');
          cy.get('.product-details .alert.alert-warning').should('be.visible');
        } else {
          cy.log(`A ${outOfStockCikkszam} cikkszámú termék oldala nem érhető el vagy nincs készleten státusz nincs rajta.`);
        }
      });
    });
  
    it('Működik a termékleírás lenyitása/összecsukása', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('#collapseOne').should('not.have.class', 'show');
      cy.get('.accordion-button').click();
      cy.get('#collapseOne').should('have.class', 'show');
      cy.get('.accordion-button').click();
      cy.get('#collapseOne').should('not.have.class', 'show');
    });
  
    it('Helyesen jeleníti meg az akciós és eredeti árat, ha van akció', () => {
      const akciósCikkszam = '010003';
      cy.request({url: productPageUrl(akciósCikkszam), failOnStatusCode: false}).then((response) => {
        if (response.status >= 200 && response.status < 300 && response.body.includes('original-price')) {
          cy.visit(productPageUrl(akciósCikkszam));
          cy.get('.price-section').within(() => {
            cy.get('.original-price', { timeout: 10000 }).should('exist').and('be.visible');
            cy.get('.discounted-price', { timeout: 10000 }).should('exist').and('be.visible');
          });
        } else {
          cy.log(`A(z) ${akciósCikkszam} cikkszámú termék oldala nem érhető el (status: ${response.status}) vagy nem akciós, a teszt kihagyva.`);
        }
      });
    });
  
  
    it('Helyesen jeleníti meg az árat, ha nincs akció', () => {
        cy.visit(productPageUrl(validCikkszam));
        cy.get('.price-section').within(() => {
            cy.get('.original-price').should('not.exist');
            cy.get('.discounted-price').should('not.exist');
            cy.get('.current-price').should('exist').and('be.visible');
        });
    });
  
    it('Megfelelően működik a képnagyítás modal', () => {
      cy.visit(productPageUrl(validCikkszam));
      cy.get('#productCarousel .carousel-item.active .zoomable-image').click();
      cy.get('#imageZoomModal', { timeout: 10000 }).should('be.visible');
      cy.get('#zoomedImage').should('be.visible').and('have.attr', 'src').and('not.be.empty');
      cy.get('#imageZoomModal .btn-close').focus().click({ force: true });
    });
  
     it('Navigál a megfelelő kategória oldalra a breadcrumb-on keresztül', () => {
         cy.visit(productPageUrl(validCikkszam));
         cy.get('.breadcrumb-item').eq(2).find('a').click();
         cy.url().should('include', '/php/termekek.php');
         cy.get('#kartyak-container', { timeout: 10000 }).should('be.visible');
     });
  
     it('Navigál a Termékek oldalra a breadcrumb-on keresztül', () => {
         cy.visit(productPageUrl(validCikkszam));
         cy.get('.breadcrumb-item').eq(1).find('a').click();
         cy.url().should('include', '/php/termekek.php');
         cy.get('#kartyak-container', { timeout: 10000 }).should('be.visible');
     });
  
     it('Navigál a Főoldalra a breadcrumb-on keresztül', () => {
         cy.visit(productPageUrl(validCikkszam));
         cy.get('.breadcrumb-item').eq(0).find('a').click();
         cy.url().should('include', '/php/index.php');
         cy.get('.video-container', { timeout: 10000 }).should('be.visible');
     });
  
  });