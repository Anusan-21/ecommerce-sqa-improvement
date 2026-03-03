
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
import { UserController } from "../src/modules/user/user.controller";
import { UserService } from "../src/modules/user/user.service";

describe("UserController - positive flows for getMe & updateMe", () => {
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
      getMe: jest.fn(),
      updateMe: jest.fn(),
      deleteUser: jest.fn() as any,
      createAdmin: jest.fn() as any,
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(userServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  const flush = () => new Promise((r) => setImmediate(r));

  it("getMe - should fetch current user and send 200", async () => {
    const fakeUser = {
      id: "u-1",
      name: "Test User",
      email: "test@example.com",
      avatar: null,
      role: "USER",
    };

    (userServiceMock.getMe as jest.Mock).mockResolvedValue(fakeUser);

    const req = {
      user: { id: "u-1" },
      session: { id: "sess-1" },
    } as unknown as Request;

    const handler = controller.getMe;
    handler(req, res as Response, next);
    await flush();

    expect(userServiceMock.getMe).toHaveBeenCalledTimes(1);
    expect(userServiceMock.getMe).toHaveBeenCalledWith("u-1");

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [sentRes, status, payload] = sendResponse.mock.calls[0];
    expect(sentRes).toBe(res);
    expect(status).toBe(200);
    expect(payload).toMatchObject({
      data: { user: fakeUser },
      message: "User fetched successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("updateMe - should update user and send 200", async () => {
    const updatedUser = {
      id: "u-2",
      name: "Updated Name",
      email: "updated@example.com",
      avatar: "avatar.png",
      role: "USER",
    };

    (userServiceMock.updateMe as jest.Mock).mockResolvedValue(updatedUser);

    const req = {
      params: { id: "u-2" },
      body: { name: "Updated Name" },
      user: { id: "u-2" },
      session: { id: "sess-2" },
    } as unknown as Request;

    const handler = controller.updateMe;
    handler(req, res as Response, next);
    await flush();

    expect(userServiceMock.updateMe).toHaveBeenCalledTimes(1);
    expect(userServiceMock.updateMe).toHaveBeenCalledWith("u-2", { name: "Updated Name" });

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [sentRes, status, payload] = sendResponse.mock.calls[0];
    expect(sentRes).toBe(res);
    expect(status).toBe(200);
    expect(payload).toMatchObject({
      data: { user: updatedUser },
      message: "User updated successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});