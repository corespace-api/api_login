const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Loading custom modules
const getAllRoutes = require('./assets/utils/getAllRoutes');
const Logger = require('./assets/utils/logger');
const allowedHeader = require('./assets/networking/allowedHeader');

// Create the logger
const logger = new Logger("login");

logger.log("Booting up microservice...");

// Load environment variables from .env file and creating the service
const service = express();
dotenv.config();

// get run arguments
const args = process.argv.slice(2);

// Load configuration
const PORT = process.env.PORT || 3000;
const ROUTES_PATH = path.join(__dirname, `routes`);
const allowDebug = process.env.ALLOW_DEBUG || false;

logger.info(allowDebug)

// #############################################################################
// ##################          Running Checks ############################
// #############################################################################
if (allowDebug) { 
  logger.info("Debug mode enabled, skipping forbidden source check"); 
} else {
  logger.info("Debug mode disabled, checking forbidden source");
}
// -;-

// #############################################################################
// ##################          Load all Middlewares ############################
// #############################################################################
logger.log("Loading middlewares...");
// Add middleware to parse the body of the request
service.use(express.json());
service.use(express.urlencoded({ extended: true }));

// setting allowed headers
service.use(cors(allowedHeader));
// -;-

// #############################################################################
// ##################       Service Request Log      ###########################
// #############################################################################

service.use((req, res, next) => {
  headers = req.headers;
  reqMessage = `Request: ${req.method} ${req.originalUrl} + ${JSON.stringify(headers)}`;
  logger.request(reqMessage);
  next();
});

// -;-

// #############################################################################
// ##################      Load all Routes     #################################
// #############################################################################
const apiRoutes = getAllRoutes(ROUTES_PATH);
const apiRouteKeys = Object.keys(apiRoutes)

logger.info(`Found ${apiRouteKeys.length} routes`);
logger.log("Beginnig to load routes...");

// check if the request originates from a forbidden source
service.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];

  if (allowDebug) { return next(); }
  if (userAgent.includes('curl') || userAgent.includes('PostmanRuntime') || userAgent.includes('insomnia')) {
    logger.warn("Forbidden source detected, aborting request");
    res.status(403).json({
      error: "Forbidden",
      message: "You are not allowed to access this resource",
      status: 403
    });
  }
  return;
});

apiRoutes.forEach(route => {
  logger.log(`Loading route: ${route}`);

  const routePath = path.join(ROUTES_PATH, route);
  const routeName = route.replace('.js', '');

  // load route classes
  const routeHandler = require(routePath);
  const routeInstance = new routeHandler();

  // load route methods
  routeInstance.load();

  // add route to service
  service.use(`/${routeName}`, routeInstance.router);
});

logger.success("Routes loading complete!");
// -;-

service.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: (error.status || 500)
    }
  });
});

service.listen(PORT || 3000, () => {
  logger.log(`running on port ${PORT}`);
});