const { Router } = require("express");
const { createUsuario, getUsuarios } = require("../controllers/usuario");

const router = Router();

// CRUD

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener usuario por id
router.get("/:id", (req, res) => {
  res.json({});
});

// Crear un usuario
router.post("/", createUsuario);

// Actualizar un usuario
router.put("/:id", (req, res) => {
  res.json({});
});

// Actualizar una parte del usuario
router.patch("/:id", (req, res) => {
  res.json({});
});

// Borrar un usuario por id
router.delete("/:id", (req, res) => {
  res.json({});
});

module.exports = router;
