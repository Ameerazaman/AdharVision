"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const AdharRouter_1 = __importDefault(require("./Routes/AdharRouter"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:3000", "https://adhar-vision.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/uploads', express.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use("/adhaar", AdharRouter_1.default);
// 404 Not Found Middleware
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use(errorHandler);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
