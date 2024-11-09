import { Router } from "express";
import { PrismaClient } from "@prisma/client";

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

export default router;
