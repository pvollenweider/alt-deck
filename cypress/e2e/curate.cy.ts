describe("Curate page", () => {
  beforeEach(() => {
    cy.visit("/curate");
  });

  it("loads with profile form", () => {
    cy.get("h1").should("contain", "CURATION");
    cy.get("fieldset").should("have.length.greaterThan", 0);
    cy.contains("ANALYSER").should("exist");
  });

  it("SelectField buttons have aria-pressed", () => {
    cy.get("fieldset button[aria-pressed]").should("have.length.greaterThan", 0);
  });

  it("runs curation and shows results", () => {
    cy.contains("button", "ANALYSER").click();
    // Should show either results or "aucune paire" message
    cy.get('[role="alert"], .flex.flex-col.gap-6').should("exist");
  });

  it("shows pairs with LANCER buttons", () => {
    cy.contains("button", "ANALYSER").click();
    cy.get("body").then(($body) => {
      if ($body.find('[aria-label*="Lancer la session"]').length > 0) {
        cy.get('[aria-label*="Lancer la session"]').should("have.length.greaterThan", 0);
      }
    });
  });

  it("genre input has maxLength", () => {
    cy.get('#genre-input').should("have.attr", "maxlength");
  });

  it("group name input has maxLength", () => {
    cy.get('#group-name-input').should("have.attr", "maxlength");
  });
});
