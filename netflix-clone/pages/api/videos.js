import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = {
  host: 'localhost',
  user: 'root', // Substitua pelo seu usuário do MySQL
  password: '', // Substitua pela sua senha do MySQL
  database: 'pap', // Substitua pelo nome do seu banco de dados
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetVideos(req, res);
    case 'POST':
      return handleAddVideo(req, res);
    case 'PUT':
      return handleUpdateVideo(req, res);
    case 'DELETE':
      return handleDeleteVideo(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Método ${method} não permitido` });
  }
}

// Função para buscar todos os vídeos
async function handleGetVideos(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM videos');
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ message: 'Erro ao buscar vídeos' });
  }
}

// Função para adicionar um novo vídeo
async function handleAddVideo(req, res) {
  const { title, description, league, isHome, isVictory, country } = req.body;

  if (!title || !description || !league || !req.files) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Cria uma pasta para o vídeo
    const videoFolder = path.join(process.cwd(), 'public', 'jogos', title);
    if (!fs.existsSync(videoFolder)) {
      fs.mkdirSync(videoFolder, { recursive: true });
    }

    // Salva a thumbnail e o vídeo
    const thumbnailPath = path.join(videoFolder, 'thumbnail.jpg');
    const videoPath = path.join(videoFolder, 'video.mp4');

    fs.writeFileSync(thumbnailPath, req.files.thumbnail.data);
    fs.writeFileSync(videoPath, req.files.videoFile.data);

    // Insere os dados no banco de dados
    await connection.execute(
      'INSERT INTO videos (title, description, country, league, is_home, is_victory, thumbnail_path, video_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, country || null, league, isHome, isVictory, thumbnailPath, videoPath]
    );

    await connection.end();
    res.status(200).json({ message: 'Vídeo adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    res.status(500).json({ message: 'Erro ao adicionar vídeo', error });
  }
}

// Função para atualizar um vídeo
async function handleUpdateVideo(req, res) {
  const { id, title, description, league, isHome, isVictory, country } = req.body;

  if (!id || !title || !description || !league) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      'UPDATE videos SET title = ?, description = ?, country = ?, league = ?, is_home = ?, is_victory = ? WHERE id = ?',
      [title, description, country || null, league, isHome, isVictory, id]
    );

    await connection.end();
    res.status(200).json({ message: 'Vídeo atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ message: 'Erro ao atualizar vídeo', error });
  }
}

// Função para excluir um vídeo
async function handleDeleteVideo(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID do vídeo não fornecido' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Busca o vídeo para excluir os arquivos
    const [rows] = await connection.execute('SELECT * FROM videos WHERE id = ?', [id]);
    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ message: 'Vídeo não encontrado' });
    }

    const video = rows[0];

    // Exclui os arquivos do vídeo
    fs.unlinkSync(video.thumbnail_path);
    fs.unlinkSync(video.video_path);
    fs.rmdirSync(path.dirname(video.thumbnail_path));

    // Exclui o vídeo do banco de dados
    await connection.execute('DELETE FROM videos WHERE id = ?', [id]);

    await connection.end();
    res.status(200).json({ message: 'Vídeo excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    res.status(500).json({ message: 'Erro ao excluir vídeo', error });
  }
}