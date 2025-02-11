import Head from 'next/head';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Head>
        <title>Login - Netflix Clone</title>
      </Head>

      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}