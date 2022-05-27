const { Router } = require("express");
const {
  getEstado,
  getEstadoById,
  createEstado,
  updateEstadoById,
  deleteEstadoByID,
} = require("../controllers/estado");

const router = Router();

// CRUD

// Obtener todos los estados de equipos
router.get("/", getEstado);

// Obtiene un estado de equipo por id
router.get("/:id", getEstadoById);

// Crear un estado de equipo
router.post("/", createEstado);

// Actualiza un estado de equipo por id
router.put("/:id", updateEstadoById);

// Borrar un estado de equipo por id
router.delete("/:id", deleteEstadoByID);

module.exports = router;
