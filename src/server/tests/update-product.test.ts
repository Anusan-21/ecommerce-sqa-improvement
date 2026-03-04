
jest.mock("../src/modules/logs/logs.factory", () => ({
  makeLogsService: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock("@/shared/utils/sendResponse", () => jest.fn());
jest.mock("@/shared/utils/slugify", () => jest.fn((s: string) => `${s}-slug`));

const sendResponse = require("@/shared/utils/sendResponse") as jest.Mock;
const slugify = require("@/shared/utils/slugify") as jest.Mock;

import { Request, Response, NextFunction } from "express";
import { ProductController } from "../src/modules/product/product.controller";
import { ProductService } from "../src/modules/product/product.service";

describe("ProductController.updateProduct (positive)", () => {
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
      updateProduct: jest.fn(),
      bulkCreateProducts: jest.fn() as any,
      deleteProduct: jest.fn() as any,
    } as unknown as jest.Mocked<ProductService>;

    controller = new ProductController(productServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("should update product and send 200 response (no variant files)", async () => {
    const productId = "prod-123";
    const reqBody = {
      name: "New Product Name",
      description: "Updated description",
      isNew: "true",
      isFeatured: "false",
      isTrending: "true",
      isBestSeller: "false",
      categoryId: "cat-1",
    };

    const updatedProduct = {
      id: productId,
      name: reqBody.name,
      slug: `${reqBody.name}-slug`,
      description: reqBody.description,
      isNew: true,
      isFeatured: false,
      isTrending: true,
      isBestSeller: false,
      categoryId: "cat-1",
      variants: undefined,
    };

    (productServiceMock.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

    const req = {
      params: { id: productId },
      body: reqBody,
      files: [],
      user: { id: "admin-1" },
      session: { id: "sess-1" },
    } as unknown as Request;


    const handler = controller.updateProduct;
    handler(req, res as Response, next);
    await flush();


    expect(productServiceMock.updateProduct).toHaveBeenCalledTimes(1);
    const expectedUpdatedData = {
      name: reqBody.name,
      slug: `${reqBody.name}-slug`,
      description: reqBody.description,
      isNew: true,
      isFeatured: false,
      isTrending: true,
      isBestSeller: false,
      categoryId: "cat-1",

    };
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith(productId, expectedUpdatedData);
    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: { product: updatedProduct },
      message: "Product updated successfully",
    });
    expect(next).not.toHaveBeenCalled();
  });
});