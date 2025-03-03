require("dotenv").config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestion des Utilisateurs",
      version: "1.0.0",
      description: "Documentation de l'API des utilisateurs avec Swagger",
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}/api`,
        description: "Serveur local",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
