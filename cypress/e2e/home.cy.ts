describe('Ecommerce App - Smoke Test', () => {

  it('loads the homepage', () => {
    cy.visit('/');   // baseUrl = http://localhost:3000

    cy.get('body').should('be.visible');

    // If you have a heading on homepage
    cy.contains(/shop|store|ecommerce/i).should('exist');
  });

});