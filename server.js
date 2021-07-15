const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const glob = require('glob');
const cors = require('cors');
const app = express();
const log4js = require('log4js')
global.path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
global.ROOT_PATH = __dirname
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    createParentPath: true
  }));
log4js.configure(path.join(__dirname, "./log-config.json"));
const adminUserRouter = require('./admin_apis/routes/users')
const faqRouter = require('./routes/faq')
const authRouter = require('./routes/auth')
const requestRouter = require('./routes/requests')
const usersRouter = require('./routes/user')
require('dotenv').config();
require('./db/db');
app.use(adminUserRouter)
app.use(faqRouter)
app.use(authRouter)
app.use(requestRouter)
app.use(usersRouter)
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

io.on('connection',(socket)=>{
  console.log('Connected')
  app.set('socket',socket)
  socket.on('login',()=>{
    console.log('logged in')
  })
})

server.listen(PORT, () => {
    console.log(`a2z Server is listening on port ${PORT}`);
});