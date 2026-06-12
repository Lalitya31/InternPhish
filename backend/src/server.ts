import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { app } from "./app";

const server = app.listen(env.PORT, () => {
  console.log(`InternPhish backend listening on port ${env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
