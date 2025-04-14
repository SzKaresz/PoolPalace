describe('Felhasználókezelési Folyamatok', () => {
    const baseUrl = Cypress.config('baseUrl');
    const timestamp = Date.now();
    const testData = {
        nev: `Teszt Felhasználó ${timestamp}`,
        email: `teszt_${timestamp}@poolpalace.test`,
        jelszo: 'TesztJelszo123!',
        szallTelefon: '+36301234567',
        szallIrszam: '8200',
        szallTelepules: 'Veszprém',
        szallCim: 'Teszt utca 1.',
    };

    Cypress.log({
        name: "Generált Teszt Adatok",
        message: `Név: ${testData.nev}, Email: ${testData.email}`
    });

    describe('Regisztrációs Folyamat', () => {
        it('Sikeresen regisztrál egy új felhasználót', () => {
            cy.visit(baseUrl + 'regisztracio.php');
            cy.get('#nev').type(testData.nev);
            cy.get('#email').type(testData.email);
            cy.get('#jelszo').type(testData.jelszo);
            cy.get('#jelszo-ujra').type(testData.jelszo);
            cy.get('#szall-telefon').type(testData.szallTelefon);
            cy.get('#szall-irszam').type(testData.szallIrszam);
            cy.get('#szall-telepules').type(testData.szallTelepules);
            cy.get('#szall-cim').type(testData.szallCim);
            cy.get('#egyezo-adatok').check();
            cy.get('#szam-telefon').should('have.value', testData.szallTelefon);
            cy.get('#szam-irszam').should('have.value', testData.szallIrszam);
            cy.get('#szam-telepules').should('have.value', testData.szallTelepules);
            cy.get('#szam-cim').should('have.value', testData.szallCim);
            cy.get('#aszf').check();
            cy.get('#regisztracio').click();
            cy.get('#visszaSzamlalo', { timeout: 10000 })
                .should('be.visible')
                .and('contain.text', 'Sikeres regisztráció!');
            cy.url({ timeout: 5000 }).should('include', '/php/bejelentkezes.php');
        });
    });

    describe('Új Felhasználó Bejelentkezése', () => {
        it('Sikeres bejelentkezés az imént regisztrált felhasználóval', () => {
            cy.visit(baseUrl + 'bejelentkezes.php');
            cy.get('#email').type(testData.email);
            cy.get('#password').type(testData.jelszo);
            cy.solveGoogleReCAPTCHA();
            cy.wait(1500);
            cy.get('#belepes').click();
            cy.url().should('include', '/php/index.php');
            cy.get('.video-caption').should('contain.text', 'Üdvözlünk a Webshopunkban!');
            cy.get('#profileDropdown').should('be.visible').click();
            cy.contains('button', 'Kijelentkezés', { matchCase: false })
                .should('be.visible')
                .click();
        });
    });
});