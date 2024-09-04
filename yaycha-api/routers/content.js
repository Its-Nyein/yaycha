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
    res.json(data);
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

export default router;
