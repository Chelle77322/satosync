import express from "express";
const app = express();
const PORT = process.env.PORT || 4000;
app.get("/health", (request,result)=>result.send("Server is up and running"));
app.listen(PORT,()=>console.log(`Listening on port ${PORT}`));