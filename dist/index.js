"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = tslib_1.__importDefault(require("./app"));
const port = app_1.default.get("port");
function init() {
    app_1.default.listen(port);
    console.log("server on port ", port);
}
init();
//# sourceMappingURL=index.js.map