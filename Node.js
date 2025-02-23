const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// Embed the API key directly (NOT RECOMMENDED for production)
const BOT_TOKEN = '7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA';

const codes = new Map();

// Get Telegram profile
app.post('/get-profile', async (req, res) => {
    try {
        const {
            username
        } = req.body;
        const chatResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/getChat`, {
                chat_id: username
            }
        );

        const user = chatResponse.data.result;
        const photosResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos`, {
                user_id: user.id,
                limit: 1
            }
        );

        let photoUrl = '';
        if (photosResponse.data.result ?.photos ?.length) {
            const file = await axios.post(
                `https://api.telegram.org/bot${BOT_TOKEN}/getFile`, {
                    file_id: photosResponse.data.result.photos[0][0].file_id
                }
            );
            photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.data.result.file_path}`;
        }

        res.json({
            id: user.id,
            name: user.first_name || user.username,
            pic: photoUrl
        });
    } catch (error) {
        res.status(400).json({
            error: 'Profile not found'
        });
    }

});

// Send verification code
app.post('/send-code', async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000);
        codes.set(userId, code);

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: userId,
            text: `🔒 Your verification code: ${code}`
        });

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to send code'
        });
    }

});

// Verify code
app.post('/verify-code', (req, res) => {
    const {
        userId,
        code
    } = req.body;
    const storedCode = codes.get(userId);

    if (storedCode && storedCode === parseInt(code)) {
        codes.delete(userId);
        res.json({
            message: '🎉 Welcome! Verification successful!'
        });
    } else {
        res.status(400).json({
            error: '❌ Invalid verification code'
        });
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
