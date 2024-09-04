import express from "express";
import cors from "cors";
import { prisma } from "./prismaClient.js";
import ContentRouter from "./routers/content.js";
import UserRouter from "./routers/user.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/content", ContentRouter);
app.use("/", UserRouter);

app.get("/info", (req, res) => {
  res.json({ msg: "Yaycha API" });
});

app.listen(8000, () => {
  console.log("Yaycha API started at port 8000...");
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Yaycha API Closed");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
