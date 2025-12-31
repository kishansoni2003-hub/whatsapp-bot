const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TOKEN = "YOUR_WHATSAPP_TOKEN";
const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID";

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "12345";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry[0].changes[0].value.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const text = msg.text?.body?.toLowerCase();

  let reply =
    "नमस्ते 🙏\n1️⃣ Product Info\n2️⃣ Price\n3️⃣ Location\n4️⃣ Talk to Human";

  if (text === "1") reply = "हमारे Products:\nA️⃣ Product A\nB️⃣ Product B";
  if (text === "2") reply = "Price:\nProduct A – ₹999\nProduct B – ₹1499";
  if (text === "3") reply = "📍 Address: Delhi, India";
  if (text === "4") reply = "👨‍💼 Executive आपको call करेगा";

  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: from,
      text: { body: reply }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot running"));
