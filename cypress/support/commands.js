Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('paulo')
    cy.get('#lastName').type('costa')
    cy.get('#email').type("paulo@teste.com")
    cy.get('#open-text-area').type('teste')

    cy.get('button[type="submit"]').click()
})