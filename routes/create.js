const express = require('express');
const crypto = require('crypto');

const router = express.Router();

router.get('/create', (req, res) => {
  const redirectMap = req.app.locals.redirectMap;
  console.log(`[${new Date().toISOString()}] GET /create request received with query:`, req.query);
  try {
    const url = req.query.url;
    const expirySeconds = parseInt(req.query.expirySeconds) || 69;
    
    if (!url) {
      console.log(`[${new Date().toISOString()}] Missing "url" in query for request`);
      return res.status(400).send('Missing "url" in query');
    }
    
    try {
      new URL(url);
    } catch {
      console.log(`[${new Date().toISOString()}] Invalid "url" URL: ${url} for request`);
      return res.status(400).send('Invalid "url" URL');
    }
    
    const id = crypto.randomUUID();
    console.log(`[${new Date().toISOString()}] Generating ID: ${id} for URL: ${url} with expiry: ${expirySeconds}s`);
    
    redirectMap.set(id, url);
    
    setTimeout(() => {
      redirectMap.delete(id);
      console.log(`[${new Date().toISOString()}] Expired and deleted ID: ${id}`);
    }, expirySeconds * 1000);
    
    console.log(`[${new Date().toISOString()}] ID ${id} stored in memory successfully`);
    
    res.status(200).json({
      status: "success",
      id,
      url
    });
    
    console.log(`[${new Date().toISOString()}] Response sent for ID: ${id}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in /create:`, err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
