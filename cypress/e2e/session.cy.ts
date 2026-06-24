describe("Session page — empty state", () => {
  beforeEach(() => {
    // Clear sessionStorage to force empty state
    cy.visit("/session");
    cy.clearAllSessionStorage();
    cy.visit("/session");
  });

  it("shows empty state with action buttons", () => {
    cy.get("h1").should("contain", "SESSION");
    cy.contains("Aucune session active").should("exist");
    cy.contains("GÉNÉRATION RAPIDE").should("exist");
  });

  it("quick generate creates a session", () => {
    cy.contains("button", "GÉNÉRATION RAPIDE").click();
    cy.contains("DÉMARRER").should("exist");
  });
});

describe("Session page — active session", () => {
  before(() => {
    // Seed a valid session via generate page
    cy.visit("/generate");
    cy.contains("button", "GÉNÉRER UNE SESSION").click();
    cy.contains("button", "LANCER LA SESSION").click();
  });

  it("shows session with phase banner", () => {
    cy.url().should("include", "/session");
    cy.get("h1").should("contain", "SESSION");
    cy.contains("DÉMARRER").should("exist");
  });

  it("phase banner has status region", () => {
    cy.get('[role="status"]').should("exist");
  });

  it("starting session advances to REVEAL phase", () => {
    cy.contains("button", "DÉMARRER").click();
    cy.contains("RÉVÉLATION").should("exist");
  });

  it("PDF button has aria-label", () => {
    cy.get('button[aria-label="Télécharger le PDF"]').should("have.length.greaterThan", 0);
  });

  it("session has progress bar", () => {
    cy.contains("button", "DÉMARRER").click();
    cy.get('[role="progressbar"]').should("exist");
  });
});
