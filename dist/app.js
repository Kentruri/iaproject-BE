"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const algorithms_1 = tslib_1.__importDefault(require("./routes/algorithms"));
const express_fileupload_1 = tslib_1.__importDefault(require("express-fileupload"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const app = (0, express_1.default)();
app.set("port", 4000 || process.env.PORT);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
app.use((0, cors_1.default)());
app.use("", algorithms_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map