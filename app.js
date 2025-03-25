const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando rotas
const produtoRoute = require('./routes/produtoRoute');
app.use('/produtos', produtoRoute);

const clienteRoute = require('./routes/clienteRoute');
app.use('/clientes', clienteRoute);
const vendedorRoute = require('./routes/vendedorRoute');
app.use('/vendedores', vendedorRoute);

const clienteRoute = require('./routes/clienteRoute');
app.use('/clientes', clienteRoute);
const vendedorRoute = require('./routes/vendedorRoute');
app.use('/vendedores', vendedorRoute);

const vendedorRoute = require('./routes/vendedorRoute');
app.use('/vendedores', vendedorRoute);
const clienteRoute = require('./routes/clienteRoute');
app.use('/clientes', clienteRoute);


// Porta de execução
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});