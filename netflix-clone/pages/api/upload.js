import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import mysql from 'mysql2/promise';

export const config = {
  api: {
    bodyParser: false, // Desabilita o bodyParser padrão para lidar com FormData
  },
};

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário
    password: '', // Substitua pela sua senha
    database: 'pap', // Substitua pelo nome do banco de dados
  });

  if (req.method === 'POST') {
    // Lógica para upload de novo vídeo
    const form = new IncomingForm({
      maxFileSize: 500 * 1024 * 1024, // 500 MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar o formulário:', err);
        return res.status(500).json({ message: 'Erro ao processar o upload.' });
      }

      try {
        const { title, isHomeGame, country, opponent, league, result } = fields;
        const thumbnail = files.thumbnail;
        const video = files.video;

        if (!title || !thumbnail || !video || !opponent || !league || !result) {
          return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Cria a pasta para o conteúdo
        const contentDir = path.join(process.cwd(), 'public', 'content', title);
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true });
        }

        // Move a thumbnail para a pasta
        const thumbnailPath = path.join(contentDir, thumbnail.originalFilename);
        fs.renameSync(thumbnail.filepath, thumbnailPath);

        // Move o vídeo para a pasta
        const videoPath = path.join(contentDir, video.originalFilename);
        fs.renameSync(video.filepath, videoPath);

        // Insere os dados no banco de dados
        await connection.execute(
          `INSERT INTO uploads (title, is_home_game, country, opponent, league, result, thumbnail_path, video_path)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            isHomeGame === 'true' ? 1 : 0,
            isHomeGame === 'true' ? null : country,
            opponent,
            league,
            result,
            thumbnailPath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/'),
            videoPath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/'),
          ]
        );

        return res.status(200).json({ message: 'Upload realizado com sucesso!' });
      } catch (error) {
        console.error('Erro ao salvar os arquivos ou dados:', error);
        return res.status(500).json({ message: 'Erro ao salvar os arquivos ou dados.' });
      }
    });
  } else if (req.method === 'PUT') {
    // Lógica para edição de vídeo
    const form = new IncomingForm({
      maxFileSize: 500 * 1024 * 1024, // 500 MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar o formulário:', err);
        return res.status(500).json({ message: 'Erro ao processar a edição.' });
      }

      try {
        const { id, title, isHomeGame, country, opponent, league, result } = fields;
        const thumbnail = files.thumbnail;
        const video = files.video;

        if (!id || !title || !opponent || !league || !result) {
          return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Busca o vídeo existente
        const [existingVideo] = await connection.execute('SELECT * FROM uploads WHERE id = ?', [id]);

        if (existingVideo.length === 0) {
          return res.status(404).json({ message: 'Vídeo não encontrado.' });
        }

        // Atualiza os dados no banco de dados
        await connection.execute(
          `UPDATE uploads 
           SET title = ?, is_home_game = ?, country = ?, opponent = ?, league = ?, result = ?
           WHERE id = ?`,
          [
            title,
            isHomeGame === 'true' ? 1 : 0,
            isHomeGame === 'true' ? null : country,
            opponent,
            league,
            result,
            id,
          ]
        );

        return res.status(200).json({ message: 'Vídeo atualizado com sucesso!' });
      } catch (error) {
        console.error('Erro ao atualizar o vídeo:', error);
        return res.status(500).json({ message: 'Erro ao atualizar vídeo.' });
      }
    });
  } else if (req.method === 'DELETE') {
    // Lógica para exclusão de vídeo
    const { id } = req.query;

    try {
      // Busca o vídeo para remover do sistema
      const [video] = await connection.execute('SELECT * FROM uploads WHERE id = ?', [id]);

      if (video.length === 0) {
        return res.status(404).json({ message: 'Vídeo não encontrado.' });
      }

      // Remove o vídeo e a thumbnail do sistema de arquivos
      const videoPath = path.join(process.cwd(), 'public', video[0].video_path);
      const thumbnailPath = path.join(process.cwd(), 'public', video[0].thumbnail_path);
      
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }

      // Remove o registro do banco de dados
      await connection.execute('DELETE FROM uploads WHERE id = ?', [id]);

      return res.status(200).json({ message: 'Vídeo excluído com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      return res.status(500).json({ message: 'Erro ao excluir vídeo.' });
    }
  } else if (req.method === 'GET') {
    // Lógica para listar vídeos
    try {
      const [videos] = await connection.execute('SELECT * FROM uploads');
      return res.status(200).json(videos);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      return res.status(500).json({ message: 'Erro ao carregar vídeos.' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido.' });
  }
}