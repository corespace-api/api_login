// Loading models
const userSchema = require('../assets/models/user');

async function retrieveUser(username, email) {
  let user = null;
  if (username) {
    user = await userSchema.findOne({
      username: username
    });

    if (!user) {
      return null;
    }
    return user;
  }

  if (email) {
    user = await userSchema.findOne({
      email: email
    });
    if (!user) {
      return null;
    }
    return user;
  }
}

async function retreivePasswordHash(username) {
  const user = await userSchema.findOne({
    username: username
  });
  return user.password;
}

async function checkIfStatus(username) {
  const user = await userSchema.findOne({
    username: username
  })

  if (user.status === "active") {
    return {
      username: username,
      status: "active",
    };
  } else {
    return {
      username: username,
      status: user.status,
    };
  }
}

async function setLastLogin(username) {
  const user = await userSchema.findOne({
    username: username
  });
  user.lastLogin = Date.now();
  await user.save();
}

function checkPasswordHash(reqPassword, dbPassword) {
  return reqPassword === dbPassword;
}

class Health {
  constructor(config, logger, express, dbc) {
    this.config = config;
    this.logger = logger;
    this.express = express;
    this.router = this.express.Router();
    this.dbc = dbc;
  }

  rootRoute() {
    this.logger.log("Loading root route...");
    this.router.post("/", async (req, res) => {
      const {
        username,
        email,
        password
      } = req.body;

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

      // check if user exists
      if (!user) {
        res.status(404).json({
          error: "User not found",
          message: "Please check your username and password or create a new account"
        });
        return;
      }

      // check if users password maches the one in the database
      const userStatus = await checkIfStatus(user.username);
      console.log(userStatus.status);
      if (userStatus.status !== "active") {
        res.status(403).json({
          user: userStatus.username,
          status: userStatus.status,
          message: "User is not active, please contact the administrator",
        });
        return;
      }

      if (checkPasswordHash(password, user.passwordHash) === false) {
        
        res.status(401).json({
          error: "Wrong password",
          message: "Please check your username and password or create a new account"
        });
        return;
      }

      await setLastLogin(user.username);
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
    });
  }

  load() {
    this.rootRoute();
  }
}

module.exports = Health;