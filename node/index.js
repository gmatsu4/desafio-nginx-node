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

// Usar pool de conexões em vez de uma única conexão
const pool = mysql.createPool(config);

// Criar tabela se não existir
const createTable = `
  CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`;

pool.query(createTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela:', error);
  } else {
    console.log('Tabela verificada/criada com sucesso!');
  }
});

app.get('/', (req, res) => {
  const name = `Pessoa ${Math.floor(Math.random() * 1000)}`;
  const insertQuery = `INSERT INTO people(name) VALUES(?)`;
  
  pool.query(insertQuery, [name], (error) => {
    if (error) {
      console.error('Erro ao inserir registro:', error);
      res.status(500).send('Erro ao inserir no banco de dados');
      return;
    }

    // Buscar todos os nomes
    pool.query('SELECT name FROM people', (error, results) => {
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

// Lidar com o encerramento da aplicação
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Erro ao fechar conexões com o banco:', err);
    }
    console.log('Conexões com o banco encerradas');
    process.exit(0);
  });
});