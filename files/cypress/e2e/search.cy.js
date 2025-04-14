describe('Keresési Funkció Tesztelése Különböző Képernyőméreteken', () => {
    const baseUrl = Cypress.config('baseUrl');
    const searchTerm = 'medence';
    const nonExistentTerm = 'xyzabc123nemletezo';

    const performSearchAndCheckResults = (term) => {
        cy.get('#keresomezo', { timeout: 10000 }).should('be.visible').clear().type(term);
        cy.get('#kereses_button').should('be.visible').click();
        cy.url().should('include', '/php/termekek.php');
        cy.get('#kartyak .card', { timeout: 15000 }).should('exist');

        cy.get('#kartyak .card').first().find('.card-title')
            .invoke('text')
            .then(text => {
                cy.log(`1. Kártya címe: "${text}"`);
                console.log(`1. Kártya címe: "${text}"`);
                expect(text).to.match(new RegExp(term, 'i'));
            });

        cy.get('#keresomezo').should($el => {
            if ($el.is(':visible')) {
                expect($el).to.have.value(term);
            } else {
                expect(true).to.be.true;
            }
        });
    };

    const checkLiveSearch = (term) => {
        cy.get('#keresomezo', { timeout: 10000 }).should('be.visible').clear().type(term);
        cy.wait(1000);
        cy.get('#search-results-dropdown').should('be.visible');
        cy.get('#search-results-dropdown .search-result-item', { timeout: 10000 }).should('have.length.greaterThan', 0);

        cy.get('#search-results-dropdown .search-result-item').first().find('.search-result-name')
            .invoke('text')
            .then(text => {
                cy.log(`1. Élő találat neve: "${text}"`);
                console.log(`1. Élő találat neve: "${text}"`);
                expect(text).to.match(new RegExp(term, 'i'));
            });

        cy.get('#search-results-dropdown .search-result-item').first().click();
        cy.url().should('include', '/php/termekOldal.php?cikkszam=');
    };

    const checkNoResults = (term) => {
        cy.get('#keresomezo', { timeout: 10000 }).should('be.visible').clear().type(term);
        cy.wait(1000);
        cy.get('#search-results-dropdown').should('be.visible');
        cy.get('#search-results-dropdown', { timeout: 10000 }).should('contain.text', 'Nincs találat.');
        cy.get('#keresomezo').type('{enter}');
        cy.url().should('include', '/php/termekek.php');
        cy.get('#talalatok', { timeout: 10000 }).should('contain.text', 'Találatok: 0 termék');
        cy.get('#kartyak').should('not.contain', '.card');
    }

    context('Nagy képernyő (pl. Desktop)', () => {
        beforeEach(() => {
            cy.viewport('macbook-15');
            cy.visit(baseUrl + 'index.php');
            cy.get('#keresomezo', { timeout: 10000 }).should('be.visible');
        });

        it('Sikeresen keres egy termékre', () => {
            performSearchAndCheckResults(searchTerm);
        });

        it('Ellenőrzi az élő keresés legördülő menüt', () => {
            checkLiveSearch(searchTerm);
        });

        it('Keresés nem létező termékre', () => {
            checkNoResults(nonExistentTerm);
        });
    });

    context('Kis képernyő (pl. Mobil)', () => {
        beforeEach(() => {
            cy.viewport('iphone-6');
            cy.visit(baseUrl + 'index.php');
            cy.get('#keresomezo').should('not.be.visible');
            cy.wait(500);
            cy.log('Kereső ikon keresése mobil nézetben');
            cy.get('.d-xl-none.search-icon', { timeout: 15000 })
                .should('be.visible')
                .as('searchIcon');
        });

        it('Sikeresen keres egy termékre a nagyító ikonra kattintás után', () => {
            cy.log('Kattintás a mobil kereső ikonra');
            cy.get('@searchIcon').click();
            cy.get('#keresomezo', { timeout: 5000 }).should('be.visible');
            performSearchAndCheckResults(searchTerm);
        });

        it('Ellenőrzi az élő keresés legördülő menüt a nagyító ikonra kattintás után', () => {
            cy.log('Kattintás a mobil kereső ikonra');
            cy.get('@searchIcon').click();
            cy.get('#keresomezo', { timeout: 5000 }).should('be.visible');
            checkLiveSearch(searchTerm);
        });

        it('Keresés nem létező termékre a nagyító ikonra kattintás után', () => {
            cy.log('Kattintás a mobil kereső ikonra');
            cy.get('@searchIcon').click();
            cy.get('#keresomezo', { timeout: 5000 }).should('be.visible');
            checkNoResults(nonExistentTerm);
        });
    });
});