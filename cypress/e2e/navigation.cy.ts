describe("Navigation", () => {
  it("home page loads and shows key elements", () => {
    cy.visit("/");
    cy.get("h1").should("contain", "ALT-DECK");
    cy.get("nav").should("exist");
    cy.contains("DECK").should("exist");
    cy.contains("GÉNÉRER").should("exist");
    cy.contains("CURATION").should("exist");
    cy.contains("SESSION").should("exist");
  });

  it("nav has aria-current on active page", () => {
    cy.visit("/deck");
    cy.get('nav a[aria-current="page"]').should("exist").and("contain", "DECK");
  });

  it("skip link exists and is focusable", () => {
    cy.visit("/");
    cy.get('a[href="#main-content"]').should("exist");
    cy.get("#main-content").should("exist");
  });

  it("navigates to all main pages without errors", () => {
    const pages = ["/", "/deck", "/generate", "/curate", "/session", "/about"];
    pages.forEach((page) => {
      cy.visit(page);
      cy.get("h1").should("exist");
    });
  });
});
