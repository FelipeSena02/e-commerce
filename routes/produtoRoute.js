const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota para listar todos os produtos
router.get('/', produtoController.getAllProducts);

// Rota para buscar um produto por ID
router.get('/:id', produtoController.getProductById);

// Rota para criar um novo produto
router.post('/', produtoController.createProduct);

// Rota para atualizar um produto existente
router.put('/:id', produtoController.updateProduct);

// Rota para deletar um produto por ID
router.delete('/:id', produtoController.deleteProduct);

module.exports = router;