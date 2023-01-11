const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const mongoConfig = {
  "MONGO_URL": process.env.MONGO_URL || "localhost",
  "MONGO_PORT": process.env.MONGO_PORT || "27017",
  "MONGO_USER": process.env.MONGO_USER || "",
  "MONGO_PASSWORD": process.env.MONGO_PASSWORD || "",
  "MONGO_DB": process.env.MONGO_DB || "usersdb"
};

class DBConnector {
  constructor() {
    this.mongoConfig = mongoConfig;
    this.dbUrl = "";
    this.connection = null;
    this.DBConnectorOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
  }

  createNAUrl() {
    this.dbUrl = `mongodb://${this.mongoConfig.MONGO_URL}:${this.mongoConfig.MONGO_PORT}/${this.mongoConfig.MONGO_DB}`;
  }

  createAUrl() {
    this.dbUrl = `mongodb://${this.mongoConfig.MONGO_USER}:${this.mongoConfig.MONGO_PASSWORD}@${this.mongoConfig.MONGO_URL}:${this.mongoConfig.MONGO_PORT}/${this.mongoConfig.MONGO_DB}`;
  }

  setDBO(option, value) {
    this.DBConnectorOptions[option] = value;
  }

  getConnection() {
    return this.connection;
  }

  attemptConnection() {
    mongoose.set('strictQuery', true);
    return new Promise((resolve, reject) => {
      if (!this.dbUrl) {
        reject(new Error("No database url was created"));
      }
      mongoose.connect(this.dbUrl, this.DBConnectorOptions)
        .then(() => {
          // Connection succeeded
          this.connection = mongoose.connection;
          resolve();
        })
        .catch((error) => {
          // Connection failed
          reject(error);
        });
    });
  }  
}

module.exports.DBConnector = DBConnector;