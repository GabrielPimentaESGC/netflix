import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Head>
        <title>Netflix Clone</title>
      </Head>

      <video autoPlay loop muted className="absolute w-full h-full object-cover opacity-30">
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {user && currentPage === 'home' && (
        <div className="z-10 text-center bg-gray-900 p-8 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo de volta, {user.username}!</h2>
          <p className="text-gray-400 mb-6">Deseja continuar como {user.username}?</p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(user.role === 'admin' ? '/admin' : '/dashboard')}
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

      {!user && currentPage === 'home' && (
        <div className="z-10 text-center flex flex-col items-center justify-center animate-fade-in">
          <img src="/logo.png" alt="Logo" className="w-80 mb-4" />
          <p className="text-white text-lg mb-8">Connosco quem quiser, contra nós quem puder!</p>
          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('register')} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Registrar</button>
            <button onClick={() => setCurrentPage('login')} className="px-6 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-black transition">Login</button>
          </div>
        </div>
      )}

      {currentPage === 'register' && (
        <div className="z-10 w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Registrar</h1>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const email = e.target.email.value;
            const password = e.target.password.value;
            try {
              const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
              });
              const data = await response.json();
              if (response.ok) {
                alert('Registro realizado com sucesso!');
                setCurrentPage('home');
              } else {
                alert(data.message || 'Erro ao registrar usuário.');
              }
            } catch (error) {
              alert('Erro ao conectar ao servidor.');
            }
          }}>
            <input type="text" id="username" className="w-full mb-4 px-3 py-2 bg-gray-800 border rounded" placeholder="Username" required />
            <input type="email" id="email" className="w-full mb-4 px-3 py-2 bg-gray-800 border rounded" placeholder="Email" required />
            <input type="password" id="password" className="w-full mb-6 px-3 py-2 bg-gray-800 border rounded" placeholder="Senha" required />
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Registrar</button>
          </form>
          <button onClick={() => setCurrentPage('home')} className="mt-4 text-sm text-gray-400 hover:text-white transition">Voltar para a Homepage</button>
        </div>
      )}

      {currentPage === 'login' && (
        <div className="z-10 w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
              });
              const data = await response.json();
              if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
              } else {
                alert(data.message || 'Credenciais inválidas.');
              }
            } catch (error) {
              alert('Erro ao conectar ao servidor.');
            }
          }}>
            <input type="email" id="email" className="w-full mb-4 px-3 py-2 bg-gray-800 border rounded" placeholder="Email" required />
            <input type="password" id="password" className="w-full mb-6 px-3 py-2 bg-gray-800 border rounded" placeholder="Senha" required />
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Login</button>
          </form>
          <button onClick={() => setCurrentPage('home')} className="mt-4 text-sm text-gray-400 hover:text-white transition">Voltar para a Homepage</button>
        </div>
      )}
    </div>
  );
}
