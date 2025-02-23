const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/ayshop", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log("❌ Database Connection Error:", err));

// Telegram Bot Config
const BOT_TOKEN = "7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA";
const OWNER_ID = "5123439510";

// Mongoose Schema for Users
const UserSchema = new mongoose.Schema({
    telegramId: String,
    verificationCode: String,
    email: String,
    phone: String,
    balance: { type: Number, default: 0 }
});
const User = mongoose.model("User", UserSchema);

// Mongoose Schema for Orders
const OrderSchema = new mongoose.Schema({
    telegramId: String,
    orderName: String,
    quantity: Number,
    timestamp: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", OrderSchema);

// **1. Send Verification Code via Telegram**
app.post("/send-code", async (req, res) => {
    const { telegramId } = req.body;
    if (!telegramId) return res.json({ success: false, message: "Telegram ID is required" });

    const code = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit code
    await User.findOneAndUpdate({ telegramId }, { verificationCode: code }, { upsert: true });

    // Send code to Telegram bot
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: telegramId,
        text: `Your verification code: ${code}`
    });

    res.json({ success: true, message: "Code sent!" });
});

// **2. Verify Code & Save User Details**
app.post("/verify-code", async (req, res) => {
    const { telegramId, code, email, phone } = req.body;
    const user = await User.findOne({ telegramId });

    if (!user || user.verificationCode !== code) {
        return res.json({ success: false, message: "Invalid code" });
    }

    user.email = email;
    user.phone = phone;
    await user.save();

    res.json({ success: true, message: "Account verified!" });
});

// **3. Place an Order**
app.post("/place-order", async (req, res) => {
    const { telegramId, orderName, quantity } = req.body;
    if (!telegramId || !orderName || !quantity) {
        return res.json({ success: false, message: "Missing order details" });
    }

    const order = new Order({ telegramId, orderName, quantity });
    await order.save();

    // Notify Admin via Telegram
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: OWNER_ID,
        text: `📦 New Order!\n\nUser: ${telegramId}\nItem: ${orderName}\nQuantity: ${quantity}`
    });

    res.json({ success: true, message: "Order placed!" });
});

// **4. Top-Up Request**
app.post("/top-up", async (req, res) => {
    const { telegramId, amount, transactionId } = req.body;
    if (!telegramId || !amount || !transactionId) {
        return res.json({ success: false, message: "Missing top-up details" });
    }

    // Notify Admin for Approval
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: OWNER_ID,
        text: `💰 Top-Up Request!\n\nUser: ${telegramId}\nAmount: ${amount} ETB\nTransaction ID: ${transactionId}`
    });

    res.json({ success: true, message: "Top-up request sent!" });
});

// **5. Load User Profile**
app.get("/get-user", async (req, res) => {
    const { telegramId } = req.query;
    const user = await User.findOne({ telegramId });

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
});

// **6. Admin Approves Top-Up**
app.post("/admin/approve-top-up", async (req, res) => {
    const { telegramId, amount } = req.body;
    if (!telegramId || !amount) return res.json({ success: false, message: "Missing details" });

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false, message: "User not found" });

    user.balance += parseFloat(amount);
    await user.save();

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: telegramId,
        text: `✅ Your top-up of ${amount} ETB has been approved! New Balance: ${user.balance} ETB`
    });

    res.json({ success: true, message: "Top-up approved!" });
});

// **7. Get Order History**
app.get("/orders", async (req, res) => {
    const { telegramId } = req.query;
    const orders = await Order.find({ telegramId });

    res.json({ success: true, orders });
});

// **Start Server**
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));