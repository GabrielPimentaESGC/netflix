import Head from 'next/head';
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // Verifica a disponibilidade do username em tempo real
  const checkUsernameAvailability = async (value) => {
    if (value.length < 3) {
      setUsernameError('O username deve ter pelo menos 3 caracteres.');
      return;
    }

    const response = await fetch('/api/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: value }),
    });

    const data = await response.json();
    setUsernameError(data.message);
  };

  // Calcula a força da senha
  const calculatePasswordStrength = (value) => {
    const strength = {
      text: 'Fraca',
      color: 'red',
    };

    if (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
      strength.text = 'Muito Forte';
      strength.color = 'darkgreen';
    } else if (value.length >= 8 && (/[A-Z]/.test(value) || /[0-9]/.test(value))) {
      strength.text = 'Forte';
      strength.color = 'green';
    } else if (value.length >= 6) {
      strength.text = 'Razoável';
      strength.color = 'orange';
    }

    setPasswordStrength(strength);
  };

  // Envia o formulário de registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameError && passwordStrength.text !== 'Fraca') {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      alert(data.message);
    } else {
      alert('Por favor, corrija os erros antes de enviar.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Head>
        <title>Registrar - Netflix Clone</title>
      </Head>

      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar</h1>

        <form onSubmit={handleSubmit}>
          {/* Campo Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsernameAvailability(e.target.value);
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
              required
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
          </div>

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
              onChange={(e) => {
                setPassword(e.target.value);
                calculatePasswordStrength(e.target.value);
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600"
              required
            />
            {password && (
              <p
                className="text-sm mt-1"
                style={{ color: passwordStrength.color }}
              >
                Força da senha: {passwordStrength.text}
              </p>
            )}
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}