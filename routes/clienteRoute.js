const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rota para listar todos os clientes
router.get('/', clienteController.getAllClients);

// Rota para buscar um cliente por ID
router.get('/:id', clienteController.getClientById);

// Rota para criar um novo cliente
router.post('/', clienteController.createClient);

// Rota para atualizar um cliente existente
router.put('/:id', clienteController.updateClient);

// Rota para deletar um cliente por ID
router.delete('/:id', clienteController.deleteClient);

module.exports = router;