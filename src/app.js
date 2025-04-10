const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const logger = require("./helper/logger");
const catchError = require("./helper/catchError");
const swaggerDocs = require("./helper/swagger.js");
const cookieParser = require("cookie-parser");

// ------------------------------------ constants -------------------------------------------
const app = express();
const port = process.env.PORT || 3000;
// Load SSL certificates only in development mode
let sslOptions;
if (process.env.NODE_ENV === "development") {
    sslOptions = {
        key: fs.readFileSync(path.resolve(__dirname, "../localhost-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "../localhost.pem")),
    };
}

// Filter out undefined origins
const allowedOrigins = [
    process.env.ORIGIN,
    process.env.ORIGIN_1,
    process.env.ORIGIN_2,
    process.env.ORIGIN_3,
    process.env.ORIGIN_4,
    process.env.ORIGIN_5
].filter(Boolean);

// ------------------------------------ middlewares -----------------------------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);


// Improved CORS configuration
const corsOptions = {
    origin: true,
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options("*", cors(corsOptions));

// ------------------------------------ dynamic routes ---------------------------------------
const routesDirPath = path.join(__dirname, "routes");

// Dynamically load routes
fs.readdirSync(routesDirPath).forEach((file) => {
    const filePath = path.join(routesDirPath, file);
    if (fs.statSync(filePath).isFile()) {
        app.use("/api", require(filePath));
    }
});

// ------------------------------------ error handling ---------------------------------------
app.use((err, req, res, next) => {
    catchError(err, req, res, next);
});

// ------------------------------------ start server -----------------------------------------
const dbUri = process.env.DB_URI;

mongoose
    .connect(dbUri)
    .then(async () => {
        logger.info("DB connected");

        https.createServer(sslOptions, app).listen(port, async () => {
            logger.info(`App is running at https://localhost:${port}`);
            swaggerDocs(app, port);
        });
    })
    .catch(() => {
        logger.error("Could not connect to db");
        process.exit(1);
    });