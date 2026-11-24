const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use((req, res, next) => next(new AppError(404, 'Rota não encontrada')));
app.use(errorHandler);

module.exports = app;
