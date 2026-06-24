describe("Generate page", () => {
  beforeEach(() => {
    cy.visit("/generate");
  });

  it("shows generate button on load", () => {
    cy.get("h1").should("contain", "GÉNÉRER");
    cy.contains("button", "GÉNÉRER UNE SESSION").should("exist");
  });

  it("generates a session on button click", () => {
    cy.contains("button", "GÉNÉRER UNE SESSION").click();
    cy.contains("VALIDE").should("exist");
    cy.contains("Carte 1").should("exist");
    cy.contains("Carte 2").should("exist");
  });

  it("shows LANCER button after generation", () => {
    cy.contains("button", "GÉNÉRER UNE SESSION").click();
    cy.contains("button", "LANCER LA SESSION").should("exist");
  });

  it("can add a third card", () => {
    cy.contains("button", "GÉNÉRER UNE SESSION").click();
    cy.contains("button", "+ 3ÈME CONTRAINTE").click();
    cy.contains("Carte 3").should("exist");
  });

  it("live region exists for screen reader announcements", () => {
    cy.get('[aria-live="polite"]').should("exist");
  });
});
