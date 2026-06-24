describe("About page", () => {
  beforeEach(() => {
    cy.visit("/about");
  });

  it("loads about page", () => {
    cy.get("h1").should("contain", "ALT-DECK");
  });

  it("has multiple h2 section headings", () => {
    cy.get("h2").should("have.length.greaterThan", 3);
  });

  it("has h3 axis headings", () => {
    cy.get("h3").should("exist");
  });

  it("shows all 6 session phases including COMPLETE", () => {
    cy.contains("COMPLETE").should("exist");
    cy.contains("PLAYING").should("exist");
    cy.contains("IDLE").should("exist");
  });

  it("shows 4 natures", () => {
    cy.contains("STRUCTURAL").should("exist");
    cy.contains("COGNITIVE").should("exist");
    cy.contains("SONIC").should("exist");
    cy.contains("PHYSICAL").should("exist");
  });
});
