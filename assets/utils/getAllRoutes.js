const fs = require('fs');
const path = require('path');

// const getAllRoutes = (ROUTES_PATH) => {
//   // Loading all available routes
//   let routeTree = {}

//   const routes = fs.readdirSync(ROUTES_PATH);
//   routes.forEach(route => {
//     if (route.includes('.js')) { return; }
//     const masterRoutes = route;

//     const subRoutePath = path.join(ROUTES_PATH, `${masterRoutes}/`);
//     const subRoutes = fs.readdirSync(subRoutePath);

//     routeTree[masterRoutes] = subRoutes;
//   });
//   return routeTree;
// }

const getAllRoutes = (ROUTES_PATH) => {
  // Loading all available routes
  let routeTree = []

  const routes = fs.readdirSync(ROUTES_PATH);
  routes.forEach(route => {
    if (!route.includes('.js')) { return; }
    routeTree.push(route);
  });
  return routes;
}

module.exports = getAllRoutes;