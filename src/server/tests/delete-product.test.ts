
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

describe("ProductController.deleteProduct (positive)", () => {
  let productServiceMock: jest.Mocked<ProductService>;
  let controller: ProductController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    productServiceMock = {
      getAllProducts: jest.fn() as any,
      getProductById: jest.fn() as any,
      getProductBySlug: jest.fn() as any,
      createProduct: jest.fn() as any,
      updateProduct: jest.fn() as any,
      bulkCreateProducts: jest.fn() as any,
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    controller = new ProductController(productServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("should delete product and send 200 response", async () => {
    (productServiceMock.deleteProduct as jest.Mock).mockResolvedValue(undefined);

    const req = {
      params: { id: "product-123" },
      user: { id: "admin-1" },
      session: { id: "sess-1" },
    } as unknown as Request;

    const handler = controller.deleteProduct;
    handler(req, res as Response, next);
    await flush();

    // service called correctly
    expect(productServiceMock.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith("product-123");

    // sendResponse called with 200
    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      message: "Product deleted successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});