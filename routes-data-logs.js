import listEndpoints from "express-list-endpoints";

// process.argv[2] is the second argument passed to the node command in the terminal, 
// if it's true, then we log the routes data, otherwise we log just the port number
const canLogRoutingData = process.argv[2] === "true";

export const logRoutesData = (PORT, app) => {
  if (canLogRoutingData) {
    console.log(
      listEndpoints(app).map((route) => {
        const url = `http://localhost:${PORT}${route.path}`;
        delete route.middlewares;
        return { ...route, url };
      })
    );
  } else {
    console.log(`Server running on port ${PORT}`);
  }
};
