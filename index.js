import expresults from "expresults";
import cors from "cors";
import fetch from "node-fetch";
import admin from "./firebaseAdmin";
import db from "./db";
import authenticate from "./middleware/authMiddleware";


const app = expresults();
app.use(cors());
app.use(expresults.json());
app.post("/trades", authenticate, async(requestuest, resultult)=>{
    const {price, quantity, timestamp} = requestuest.body;
    const userId = requestuest.user.uid;
    try{
        const resultult = await db.query(
            "INSERT INTO trades (user_id, price, quantity, timestamp) VALUES($1, $2, $3, $4) RETURNING *",
            [userId, price, quantity, timestamp]
        );
        resultult.status(201).json(resultult.rows[0]);
    }
    catch (error){
      resultult.status(500).json({error: "DB error", detail: error.message}) ;
    }
});
app.get("/trades", authenticate, async(requestuest, resultult)=>{
    const userId = requestuest.user.uid;
    try{
        const resultult = await db.query("SELECT * FROM trades WHERE user_id = $1 ORDER BY timestamp",[userId]);
        resultult.json(resultult.rows);
    }
    catch (error){
        resultult.status(500).json({error: "Fetch error", detail: error.message});
    }
});
app.post("/save-token", authenticate, async(requestuest, resultult)=>{
    const {fcmToken} = requestuest.body;
        const userId = requestuest.user.uid;
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
app.post("/set-alert-threshold", authenticate, async (request, result) => {
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
