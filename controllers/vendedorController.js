const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllVendors = async (req, res) => {
    try {
        const vendedores = await prisma.vendedor.findMany();
        res.status(200).json(vendedores);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os vendedores' });
    }
};

exports.getVendorById = async (req, res) => {
    const { id } = req.params;
    try {
        const vendedor = await prisma.vendedor.findUnique({
            where: { id: parseInt(id) },
        });
        if (vendedor) {
            res.status(200).json(vendedor);
        } else {
            res.status(404).json({ error: 'Vendedor não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o vendedor' });
    }
};

exports.createVendor = async (req, res) => {
    const { nome, idade, email, telefone } = req.body;
    try {
        const novoVendedor = await prisma.vendedor.create({
            data: { nome, idade, email, telefone },
        });
        res.status(201).json(novoVendedor);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o vendedor' });
    }
};

exports.updateVendor = async (req, res) => {
    const { id } = req.params;
    const { nome, idade, email, telefone } = req.body;
    try {
        const vendedorAtualizado = await prisma.vendedor.update({
            where: { id: parseInt(id) },
            data: { nome, idade, email, telefone },
        });
        res.status(200).json(vendedorAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o vendedor' });
    }
};

exports.deleteVendor = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.vendedor.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o vendedor' });
    }
};