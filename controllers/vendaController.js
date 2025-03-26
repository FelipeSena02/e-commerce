const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllVendas = async (req, res) => {
    try {
        const vendas = await prisma.venda.findMany({
            include: {
                cliente: true,
                vendedor: true,
                itensVenda: {
                    include: {
                        produto: true
                    }
                }
            }
        });
        res.status(200).json(vendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as vendas' });
    }
};

exports.getVendaById = async (req, res) => {
    const { id } = req.params;
    try {
        const venda = await prisma.venda.findUnique({
            where: { id: parseInt(id) },
            include: {
                cliente: true,
                vendedor: true,
                itensVenda: {
                    include: {
                        produto: true
                    }
                }
            }
        });
        if (venda) {
            res.status(200).json(venda);
        } else {
            res.status(404).json({ error: 'Venda não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a venda' });
    }
};

exports.createVenda = async (req, res) => {
    const { idCliente, idVendedor, itensVenda } = req.body;

    if (!idCliente || !idVendedor || !itensVenda || !Array.isArray(itensVenda)) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando ou itensVenda está em formato incorreto.' });
    }

    try {
        let total = 0;

        // Atualizar estoque dos produtos
        const atualizacoesEstoque = itensVenda.map(async (item) => {
            // Verificar se o produto existe
            const produto = await prisma.produto.findUnique({
                where: { id: item.idProduto }
            });

            if (!produto) {
                throw new Error(`Produto com ID ${item.idProduto} não encontrado.`);
            }

            // Verificar se há estoque suficiente
            if (produto.quantidadeEstoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto com ID ${item.idProduto}.`);
            }

            // Subtrair a quantidade do estoque
            await prisma.produto.update({
                where: { id: item.idProduto },
                data: {
                    quantidadeEstoque: produto.quantidadeEstoque - item.quantidade
                }
            });

            // Calcular o total da venda
            total += item.quantidade * item.precoUnitario;
        });

        // Aguarda a finalização de todas as atualizações de estoque
        await Promise.all(atualizacoesEstoque);

        // Criar a venda
        const novaVenda = await prisma.venda.create({
            data: {
                idCliente,
                idVendedor,
                total,
                itensVenda: {
                    create: itensVenda.map(item => ({
                        idProduto: item.idProduto,
                        quantidade: item.quantidade,
                        precoUnitario: item.precoUnitario
                    }))
                }
            },
            include: {
                cliente: true,
                vendedor: true,
                itensVenda: true
            }
        });

        res.status(201).json(novaVenda);
    } catch (error) {
        console.error('Erro ao criar venda:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.updateVenda = async (req, res) => {
    const { id } = req.params;
    const { idCliente, idVendedor, itensVenda, total } = req.body;
    try {
        const vendaAtualizada = await prisma.venda.update({
            where: { id: parseInt(id) },
            data: {
                idCliente,
                idVendedor,
                total,
                itensVenda: {
                    deleteMany: {}, // Remove itens antigos
                    create: itensVenda.map(item => ({
                        idProduto: item.idProduto,
                        quantidade: item.quantidade,
                        precoUnitario: item.precoUnitario
                    }))
                }
            }
        });
        res.status(200).json(vendaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar a venda' });
    }
};

exports.deleteVenda = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.venda.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar a venda' });
    }
};