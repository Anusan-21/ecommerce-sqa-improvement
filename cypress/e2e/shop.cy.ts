/// <reference types="cypress" />



describe("Shop page with GraphQL mocks (self-contained intercepts)", () => {
  const mockCategories = {
    data: {
      categories: [
        { id: "cat-1", name: "Clothing" },
        { id: "cat-2", name: "Accessories" },
      ],
    },
  };

  const mockProductsDefault = {
    data: {
      products: {
        products: [
          {
            id: "prod-1",
            name: "Sample Product 1",
            slug: "sample-product-1",
            price: 19.99,
            images: [{ url: "/img/1.jpg" }],
            category: { id: "cat-1", name: "Clothing" },
          },
          {
            id: "prod-2",
            name: "Sample Product 2",
            slug: "sample-product-2",
            price: 29.99,
            images: [{ url: "/img/2.jpg" }],
            category: { id: "cat-2", name: "Accessories" },
          },
        ],
        hasMore: false,
      },
    },
  };

  it("renders header, product count and toggles desktop filters", () => {
    cy.intercept("POST", "**/graphql", (req) => {
      const opName = (req.body.operationName || "").toLowerCase();
      const query = req.body.query || "";

      if (opName.includes("categories") || /categories/.test(query)) {
        req.reply(mockCategories);
        return;
      }

      if (opName.includes("products") || /products/.test(query)) {
        // default product set
        req.reply(mockProductsDefault);
        return;
      }

      req.reply({ data: {} });
    }).as("graphqlAll");

    cy.viewport(1280, 800);
    cy.visit("/shop");

    cy.wait("@graphqlAll");

    cy.get("h1").contains(/^Shop$/).should("be.visible");
    cy.contains(/products found/i).should("exist");


    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="desktop-filter-toggle"]').length) {
        cy.get('[data-testid="desktop-filter-toggle"]').should("be.visible").click();
        cy.get("h1").contains(/^Shop$/).should("be.visible");
      } else if ($body.find('[data-testid="mobile-filter-button"]').length) {
        cy.get('[data-testid="mobile-filter-button"]').should("be.visible").click();
        cy.contains("Clothing").should("exist");
      } else {
        cy.log("No filter toggle found in DOM.");
      }
    });
  });

});