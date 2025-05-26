import express, { json } from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(json());

let trades = [];

app.get("/", (request, result) => {
  result.send("Bitcoin Tracker Backend is running.");
});

app.get("/trades", (request, result) => {
  result.json(trades);
});

app.post("/trades", (request, result) => {
  const trade = request.body;
  trades.push(trade);
  result.status(201).json({ message: "Trade added", trade });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
