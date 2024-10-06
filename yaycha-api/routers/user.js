import express from "express";
import { prisma } from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
        followers: true,
        following: true,
      },
      orderBy: { id: "desc" },
      take: 20,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.user.findMany({
      where: { id: Number(id) },
      include: {
        posts: true,
        comments: true,
        followers: true,
        following: true,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

router.post("/users", async (req, res) => {
  const { name, userName, bio, password } = req.body;

  if (!name || !userName || !password) {
    return res
      .status(400)
      .json({ msg: "Name, userName and password fields are required" });
  }

  const hashPassword = await bcrypt.hash("password", 10);
  const user = await prisma.user.create({
    data: { name, userName, bio, password: hashPassword },
  });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  const user = await prisma.user.findUnique({
    where: { userName },
  });
  if (user) {
    if (bcrypt.compare(password, user.password)) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ token, user });
    }
  }
  res.status(401).json({ msg: "Wrong credentials" });
});

router.get("/verify", auth, async (req, res) => {
  const user = res.locals.user;
  res.json(user);
});

router.post("/follow/:id", auth, async (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;

  const data = await prisma.follow.create({
    data: {
      followerId: Number(user.id),
      followingId: Number(id),
    },
  });
  res.json(data);
});

router.delete("/unfollow/:id", auth, async (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;

  await prisma.follow.deleteMany({
    where: {
      followerId: Number(user.id),
      followingId: Number(id),
    },
  });

  res.json({ msg: `Unfollow user ${id}` });
});

export default router;
