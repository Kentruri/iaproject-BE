import express, { Application } from "express";
import morgan from "morgan";
import router from "./routes/algorithms";
import fileupload from "express-fileupload";

const app: Application = express();

app.set("port", 4000 || process.env.PORT);

app.use(morgan("dev"));
app.use(express.json());
app.use(fileupload());

app.use("", router);

export default app;
