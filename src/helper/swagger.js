const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {version} = require("../../package.json");
const log = require("./logger.js");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SHAPPY REST API Docs",
            version,
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/schema/*.ts"
    ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    log.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;
