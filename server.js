const express = require("express");
const app = express();

app.use(express.json({limit: "10mb"}));

app.post("/location", (req, res) => {
  console.log("Location:", req.body);
  res.send("OK");
});

app.post("/image", (req, res) => {
  console.log("Image received");
  res.send("OK");
});

app.listen(3000, () => console.log("Server running"));