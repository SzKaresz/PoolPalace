Cypress.on('uncaught:exception', (err, runnable) => {
    console.error('Elkapott alkalmazás hiba:', err);
    return false;
});

describe('Termékek Oldal - Részletes Tesztek (Reszponzív)', () => {
    const baseUrl = Cypress.config('baseUrl');
    const productsPageUrl = baseUrl + 'termekek.php';

    const validCategoryValue = 'Fehér termék';
    const validManufacturerValue = 'ACIS';

    const setupInterceptions = () => {
        cy.intercept('GET', '**/kategoriaLeker.php').as('getCategories');
        cy.intercept('GET', '**/gyartoLeker.php').as('getManufacturers');
        cy.intercept('GET', '**/termekek_api.php*').as('getProducts');
    };

    const waitForFilterRendering = () => {
        cy.get('#kategoriak h6', { timeout: 10000 }).should('be.visible');
        cy.get('#gyartok h6', { timeout: 10000 }).should('be.visible');
    };

    context('Nagy képernyő (pl. Desktop)', () => {
        beforeEach(() => {
            setupInterceptions();
            cy.viewport('macbook-15');
            cy.visit(productsPageUrl);
            cy.wait('@getProducts');
            cy.get('#kartyak .card', { timeout: 15000 }).should('have.length.greaterThan', 0);
            cy.get('#kartyak .card').its('length').as('initialProductCount');
            cy.get('#szuro-container', { timeout: 10000 }).should('be.visible');
            cy.get('#szures-button').should('contain.text', 'Szűrők elrejtése');
            cy.wait(['@getCategories', '@getManufacturers'], { timeout: 10000 });
            waitForFilterRendering();
        });

        context('Szűrési Funkciók (Nagy Képernyő)', () => {
            it('Szűrés egy kategóriára', () => {
                const categorySelector = `#kategoriak input[type="checkbox"][value="${validCategoryValue}"]`;
                cy.get(categorySelector, { timeout: 10000 }).should('exist').check({ force: true });
                cy.get('#szures_button').click();
                cy.wait('@getProducts');
                cy.get('#kartyak').should('exist');
            });

            it('Szűrés egy gyártóra', () => {
                const manufacturerSelector = `#gyartok input[type="checkbox"][value="${validManufacturerValue}"]`;
                cy.get(manufacturerSelector, { timeout: 10000 }).should('exist').check({ force: true });
                cy.get('#szures_button').click();
                cy.wait('@getProducts');
                cy.get('#kartyak').should('exist');
            });

            it('Szűrés ár alapján (csúszkákkal)', () => {
                const minPrice = 50000;
                const maxPrice = 200000;

                cy.get('#fromSlider').invoke('val', minPrice).trigger('input', { force: true });
                cy.get('#toSlider').invoke('val', maxPrice).trigger('input', { force: true });
                cy.wait(500);

                cy.intercept('GET', '**/termekek_api.php*').as('filterByPrice');
                cy.get('#szures_button').click();

                cy.wait('@filterByPrice').its('request.url').then(url => {
                    const params = new URLSearchParams(new URL(url).search);
                    expect(params.get('fromprice')).to.equal(minPrice.toString());
                    expect(params.get('toprice')).to.equal(maxPrice.toString());
                });

                cy.get('#kartyak').should('exist');
            });

            it('Szűrés kategóriára, gyártóra és árra egyszerre', () => {
                const categorySelector = `#kategoriak input[type="checkbox"][value="${validCategoryValue}"]`;
                const manufacturerSelector = `#gyartok input[type="checkbox"][value="${validManufacturerValue}"]`;
                const minPrice = 1000;
                const maxPrice = 5000000;

                cy.get(categorySelector, { timeout: 10000 }).check({ force: true });
                cy.get(manufacturerSelector, { timeout: 10000 }).check({ force: true });
                cy.get('#fromSlider').invoke('val', minPrice).trigger('input', { force: true });
                cy.get('#toSlider').invoke('val', maxPrice).trigger('input', { force: true });
                cy.wait(500);

                cy.intercept('GET', '**/termekek_api.php*').as('combinedFilter');
                cy.get('#szures_button').click();

                cy.wait('@combinedFilter').its('request.url').then(url => {
                    const params = new URLSearchParams(new URL(url).search);
                    expect(params.get('kategoriak')).to.equal(validCategoryValue);
                    expect(params.get('gyartok')).to.equal(validManufacturerValue);
                    expect(params.get('fromprice')).to.equal(minPrice.toString());
                    expect(params.get('toprice')).to.equal(maxPrice.toString());
                });

                cy.get('#kartyak').should('exist');
            });

            it('Szűrők törlése a "Paraméterek törlése" linkkel', () => {
                const categorySelector = `#kategoriak input[type="checkbox"][value="${validCategoryValue}"]`;
                const minPrice = 100000;
                cy.get(categorySelector, { timeout: 10000 }).check({ force: true });
                cy.get('#fromSlider').invoke('val', minPrice).trigger('input', { force: true });
                cy.wait(500);
                cy.get('#szures_button').click();
                cy.wait('@getProducts');

                cy.get('#clear-filters').click();
                cy.wait('@getProducts');

                cy.get(categorySelector).should('not.be.checked');
                cy.get('#fromInput').should('have.value', '0');
                cy.get('#toInput').should('have.value', '5000000');
                cy.get('#fromSlider').should('have.value', '0');
                cy.get('#toSlider').should('have.value', '5000000');

                cy.get('@initialProductCount').then((initialCount) => {
                    cy.get('#kartyak .card', { timeout: 15000 }).should('have.length', initialCount);
                });
            });
        });

        context('Rendezési Funkciók (Nagy Képernyő)', () => {
            const sortOptions = [
                { name: 'Ár növekvő', selector: 'ar-novekvo' },
                { name: 'Ár csökkenő', selector: 'ar-csokkeno' },
                { name: 'Név A-Z', selector: 'nev-az' },
                { name: 'Név Z-A', selector: 'nev-za' },
            ];
            sortOptions.forEach(option => {
                it(`Rendezés: ${option.name}`, () => {
                    cy.get('#dropdown-button').click();
                    cy.intercept('GET', '**/termekek_api.php*').as('sortProducts');
                    cy.get(`#dropdown-options li[data-sort="${option.selector}"]`).click();

                    cy.wait('@sortProducts').its('request.url').should(url => {
                        const params = new URLSearchParams(new URL(url).search);
                        expect(params.get('sort')).to.equal(option.selector);
                    });
                    cy.get('#kartyak').should('exist');
                });
            });
        });

        context('Lapozási Funkciók (Nagy Képernyő)', () => {
            it('Lapozás a következő oldalra, ha létezik', () => {
                cy.get('body').then(($body) => {
                    if ($body.find('#pagination-container-top .pagination-center .page-btn').length > 1) {
                        cy.intercept('GET', '**/termekek_api.php*').as('nextPage');
                        cy.get('#pagination-container-top .pagination-right .page-btn').contains('>').click();
                        cy.wait('@nextPage').its('request.url').should(url => {
                            const params = new URLSearchParams(new URL(url).search);
                            expect(params.get('page')).to.equal('2');
                        });
                        cy.get('#kartyak .card', { timeout: 15000 }).should('exist');
                    } else {
                        cy.log('Nincs lapozó vagy csak egy oldal van.');
                        expect(true).to.be.true;
                    }
                });
            });
        });
    });

    context('Kis képernyő (pl. Mobil)', () => {
        beforeEach(() => {
            setupInterceptions();
            cy.viewport('iphone-6');
            cy.visit(productsPageUrl);
            cy.wait('@getProducts');
            cy.get('#kartyak .card', { timeout: 15000 }).should('have.length.greaterThan', 0);
            cy.get('#kartyak .card').its('length').as('initialProductCount');
            cy.get('#szuro-container', { timeout: 10000 }).should('not.be.visible');
            cy.get('#szures-button').should('contain.text', 'Szűrők megjelenítése');
        });

        context('Szűrési Funkciók (Kis Képernyő)', () => {
            it('Szűrés egy kategóriára (szűrő megjelenítése után)', () => {
                cy.get('#szures-button').click();
                cy.get('#szuro-container').should('be.visible');
                cy.wait(['@getCategories', '@getManufacturers'], { timeout: 10000 });
                waitForFilterRendering();

                const categorySelector = `#kategoriak input[type="checkbox"][value="${validCategoryValue}"]`;
                cy.get(categorySelector, { timeout: 10000 }).should('exist').check({ force: true });
                cy.get('#szures_button').click();
                cy.wait('@getProducts');
                cy.get('#kartyak').should('exist');
            });

            it('Szűrők törlése (szűrő megjelenítése után)', () => {
                cy.get('#szures-button').click();
                cy.get('#szuro-container').should('be.visible');
                cy.wait(['@getCategories', '@getManufacturers'], { timeout: 10000 });
                waitForFilterRendering();

                const categorySelector = `#kategoriak input[type="checkbox"][value="${validCategoryValue}"]`;
                cy.get(categorySelector, { timeout: 10000 }).check({ force: true });
                cy.get('#szures_button').click();
                cy.wait('@getProducts');

                cy.get('body').then($body => {
                    if ($body.find('#szures-button:contains("Szűrők megjelenítése")').length > 0) {
                        cy.get('#szures-button').click();
                        cy.get('#szuro-container').should('be.visible');
                    }
                });
                cy.wait(500);

                cy.get('#clear-filters').click();
                cy.wait('@getProducts');

                cy.get('body').then($body => {
                    if ($body.find('#szures-button:contains("Szűrők megjelenítése")').length > 0) {
                        cy.get('#szures-button').click();
                        cy.get('#szuro-container').should('be.visible');
                        waitForFilterRendering();
                    }
                });
                cy.get(categorySelector).should('not.be.checked');

                cy.get('#fromInput').should('have.value', '0');
                cy.get('#toInput').should('have.value', '5000000');

                cy.get('@initialProductCount').then((initialCount) => {
                    cy.get('#kartyak .card', { timeout: 15000 }).should('have.length', initialCount);
                });
            });
        });

        context('Rendezési Funkciók (Kis Képernyő)', () => {
            it('Rendezés: Ár növekvő', () => {
                cy.get('#dropdown-button').click();
                cy.intercept('GET', '**/termekek_api.php*').as('sortProductsMobile');
                cy.get(`#dropdown-options li[data-sort="ar-novekvo"]`).click();
                cy.wait('@sortProductsMobile').its('request.url').should(url => {
                    const params = new URLSearchParams(new URL(url).search);
                    expect(params.get('sort')).to.equal('ar-novekvo');
                });
                cy.get('#kartyak').should('exist');
            });
        });

        context('Lapozási Funkciók (Kis Képernyő)', () => {
            it('Lapozás a következő oldalra, ha létezik', () => {
                cy.get('body').then(($body) => {
                    if ($body.find('#pagination-container-top .pagination-center .page-btn').length > 1) {
                        cy.intercept('GET', '**/termekek_api.php*').as('nextPageMobile');
                        cy.get('#pagination-container-top .pagination-right .page-btn').contains('>').click();
                        cy.wait('@nextPageMobile').its('request.url').should(url => {
                            const params = new URLSearchParams(new URL(url).search);
                            expect(params.get('page')).to.equal('2');
                        });
                        cy.get('#kartyak .card', { timeout: 15000 }).should('exist');
                    } else {
                        cy.log('Nincs lapozó vagy csak egy oldal van.');
                        expect(true).to.be.true;
                    }
                });
            });
        });

    });

});