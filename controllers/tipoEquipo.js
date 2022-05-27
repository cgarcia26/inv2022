const { request, response } = require("express");
const TipoEquipo = require("../models/tipoEquipo");
const Usuario = require("../models/usuario");

// Consultar todos tipos de equipo activos con usuario activo
const getTiposEquipoUserActivo = async (req, res = response) => {
  try {
    const query = { estado: true }; // estado del equipo
    let tiposEquipoBD = await TipoEquipo.find(query).populate({
      path: "usuario",
      match: { estado: true },
    });
    tiposEquipoBD = tiposEquipoBD.filter((t) => t.usuario != null);
    res.json(tiposEquipoBD);
  } catch (e) {
    return res.status(500).json({ msj: e });
  }
};

//Consultar un tipo de equipo por Id
const getTiposEquipoById = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const query = { _id: id };
    const tipoEquipo = await TipoEquipo.findOne(query);
    res.json(tipoEquipo);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Actualiza un tipo de equipo por su ID
const updateTipoEquipoById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { nombre, ...data } = req.body; // destructuring, spread (...)
    const usuarioBD = await Usuario.findOne({ email: data.usuario.email });
    if (!usuarioBD) {
      return res.status(404).json({ msg: "No existe usuario" });
    }
    data.usuario = usuarioBD._id;
    data.fechaActualizacion = new Date();
    data.nombre = nombre.toUpperCase();
    const tipoEquipo = await TipoEquipo.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json(tipoEquipo);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Borrar un tipo de equipo por su ID
const deleteTipoEquipoByID = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const tipoEquipo = await TipoEquipo.findByIdAndDelete(id);
    res.status(204).json(tipoEquipo);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Consulta todos los tipos de equipo
const getTiposEquipo = async (req, res = response) => {
  try {
    const query = {};
    const tiposEquipoBD = await TipoEquipo.find(query);
    res.json(tiposEquipoBD);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// crea un tipo de eqipo
const createTipoEquipo = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const email = req.body.usuario.email;
    const tipoEquipoBD = await TipoEquipo.findOne({ nombre });
    if (tipoEquipoBD) {
      // ya existe el equipo
      return res.status(400).json({ msg: "Ya existe tipo equipo" });
    }
    const usuarioBD = await Usuario.findOne({ email });
    if (!usuarioBD) {
      // no existe usuario
      return res.status(404).json({ msg: "No existe usuario" });
    }
    const datos = {
      nombre,
      usuario: usuarioBD._id,
    };
    const tipoEquipo = new TipoEquipo(datos);
    await tipoEquipo.save();
    res.status(201).json(tipoEquipo);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

module.exports = {
  getTiposEquipoUserActivo,
  getTiposEquipoById,
  updateTipoEquipoById,
  deleteTipoEquipoByID,
  getTiposEquipo,
  createTipoEquipo,
};
