const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');

// Rota para listar todos os vendedores
router.get('/', vendedorController.getAllVendors);

// Rota para buscar um vendedor por ID
router.get('/:id', vendedorController.getVendorById);

// Rota para criar um novo vendedor
router.post('/', vendedorController.createVendor);

// Rota para atualizar um vendedor existente
router.put('/:id', vendedorController.updateVendor);

// Rota para deletar um vendedor por ID
router.delete('/:id', vendedorController.deleteVendor);

module.exports = router;