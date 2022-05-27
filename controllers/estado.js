const { request, response } = require("express");
const Estado = require("../models/estado");
const Usuario = require("../models/usuario");

// Consultar todos estados de equipo activos
const getEstado = async (req, res = response) => {
  try {
    const query = { estado: true }; // estado del equipo
    const estadoBD = await Estado.find(query);
    res.json(estadoBD);
  } catch (e) {
    return res.status(500).json({ msj: e });
  }
};

//Consultar un estado de equipo por Id
const getEstadoById = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const query = { estado: true, _id: id };
    const estado = await Estado.findOne(query);
    res.json(estado);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// crea un estado de eqipo
const createEstado = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const estadoBD = await Estado.findOne({ nombre });
    if (estadoBD) {
      // ya existe el estado del equipo
      return res.status(400).json({ msg: "Ya existe el estado de equipo" });
    }
    const datos = {
      nombre
    };
    const estado = new Estado(datos);
    await estado.save();
    res.status(201).json(estado);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Actualiza un estado de equipo por su ID
const updateEstadoById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { nombre, ...data } = req.body; // destructuring, spread (...)
    const estadoBD = await Estado.findOne({ _id: id });
    if (!estadoBD) {
      // ya existe el estado del equipo
      return res.status(404).json({ msg: "No existe el estado de equipo" });
    }
    data.fechaCreacion = estadoBD.fechaCreacion;
    data.fechaActualizacion = new Date();
    const estado = await Estado.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json(estado);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Borrar un tipo de equipo por su ID
const deleteEstadoByID = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const estado = await Estado.findByIdAndDelete(id);
    res.status(204).json(estado);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

module.exports = {
  getEstado,
  getEstadoById,
  updateEstadoById,
  deleteEstadoByID,
  createEstado,
};
