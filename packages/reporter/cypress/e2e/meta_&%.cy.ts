// this ensures that special characters in the spec title are displayed
// properly. it tests the actual reporter instead of the AUT like other tests
describe('special characters', () => {
  // TODO: (protocol) these tests should be cy-in-cy tests since they interact with the reporter
  // unskip these after the --runner-ui cli option has been added
  it.skip('displays file name with decoded special characters', () => {
    cy.wrap(Cypress.$(window.top.document.body))
    .find('.reporter .runnable-header a')
    .should('have.text', 'meta_&%.cy.ts')
  })
})
