import dotenv from "dotenv";
dotenv.config();

//if portfinder used, then PORT is not needed
const PORT = process.env.PORT;
const URI_URL = process.env.URI_URL;
const JWT_SECRETKEY = process.env.SECRETKEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

export { PORT, URI_URL, JWT_SECRETKEY, SENDGRID_API_KEY };
