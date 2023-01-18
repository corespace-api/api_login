const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Loading custom modules
const Logger = require('../assets/utils/logger');
const { DBConnector } = require('../assets/database/DBManager');

// Loading models
const userSchema = require('../assets/models/user');

async function retrieveUser(username, email) {
    let user = null;
    if (username) {
        user = await userSchema.findOne({ username: username});
        return user;
    }

    if (email) {
        user = await userSchema.findOne({ email: email });
        return user;
    }
}

async function retreivePasswordHash(username) {
    const user = await userSchema.findOne({ username: username });
    return user.password;
}

function checkPasswordHash(incPassword, dbPassword) {
    return incPassword === dbPassword;
}

class Health {
  constructor() {
    this.logger = new Logger("login/login");
    this.router = express.Router();
    this.dbc = new DBConnector();
  }

  dbConnection() {
    // Starting connection to the database
    this.dbc.createAUrl();
    this.logger.log(`Starting connection to the database...`);
    this.logger.log(`Database URL: ${this.dbc.url}`);
    this.dbc.attemptConnection()
      .then(() => {
        this.logger.success("Database connection succeeded");
      })
      .catch((error) => {
        this.logger.log("Database connection failed");
        this.logger.error(error);
      });
  }

  rootRoute() {
    this.logger.log("Loading root route...");
    this.router.post("/", async (req, res) => {
        const {username, email, password} = req.body;

        // check if at least one of these fields are filled [username, email]
        if (!username && !email) {
            res.status(400).json({
                error: "Missing fields",
                message: "Please fill in all the fields",
                fields: ["username", "email"]
            });
            return;
        }

        const user = await retrieveUser(username, email);

        // check if users password maches the one in the database
        

        if (user) {
            res.status(200).json({
                message: "User found",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    creationDate: user.creationDate,
                    lastLogin: user.lastLogin
                }
            });
        } else {
            res.status(404).json({
                error: "User not found",
                message: "User not found"
            });
        }
    });
  }

  load() {
    this.dbConnection();
    this.rootRoute();
  }
}

module.exports = Health;