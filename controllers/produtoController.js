const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.render('produtos', { produtos });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os produtos' });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await prisma.produto.findUnique({
            where: { id: parseInt(id) },
        });
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
};

exports.createProduct = async (req, res) => {
    const { nome, imagem, descricao, preco, quantidadeEstoque, categoria } = req.body;
    try {
        const novoProduto = await prisma.produto.create({
            data: { nome, imagem, descricao, preco, quantidadeEstoque, categoria },
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o produto' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nome, imagem, descricao, preco, quantidadeEstoque, categoria } = req.body;
    try {
        const produtoAtualizado = await prisma.produto.update({
            where: { id: parseInt(id) },
            data: { nome, imagem, descricao, preco, quantidadeEstoque, categoria },
        });
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o produto' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.produto.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o produto' });
    }
};

