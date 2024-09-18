const { Router } = require("express");
const { env } = require("./src/constant/environment");

const path = require("path");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load(path.resolve(`${__dirname}/swagger.yaml`));
const swaggerUi = require("swagger-ui-express");

const router = Router();

swaggerDocument.host = `${env.SERVER_IP}:${env.PORT}`;

router.get("/docs.json", (req, res) => res.send(swaggerDocument));
router.use("/docs", swaggerUi.serve, (req, res) =>
  res.send(swaggerUi.generateHTML(swaggerDocument)),
);

module.exports = router;
