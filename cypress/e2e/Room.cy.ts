describe('Room', () => {
  beforeEach(() => cy.visit('/room/1'));

  it('should have minimal required info for room', () => {
    cy.get('header');
    cy.get('.room__preview-img');
    cy.get('.room__information');
    cy.get('.room__feedback');
    cy.get('.room__rules');
    cy.get('.room__cancel');
    cy.get('.room__booking-form');
    cy.get('footer');
  });

  it(`should open datepicker set dates and click apply button.
      After should open datepicker then click clear button and close this by click outside datepicker`, () => {
    cy.get('.date-dropdown__start').find('input').click();

    cy.get('.date-picker').find('.-current-').click();
    cy.get('.date-picker').find('.-current-').next().click();
    cy.get('.date-dropdown__start')
      .find('input')
      .should(
        'have.value',
        `${new Date().toLocaleDateString('en-GB').split('/').join('.')}`
      );
    cy.get('.date-dropdown__end')
      .find('input')
      .should(
        'have.value',
        `${new Date(new Date().getTime() + 86400000)
          .toLocaleDateString('en-GB')
          .split('/')
          .join('.')}`
      );

    cy.get('.air-datepicker-buttons button:last').click();

    cy.get('.date-dropdown__end').find('input').click();
    cy.get('.air-datepicker-buttons button:first').click();
    cy.get('main').click();
  });

  it(`should open and change guests in dropdown and click apply button.
      After should open dropdown then click clear button and close this by click on arrow button`, () => {
    cy.get('form').within(() => {
      cy.get('.dropdown').click();

      cy.get('.dropdown-item:first')
        .contains('.dropdown-item__button', '+')
        .click()
        .click();
      cy.get('.dropdown-item:nth-child(2)')
        .contains('.dropdown-item__button', '+')
        .click();
      cy.get('.dropdown-item:last')
        .contains('.dropdown-item__button', '+')
        .click();
      cy.get('.dropdown-item:nth-child(2)')
        .contains('.dropdown-item__button', '-')
        .click();

      cy.contains('.button', /применить/i).click();

      cy.get('.dropdown').click();
      cy.contains('.button', /очистить/i).click();
      cy.get('.dropdown__arrow-button').click();
    });
  });

  it('should open dropdown and close by click outside dropdown', () => {
    cy.get('.dropdown').click();
    cy.get('main').click();
  });

  it(`when user not authorized should exist sign-up button in booking form
      and if click on this button user should visit sign-up page`, () => {
    cy.get('.booking-form').find('.button-link').click();
    cy.url().should('include', '/sign-up');
  });

  it('should render room-page when user is auth', () => {
    cy.visit('/room/1', {
      onBeforeLoad(win) {
        win.localStorage.setItem('userId', '123321');
        win.localStorage.setItem('userName', 'Иван');
        win.localStorage.setItem('userSurname', 'Иванов');
        win.localStorage.setItem('token', '123');
        win.localStorage.setItem('isAuth', 'true');
        win.localStorage.setItem('refreshToken', '321');
      },
    });
  });
});
