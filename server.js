/**
 * server.js
 * Configuración del servidor Express para la aplicación de conversión y división de archivos.
 */

const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

/**
 * Middleware para manejar la carga de archivos.
 * Filtra los tipos de archivo permitidos y limita el tamaño máximo del archivo a 10 MB.
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/plain' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const maxSize = 10 * 1024 * 1024; // 10 MB
const uploadMiddleware = multer({ dest: 'uploads/', fileFilter, limits: { fileSize: maxSize } }).single('file');

/**
 * Middleware para validar archivos.
 * Verifica el tamaño del archivo y llama a la siguiente función middleware si el archivo es válido.
 */
app.use((req, res, next) => {
  if (req.file) {
    if (req.file.size > maxSize) {
      return res.status(400).send('El archivo es demasiado grande');
    }
    next();
  } else {
    next();
  }
});

// Rutas
const routes = require('./routes/index');
app.use('/api', uploadMiddleware, routes);

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

/**
 * Inicia el servidor en el puerto especificado.
 */
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});