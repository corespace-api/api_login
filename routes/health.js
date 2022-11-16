const express = require('express');
const path = require('path');
const fs = require('fs');

// Loading custom modules
const Logger = require('../assets/utils/logger');

// Create the logger
const logger = new Logger("login/health");

// Importing router
const router = express.Router();

// Create the root product route
router.get("/", (req, res) => {
  res.status(200).json({
    healthy: true,
    uptime: process.uptime()
  });
});

logger.success("Loaded root route");

module.exports = router;