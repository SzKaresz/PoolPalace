// files/cypress/e2e/account.cy.js

describe('Felhasználói Fiók Tesztek', () => {
    const baseUrl = Cypress.config('baseUrl');
    const loginUrl = baseUrl + 'bejelentkezes.php';
    const accountUrl = baseUrl + 'adataim.php';
    const ordersUrl = baseUrl + 'rendeleseim.php';
    const testUser = {
        email: 'teszt.ember@gmail.com',
        password: 'Teszt123'
    };
    const temporaryPassword = 'IdeiglenesJelszo99';

    beforeEach(() => {
        cy.log(`Bejelentkezés mint ${testUser.email}...`);
        cy.visit(loginUrl);
        cy.get('#email').should('be.visible');
        cy.get('#password').should('be.visible');
        cy.get('#email').type(testUser.email);
        cy.get('#password').type(testUser.password);
        cy.wait(500);
        cy.solveGoogleReCAPTCHA();
        cy.wait(500);
        cy.get('#belepes').click();
        cy.wait(1000); // Extra várakozás bejelentkezés után
        cy.url().should('not.eq', loginUrl, { timeout: 10000 }); // Növelt timeout az URL ellenőrzéshez
        cy.get('.logged-icon').should('be.visible');
        cy.log('Bejelentkezés sikeres.');
    });

    describe('Adataim Módosítása (adataim.php)', () => {
        beforeEach(() => {
            cy.visit(accountUrl);
            cy.contains('h3', 'Adatok módosítása').should('be.visible');
            cy.get('.alert-danger').should('not.exist');
            cy.get('span.error').each(($span) => {
                 cy.wrap($span).should('not.be.visible');
            });
            cy.get('#regi-jelszo').clear();
            cy.get('#uj-jelszo').clear();
            cy.get('#uj-jelszo-ismet').clear();
        });

        it('Megjeleníti a meglévő felhasználói adatokat', () => {
            cy.get('#nev').should('not.have.value', '');
            cy.get('#email').should('have.value', testUser.email);
            cy.get('#telefonszam').should('not.have.value', '');
            cy.get('#szallitasi-irsz').should('not.have.value', '');
            cy.get('#szallitasi-telepules').should('not.have.value', '');
            cy.get('#szallitasi-utca').should('not.have.value', '');
            cy.get('#szamlazasi-irsz').should('not.have.value', '');
            cy.get('#szamlazasi-telepules').should('not.have.value', '');
            cy.get('#szamlazasi-utca').should('not.have.value', '');
        });

        it('Személyes adatok (név, telefon) módosítása sikeres', () => {
            const ujNev = `Teszt Új Név`;
            const ujTelefon = '+36991112233';

            cy.get('#nev').clear().type(ujNev);
            cy.get('#telefonszam').clear().type(ujTelefon);
            cy.get('#mentes-gomb').click();

            cy.get('#visszaSzamlalo').should('be.visible').and('contain.text', 'Sikeres mentés!');
            cy.visit(accountUrl);
            cy.get('#nev').should('have.value', ujNev);
            cy.get('#telefonszam').should('have.value', ujTelefon);
        });

        it('Szállítási cím módosítása sikeres', () => {
            const ujIrsz = '1234';
            const ujTelepules = 'Újhely';
            const ujUtca = 'Módosított utca 100. szám';

            cy.get('#szallitasi-irsz').clear().type(ujIrsz);
            cy.get('#szallitasi-telepules').clear().type(ujTelepules);
            cy.get('#szallitasi-utca').clear().type(ujUtca);
            cy.get('#mentes-gomb').click();

            cy.get('#visszaSzamlalo').should('be.visible').and('contain.text', 'Sikeres mentés!');
            cy.visit(accountUrl);
            cy.get('#szallitasi-irsz').should('have.value', ujIrsz);
            cy.get('#szallitasi-telepules').should('have.value', ujTelepules);
            cy.get('#szallitasi-utca').should('have.value', ujUtca);
        });

         it('Számlázási cím módosítása sikeres', () => {
            const ujIrsz = '5678';
            const ujTelepules = 'Számlaváros';
            const ujUtca = 'Átírt utca 200. szám';

            cy.get('#szamlazasi-irsz').clear().type(ujIrsz);
            cy.get('#szamlazasi-telepules').clear().type(ujTelepules);
            cy.get('#szamlazasi-utca').clear().type(ujUtca);
            cy.get('#mentes-gomb').click();

            cy.get('#visszaSzamlalo').should('be.visible').and('contain.text', 'Sikeres mentés!');
            cy.visit(accountUrl);
            cy.get('#szamlazasi-irsz').should('have.value', ujIrsz);
            cy.get('#szamlazasi-telepules').should('have.value', ujTelepules);
            cy.get('#szamlazasi-utca').should('have.value', ujUtca);
        });

        it('Jelszó módosítás - Hibás régi jelszó (PHP)', () => {
            cy.get('#regi-jelszo').type('RosszJelszo1');
            cy.get('#uj-jelszo').type('UjJelszoValid1');
            cy.get('#uj-jelszo-ismet').type('UjJelszoValid1');
            cy.get('#mentes-gomb').click();

            cy.get('.alert-danger').should('be.visible').and('contain.text', 'Hibás régi jelszó!');
        });

        it('Jelszó módosítás - Új jelszavak nem egyeznek (JS)', () => {
            cy.get('#regi-jelszo').type(testUser.password);
            cy.get('#uj-jelszo').type('ValamiJoJelszo1');
            cy.get('#uj-jelszo-ismet').type('NemEgyezoJelszo2');
            cy.get('#mentes-gomb').click();

            cy.get('#uj-jelszo-ismet').should('have.class', 'is-invalid');
            cy.get('#uj-jelszo-ismet + span.error').should('be.visible').and('contain.text', 'A megadott új jelszavak nem egyeznek meg!');
            cy.get('#visszaSzamlalo').should('not.exist');
            cy.get('.alert-danger').should('not.exist');
        });

         it('Jelszó módosítás - Új jelszó formátuma érvénytelen (JS)', () => {
            cy.get('#regi-jelszo').type(testUser.password);
            cy.get('#uj-jelszo').type('rovid');
            cy.get('#uj-jelszo-ismet').type('rovid');
            cy.get('#mentes-gomb').click();

            cy.get('#uj-jelszo').should('have.class', 'is-invalid');
            cy.get('#uj-jelszo + span.error').should('be.visible').and('contain.text', 'A jelszónak minimum 8 karakter hosszúnak kell lennie');
            cy.get('#visszaSzamlalo').should('not.exist');
            cy.get('.alert-danger').should('not.exist');
        });

        it('Jelszó módosítás - Kötelező mezők hiánya jelszóváltáskor (JS)', () => {
             cy.get('#uj-jelszo').type('UjJelszoValid1');
             cy.get('#mentes-gomb').click();

             cy.get('#regi-jelszo').should('have.class', 'is-invalid');
             cy.get('#regi-jelszo + span.error')
               .should('be.visible')
               .and('contain.text', 'A jelszó módosításához mindhárom jelszó mezőt ki kell tölteni!');
             cy.get('#uj-jelszo-ismet').should('have.class', 'is-invalid');
             cy.get('#uj-jelszo-ismet + span.error')
               .should('be.visible')
               .and('contain.text', 'A jelszó módosításához mindhárom jelszó mezőt ki kell tölteni!');

             cy.get('#visszaSzamlalo').should('not.exist');
        });

        it('Jelszó módosítása sikeres (ideiglenesre, majd vissza)', () => {
            cy.log('Váltás ideiglenes jelszóra...');
            cy.get('#regi-jelszo').type(testUser.password);
            cy.get('#uj-jelszo').type(temporaryPassword);
            cy.get('#uj-jelszo-ismet').type(temporaryPassword);
            cy.get('#mentes-gomb').click();
            cy.get('#visszaSzamlalo').should('be.visible').and('contain.text', 'Sikeres mentés!');
            cy.log('Váltás ideiglenesre sikeres.');

            cy.wait(1000);

            cy.log('Visszaváltás eredeti jelszóra...');
            cy.get('#regi-jelszo').clear().type(temporaryPassword);
            cy.get('#uj-jelszo').clear().type(testUser.password);
            cy.get('#uj-jelszo-ismet').clear().type(testUser.password);
            cy.get('#mentes-gomb').click();
            cy.get('#visszaSzamlalo').should('be.visible').and('contain.text', 'Sikeres mentés!');
            cy.log('Visszaváltás eredetire sikeres.');
        });
    });

    describe('Rendeléseim Megtekintése (rendeleseim.php)', () => {
        beforeEach(() => {
            cy.visit(ordersUrl);
            cy.contains('h2', 'Rendeléseim').should('be.visible');
        });

        it('Megjeleníti a rendelési listát vagy az üres üzenetet', () => {
            cy.get('body').then($body => {
                if ($body.find('#orderAccordion .accordion-item').length > 0) {
                    cy.log('Rendelések listája megtalálva.');
                    cy.get('#orderAccordion .accordion-item').should('have.length.greaterThan', 0);
                    cy.get('.empty-order-wrapper').should('not.exist');
                } else {
                    cy.log('Rendelések listája üres.');
                    cy.get('.empty-order-wrapper p').should('be.visible').and('contain.text', 'Még nem adtál le rendelést.');
                     cy.get('#orderAccordion .accordion-item').should('not.exist');
                }
            });
        });

        it('Kinyitja és becsukja a rendelés részleteit', () => {
            cy.get('body').then($body => {
                if ($body.find('#orderAccordion .accordion-item').length > 0) {
                    cy.get('#orderAccordion .accordion-button').first().as('firstOrderButton');
                    cy.get('@firstOrderButton').invoke('attr', 'data-bs-target').then(targetId => {
                        const collapseSelector = targetId.replace('#', '');
                        cy.get(`div#${collapseSelector}`).should('not.have.class', 'show');
                        cy.get('@firstOrderButton').click();
                        cy.get(`div#${collapseSelector}`).should('have.class', 'show');
                        cy.get(`div#${collapseSelector}`).find('ul.list-group').should('exist');
                        cy.get(`div#${collapseSelector}`).find('li.list-group-item').should('have.length.greaterThan', 0);
                        cy.get('@firstOrderButton').click();
                        cy.get(`div#${collapseSelector}`).should('not.have.class', 'show');
                    });
                } else {
                    cy.log('Nincs rendelés a listában, részletek teszt kihagyva.');
                    expect(true).to.be.true;
                }
            });
        });
    });
});