const express = require('express');
const crypto = require('crypto');

const router = express.Router();

router.get('/create', (req, res) => {
  const redirectMap = req.app.locals.redirectMap;
  try {
    const url = req.query.url;
    const expirySeconds = parseInt(req.query.expirySeconds) || 69;

    if (!url) {
      return res.status(400).send('Missing "url" in query');
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).send('Invalid "url" URL');
    }

    const id = crypto.randomUUID();

    redirectMap.set(id, url);

    setTimeout(function() {
      redirectMap.delete(id);
    }, expirySeconds * 1000);

    res.status(200).json({
      status: "success",
      id,
      url
    });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;