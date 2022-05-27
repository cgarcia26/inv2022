const { Router } = require("express");
const {
    getMarca,
    getMarcaById,
    createMarca,
    updateMarcaById,
    deleteMarcaByID,
} = require("../controllers/marca");

const router = Router();

// CRUD

// Obtener todas las marcas
router.get("/", getMarca);

// Obtiene una marca por id
router.get('/:id', getMarcaById);

// Crear una marca
router.post('/', createMarca);

// Actualiza una marca por id
router.put('/:id', updateMarcaById);

// Borrar una marca por id
router.delete('/:id', deleteMarcaByID);

module.exports = router;
