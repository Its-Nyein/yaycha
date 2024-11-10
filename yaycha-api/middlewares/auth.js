import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

function auth(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization && authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ msg: "Token is required" });
  }

  const user = jwt.decode(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(401).json({ msg: "Token is invalid" });
  }

  res.locals.user = user;

  next();
}

/*
 * @param {('post'|'comment')} type
 */

function isOwner(type) {
  /*
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  return async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;

    if (type === "post") {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      if (post.userId === user.id) return next();
    }

    if (type === "comment") {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
          post: true,
        },
      });
      if (comment.userId === user.id || comment.post.userId === user.id)
        return next();
    }

    return res.status(403).json({ msg: "Unauthorize to delete" });
  };
}

export { auth, isOwner };
