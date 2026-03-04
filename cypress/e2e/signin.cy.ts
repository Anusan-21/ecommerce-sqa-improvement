/// <reference types="cypress" />

context("Sign In page", () => {
  const AUTH_API_BASE_URL = "http://localhost:5000/api/v1";
  const getForm = () => cy.get("main").find("form").first();

  beforeEach(() => {
    cy.visit("/sign-in");
  });

  it("renders the sign in form and testing accounts", () => {
    cy.contains("Sign In").should("exist");
    cy.get('input[placeholder="Email"]').should("exist");
    cy.get('input[placeholder="Password"]').should("exist");
    cy.contains("button", "Sign In").should("exist");
    cy.contains("Testing Accounts").should("exist");
  }); 

  it("submits and navigates on successful sign in", () => {
    cy.intercept("POST", "**/auth/sign-in", {
      statusCode: 200,
      body: { accessToken: "fake-token", user: { id: "1", name: "User", email: "user@example.com", role: "user", emailVerified: true, avatar: null } },
    }).as("signInRequest");

    cy.get('input[placeholder="Email"]').type("user@example.com");
    cy.get('input[placeholder="Password"]').type("password123{enter}");

    cy.wait("@signInRequest", { timeout: 15000 }).its("response.statusCode").should("eq", 200);

    cy.url({ timeout: 10000 }).should("eq", `${Cypress.config().baseUrl || ""}/`);
  });

  
  it("has a working forgot password link and sign up link", () => {
    cy.contains("Forgot password?").should("have.attr", "href", "/password-reset");
    cy.contains("Sign up").should("have.attr", "href", "/sign-up");
  });
});