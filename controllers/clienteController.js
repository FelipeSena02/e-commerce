const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllClients = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os clientes' });
    }
};

exports.getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) },
        });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o cliente' });
    }
};

exports.createClient = async (req, res) => {
    const { nome, idade, email, endereco, telefone } = req.body;
    try {
        const novoCliente = await prisma.cliente.create({
            data: { nome, idade, email, endereco, telefone },
        });
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o cliente' });
    }
};

exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { nome, idade, email, endereco, telefone } = req.body;
    try {
        const clienteAtualizado = await prisma.cliente.update({
            where: { id: parseInt(id) },
            data: { nome, idade, email, endereco, telefone },
        });
        res.status(200).json(clienteAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o cliente' });
    }
};

exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.cliente.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o cliente' });
    }
};