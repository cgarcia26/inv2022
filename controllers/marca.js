const { request, response } = require("express");
const Marca = require("../models/marca");
const Usuario = require("../models/usuario");

// Consulta todas las marcas activas
const getMarca = async (req, res = response) => {
  try {
    const query = { estado: true };
    const marcaBD = await Marca.find(query);
    res.json(marcaBD);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//Consultar un tipo de equipo por Id
const getMarcaById = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const query = { estado: true, _id: id };
    const marca = await Marca.findOne(query);
    res.json(marca);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// crea una marca
const createMarca = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const marcaBD = await Marca.findOne({ nombre });
    if (marcaBD) {
      // ya existe la marca
      return res.status(400).json({ msg: "Ya existe la marca" });
    }
    const datos = {
      nombre,
    };
    const marca = new Marca(datos);
    await marca.save();
    res.status(201).json(marca);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Actualiza una marca por su ID
const updateMarcaById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { nombre, ...data } = req.body; // destructuring, spread (...)
    const marcaBD = await Marca.findOne({ _id: id });
    if (!marcaBD) {
      // ya existe la marca
      return res.status(400).json({ msg: "No existe la marca" });
    }
    data.fechaCreacion = Marca.fechaCreacion;
    data.fechaActualizacion = new Date();
    const marca = await Marca.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json(marca);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// Borrar una marca por su ID
const deleteMarcaByID = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const marca = await Marca.findByIdAndDelete(id);
    res.status(204).json(marca);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

module.exports = {
  getMarca,
  getMarcaById,
  updateMarcaById,
  deleteMarcaByID,
  createMarca,
};
