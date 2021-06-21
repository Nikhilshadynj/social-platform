const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const glob = require('glob');
const cors = require('cors');
const app = express();
const log4js = require('log4js')
global.path = require('path')
global.ROOT_PATH = __dirname
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    createParentPath: true
  }));
log4js.configure(path.join(__dirname, "./log-config.json"));

require('dotenv').config();
require('./db/db');

const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");
  const swaggerDocument = YAML.load("./public/docs/swagger.yaml");

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customfavIcon: "/favicon.ico",
      customSiteTitle: "a2z",
      swaggerOptions: {
        filter: true,
        displayRequestDuration: true
      }
    })
  );
const PORT = process.env.PORT || 5000;

glob('./routes/**/*.js', (err, routers) => {
    if (err) {
        throw new Error('Unable to glob routers');
    }
    routers.forEach(router => {
        require(router)(app);
    });

    app.use((req, res, next) => {
        res.status(404).json({
            status: 404,
            message: 'The a2z endpoint does not exist'
        });
    });
});

app.listen(PORT, () => {
    console.log(`a2z Server is listening on port ${PORT}`);
});