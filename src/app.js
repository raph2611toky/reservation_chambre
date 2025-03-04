const express = require("express");
const roomRoutes = require("./routes/room.routes")
const { swaggerUi, swaggerSpec } = require("./docs/swagger");

const app = express();

app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
