import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import portfinder from "portfinder";
import "./db-connect.js";
import { logRoutesData } from "./routes-data-logs.js";
import userRoute from "./routes/userRoute.js";

const startScriptType =
  process.env.npm_lifecycle_script !== undefined
    ? process.env.npm_lifecycle_script.split(" ")[0]
    : null;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRoute);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: error,
    status: error.status || 500,
  });
});

portfinder.getPort((err, portfinderPort) => {
  if (err) {
    console.log(err);
    return;
  }
  //prevent error when deploying
  const PORT = !startScriptType ? process.env.PORT : portfinderPort;
  app.listen(PORT, () => logRoutesData(PORT, app));
});
