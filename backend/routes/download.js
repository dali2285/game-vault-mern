const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'Image URL is required.' });
  }

  let targetUrl;
  try {
    targetUrl = new URL(url);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid image URL.' });
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return res.status(400).json({ message: 'Only http(s) image URLs are supported.' });
  }

  try {
    const response = await fetch(targetUrl.href);
    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch image from source.' });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const filename = path.basename(targetUrl.pathname) || 'game_image';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ message: 'Unable to download image.' });
  }
});

module.exports = router;
