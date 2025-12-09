const express = require('express');
const router = express.Router();
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

router.get('/', ensureAuth, ensureAdmin, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.flushHeaders(); 
    const sendEvent = () => {
        const payload = {
            ts: new Date().toISOString(),
            activeUsers: Math.floor(Math.random() * 20),
            projects: Math.floor(Math.random() * 10)
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };
    sendEvent();
    const iv = setInterval(sendEvent, 3000);
    req.on("close", () => {
        clearInterval(iv);
        res.end();
    });
});

module.exports = router;
