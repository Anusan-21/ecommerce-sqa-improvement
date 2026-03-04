jest.mock("../src/modules/logs/logs.factory", () => ({
  makeLogsService: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock("@/shared/utils/sendResponse", () => jest.fn());
jest.mock("@/shared/utils/authUtils", () => ({
  tokenUtils: {
    blacklistToken: jest.fn(),
  },
}));
jest.mock("jsonwebtoken", () => ({
  decode: jest.fn(),
}));

const sendResponse = require("@/shared/utils/sendResponse") as jest.Mock;
const { tokenUtils } = require("@/shared/utils/authUtils");
const jwt = require("jsonwebtoken");

import { Request, Response, NextFunction } from "express";
import { AuthController } from "../src/modules/auth/auth.controller";
import { AuthService } from "../src/modules/auth/auth.service";
import { CartService } from "../src/modules/cart/cart.service";

describe("AuthController (positive flows)", () => {
  let authServiceMock: {
    registerUser: jest.Mock;
    signin: jest.Mock;
  };
  let cartServiceMock: {
    mergeCartsOnLogin: jest.Mock;
  };
  let controller: AuthController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    authServiceMock = {
      registerUser: jest.fn(),
      signin: jest.fn(),
    };

    cartServiceMock = {
      mergeCartsOnLogin: jest.fn(),
    };

    controller = new AuthController(
      authServiceMock as unknown as AuthService,
      cartServiceMock as unknown as CartService
    );

    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Partial<Response>;

    next = jest.fn();
  });


  const flush = () => new Promise((r) => setImmediate(r));

  it("signup - should register user, set cookies, merge carts and send 201", async () => {
    const fakeUser = {
      id: "user-1",
      name: "Alice",
      role: "USER",
      avatar: null,
    };

    (authServiceMock.registerUser as jest.Mock).mockResolvedValue({
      user: fakeUser,
      accessToken: "access-xyz",
      refreshToken: "refresh-xyz",
    });

    const req = {
      body: { name: "Alice", email: "a@ex.com", password: "pass", role: "USER" },
      session: { id: "sess-1" },
    } as unknown as Request;

    const handler = controller.signup;
    handler(req, res as Response, next);
    await flush();

    expect((res.cookie as jest.Mock).mock.calls.length).toBe(2);
    expect((res.cookie as jest.Mock).mock.calls[0][0]).toBe("refreshToken");
    expect((res.cookie as jest.Mock).mock.calls[1][0]).toBe("accessToken");

    expect((cartServiceMock.mergeCartsOnLogin as jest.Mock)).toHaveBeenCalledWith(
      "sess-1",
      "user-1"
    );

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_resArg, statusArg, payloadArg] = sendResponse.mock.calls[0];
    expect(statusArg).toBe(201);
    expect(payloadArg).toMatchObject({
      message: "User registered successfully",
      data: {
        user: { id: "user-1", name: "Alice", role: "USER", avatar: null },
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("signin - should authenticate, set cookies, merge carts and send 200", async () => {
    const fakeUser = {
      id: "user-2",
      name: "Bob",
      role: "USER",
      avatar: "avatar.png",
    };

    (authServiceMock.signin as jest.Mock).mockResolvedValue({
      user: fakeUser,
      accessToken: "access-abc",
      refreshToken: "refresh-abc",
    });

    const req = {
      body: { email: "b@ex.com", password: "pw" },
      session: { id: "sess-2" },
    } as unknown as Request;

    const handler = controller.signin;
    handler(req, res as Response, next);
    await flush();

    expect((res.cookie as jest.Mock).mock.calls.length).toBe(2);
    expect((res.cookie as jest.Mock).mock.calls[0][0]).toBe("refreshToken");
    expect((res.cookie as jest.Mock).mock.calls[1][0]).toBe("accessToken");

    expect((cartServiceMock.mergeCartsOnLogin as jest.Mock)).toHaveBeenCalledWith(
      "sess-2",
      "user-2"
    );

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_r, status, payload] = sendResponse.mock.calls[0];
    expect(status).toBe(200);
    expect(payload).toMatchObject({
      message: "User logged in successfully",
      data: {
        user: { id: "user-2", name: "Bob", role: "USER", avatar: "avatar.png" },
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("signout - should blacklist token when needed, clear cookies and send 200", async () => {
    const future = Math.floor(Date.now() / 1000) + 60 * 60; // +1 hour
    (jwt.decode as jest.Mock).mockReturnValue({ absExp: future });

    (tokenUtils.blacklistToken as jest.Mock).mockResolvedValue(undefined);

    const req = {
      cookies: { refreshToken: "refresh-abc" },
      user: { id: "user-3" },
      session: { id: "sess-3" },
    } as unknown as Request;

    const handler = controller.signout;
    handler(req, res as Response, next);
    await flush();

    expect((tokenUtils.blacklistToken as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((tokenUtils.blacklistToken as jest.Mock).mock.calls[0][0]).toBe("refresh-abc");

    expect((res.clearCookie as jest.Mock).mock.calls.length).toBe(2);
    expect((res.clearCookie as jest.Mock).mock.calls[0][0]).toBe("refreshToken");
    expect((res.clearCookie as jest.Mock).mock.calls[1][0]).toBe("accessToken");

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [_r, status, payload] = sendResponse.mock.calls[0];
    expect(status).toBe(200);
    expect(payload).toMatchObject({ message: "Logged out successfully" });

    expect(next).not.toHaveBeenCalled();
  });
});