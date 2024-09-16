import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";

// @param {express.Request} req
// @param {express.Response} res
// @param {express.NextFunction} next

function auth(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ msg: "token is required" });
  }

  const user = jwt.decode(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(401).json({ msg: "token is invalid" });
  }

  res.locals.user = user;

  next();
}

function isOwner(type) {
  return async (req, res, next) => {
    const { id } = req.params;
    const user = res.locals.user;

    if (type === "post") {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      console.log(post?.userId);
      if (post && post.userId === user.id) return next();
    }

    if (type === "comment") {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
          post: true,
        },
      });
      if (
        (comment && comment.userId === user.id) ||
        (comment?.post && comment.post.userId == user.id)
      )
        return next();
    }
    res.status(403).json({ msg: "Unauthorize to delete" });
  };
}

export { auth, isOwner };
