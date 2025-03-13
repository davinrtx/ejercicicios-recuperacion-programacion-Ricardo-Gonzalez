var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var { v4: uuidv4 } = require('uuid'); // Importar uuid para generar IDs únicos

// Actualizar la ruta del archivo JSON
const namesFilePath = path.join(__dirname, '../data/names.json');

/* Página principal */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inicio - Ejercicio 1' });
});

/* Formulario de ingreso de nombres */
router.get('/users/form', function(req, res, next) {
  res.render('form', { title: 'Formulario' });
});

/* Confirmar nombre ingresado */
router.post('/users/confirm', function(req, res, next) {
  const name = req.body.name; // Obtener nombre
  res.render('confirm', { name: name, title: 'Confirmar formulario' });
});

/* Guardar nombre y redirigir a lista */
router.post('/users/save', function(req, res, next) {
  const name = req.body.name; // Obtener nombre

  // Leer el archivo JSON existente
  fs.readFile(namesFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return next(err);
    }

    const names = data ? JSON.parse(data) : [];
    const newName = { _id: uuidv4(), name: name }; // Crear objeto con ID único y nombre
    names.push(newName); // Agregar objeto al arreglo

    // Guardar el arreglo actualizado en el archivo JSON
    fs.writeFile(namesFilePath, JSON.stringify(names), (err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/users/list?success=true'); // Redirigir a lista con parámetro success
    });
  });
});

/* Mostrar lista de nombres */
router.get('/users/list', function(req, res, next) {
  // Leer el archivo JSON
  fs.readFile(namesFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return next(err);
    }

    const names = data ? JSON.parse(data) : [];
    res.render('list', { names: names, title: 'Lista de nombres' });
  });
});

module.exports = router; // Exportar enrutador
