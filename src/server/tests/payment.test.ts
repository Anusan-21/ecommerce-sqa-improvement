
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
import { PaymentController } from "../src/modules/payment/payment.controller";
import { PaymentService } from "../src/modules/payment/payment.service";

describe("PaymentController - getUserPayments & getPaymentDetails (positive)", () => {
  let paymentServiceMock: jest.Mocked<PaymentService>;
  let controller: PaymentController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    paymentServiceMock = {
      getUserPayments: jest.fn(),
      getPaymentDetails: jest.fn(),
      deletePayment: jest.fn() as any,
    } as unknown as jest.Mocked<PaymentService>;

    controller = new PaymentController(paymentServiceMock);
    // we don't rely on real express Response methods because sendResponse is mocked
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("getUserPayments - should fetch payments and send 200", async () => {
    const userId = "user-1";
    const fakePayments = [
      { id: "pay1", amount: 100 },
      { id: "pay2", amount: 50 },
    ];
    (paymentServiceMock.getUserPayments as jest.Mock).mockResolvedValue(
      fakePayments
    );

    const req = {
      user: { id: userId },
      session: { id: "sess-1" },
    } as unknown as Request;

    const handler = controller.getUserPayments;
    handler(req, res as Response, next);
    await flush();

    expect(paymentServiceMock.getUserPayments).toHaveBeenCalledTimes(1);
    expect(paymentServiceMock.getUserPayments).toHaveBeenCalledWith(userId);

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: fakePayments,
      message: "Payments retrieved successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("getPaymentDetails - should fetch payment details and send 200", async () => {
    const userId = "user-2";
    const paymentId = "pay-123";
    const fakePayment = { id: paymentId, amount: 250, status: "paid" };

    (paymentServiceMock.getPaymentDetails as jest.Mock).mockResolvedValue(
      fakePayment
    );

    const req = {
      params: { paymentId },
      user: { id: userId },
      session: { id: "sess-2" },
    } as unknown as Request;

    const handler = controller.getPaymentDetails;
    handler(req, res as Response, next);
    await flush();

    expect(paymentServiceMock.getPaymentDetails).toHaveBeenCalledTimes(1);
    expect(paymentServiceMock.getPaymentDetails).toHaveBeenCalledWith(
      paymentId,
      userId
    );

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(200);
    expect(payloadArg).toMatchObject({
      data: fakePayment,
      message: "Payment retrieved successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});