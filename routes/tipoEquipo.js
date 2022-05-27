const { Router } = require("express");
const {
  getTiposEquipo,
  getTiposEquipoUserActivo,
  createTipoEquipo,
  getTiposEquipoById,
  updateTipoEquipoById,
  deleteTipoEquipoByID,
} = require("../controllers/tipoEquipo");

const router = Router();

// CRUD

//  btiene todos los tipos de equipos los cuales los usuarios son activos
router.get('/user-activo', getTiposEquipoUserActivo);

// Obtener todos los equipos
router.get("/", getTiposEquipo);

// Obtiene un tipo de equipo por id
router.get('/:id', getTiposEquipoById);

// Crear un tipo de equipo
router.post('/', createTipoEquipo);

// Actualiza un tipo de equipo por id
router.put('/:id', updateTipoEquipoById);

// Borrar un tipo de equipo por id
router.delete('/:id', deleteTipoEquipoByID);

module.exports = router;
