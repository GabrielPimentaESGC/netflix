import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
  host: 'localhost',
  user: 'root', // Substitua pelo seu usuário do MySQL
  password: '', // Substitua pela sua senha do MySQL
  database: 'pap', // Substitua pelo nome do seu banco de dados
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Conecta ao banco de dados
      const connection = await mysql.createConnection(dbConfig);

      // Verifica se o username já existe
      const [usernameCheck] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (usernameCheck.length > 0) {
        await connection.end();
        return res.status(400).json({ message: 'Username já está em uso.' });
      }

      // Verifica se o email já existe
      const [emailCheck] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (emailCheck.length > 0) {
        await connection.end();
        return res.status(400).json({ message: 'Email já está em uso.' });
      }

      // Criptografa a senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insere o novo usuário no banco de dados
      await connection.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      await connection.end();
      res.status(200).json({ message: 'Registro realizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}