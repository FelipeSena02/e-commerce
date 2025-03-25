const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/vendaController.js');

// POST /vendas - Cria nova venda com itens
router.post('/', VendaController.criarVenda);

// GET /vendas/:id - Busca venda específica
router.get('/:id', VendaController.buscarVenda);

// POST /vendas/:id/itens - Adiciona item a venda existente
router.post('/:id/itens', VendaController.adicionarItem);

// PUT /vendas/:id/itens/:itemId - Atualiza quantidade de um item
router.put('/:id/itens/:itemId', VendaController.atualizarQuantidadeItem);

// DELETE /vendas/:id/itens/:itemId - Remove item da venda
router.delete('/:id/itens/:itemId', VendaController.removerItem);

module.exports = router;