import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/users", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
      orderBy: { id: "desc" },
      take: 20,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await prisma.user.findFirst({
      where: { id: Number(id) },
      include: {
        posts: true,
        comments: true,
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/users", async (req, res) => {
  const { name, username, bio, password } = req.body;

  if (!name || !username || !password) {
    return res
      .status(400)
      .json({ msg: "Name, username and password are required" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, username, bio, password: hashPassword },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ token, user });
    }
  }

  res.status(401).json({ msg: "Username or password are invalid" });
});

router.get("/verify", auth, async (req, res) => {
  const user = res.locals.user;
  res.json(user);
});

export default router;
