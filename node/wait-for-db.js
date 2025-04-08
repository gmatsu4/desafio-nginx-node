
const mysql = require('mysql');
const MAX_RETRIES = 20;
const RETRY_INTERVAL = 3000;

console.log('Esperando o banco de dados estar pronto...');

function connectToDatabase(retryCount) {
  if (retryCount >= MAX_RETRIES) {
    console.error('Número máximo de tentativas excedido. Não foi possível conectar ao banco de dados.');
    process.exit(1);
  }

  const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  });

  connection.connect((err) => {
    if (err) {
      console.log(`Tentativa ${retryCount + 1}/${MAX_RETRIES}: Não foi possível conectar ao banco de dados. Tentando novamente em ${RETRY_INTERVAL/1000} segundos...`);
      connection.end();
      setTimeout(() => connectToDatabase(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.log('Conectado ao banco de dados com sucesso!');
      connection.end();
      require('./index');
    }
  });
}

connectToDatabase(0);