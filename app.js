const express = require('express');
const _path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const _config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginValidation = require('./middlewares/login-validation');
//Custom middlewares;
const _redirect = require('./middlewares/https-redirect');
const _responser = require('./middlewares/route-responser');

const app = express();

app.use(helmet());

//Custom middlewares para responses todas routes;
app.use(_responser);

//Estado da ROUTE;
app.get('/health', (req, res) => {
  return res.responser(200, 'Server funcionando em configuração ' + process.env.NODE_ENV + '.');
});

//Configuração para HTTPS;
app.use(_redirect);

//Set view engine;
app.set('views', _path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//CORS para todas as routes;
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || _config.cors.origin.indexOf('*') !== -1 || _config.cors.origin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: _config.cors.methods,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//Configuração compression gzip;
app.use(compression());

//Configuração bodyParser;
app.use(express.urlencoded({
    extended: false,
    limit: "50mb",
  })
);
app.use(express.json({
    limit: '50mb',
  })
);

//Configuração static folder;
app.use(express.static('public'));

//Carregar routes;
const index = require('./routes/index');
const auth = require('./routes/auth');

const deliveryHistory = require('./routes/v1/deliveryHistory');
const deliverys = require('./routes/v1/deliverys');
const deliveryStatus = require('./routes/v1/deliveryStatus');
const mobile = require('./routes/v1/mobile');
const orderItens = require('./routes/v1/orderItens');
const orders = require('./routes/v1/orders');
const orderStatus = require('./routes/v1/orderStatus');
const products = require('./routes/v1/products');
const userLocations = require('./routes/v1/userLocations');
const userOrders = require('./routes/v1/userOrders');
const users = require('./routes/v1/users');
const payments = require('./routes/v1/payments');
const paymentsIPN = require('./routes/v1/paymentsIPN');
const productscliente = require('./routes/v1/productscliente');
const stockConfig = require('./routes/v1/stockConfig');
const configadmin = require('./routes/v1/configadm');

const configget = require('./routes/config');

//productscliente
//APIs sem validação de login;
app.use("/auth", auth);
app.use("/", index);
app.use("/products", productscliente)
app.use("/paymentsIPN", paymentsIPN);
app.use("/config", configget);

app.use(loginValidation);

//APIs com validação de login
app.use("/api/v1/payments", payments);
app.use("/api/v1/deliveryhistory", deliveryHistory);
app.use("/api/v1/deliverys", deliverys);
app.use("/api/v1/deliverystatus", deliveryStatus);
app.use("/api/v1/mobile", mobile);
app.use("/api/v1/orderitens", orderItens);
app.use("/api/v1/orders", orders);
app.use("/api/v1/orderstatus", orderStatus);
app.use("/api/v1/products", products);
app.use("/api/v1/userlocations", userLocations);
app.use("/api/v1/userorders", userOrders);
app.use("/api/v1/users", users);
app.use("/api/v1/stockConfig", stockConfig);
app.use("/api/v1/config", configadmin);

module.exports = app;