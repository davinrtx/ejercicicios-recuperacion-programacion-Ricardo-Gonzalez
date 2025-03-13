var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para registrar solicitudes HTTP
app.use(logger('dev'));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos codificados en URL
app.use(express.urlencoded({ extended: false }));

// Middleware para manejar cookies
app.use(cookieParser());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos codificados en URL
app.use(bodyParser.urlencoded({ extended: false }));

// Usar el enrutador principal
app.use('/', indexRouter);

// Manejar errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; // Exportar la aplicación
