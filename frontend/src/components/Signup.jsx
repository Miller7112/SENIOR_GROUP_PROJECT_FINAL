import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:"<>?';
    let generated = '';
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password: generated });
    setCopied(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(form.password);
    setCopied(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      setError('');
      window.location.href = '/login';

    } catch (err) {
      setError(err.message);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#e8f0fe' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#0d47a1' }}>Signup</h1>

      <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '320px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        {error && (
          <div style={{ backgroundColor: '#ffdddd', color: '#d32f2f', padding: '10px', borderRadius: '8px', marginBottom: '15px', width: '100%', textAlign: 'center', fontSize: '0.95rem' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
          <input
            name="username"
            ref={usernameRef}
            onChange={handleChange}
            placeholder="Username"
            required
            autoComplete="off"
            style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            required
            autoComplete="off"
            style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <div style={{ marginBottom: '10px' }}>
            <button
              type="button"
              onClick={generatePassword}
              style={{ padding: '8px 12px', backgroundColor: '#1976D2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
            >
              ⚡ Generate Password
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              readOnly
              placeholder="Password"
              required
              autoComplete="new-password"
              style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={copyPassword}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555' }}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            Signup
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <button
            onClick={goToLogin}
            style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}