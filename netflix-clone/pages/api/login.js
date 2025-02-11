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
    const { email, password } = req.body;

    try {
      // Conecta ao banco de dados
      const connection = await mysql.createConnection(dbConfig);

      // Busca o usuário pelo email
      const [user] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      await connection.end();

      // Verifica se o usuário existe
      if (user.length === 0) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      // Compara a senha fornecida com a senha criptografada no banco de dados
      const isPasswordValid = await bcrypt.compare(password, user[0].password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      // Retorna uma resposta de sucesso
      res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          role: user[0].role,
        },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro ao fazer login', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}