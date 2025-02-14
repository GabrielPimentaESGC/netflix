import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function DashboardPage() {
  const [categories, setCategories] = useState({
    homeGames: [],
    countries: {},
    leagues: {},
    results: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/upload');
      organizeVideos(response.data);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const organizeVideos = (videos) => {
    const organized = {
      homeGames: [],
      countries: {},
      leagues: {},
      results: {}
    };

    videos.forEach(video => {
      // Categoria: Jogos em Casa
      if (video.is_home_game === 1) {
        organized.homeGames.push(video);
      } else {
        // Categoria: Por País
        if (!organized.countries[video.country]) {
          organized.countries[video.country] = [];
        }
        organized.countries[video.country].push(video);
      }

      // Categoria: Campeonatos
      if (!organized.leagues[video.league]) {
        organized.leagues[video.league] = [];
      }
      organized.leagues[video.league].push(video);

      // Categoria: Resultados
      if (!organized.results[video.result]) {
        organized.results[video.result] = [];
      }
      organized.results[video.result].push(video);
    });

    setCategories(organized);
  };

  const openVideo = (videoPath) => {
    window.open(videoPath, '_blank');
  };

  const renderCategory = (title, videos) => {
    if (!videos || videos.length === 0) return null;

    return (
      <div className="mb-8 animate-slide-in">
        <h2 className="text-xl font-bold mb-4 px-4 animate-text-pop">{title}</h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 px-4">
          {videos.map(video => (
            <div
              key={video.id}
              className="flex-none w-48 transform transition-transform hover:scale-105 hover:cursor-pointer animate-card-pop"
              onClick={() => openVideo(video.video_path)}
            >
              <img
                src={video.thumbnail_path}
                alt={video.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="mt-2">
                <h3 className="text-sm font-semibold truncate">{video.title}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {video.opponent} • {video.league}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title>Dashboard</title>
      </Head>

      {/* Background Video com Efeito Parallax */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <video autoPlay loop muted className="w-full h-full object-cover opacity-30">
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">Últimos Jogos</h1>
            <p className="text-gray-400 text-lg animate-fade-in">Reviva os melhores momentos!</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="p-4 bg-black bg-opacity-75">
          {renderCategory('Jogos em Casa', categories.homeGames)}

          {Object.keys(categories.leagues || {}).map(league => (
            renderCategory(league, categories.leagues[league])
          ))}

          {Object.keys(categories.results || {}).map(result => (
            renderCategory(`${result}s`, categories.results[result])
          ))}
        </div>
      </div>
    </div>
  );
}