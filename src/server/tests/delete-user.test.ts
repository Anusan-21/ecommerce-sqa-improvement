
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

describe("UserController.deleteUser", () => {
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
      deleteUser: jest.fn(),
      createAdmin: jest.fn() as any,
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(userServiceMock);
    res = {} as Partial<Response>;
    next = jest.fn();
  });

  it("should delete user and call sendResponse with 204", async () => {
    (userServiceMock.deleteUser as jest.Mock).mockResolvedValue(undefined);

    const req = {
      params: { id: "target-user-id" },
      user: { id: "current-user-id" },
      session: { id: "session-abc" },
    } as unknown as Request;

    const handler = controller.deleteUser;
    handler(req, res as Response, next);
    await Promise.resolve();

    expect(userServiceMock.deleteUser).toHaveBeenCalledTimes(1);
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(
      "target-user-id",
      "current-user-id"
    );

    expect(sendResponse).toHaveBeenCalledTimes(1);
    const [sentRes, status, payload] = sendResponse.mock.calls[0];
    expect(sentRes).toBe(res);
    expect(status).toBe(204);
    expect(payload).toMatchObject({
      message: "User deleted successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
 
});