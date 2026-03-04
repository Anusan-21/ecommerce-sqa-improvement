jest.mock("../src/modules/logs/logs.factory", () => ({
  makeLogsService: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock("@/shared/utils/sendResponse", () => jest.fn());
const sendResponse = require("@/shared/utils/sendResponse") as jest.Mock;

import { Request, Response, NextFunction } from "express";
import { ProductController } from "../src/modules/product/product.controller";
import { ProductService } from "../src/modules/product/product.service";

describe("ProductController.getAllProducts (positive)", () => {
  let productServiceMock: jest.Mocked<ProductService>;
  let controller: ProductController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    productServiceMock = {
      getAllProducts: jest.fn(),
      getProductById: jest.fn() as any,
      getProductBySlug: jest.fn() as any,
      createProduct: jest.fn() as any,
      updateProduct: jest.fn() as any,
      bulkCreateProducts: jest.fn() as any,
      deleteProduct: jest.fn() as any,
    } as unknown as jest.Mocked<ProductService>;

    controller = new ProductController(productServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("should fetch products and call sendResponse with 200", async () => {
    const fakeProducts = [
      { id: "p1", name: "Product 1" },
      { id: "p2", name: "Product 2" },
    ];
    const serviceResult = {
      products: fakeProducts,
      totalResults: 2,
      totalPages: 1,
      currentPage: 1,
      resultsPerPage: 10,
    };

    (productServiceMock.getAllProducts as jest.Mock).mockResolvedValue(serviceResult);

    const req = {
      query: { page: "1", limit: "10" },
    } as unknown as Request;

    const handler = controller.getAllProducts;
    handler(req, res as Response, next);
    await flush();

    expect(productServiceMock.getAllProducts).toHaveBeenCalledTimes(1);
    expect(productServiceMock.getAllProducts).toHaveBeenCalledWith(req.query);

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: {
        products: fakeProducts,
        totalResults: 2,
        totalPages: 1,
        currentPage: 1,
        resultsPerPage: 10,
      },
      message: "Products fetched successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});