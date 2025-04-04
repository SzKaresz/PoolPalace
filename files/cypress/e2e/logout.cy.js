describe('Kijelentkezési Folyamat Tesztelése Több Oldalról (Teljes Login Minden Teszt Előtt - Lassítva)', () => {
    const baseUrl = 'http://localhost/PoolPalace/files/php/';
    const loginPagePath = 'bejelentkezes.php';
    const indexPagePath = 'index.php';
    const userEmail = 'info.poolpalace@gmail.com';
    const userPassword = 'Admin123';
    const waitTime = 800;

    const pagesToTestLogoutFrom = [
        'index.php',
        'termekek.php',
        'rolunk.php',
        'kosar.php',
        'adataim.php',
        'rendeleseim.php',
        'megrendeles.php'
    ];

    beforeEach(() => {
        cy.visit(baseUrl + loginPagePath);
        cy.wait(waitTime);

        cy.get('#email').type(userEmail);
        cy.wait(waitTime);

        cy.get('#password').type(userPassword);
        cy.wait(waitTime);

        cy.solveGoogleReCAPTCHA();
        cy.wait(1000);

        cy.get('#belepes').click();
        cy.wait(waitTime);

        cy.url().should('include', indexPagePath);
        cy.get('#profileDropdown').should('be.visible');
        cy.wait(waitTime);
    });

    pagesToTestLogoutFrom.forEach((pagePath) => {
        it(`Sikeres kijelentkezés a(z) '${pagePath}' oldalról`, () => {
            cy.visit(baseUrl + pagePath);
            cy.wait(waitTime);

            cy.get('#profileDropdown').should('be.visible').click();
            cy.wait(waitTime);

            cy.contains('button', 'Kijelentkezés', { matchCase: false })
                .should('be.visible')
                .click();
            cy.wait(waitTime);

            cy.get('#profileDropdown', { timeout: 10000 }).should('not.exist');
            cy.wait(waitTime);

            cy.get('a[href="./bejelentkezes.php"]')
                .should('be.visible');
            cy.wait(waitTime);

            cy.get('a[href="./bejelentkezes.php"]').click();
            cy.wait(waitTime);

            cy.url().should('include', loginPagePath);
            cy.wait(waitTime);
        });
    });
});