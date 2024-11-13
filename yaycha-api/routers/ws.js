import express from "express";
import expressWs from "express-ws";
import jwt from "jsonwebtoken";

const app = express();
expressWs(app);

const router = express.Router();
const secret = process.env.JWT_SECRET;

let clients = [];

router.ws("/subscribe", (ws, req) => {
  console.log("WS: WebSocket connection received");

  ws.on("message", (msg) => {
    const { token } = JSON.parse(msg);
    console.log("WS: Token received");

    jwt.verify(token, secret, (err, user) => {
      if (err) return false;

      clients.push({ userId: user.id, ws });
      console.log(`WS: Client added ${user.id}`);
    });
  });
});

export { clients, router };
