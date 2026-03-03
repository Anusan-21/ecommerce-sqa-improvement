jest.mock("../src/modules/logs/logs.factory", () => ({
  makeLogsService: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

import { Request, Response, NextFunction } from "express";
import { UserController } from "../src/modules/user/user.controller";
import { UserService } from "../src/modules/user/user.service";



jest.mock("@/shared/utils/sendResponse", () => jest.fn());
const sendResponse = require("@/shared/utils/sendResponse") as jest.Mock;

describe("UserController.createAdmin", () => {
  let userServiceMock: jest.Mocked<UserService>;
  let controller: UserController;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    userServiceMock = {
      getAllUsers: jest.fn() as any,
      getUserById: jest.fn() as any,
      getUserByEmail: jest.fn() as any,
      getMe: jest.fn() as any,
      updateMe: jest.fn() as any,
      deleteUser: jest.fn() as any,
      createAdmin: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(userServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  it("should create admin", async () => {
    const fakeAdmin = {
      id: "new-admin-id",
      name: "Admin",
      email: "a@ex.com",
      avatar: null,
      role: "ADMIN", // casted as any later if your real ROLE is an enum
    };

    (userServiceMock.createAdmin as jest.Mock).mockResolvedValue(fakeAdmin as any);

    const req = {
      body: { name: "Admin", email: "a@ex.com", password: "pass" },
      user: { id: "current-user-id" },
      session: { id: "session-123" },
    } as unknown as Request;

    const handler = controller.createAdmin;
    handler(req, res as Response, next);
    // allow async internals to run
    await Promise.resolve();

    expect(userServiceMock.createAdmin).toHaveBeenCalledTimes(1);
    expect(userServiceMock.createAdmin).toHaveBeenCalledWith(
      { name: "Admin", email: "a@ex.com", password: "pass" },
      "current-user-id"
    );

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [sentRes, status, payload] = sendResponse.mock.calls[0];
    expect(sentRes).toBe(res);
    expect(status).toBe(201);
    expect(payload).toMatchObject({
      data: { user: fakeAdmin },
      message: "Admin created successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

});