const { request, response } = require("express");
const Inventario = require("../models/inventario");
const Usuario = require("../models/usuario");
const Marca = require("../models/marca");
const Estado = require("../models/estado");
const TipoEquipo = require("../models/tipoEquipo");

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Consultar todos inventarios
const getInventarios = async (req, res = response) => {
  try {
    const query = {};
    const inventariosBD = await Inventario.find(query);
    res.json(inventariosBD);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
};

// Consultar un inventario por Id
const getInventarioByID = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const query = { _id: id };
    const inventarioBD = await Inventario.findOne(query);
    if (!inventarioBD) {
      return res.status(400).json({
        msj: "No existe inventario",
      });
    }
    res.json(inventarioBD);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
};

// crea un inventario
const createInventario = async (req = request, res = response) => {
  try {
    const {
      serial,
      modelo,
      usuario,
      marca,
      estado,
      tipoEquipo,
      descripcion,
      foto,
      color,
      precio,
    } = req.body;

    const inventarioBD = await Inventario.findOne({
      $or: [{ serial }, { modelo }],
    });
    if (inventarioBD) {
      return res.status(400).json({
        msj: "Ya existe serial o modelo",
      });
    }
    const usuarioBD = await Usuario.findOne({
      _id: usuario,
      estado: true,
    });
    if (!usuarioBD) {
      return res.status(400).json({
        msj: "No existe usuario",
      });
    }
    const marcaBD = await Marca.findOne({
      _id: marca,
      estado: true,
    });
    if (!marcaBD) {
      return res.status(400).json({
        msj: "No existe marca",
      });
    }
    const estadoBD = await Estado.findOne({
      _id: estado,
      estado: true,
    });
    if (!estadoBD) {
      return res.status(400).json({
        msj: "No existe estado",
      });
    }
    const tipoEquipoBD = await TipoEquipo.findOne({
      _id: tipoEquipo,
      estado: true,
    });
    if (!tipoEquipoBD) {
      return res.status(400).json({
        msj: "No existe el tipo de equipo",
      });
    }
    const data = {
      serial,
      modelo,
      descripcion,
      foto,
      color,
      precio,
      usuario,
      marca,
      estado,
      tipoEquipo,
    };
    const inventario = new Inventario(data);
    await inventario.save();
    res.status(201).json(inventario);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
};

// actualizar un inventario por Id
const updateInventario = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { serial, modelo, usuario, marca, estado, tipoEquipo, ...data } =
      req.body; // destructuring, spread (...)

    const inventarioBD = await Inventario.findOne({ _id: id });
    // TODO: VALIDAR QUE EXISTEN Y ESTAN ACTIVOS: ESTADO, USUARIO, MARCA, ...
    if (!inventarioBD) {
      return res.status(400).json({
        msj: "No existe este inventario",
      });
    }
    const usuarioBD = await Usuario.findOne({
      _id: usuario,
      estado: true,
    });
    if (!usuarioBD) {
      return res.status(400).json({
        msj: "No existe usuario",
      });
    }
    const marcaBD = await Marca.findOne({
      _id: marca,
      estado: true,
    });
    if (!marcaBD) {
      return res.status(400).json({
        msj: "No existe marca",
      });
    }
    const estadoBD = await Estado.findOne({
      _id: estado,
      estado: true,
    });
    if (!estadoBD) {
      return res.status(400).json({
        msj: "No existe estado",
      });
    }
    const tipoEquipoBD = await TipoEquipo.findOne({
      _id: tipoEquipo,
      estado: true,
    });
    if (!tipoEquipoBD) {
      return res.status(400).json({
        msj: "No existe el tipo de equipo",
      });
    }
    const inventario = await Inventario.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json(inventario);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
};

// Cargar una imagen al inventario
const uploadImage = async (req = request, res = response) => {
  const { id } = req.params;
  const invBD = await Inventario.findOne({ _id: id });
  if (!invBD) {
    return res.status(400).json({
      msj: "No existe en inventario",
    });
  }
  if (!req.files || Object.keys(req.files) == 0 || !req.files.foto) {
    return res.status(400).json({
      msj: "No se est?? subiendo una foto",
    });
  }
  const foto = req.files.foto;
  const extensionesAceptadas = ["jpg", "jpeg", "png", "gif"]; // validamos extensiones
  const arrayExtension = foto.name.split(".");
  const extension = arrayExtension[arrayExtension.length - 1];
  if (!extensionesAceptadas.includes(extension)) {
    return res.status(400).json({
      msj: "Extension no aceptada",
    });
  }
  const nombreTemp = `${uuidv4()}.${extension}`;
  const rutaSubida = path.join(__dirname, "../uploads", nombreTemp);
  foto.mv(rutaSubida, (e) => {
    if (e) {
      return res.status(500).json({ error: e });
    }
  });
  const data = {};
  data.foto = nombreTemp;
  const inv = await Inventario.findByIdAndUpdate(id, data, { new: true });
  if (!inv) {
    return res.status(400).json({ mensaje: "Error al actualizar" });
  }
  res.status(201).json({ msj: "Se subi?? la foto" });
};

const getFotoById = async (req = request, res = response) => {
  const { id } = req.params;
  const inventarioBD = await Inventario.findOne({ _id: id });
  if (!inventarioBD) {
    return res.status(400).json({ Error: "No existe el inventario" });
  }
  const nombreFoto = inventarioBD.foto;
  const rutaImg = path.join(__dirname, "../uploads", nombreFoto);
  if (fs.existsSync(rutaImg)) {
    res.sendFile(rutaImg);
  }
};

module.exports = {
  getInventarios,
  getInventarioByID,
  createInventario,
  updateInventario,
  uploadImage,
  getFotoById,
};
