
import request from "supertest";

jest.mock("stripe", () => {

  return class MockStripe {
    constructor(_key?: string, _opts?: any) {

    }

    customers = {
      create: jest.fn().mockResolvedValue({ id: "cus_test" }),
      retrieve: jest.fn().mockResolvedValue(null),
    };
    charges = {
      create: jest.fn().mockResolvedValue({ id: "ch_test" }),
    };
    paymentIntents = {
      create: jest.fn().mockResolvedValue({ id: "pi_test" }),
    };
  };
});


jest.mock("../src/infra/database/database.config", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));


jest.mock("../src/infra/cache/redis", () => ({
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  quit: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue("OK"),
}));

// --- Correct connect-redis mock: export RedisStore as a class (instances have .on) ---
jest.mock("connect-redis", () => {
  class MockRedisStore {
    constructor(_opts?: any) {
      // noop
    }
    on(_event: string, _listener?: (...args: any[]) => void) {
      // noop
      return this;
    }
    get(_sid: any, cb: (err: any, sess?: any) => void) {
      cb(null, null);
    }
    set(_sid: any, _sess: any, cb?: (err?: any) => void) {
      if (cb) cb();
    }
    destroy(_sid: any, cb?: (err?: any) => void) {
      if (cb) cb();
    }
  }
  return { RedisStore: MockRedisStore };
});

// --- Logger mock (ES module default) ---
jest.mock("../src/infra/winston/logger", () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

// --- Other side-effect no-op mocks ---
jest.mock("../src/infra/passport/passport", () => jest.fn());
jest.mock("../src/infra/cloudinary/config", () => ({}));
jest.mock("../src/infra/socket/socket", () => ({ SocketManager: jest.fn().mockImplementation(() => ({ getIO: () => ({}) })) }));
jest.mock("../src/docs/swagger", () => ({ setupSwagger: jest.fn() }));
jest.mock("../src/graphql", () => ({ configureGraphQL: jest.fn().mockResolvedValue(undefined) }));

// --- Health route mock so GET / exists ---
jest.mock("../src/routes/health.routes", () => {
  const express = require("express");
  const r = express.Router();
  r.get("/", (_req: any, res: any) => res.json({ status: "ok" }));
  return r;
});

// --- IMPORT AFTER MOCKS ---
import { createApp } from "../src/app";

describe("Simple Express Test (healthy mocks)", () => {
  let app: any;
  let httpServer: any;

  beforeAll(async () => {
    const created = await createApp();
    app = created?.app;
    httpServer = created?.httpServer;
  });

  afterAll(async () => {
    if (httpServer && typeof httpServer.close === "function") {
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    }
  });

  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});