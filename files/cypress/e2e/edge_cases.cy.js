// files/cypress/e2e/edge_cases.cy.js

describe('Általános és Edge Case Tesztek', () => {
    const baseUrl = Cypress.config('baseUrl');
    const xlBreakpoint = 1200;

    describe('Reszponzivitás Ellenőrzése', () => {
        const pagesToTest = [
            { name: 'Kezdőlap', url: baseUrl + 'index.php' },
            { name: 'Termékek', url: baseUrl + 'termekek.php' },
            { name: 'Termék Oldal', url: baseUrl + 'termekOldal.php?cikkszam=010001' },
            { name: 'Kosár', url: baseUrl + 'kosar.php' },
            { name: 'Rólunk', url: baseUrl + 'rolunk.php' }
        ];
        const viewports = [
            'iphone-6',
            'ipad-2',
            [1920, 1080]
        ];

        pagesToTest.forEach(page => {
            viewports.forEach(viewport => {
                const viewportDesc = Array.isArray(viewport) ? `${viewport[0]}x${viewport[1]}` : viewport;
                let currentWidth = 0;

                it(`[${viewportDesc}] ${page.name} - Alapvető elemek láthatósága`, () => {
                    cy.log(`Oldal: ${page.name}, Méret: ${viewportDesc}`);
                    if (Array.isArray(viewport)) {
                        cy.viewport(viewport[0], viewport[1]);
                        currentWidth = viewport[0];
                    } else {
                        cy.viewport(viewport);
                        currentWidth = Cypress.config('viewportWidth');
                    }

                    cy.visit(page.url);
                    cy.wait(500);

                    cy.get('.navbar').should('be.visible');
                    cy.get('body').should('be.visible');
                    cy.get('footer').should('be.visible');

                    if (currentWidth < xlBreakpoint) {
                        cy.get('.navbar-toggler').should('be.visible');
                        cy.get('#navbarNav').should('not.be.visible');
                        cy.get('.navbar-toggler').click();
                        cy.get('#navbarNav').should('be.visible');
                    } else {
                        cy.get('.navbar-toggler').should('not.be.visible');
                        cy.get('#navbarNav').should('be.visible');
                    }
                });
            });
        });
    });

    describe('Hibakezelés Ellenőrzése', () => {
        it('Érvénytelen termék ID - Felhasználóbarát oldal/üzenet jelenik meg', () => {
            const invalidUrl = baseUrl + 'termekOldal.php?cikkszam=NEMLETEZOID999';
            cy.request({ url: invalidUrl, failOnStatusCode: false }).then((response) => {
                expect(response.status).to.be.lessThan(500);
            });

            cy.visit(invalidUrl, { failOnStatusCode: false });

            cy.url().should('include', 'termekOldal.php?cikkszam=NEMLETEZOID999');
            cy.get('body').should('not.contain.text', 'Fatal error', { matchCase: false });
            cy.get('body').should('not.contain.text', 'Warning', { matchCase: false });
            cy.get('#add-to-cart-btn').should('not.exist');
        });
    });

    describe('API Végpontok Tesztelése', () => {
        it('termekek_api.php - Alap lekérdezés sikeres (status 200, JSON)', () => {
            cy.request({
                method: 'GET',
                url: baseUrl + 'termekek_api.php',
                qs: {
                    page: 1,
                    limit: 6
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('termekek').and.to.be.an('array');
                expect(response.body).to.have.property('total_items').and.to.be.a('number');
                if (response.body.termekek.length > 0) {
                    expect(response.body.termekek[0]).to.include.keys('cikkszam', 'nev', 'egysegar', 'akcios_ar');
                }
            });
        });

        it('kosarMuvelet.php - getCartCount (vendég válasz ellenőrzése)', () => {
             cy.request({
                 method: 'GET',
                 url: baseUrl + 'kosarMuvelet.php',
                 qs: {
                     action: 'getCartCount'
                 },
                 failOnStatusCode: false
             }).then((response) => {
                 expect(response.status).to.eq(200);
             });
        });

         it('live_search.php - Keresés termékre', () => {
             cy.request({
                 method: 'GET',
                 url: baseUrl + 'live_search.php',
                 qs: {
                     query: 'medence'
                 }
             }).then((response) => {
                 expect(response.status).to.eq(200);
                 expect(response.headers['content-type']).to.include('application/json');
                 expect(response.body).to.be.an('array');
                 if (response.body.length > 0) {
                     expect(response.body[0]).to.have.all.keys('cikkszam', 'nev', 'kep_url');
                 }
             });
         });
    });

    describe('Speciális Karakterek és Input Sanitization', () => {
        const specialInputs = [
            "<script>alert('xss-test')</script>",
            "' OR '1'='1'; --",
            "; DROP TABLE felhasznalok; --"
        ];

        it('Kereső mező - Speciális karakterek kezelése', () => {
            cy.visit(baseUrl + 'index.php');
            specialInputs.forEach(input => {
                cy.log(`Tesztelt input: ${input}`);
                cy.get('#keresomezo', { timeout: 10000 }).clear({ force: true }).type(input, { force: true });
                cy.get('#kereses_button').click({ force: true });

                cy.url().should('include', 'termekek.php');
                cy.get('body').should('not.contain.text', '<script>', { matchCase: false });
                cy.get('body').should('not.contain.text', 'alert(\'xss-test\')');
                cy.get('body').should('not.contain.text', 'Fatal error', { matchCase: false });
            });
        });

        it('Kapcsolatfelvételi űrlap (Rólunk) - Speciális karakterek', () => {
            cy.visit(baseUrl + 'rolunk.php');
            cy.intercept('POST', '**/rolunk_form.php').as('contactFormSubmit');

            specialInputs.forEach(input => {
                cy.log(`Tesztelt input: ${input}`);
                cy.get('#nev').clear().type('Teszt');
                cy.get('#email').clear().type('teszt@teszt.hu');
                cy.get('#email_targya').clear().type('Speciális karakter teszt');
                cy.get('#email_szovege').clear().type(input);
                cy.get('#adatkez').check();
                cy.solveGoogleReCAPTCHA();
                cy.wait(500);
                cy.get('#kuldesGomb').click();

                cy.wait('@contactFormSubmit');

                cy.get('.toast-container', { timeout: 10000 }).should('be.visible');
                cy.get('.toast-container').invoke('text').should('not.include', '<script>');
                cy.get('.toast-container').should('contain.text', 'sikeresen');
            });
        });
    });
});