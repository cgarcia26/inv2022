const express = require("express");

const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');

const usuarios = require("./routes/usuario");
const tiposEquipo = require("./routes/tipoEquipo");
const marcas = require("./routes/marca");
const estados = require("./routes/estado");
const inventarios = require('./routes/inventario');

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors());

app.use("/api/usuarios", usuarios);
app.use("/api/tiposequipo", tiposEquipo);
app.use("/api/marcas", marcas);
app.use("/api/estados", estados);
app.use('/api/inventarios', inventarios);

module.exports = app;
