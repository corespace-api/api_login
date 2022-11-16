const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Loading custom modules
const getAllRoutes = require('./assets/utils/getAllRoutes');
const Logger = require('./assets/utils/logger');

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
let RunMode = 'dev';


// #############################################################################
// ##################          Load all Middlewares ############################
// #############################################################################
logger.log("Loading middlewares...");
// Add middleware to parse the body of the request
service.use(express.json());
service.use(express.urlencoded({ extended: true }));

// setting allowed headers
service.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
  res.header('Access-Control-Allow-Headers', process.env.ALLOWED_HEADERS);
  res.header('Access-Control-Allow-Methods', process.env.ALLOWED_METHODS_X);

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', process.env.ALLOWED_METHODS);
    return res.status(200).json({});
  }

  next();
});
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

apiRoutes.forEach(route => {
  const routePath = path.join(ROUTES_PATH, route);
  const routeName = route.replace('.js', '');
  const routeHandler = require(routePath);
  service.use(`/${routeName}`, routeHandler);
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