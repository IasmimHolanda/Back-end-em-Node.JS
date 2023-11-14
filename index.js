const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { QueryResultError } = require('pg-promise');
const pgp = require('pg-promise')();



const port = process.env.PORT || 3000;

const Professor = require('./professores');
const professoresBaseRoute = '/professores';

app.use(bodyParser.json());

// criar 
app.post(`${professoresBaseRoute}`, async (req, res) => {
  try {
    const { nome, materia, email } = req.body;
    const newProfessor = await Professor.create(nome, materia, email);
    res.json(newProfessor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o professor' });
  }
});

// listar 
app.get(`${professoresBaseRoute}`, async (req, res) => {
  try {
    const professores = await Professor.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.json(professores);
  } catch (error) {
    if (error.code === pgp.errors.queryResultErrorCode.noData) {
      res.setHeader('Content-Type', 'application/json');
      res.json([]);
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar os professores' });
    }
  }
});

//atualizar 
app.put(`${professoresBaseRoute}/:id`, async (req, res) => {
  try {
    const professorId = req.params.id;
    const { nome, materia, email } = req.body;
    const updatedProfessor = await Professor.update(professorId, nome, materia, email);
    res.json(updatedProfessor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o professor' });
  }
});


// Rota padrão para a raiz
app.get('*', (req, res) => {
  res.redirect (professoresBaseRoute);
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
