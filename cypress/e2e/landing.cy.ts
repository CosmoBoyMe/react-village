Cypress.on('uncaught:exception', () => false);

describe('Landing page', () => {
  it('Should fill dates and guests in search-rooms-form', () => {
    cy.visit('http://localhost:3000');
    cy.get('.date-dropdown__start .input__input').should('have.value', '');
    cy.get('.date-dropdown__end .input__input').should('have.value', '');
    cy.get('.dropdown__wrapper>input').should('have.value', '');

    cy.get('.date-dropdown__start .input__input').click();
    cy.get('.air-datepicker-cell:nth-child(35)').click();
    cy.get('.air-datepicker-cell:nth-child(15)').click();
    cy.get('.air-datepicker-buttons .air-datepicker-button:last-child').click();
   
    cy.get('.dropdown__wrapper>button').click();
    cy.get('.dropdown__drop .dropdown-item:first-child .dropdown-item__button:last-child').click();
    cy.get('.dropdown__drop .dropdown-item:nth-child(2) .dropdown-item__button:last-child').click();
    cy.get('.dropdown__drop .dropdown-item:last-child .dropdown-item__button:last-child').click();
    cy.get('.dropdown__button-apply button').click();

    cy.get('.date-dropdown__start .input__input').should('have.value', '02.04.2023');
    cy.get('.date-dropdown__end .input__input').should('have.value', '10.04.2023');
    cy.get('.dropdown__wrapper>input').should('have.value', '2 гостя, 1 младенец');
  })
})