const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VendaController = {
  
  async criarVenda(req, res) {
    const { id_cliente, id_vendedor, itens } = req.body;

    try {
      
      await prisma.cliente.findUniqueOrThrow({ where: { id: id_cliente } });
      await prisma.vendedores.findUniqueOrThrow({ where: { id: id_vendedor } });

      
      let total = 0;
      const produtosComPreco = [];

      for (const item of itens) {
        const produto = await prisma.produtos.findUnique({ 
          where: { id: item.id_produto } 
        });

        if (!produto) {
          return res.status(400).json({ error: `Produto ${item.id_produto} não existe` });
        }

        if (produto.quantidade_estoque < item.quantidade) {
          return res.status(400).json({ 
            error: `Estoque insuficiente para ${produto.nome} (só tem ${produto.quantidade_estoque})` 
          });
        }

        produtosComPreco.push({
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          precoUnitario: produto.preco
        });

        total += produto.preco * item.quantidade;
      }

      
      const resultado = await prisma.$transaction([
        
        prisma.vendas.create({
          data: {
            id_cliente,
            id_vendedor,
            total,
            itensVenda: { create: produtosComPreco }
          },
          include: { itensVenda: true }
        }),

        
        ...produtosComPreco.map(item => 
          prisma.produtos.update({
            where: { id: item.id_produto },
            data: { quantidade_estoque: { decrement: item.quantidade } }
          })
        )
      ]);

      res.status(201).json(resultado[0]);

    } catch (error) {
      console.error('Erro ao criar venda:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  
  async adicionarItem(req, res) {
    const { id } = req.params;
    const { id_produto, quantidade } = req.body;

    try {
      
      const venda = await prisma.vendas.findUniqueOrThrow({ 
        where: { id: Number(id) } 
      });

      const produto = await prisma.produtos.findUniqueOrThrow({
        where: { id: id_produto }
      });

      if (produto.quantidade_estoque < quantidade) {
        return res.status(400).json({ error: 'Estoque insuficiente' });
      }

      
      const resultado = await prisma.$transaction([
        
        prisma.itensVenda.create({
          data: {
            id_venda: Number(id),
            id_produto,
            quantidade,
            precoUnitario: produto.preco
          }
        }),

        
        prisma.vendas.update({
          where: { id: Number(id) },
          data: { total: { increment: produto.preco * quantidade } }
        }),

       
        prisma.produtos.update({
          where: { id: id_produto },
          data: { quantidade_estoque: { decrement: quantidade } }
        })
      ]);

      res.status(201).json(resultado[0]);

    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  
  async removerItem(req, res) {
    const { id, itemId } = req.params;

    try {
      
      const item = await prisma.itensVenda.findUniqueOrThrow({
        where: { id: Number(itemId) }
      });

      
      await prisma.$transaction([
        
        prisma.itensVenda.delete({ where: { id: Number(itemId) } }),

        
        prisma.vendas.update({
          where: { id: Number(id) },
          data: { total: { decrement: item.precoUnitario * item.quantidade } }
        }),

        
        prisma.produtos.update({
          where: { id: item.id_produto },
          data: { quantidade_estoque: { increment: item.quantidade } }
        })
      ]);

      res.status(204).end();

    } catch (error) {
      console.error('Erro ao remover item:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },


  async buscarVenda(req, res) {
    try {
      const venda = await prisma.vendas.findUniqueOrThrow({
        where: { id: Number(req.params.id) },
        include: {
          cliente: { select: { nome: true } },
          vendedor: { select: { nome: true } },
          itensVenda: { 
            include: { 
              produto: { select: { nome: true, preco: true } } 
            } 
          }
        }
      });

      res.json(venda);

    } catch (error) {
      console.error('Erro ao buscar venda:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async atualizarQuantidadeItem(req, res) {  
    const { id, itemId } = req.params;
    const { novaQuantidade } = req.body;

    try {
      const item = await prisma.itensVenda.findUniqueOrThrow({
        where: { id: Number(itemId) }
      });

      const diferenca = novaQuantidade - item.quantidade;

      await prisma.$transaction([
        prisma.itensVenda.update({
          where: { id: Number(itemId) },
          data: { quantidade: novaQuantidade }
        }),
        prisma.vendas.update({
          where: { id: Number(id) },
          data: { total: { increment: item.precoUnitario * diferenca } }
        }),
        prisma.produtos.update({
          where: { id: item.id_produto },
          data: { quantidade_estoque: { decrement: diferenca } }
        })
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar quantidade" });
    }  
  }
}; 

module.exports = VendaController;