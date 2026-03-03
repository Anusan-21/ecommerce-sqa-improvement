
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
import { CheckoutController } from "../src/modules/checkout/checkout.controller";
import { CheckoutService } from "../src/modules/checkout/checkout.service";
import { CartService } from "../src/modules/cart/cart.service";

describe("CheckoutController.initiateCheckout (positive)", () => {
  let checkoutServiceMock: jest.Mocked<CheckoutService>;
  let cartServiceMock: jest.Mocked<CartService>;
  let controller: CheckoutController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    checkoutServiceMock = {
      createStripeSession: jest.fn(),
    } as unknown as jest.Mocked<CheckoutService>;

    cartServiceMock = {
      getOrCreateCart: jest.fn(),
      logCartEvent: jest.fn(),
      // other CartService methods stubbed if needed
    } as unknown as jest.Mocked<CartService>;

    controller = new CheckoutController(checkoutServiceMock, cartServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("should initiate checkout, return session id and log the event", async () => {
    const userId = "user-123";
    const cart = {
      id: "cart-1",
      cartItems: [{ id: "ci-1", quantity: 1 }],
    };

    (cartServiceMock.getOrCreateCart as jest.Mock).mockResolvedValue(cart);
    const stripeSession = { id: "sess_abc123" };
    (checkoutServiceMock.createStripeSession as jest.Mock).mockResolvedValue(
      stripeSession
    );

    const req = {
      user: { id: userId },
      session: { id: "sess-x" },
    } as unknown as Request;

    const handler = controller.initiateCheckout;
    handler(req, res as Response, next);
    await flush();

    // Cart service called to fetch the cart
    expect(cartServiceMock.getOrCreateCart).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.getOrCreateCart).toHaveBeenCalledWith(userId);

    // Checkout service called with cart and userId
    expect(checkoutServiceMock.createStripeSession).toHaveBeenCalledTimes(1);
    expect(checkoutServiceMock.createStripeSession).toHaveBeenCalledWith(cart, userId);

    // sendResponse called with 200 and sessionId
    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: { sessionId: stripeSession.id },
      message: "Checkout initiated successfully",
    });

    // cartService.logCartEvent called
    expect(cartServiceMock.logCartEvent).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.logCartEvent).toHaveBeenCalledWith(cart.id, "CHECKOUT_STARTED", userId);

    // next should not be called for success
    expect(next).not.toHaveBeenCalled();
  });
});