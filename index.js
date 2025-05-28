import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import admin from "./firebaseAdmin";
import db from "./db";
import authenticate from "./middleware/authMiddleware";


const app = express();
app.use(cors());
app.use(express.json());
app.post("https://satosync-4dc0a22a0b02.herokuapp.com/trades", authenticate, async(request, result)=>{
    const {price, quantity, timestamp} = request.body;
    const userId = request.user.uid;
    try{
        const result = await db.query(
            "INSERT INTO trades (user_id, price, quantity, timestamp) VALUES($1, $2, $3, $4) RETURNING *",
            [userId, price, quantity, timestamp]
        );
        result.status(201).json(result.rows[0]);
    }
    catch (error){
      result.status(500).json({error: "DB error", detail: error.message}) ;
    }
});
app.get("https://satosync-4dc0a22a0b02.herokuapp.com/trades", authenticate, async(request, result)=>{
    const userId = request.user.uid;
    try{
        const result = await db.query("SELECT * FROM trades WHERE user_id = $1 ORDER BY timestamp",[userId]);
        result.json(result.rows);
    }
    catch (error){
        result.status(500).json({error: "Fetch error", detail: error.message});
    }
});
app.post("https://satosync-4dc0a22a0b02.herokuapp.com/save-token", authenticate, async(request, result)=>{
    const {fcmToken} = request.body;
        const userId = request.user.uid;
    try{
       await db.query(
        "INSERT INTO fcm_tokens (user_id, token)VALUES($1,$2) ON CONFLICT(token) DO NOTHING",
        [userId, fcmToken]
       );
       result.sendStatus(200);}
       catch(error){
        result.status(500).json({error: "Failed t t save FCM token", detail: error.message});
       }
});
app.post("https://satosync-4dc0a22a0b02.herokuapp.com/set-alert-threshold", authenticate, async (request, result) => {
  const { threshold } = request.body;
  const userId = request.user.uid;
  try {
    await db.query(
      "INSERT INTO btc_alerts (user_id, threshold) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET threshold = $2",
      [userId, threshold]
    );
    result.sendStatus(200);
  } catch (err) {
    result.status(500).json({ error: "Failed to save threshold", detail: err.message });
  }
});

const sendBTCAlerts = async (btcPrice) => {
  const result = await db.query(`
    SELECT a.user_id, a.threshold, f.token, a.last_sent
    FROM btc_alerts a
    JOIN fcm_tokens f ON a.user_id = f.user_id
    WHERE $1 >= a.threshold
  `, [btcPrice]);

  const now = new Date();
  const messages = [];

  for (const row of result.rows) {
    const sentRecently = row.last_sent && new Date(row.last_sent) > new Date(now - 1000 * 60 * 60);
    if (!sentRecently) {
      messages.push({
        token: row.token,
        notification: {
          title: "BTC Alert",
          body: `BTC has hit $${btcPrice}, your alert threshold.`
        }
      });
      await db.query(`UPDATE btc_alerts SET last_sent = $1 WHERE user_id = $2`, [now, row.user_id]);
    }
  }

  if (messages.length > 0) {
    await admin.messaging().sendAll(messages);
    console.log(`Sent ${messages.length} BTC alerts.`);
  }
};

const checkBTCAndAlert = async () => {
  try {
    const result = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud");
    const btcPrice = (await result.json()).bitcoin.usd;
    await sendBTCAlerts(btcPrice);
  } catch (err) {
    console.error("Failed to fetch BTC price:", err.message);
  }
};

setInterval(checkBTCAndAlert, 10 * 60 * 1000);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
