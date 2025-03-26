const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');

// Rota para listar todas as vendas
router.get('/', vendaController.getAllVendas);

// Rota para buscar uma venda por ID
router.get('/:id', vendaController.getVendaById);

// Rota para criar uma nova venda
router.post('/', vendaController.createVenda);

// Rota para atualizar uma venda existente
router.put('/:id', vendaController.updateVenda);

// Rota para deletar uma venda por ID
router.delete('/:id', vendaController.deleteVenda);

module.exports = router;