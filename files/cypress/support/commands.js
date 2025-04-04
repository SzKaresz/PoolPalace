Cypress.Commands.add('solveGoogleReCAPTCHA', () => {
    cy.get('.g-recaptcha iframe', { timeout: 10000 })
      .should('be.visible')
      .should($iframe => {
        expect($iframe.prop('contentDocument')).to.exist;
        expect($iframe.prop('contentDocument').readyState).to.equal('complete');
        expect($iframe.contents().find('body')).to.exist;
        expect($iframe.contents().find('body').find('.recaptcha-checkbox-border')).to.exist;
      })
      .then($iframe => {
        const $body = $iframe.contents().find('body');
        cy.wrap($body)
          .find('.recaptcha-checkbox-border')
          .should('be.visible')
          .click({ force: true });
      });
      cy.wait(500);
  });