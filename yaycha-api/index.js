import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(cors());

app.get("/info", (req, res) => {
  res.json({ msg: "Yaycha API" });
});

const server = app.listen(8000, () => {
  console.log("Yaycha API started at 8000...");
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Yaycha API is closed!");
    process.exit(0);
  });
};

// Event is raised when stopping server, terminating API and interrupt
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
