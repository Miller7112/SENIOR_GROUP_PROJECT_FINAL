import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ email: '', password: '' });
    setError('');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      setError('');
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToSignup = () => {
    navigate('/');
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', backgroundColor: '#e8f0fe' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#0d47a1' }}>Login</h1>

      <div style={{ 
        backgroundColor: '#ffffff', padding: '30px', borderRadius: '15px', display: 'flex', 
        flexDirection: 'column', alignItems: 'center', width: '320px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
      }}>
        {error && (
          <div style={{ backgroundColor: '#ffdddd', color: '#d32f2f', padding: '10px', borderRadius: '8px', marginBottom: '15px', width: '100%', textAlign: 'center', fontSize: '0.95rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
          {/* ✅ Hidden dummy fields to prevent browser autofill */}
          <input type="text" name="username" style={{ display: 'none' }} />
          <input type="password" name="password" style={{ display: 'none' }} />

          {/* ✅ Real fields start here */}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            autoComplete="off"
            style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="off"
              style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#555',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <button
            onClick={goToSignup}
            style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}