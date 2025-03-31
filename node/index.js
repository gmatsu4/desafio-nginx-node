const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuração do MySQL
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

// Criar conexão com o banco
const connection = mysql.createConnection(config);

// Criar tabela se não existir
const createTable = `
  CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`;

connection.query(createTable);

// Inserir um nome aleatório quando a aplicação é acessada
app.get('/', (req, res) => {
  const name = `Pessoa ${Math.floor(Math.random() * 1000)}`;
  const insertQuery = `INSERT INTO people(name) VALUES('${name}')`;
  
  connection.query(insertQuery, (error) => {
    if (error) {
      console.error('Erro ao inserir registro:', error);
      res.status(500).send('Erro ao inserir no banco de dados');
      return;
    }

    // Buscar todos os nomes
    connection.query('SELECT name FROM people', (error, results) => {
      if (error) {
        console.error('Erro ao buscar registros:', error);
        res.status(500).send('Erro ao consultar o banco de dados');
        return;
      }
      
      let namesList = '';
      results.forEach(person => {
        namesList += `<li>${person.name}</li>`;
      });

      res.send(`
        <h1>Full Cycle Rocks!</h1>
        <ul>
          ${namesList}
        </ul>
      `);
    });
  });
});

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});