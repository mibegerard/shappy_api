const http = require("http");
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
const isProduction = process.env.NODE_ENV === "production";

// Load SSL certificates only in local
const sslOptions = !isProduction
  ? {
      key: fs.readFileSync(path.resolve(__dirname, "../localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../localhost.pem")),
    }
  : null;

// Filter out undefined origins
const allowedOrigins = [
  process.env.ORIGIN,
  process.env.ORIGIN_1,
  process.env.ORIGIN_2,
  process.env.ORIGIN_3,
  process.env.ORIGIN_4,
  process.env.ORIGIN_5,
].filter(Boolean);

// ------------------------------------ middlewares -----------------------------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

// Redirect HTTP to HTTPS (only in local dev)
if (!isProduction) {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow this origin"));
    }
  },
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

app.use(cors(corsOptions));
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ------------------------------------ basic route for health check ------------------------
app.get("/", (req, res) => {
  res.send("Shappy API is live 🎉");
});

// ------------------------------------ dynamic routes ---------------------------------------
const routesDirPath = path.join(__dirname, "routes");

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

    if (isProduction) {
      http.createServer(app).listen(port, () => {
        logger.info(`Production app running at http://localhost:${port}`);
        swaggerDocs(app, port);
      });
    } else {
      https.createServer(sslOptions, app).listen(port, () => {
        logger.info(`App is running at https://localhost:${port}`);
        swaggerDocs(app, port);
      });
    }
  })
  .catch(() => {
    logger.error("Could not connect to db");
    process.exit(1);
  });
  