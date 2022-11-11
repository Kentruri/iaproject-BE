import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port = app.get("port");
function init() {
  app.listen(port);
  console.log("server on port ", port);
}

init();
