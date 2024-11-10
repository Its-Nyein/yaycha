import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth, isOwner } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        user: true,
        comments: true,
      },
      orderBy: { id: "desc" },
      take: 20,
    });
    setTimeout(() => {
      res.json(data);
    }, 2000);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: {
        user: true,
        comments: {
          include: { user: true },
        },
      },
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

router.delete("/posts/:id", auth, isOwner("post"), async (req, res) => {
  const id = req.params.id;

  await prisma.comment.deleteMany({
    where: { postId: Number(id) },
  });

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  res.sendStatus(204);
});

router.delete("/comments/:id", auth, isOwner("comment"), async (req, res) => {
  const id = req.params.id;

  await prisma.comment.delete({
    where: { id: Number(id) },
  });

  res.sendStatus(204);
});

export default router;
