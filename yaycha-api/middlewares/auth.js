import express from "express";
import jwt from "jsonwebtoken";

// @param {express.Request} req
// @param {express.Response} res
// @param {express.NextFunction} next

export default function auth(req, res, next) {
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
