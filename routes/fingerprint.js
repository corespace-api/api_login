const express = require('express');
const path = require('path');
const fs = require('fs');

// Loading custom modules
const Logger = require('../assets/utils/logger');


class FingerPrintService {
  constructor() {
    this.logger = new Logger("login/fps");
    this.router = express.Router();
  }

  rootRoute() {
    this.router.get("/", (req, res) => {
      res.status(200).json({
        status: "success",
        fingerprint: req.fingerprint,
        message: "Fingerprint generated successfully"
      });
    });
  }

  load() {
    this.rootRoute();
  }
}

module.exports = FingerPrintService;