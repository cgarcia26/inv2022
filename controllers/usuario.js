const { request, response } = require("express");
const Usuario = require("../models/usuario");

// Consultar todos los usuarios activos
const getUsuarios = async (req, res = response) => {
  try {
    const query = { estado: true };
    const usuariosBD = await Usuario.find(query);
    res.json(usuariosBD);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
};

const createUsuario = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre;
    const email = req.body.email;
    const data = {
      nombre,
      email
    }

    const usuario = new Usuario(data);
    await usuario.save();
    res.json(usuario);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

module.exports = { 
  getUsuarios, 
  createUsuario 
};
