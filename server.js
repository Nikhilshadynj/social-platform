const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors');
const app = express();
const log4js = require('log4js')
global.path = require('path')
const server = require('http').createServer(app)
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
const cronRouter = require('./controllers/cron')
require('dotenv').config();
require('./db/db');

app.use('/',(req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();

  //set default headers
  if (
    req.headers["accept-language"] == undefined ||
    req.headers["accept-language"] == ""
  ) {
    req.headers["accept-language"] = process.env.DEFAULT_LANGUAGE;
  }

  global.DM = require("./locale/" +
    process.env.DEFAULT_LANGUAGE +
    "/display_messages").APP_MESSAGES;
  if (req.headers["accept-language"] == "hi") {
    global.DM = require("./locale/hi/display_messages").APP_MESSAGES;
  }
  if (req.headers["accept-language"] == "bn") {
    global.DM = require("./locale/bn/display_messages").APP_MESSAGES;
  }
});
app.use(adminUserRouter)
app.use(faqRouter)
app.use(authRouter)
app.use(requestRouter)
app.use(usersRouter)
app.use(cronRouter)

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

server.listen(PORT, () => {
  console.log(`a2z Server is listening on port ${PORT}`);
});