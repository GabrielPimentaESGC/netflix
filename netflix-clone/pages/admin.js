import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Admin() {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState('addVideo');

  // Verifica se o usuário está logado e é administrador
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      router.push('/login'); // Redireciona para a página de login se não for admin
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Head>
        <title>Painel de Administração - Netflix Clone</title>
      </Head>

      <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>

      {/* Menu de Navegação */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setCurrentMenu('addVideo')}
          className={`px-4 py-2 rounded ${
            currentMenu === 'addVideo' ? 'bg-red-600' : 'bg-gray-700'
          } hover:bg-red-700 transition`}
        >
          Adicionar Vídeo
        </button>
        <button
          onClick={() => setCurrentMenu('manageVideos')}
          className={`px-4 py-2 rounded ${
            currentMenu === 'manageVideos' ? 'bg-red-600' : 'bg-gray-700'
          } hover:bg-red-700 transition`}
        >
          Gerir Vídeos
        </button>
        <button
          onClick={() => setCurrentMenu('manageUsers')}
          className={`px-4 py-2 rounded ${
            currentMenu === 'manageUsers' ? 'bg-red-600' : 'bg-gray-700'
          } hover:bg-red-700 transition`}
        >
          Gerir Usuários
        </button>
      </div>

      {/* Conteúdo do Menu */}
      {currentMenu === 'addVideo' && <AddVideo />}
      {currentMenu === 'manageVideos' && <ManageVideos />}
      {currentMenu === 'manageUsers' && <ManageUsers />}
    </div>
  );
}

// Componente para Adicionar Vídeo
function AddVideo() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    league: '',
    isHome: false,
    isVictory: false,
    thumbnail: null,
    videoFile: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cria um FormData para enviar arquivos
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('league', formData.league);
    formDataToSend.append('isHome', formData.isHome);
    formDataToSend.append('isVictory', formData.isVictory);
    formDataToSend.append('thumbnail', formData.thumbnail);
    formDataToSend.append('videoFile', formData.videoFile);

    // Adiciona o país apenas se o jogo não for em casa
    if (!formData.isHome) {
      formDataToSend.append('country', formData.country);
    }

    try {
      // Envia os dados para a API
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Vídeo adicionado com sucesso!');
        setFormData({
          title: '',
          description: '',
          country: '',
          league: '',
          isHome: false,
          isVictory: false,
          thumbnail: null,
          videoFile: null,
        });
      } else {
        alert(data.message || 'Erro ao adicionar vídeo.');
      }
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Adicionar Vídeo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="league" className="block text-sm font-medium mb-2">
            Liga
          </label>
          <select
            id="league"
            value={formData.league}
            onChange={(e) => setFormData({ ...formData, league: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          >
            <option value="">Selecione uma liga</option>
            <option value="Champions">Champions</option>
            <option value="Liga Portugal">Liga Portugal</option>
            <option value="Premier League">Premier League</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="isHome" className="block text-sm font-medium mb-2">
            Jogo em Casa?
          </label>
          <input
            type="checkbox"
            id="isHome"
            checked={formData.isHome}
            onChange={(e) => setFormData({ ...formData, isHome: e.target.checked })}
            className="mr-2"
          />
          <span>Sim</span>
        </div>

        {!formData.isHome && (
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              País
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="isVictory" className="block text-sm font-medium mb-2">
            Vitória?
          </label>
          <input
            type="checkbox"
            id="isVictory"
            checked={formData.isVictory}
            onChange={(e) => setFormData({ ...formData, isVictory: e.target.checked })}
            className="mr-2"
          />
          <span>Sim</span>
        </div>

        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="videoFile" className="block text-sm font-medium mb-2">
            Vídeo
          </label>
          <input
            type="file"
            id="videoFile"
            onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Adicionar Vídeo
        </button>
      </form>
    </div>
  );
}

function ManageVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchVideos = async () => {
        try {
          const response = await fetch('/api/videos');
          if (!response.ok) {
            throw new Error(`Erro ao buscar vídeos: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Dados recebidos da API:', data); // Depuração
          if (Array.isArray(data)) {
            setVideos(data);
          } else {
            throw new Error('Dados inválidos recebidos da API');
          }
        } catch (error) {
          console.error('Erro ao buscar vídeos:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchVideos();
    }, []);
  
    if (loading) {
      return <div className="bg-gray-800 p-6 rounded-lg">Carregando vídeos...</div>;
    }
  
    if (error) {
      return (
        <div className="bg-gray-800 p-6 rounded-lg text-red-500">
          Erro: {error}
        </div>
      );
    }
  
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Gerir Vídeos</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Título</th>
              <th className="text-left py-2">Liga</th>
              <th className="text-left py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {videos.length > 0 ? (
              videos.map((video) => (
                <tr key={video.id} className="border-b border-gray-700">
                  <td className="py-2">{video.title}</td>
                  <td className="py-2">{video.league}</td>
                  <td className="py-2">
                    <button className="text-red-600 hover:text-red-700 transition">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-700 transition ml-4">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 text-center">
                  Nenhum vídeo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

// Componente para Gerir Usuários
function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Busca os usuários do banco de dados
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gerir Usuários</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Username</th>
            <th className="text-left py-2">Cargo</th>
            <th className="text-left py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="py-2">{user.username}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">
                <button className="text-red-600 hover:text-red-700 transition">
                  Editar
                </button>
                <button className="text-red-600 hover:text-red-700 transition ml-4">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}