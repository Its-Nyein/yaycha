import express from "express";
import { prisma } from "../prismaClient.js";

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
    res.status(500).json({ e });
  }
});

router.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: {
        user: true,
        comments: {
          include: { user: true },
        },
      },
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.comment.deleteMany({
      where: { postId: Number(id) },
    });

    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

router.delete("/comments/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

export default router;
