// src/server/src/start.ts
import { createApp } from "./app"; // path you provided earlier
import redisClient from "./infra/cache/redis";
import { setTimeout as wait } from "timers/promises";

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

// protect process from unhandled rejections / exceptions so logs are visible in CI
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection at:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// make redis errors non-fatal and log them
if (redisClient && typeof redisClient.on === "function") {
  redisClient.on("error", (err: any) => {
    console.warn("Redis error (non-fatal):", err && err.message ? err.message : err);
  });
  redisClient.on("connect", () => {
    console.info("Redis client connected");
  });
  redisClient.on("ready", () => {
    console.info("Redis client ready");
  });
}

/**
 * Wait for Redis to be reachable using the client ping() if available.
 * If Redis doesn't become reachable within timeoutMs, we continue (do not exit),
 * relying on redis retry strategy so app doesn't crash immediately in CI.
 */
async function waitForRedis(timeoutMs = 30000) {
  if (!redisClient) return;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      // ioredis has .ping(); some clients also support .status === 'ready'
      if (typeof redisClient.ping === "function") {
        const res = await Promise.race([
          (redisClient as any).ping(),
          wait(2000).then(() => { throw new Error("ping timeout"); }),
        ]);
        if (res === "PONG" || res === "OK" || res === undefined) {
          console.info("Redis ping succeeded");
          return;
        }
      } else if ((redisClient as any).status === "ready") {
        return;
      }
    } catch (err) {
      // ignore and retry
    }
    await wait(500);
  }
  console.warn(`Redis did not become ready within ${timeoutMs}ms — continuing anyway.`);
}

(async () => {
  try {
    console.info(`Waiting up to 30s for Redis at ${REDIS_HOST}:${REDIS_PORT}...`);
    await waitForRedis(30000);

    const { app, httpServer } = await createApp();

    // start HTTP server on explicit host so CI/containers can reach it
    httpServer.listen(PORT, HOST, () => {
      console.log(`Server listening on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start application:", err);
    // If you'd like to fail hard instead of continuing, uncomment the next line:
    // process.exit(1);
  }
})();