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
    thumbnail: null,
    videoFile: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend
    console.log('Dados do vídeo:', formData);
    alert('Vídeo adicionado com sucesso!');
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
            Disponível em Casa?
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

// Componente para Gerir Vídeos
function ManageVideos() {
  // Simulação de lista de vídeos
  const [videos, setVideos] = useState([
    { id: 1, title: 'Vídeo 1', views: 100 },
    { id: 2, title: 'Vídeo 2', views: 200 },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gerir Vídeos</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Título</th>
            <th className="text-left py-2">Visualizações</th>
            <th className="text-left py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-b border-gray-700">
              <td className="py-2">{video.title}</td>
              <td className="py-2">{video.views}</td>
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

// Componente para Gerir Usuários
function ManageUsers() {
  // Simulação de lista de usuários
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', role: 'user' },
    { id: 2, username: 'admin', role: 'admin' },
  ]);

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