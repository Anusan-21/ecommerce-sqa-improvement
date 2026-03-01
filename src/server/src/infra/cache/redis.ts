// src/server/src/infra/cache/redis.ts
import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Create client with retry strategy so ioredis attempts reconnects
const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  // reconnection backoff: linear up to 2s
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  // optional: reconnect on certain errors
  reconnectOnError(err) {
    // you can filter errors to decide when to reconnect
    return true;
  },
  // optional: enable auto-resubscribe and other safe defaults
  autoResubscribe: true,
  enableReadyCheck: true,
});

// ALWAYS attach handlers here so any import of redisClient has them
redisClient.on("error", (err: any) => {
  // Log but DO NOT throw: prevents unhandled error events crashing the process
  // Use your logger if available (logger.warn/info), here we fallback to console
  console.warn("[redis] error (non-fatal):", err && err.message ? err.message : err);
});

redisClient.on("connect", () => {
  console.info("[redis] connect");
});

redisClient.on("ready", () => {
  console.info("[redis] ready");
});

redisClient.on("close", () => {
  console.info("[redis] connection closed");
});

redisClient.on("reconnecting", (delay: number) => {
  console.info(`[redis] reconnecting in ${delay}ms`);
});

export default redisClient;