import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home'); // Estado para controlar a página atual
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado
  const router = useRouter();

  // Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // Atualiza o estado com o usuário logado
    }
  }, []);

  // Função para encerrar a sessão
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    setUser(null); // Atualiza o estado para null
    setCurrentPage('home'); // Volta para a homepage
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Head>
        <title>Netflix Clone</title>
      </Head>

      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover opacity-30"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Card de continuar como usuário logado */}
      {user && currentPage === 'home' && (
        <div className="z-10 text-center bg-gray-900 p-8 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo de volta, {user.username}!</h2>
          <p className="text-gray-400 mb-6">Deseja continuar como {user.username}?</p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')} // Redireciona para a dashboard (quando existir)
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Continuar
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-black transition"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo da Homepage (se não estiver logado) */}
      {!user && currentPage === 'home' && (
        <div className="z-10 text-center flex flex-col items-center justify-center animate-fade-in">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-80 mb-4"
          />

          {/* Texto abaixo da logo */}
          <p className="text-white text-lg mb-8">
            Connosco quem quiser, contra nós quem poder!
          </p>

          {/* Botões de Registro e Login */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('register')}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Registrar
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-black transition"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo do Registro */}
      {currentPage === 'register' && (
        <div className="z-10 w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Registrar</h1>

          <form onSubmit={async (e) => {
            e.preventDefault();

            const username = e.target.username.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
              // Envia os dados de registro para a API
              const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
              });

              const data = await response.json();

              if (response.ok) {
                alert('Registro realizado com sucesso!');
                setCurrentPage('home'); // Volta para a homepage após o registro
              } else {
                alert(data.message || 'Erro ao registrar usuário.');
              }
            } catch (error) {
              console.error('Erro ao registrar usuário:', error);
              alert('Erro ao conectar ao servidor.');
            }
          }}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Registrar
            </button>
          </form>

          <button
            onClick={() => setCurrentPage('home')}
            className="mt-4 text-sm text-gray-400 hover:text-white transition"
          >
            Voltar para a Homepage
          </button>
        </div>
      )}

      {/* Conteúdo do Login */}
      {currentPage === 'login' && (
        <div className="z-10 w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={async (e) => {
            e.preventDefault();

            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
              // Envia os dados de login para a API
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });

              const data = await response.json();

              if (response.ok) {
                // Salva os dados do usuário no localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user); // Atualiza o estado com o usuário logado
                setCurrentPage('home'); // Volta para a homepage após o login
              } else {
                // Exibe mensagem de erro
                alert(data.message || 'Credenciais inválidas.');
              }
            } catch (error) {
              console.error('Erro ao fazer login:', error);
              alert('Erro ao conectar ao servidor.');
            }
          }}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Login
            </button>
          </form>

          <button
            onClick={() => setCurrentPage('home')}
            className="mt-4 text-sm text-gray-400 hover:text-white transition"
          >
            Voltar para a Homepage
          </button>
        </div>
      )}
    </div>
  );
}