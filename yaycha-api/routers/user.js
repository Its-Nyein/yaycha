import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

  const hashPassword = await bcrypt.hash("password", 10);
  const user = await prisma.user.create({
    data: { name, username, bio, password: hashPassword },
  });
  res.json(user);
});

export default router;
