import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pap',
    });

    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM uploads');
      await connection.end();
      return res.status(200).json(rows); // Retorna um array de vídeos
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await connection.execute('DELETE FROM uploads WHERE id = ?', [id]);
      await connection.end();
      return res.status(200).json({ message: 'Vídeo excluído com sucesso!' });
    }

    return res.status(405).json({ message: 'Método não permitido' });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}