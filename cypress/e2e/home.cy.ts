describe('Ecommerce App - Smoke Test', () => {

  it('loads the homepage', () => {
    cy.visit('/');  
    cy.get('body').should('be.visible');

    cy.contains(/shop|store|ecommerce/i).should('exist');
  });

});