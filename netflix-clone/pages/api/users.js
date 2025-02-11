import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'netflix_clone',
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, role } = req.body;

    try {
      const connection = await mysql.createConnection(dbConfig);
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, password, role]
      );
      connection.end();

      res.status(200).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}