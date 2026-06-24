describe("Deck page", () => {
  beforeEach(() => {
    cy.visit("/deck");
  });

  it("shows all 45 cards by default", () => {
    cy.contains("45 sur 45 cartes").should("exist");
  });

  it("filter bar has toolbar role and aria-label", () => {
    cy.get('[role="toolbar"][aria-label="Filtrer par nature"]').should("exist");
  });

  it("filter buttons have aria-pressed", () => {
    cy.get('[role="toolbar"] button[aria-pressed="true"]').should("have.length", 1);
    cy.get('[role="toolbar"] button[aria-pressed="false"]').should("have.length.greaterThan", 0);
  });

  it("STRUCTURAL filter shows only STRUCTURAL cards", () => {
    cy.contains("button", "STRUCTURAL").click();
    cy.get('[aria-pressed="true"]').should("contain", "STRUCTURAL");
    cy.get(".grid .border").each(($card) => {
      cy.wrap($card).should("contain", "STRUCTURAL");
    });
  });

  it("filter live region announces count", () => {
    cy.contains("button", "SONIC").click();
    cy.get('[aria-live="polite"]').should("exist");
  });

  it("keyboard arrow navigation works on filter toolbar", () => {
    cy.get('[role="toolbar"] button').first().focus();
    cy.focused().trigger("keydown", { key: "ArrowRight" });
    cy.focused().should("not.have.attr", "aria-pressed", "true");
  });
});
