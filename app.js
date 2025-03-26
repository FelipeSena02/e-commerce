const express = require('express');
const path = require('path'); // Importar o módulo 'path'
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar o mecanismo de visualização como 'ejs'
app.set('view engine', 'ejs');
// Especificar o diretório onde as views estão localizadas
app.set('views', path.join(__dirname, 'views'));


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/', async (req, res) => {
    const produtos = await prisma.produto.findMany();
    res.render('home', { produtos });
});

// Rota para renderizar a página de produtos
app.get('/produtos', async (req, res) => {
    const produtos = await prisma.produto.findMany(); // Obtenção dos produtos no banco
    res.render('product', { produtos }); // Renderiza o arquivo product.ejs com os produtos
});

// Rota para a API de produtos (retorna JSON)
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Rota para a página "Sobre"
app.get('/sobre', (req, res) => {
    res.render('sobre'); // Renderiza o arquivo sobre.ejs
});

app.post('/api/produtos', async (req, res) => {
    const { nome, imagem, descricao, preco, quantidadeEstoque, categoria } = req.body;

    // Validação básica
    if (!nome || !preco || !quantidadeEstoque || !categoria) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    try {
        const novoProduto = await prisma.produto.create({
            data: { nome, imagem, descricao, preco: parseFloat(preco), quantidadeEstoque: parseInt(quantidadeEstoque), categoria },
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar o produto.' });
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.produto.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o produto' });
    }
});

// Rota para renderizar a página de clientes
app.get('/clientes', async (req, res) => {
    const clientes = await prisma.cliente.findMany(); // Obtenção dos produtos no banco
    res.render('client', { clientes }); // Renderiza o arquivo client.ejs com os clientes
});

// Rota para a API de clientes (retorna JSON)
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.post('/api/clientes', async (req, res) => {
    const { nome, idade, email, endereco, telefone } = req.body;

    // Validação básica
    if (!nome || !email || !endereco || !telefone) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    try {
        const novoCliente = await prisma.cliente.create({
            data: { nome, idade: parseInt(idade), email, endereco, telefone},
        });
        res.status(201).json(novoCliente);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ error: 'Erro ao criar o cliente.' });
    }
});

app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.cliente.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o cliente' });
    }
});

// Rota para renderizar a página de vendedores
app.get('/vendedores', async (req, res) => {
    const vendedores = await prisma.vendedor.findMany(); // Obtenção dos vendedores no banco
    res.render('vendor', { vendedores }); // Renderiza o arquivo vendor.ejs com os vendedores
});

// Rota para a API de vendedores (retorna JSON)
app.get('/api/vendedores', async (req, res) => {
    try {
        const vendedores = await prisma.vendedor.findMany();
        res.status(200).json(vendedores);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vendedores' });
    }
});

app.post('/api/vendedores', async (req, res) => {
    const { nome, idade, email, telefone } = req.body;

    // Validação básica
    if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    try {
        const novoVendedor = await prisma.vendedor.create({
            data: { nome, idade: parseInt(idade), email, telefone},
        });
        res.status(201).json(novoVendedor);
    } catch (error) {
        console.error('Erro ao criar vendedor:', error);
        res.status(500).json({ error: 'Erro ao criar o vendedor.' });
    }
});

app.delete('/api/vendedores/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.vendedor.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o vendedor' });
    }
});

// Configurando rotas
const produtoRoute = require('./routes/produtoRoute');
app.use('/produtos', produtoRoute);
const clienteRoute = require('./routes/clienteRoute');
app.use('/clientes', clienteRoute);
const vendedorRoute = require('./routes/vendedorRoute');
app.use('/vendedores', vendedorRoute);

// Porta de execução
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});