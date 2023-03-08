class Health {
  constructor(config, logger, express) {
    this.config = config;
    this.logger = logger
    this.express = express;
    this.router = this.express.Router();
  }

  rootRoute() {
    this.router.get("/", (req, res) => {
      res.status(200).json({
        service: "login",
        healthy: true,
        uptime: process.uptime()
      });
    });
  }

  load() {
    this.rootRoute();
  }
}

module.exports = Health;