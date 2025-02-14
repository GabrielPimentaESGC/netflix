import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [isHomeGame, setIsHomeGame] = useState(true);
  const [country, setCountry] = useState('');
  const [opponent, setOpponent] = useState('');
  const [league, setLeague] = useState('Champions');
  const [result, setResult] = useState('Vitória');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isClient, setIsClient] = useState(false); // Para garantir execução no cliente

  useEffect(() => {
    setIsClient(true); // Garante que o código só será executado no cliente
  }, []);

  useEffect(() => {
    if (activeTab === 'gerir') {
      fetchVideos();
    }
  }, [activeTab]);

  // Função para buscar vídeos
  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/upload'); // Busca vídeos
      setVideos(response.data);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
  };

  // Função para excluir vídeo
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/upload?id=${id}`); // Exclui vídeo
      if (response.status === 200) {
        alert('Vídeo excluído com sucesso!');
        fetchVideos(); // Atualiza a lista de vídeos
      } else {
        alert('Erro ao excluir o vídeo.');
      }
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
    }
  };

  // Função para abrir o vídeo em uma nova aba
  const openVideoPreview = (videoPath) => {
    window.open(videoPath, '_blank');
  };

  // Função para enviar novo vídeo
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('thumbnail', thumbnail);
    formData.append('video', video);
    formData.append('isHomeGame', isHomeGame);
    formData.append('country', country);
    formData.append('opponent', opponent);
    formData.append('league', league);
    formData.append('result', result);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        alert('Upload bem-sucedido!');
        resetForm();
        fetchVideos(); // Atualiza a lista de vídeos
      } else {
        alert('Erro ao enviar o vídeo.');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro inesperado.');
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setTitle('');
    setThumbnail(null);
    setVideo(null);
    setIsHomeGame(true);
    setCountry('');
    setOpponent('');
    setLeague('Champions');
    setResult('Vitória');
    setUploadProgress(0);
  };

  // Retorna null enquanto estamos no servidor
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Head>
        <title>Administração</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Administração</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded ${activeTab === 'upload' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Upload de Vídeo
        </button>
        <button
          onClick={() => setActiveTab('gerir')}
          className={`px-4 py-2 rounded ${activeTab === 'gerir' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Gerir Vídeos
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Upload de Vídeo</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label className="block mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Thumbnail (Imagem)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Vídeo</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Jogo em casa?</label>
              <select
                value={isHomeGame}
                onChange={(e) => setIsHomeGame(e.target.value === 'true')}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            {!isHomeGame && (
              <div className="mb-4">
                <label className="block mb-1">País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1">Adversário</label>
              <input
                type="text"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Competição</label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="Champions">Champions League</option>
                <option value="Liga Europa">Liga Europa</option>
                <option value="Liga Betclic">Liga Betclic</option>
                <option value="Taça de Portugal">Taça de Portugal</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Resultado</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="Vitória">Vitória</option>
                <option value="Empate">Empate</option>
                <option value="Derrota">Derrota</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Progresso do Upload</label>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            <br />
            <div className="flex flex-col">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              >
                Enviar Vídeo
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'gerir' && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Gerir Vídeos</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2">Preview</th>
                <th className="p-2">Nome</th>
                <th className="p-2">Detalhes</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-t border-gray-600">
                  <td className="p-2">
                    <img
                      src={video.thumbnail_path}
                      alt={video.title}
                      className="w-24 h-16 object-cover cursor-pointer rounded-lg hover:opacity-80 transition"
                      onClick={() => openVideoPreview(video.video_path)}
                    />
                  </td>
                  <td className="p-2">{video.title}</td>
                  <td className="p-2 text-gray-400">
                    {video.league} - {video.opponent} ({video.result})
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}