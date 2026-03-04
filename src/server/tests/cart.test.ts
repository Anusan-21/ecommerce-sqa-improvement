
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
import { CartController } from "../src/modules/cart/cart.controller";
import { CartService } from "../src/modules/cart/cart.service";

describe("CartController - addToCart, updateCartItem, removeFromCart (positive)", () => {
  let cartServiceMock: jest.Mocked<CartService>;
  let controller: CartController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    cartServiceMock = {
      getOrCreateCart: jest.fn() as any,
      getCartCount: jest.fn() as any,
      addToCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      mergeCartsOnLogin: jest.fn() as any,
    } as unknown as jest.Mocked<CartService>;

    controller = new CartController(cartServiceMock);
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Partial<Response>;

    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("addToCart - should add item and send 200 with item", async () => {
    const fakeItem = { id: "item-1", cartId: "cart-1", variantId: "v-1", quantity: 2 };
    (cartServiceMock.addToCart as jest.Mock).mockResolvedValue(fakeItem);

    const req = {
      body: { variantId: "v-1", quantity: 2 },
      user: { id: "user-1" },
      session: { id: "sess-1" },
    } as unknown as Request;

    const handler = controller.addToCart;
    handler(req, res as Response, next);
    await flush();

    expect(cartServiceMock.addToCart).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith("v-1", 2, "user-1", "sess-1");

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: { item: fakeItem },
      message: "Item added to cart successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("updateCartItem - should update item quantity and send 200 with updated item", async () => {
    const updatedItem = { id: "item-2", cartId: "cart-2", quantity: 5 };
    (cartServiceMock.updateCartItemQuantity as jest.Mock).mockResolvedValue(updatedItem);

    const req = {
      params: { itemId: "item-2" },
      body: { quantity: 5 },
      session: { id: "sess-2" },
      user: { id: "user-2" },
    } as unknown as Request;

    const handler = controller.updateCartItem;
    handler(req, res as Response, next);
    await flush();

    expect(cartServiceMock.updateCartItemQuantity).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.updateCartItemQuantity).toHaveBeenCalledWith("item-2", 5);

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: { item: updatedItem },
      message: "Item quantity updated successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("removeFromCart - should remove item and send 200", async () => {
    (cartServiceMock.removeFromCart as jest.Mock).mockResolvedValue(undefined);

    const req = {
      params: { itemId: "item-3" },
      session: { id: "sess-3" },
      user: { id: "user-3" },
    } as unknown as Request;

    const handler = controller.removeFromCart;
    handler(req, res as Response, next);
    await flush();

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith("item-3");

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      message: "Item removed from cart successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});