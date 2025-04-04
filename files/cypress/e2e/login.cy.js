describe('Bejelentkezési Folyamat Tesztelése (Direkt Stílus)', () => {
  beforeEach(() => {
    cy.visit('http://localhost/PoolPalace/files/php/bejelentkezes.php');
  });

  it('Sikeres bejelentkezés érvényes adatokkal és reCAPTCHA kattintással', () => {
    cy.get('#email').type('info.poolpalace@gmail.com');
    cy.get('#password').type('Admin123');

    cy.solveGoogleReCAPTCHA();
    cy.wait(1500);

    cy.get('#belepes').click();

    cy.url().should('include', '/php/index.php');

    cy.contains('Üdvözlünk a Webshopunkban!').should('be.visible');

    cy.get('.alert.alert-danger').should('not.exist');
  });

  it('Sikertelen bejelentkezés érvénytelen adatokkal', () => {
    cy.get('#email').type('info.poolpalace@gmail.com');
    cy.get('#password').type('rosszjelszo123');

    cy.solveGoogleReCAPTCHA();
    cy.wait(1500);

    cy.get('#belepes').click();

    cy.url().should('not.include', '/php/index.php');

    cy.url().should('include', '/php/bejelentkezes.php');

    cy.get('.alert.alert-danger')
      .should('be.visible')
      .should('contain.text', 'Érvénytelen e-mail cím vagy jelszó!');
  });

  it('Sikertelen bejelentkezés hiányzó adatokkal (pl. jelszó nélkül)', () => {
    cy.get('#email').type('info.poolpalace@gmail.com');

    cy.solveGoogleReCAPTCHA();
    cy.wait(1500);

    cy.get('#belepes').click();

    cy.url().should('not.include', '/php/index.php');

    cy.url().should('include', '/php/bejelentkezes.php');

    cy.get('.alert.alert-danger')
      .should('be.visible')
      .should('contain.text', 'Kérjük töltse ki az összes mezőt, az ellenőrzéssel együtt!');
  });

  it('Sikertelen bejelentkezés reCAPTCHA nélkül (ha a form elküldhető)', () => {
    cy.get('#email').type('info.poolpalace@gmail.com');
    cy.get('#password').type('Admin123');

    cy.get('#belepes').click();

    cy.url().should('not.include', '/php/index.php');

    cy.url().should('include', '/php/bejelentkezes.php');

    cy.get('.alert.alert-danger')
      .should('be.visible')
      .should('contain.text', 'Kérjük töltse ki az összes mezőt, az ellenőrzéssel együtt!');
  });
});