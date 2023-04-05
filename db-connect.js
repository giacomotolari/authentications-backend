import mongoose from "mongoose";
import { URI_URL } from "./global.js";

mongoose.set("strictQuery", true);

mongoose
  .connect(URI_URL)
  .then(() => {
    console.log("Database Connected 😎");
  })
  .catch((err) => {
    console.log(err);
  });
