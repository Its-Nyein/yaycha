import express from "express";
import { prisma } from "../prismaClient.js";
import { auth, isOwner } from "../middlewares/auth.js";

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

router.delete("/posts/:id", auth, isOwner("post"), async (req, res) => {
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

router.delete("/comments/:id", auth, isOwner("comment"), async (req, res) => {
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

router.post("/posts", auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: "Content is required" });

  const user = res.locals.user;
  const post = await prisma.post.create({
    data: {
      content,
      postId: Number(user.id),
    },
  });

  const data = await prisma.post.findUnique({
    where: { id: Number(post.id) },
    include: {
      user: true,
      comments: {
        include: { user: true },
      },
    },
  });

  res.json(data);
});

router.post("/comments", auth, async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId)
    return res.status(400).json({ msg: "Content and postId are required" });

  const user = req.locals.user;
  const comment = await prisma.comment.create({
    data: {
      content,
      user: Number(user.id),
      postId: Number(postId),
    },
  });

  res.json(comment);
});

export default router;
