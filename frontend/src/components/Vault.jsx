import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Vault() {
  const [form, setForm] = useState({ website: '', username: '', password: '' });
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [showPasswordIds, setShowPasswordIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    const filtered = passwords.filter(p =>
      p.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPasswords(filtered);
  }, [searchTerm, passwords]);

  useEffect(() => {
    checkPasswordStrength(form.password);
  }, [form.password]);

  function checkPasswordStrength(password) {
    if (!password) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('Weak');
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  }

  function generateStrongPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:"<>?';
    let newPassword = '';
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password: newPassword });
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await fetch('/vault/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add password');

      setForm({ website: '', username: '', password: '' });
      fetchPasswords();
    } catch (err) {
      console.error('Failed to add password', err);
    }
  }

  async function fetchPasswords() {
    try {
      const res = await fetch('/vault/list');
      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      console.error('Failed to fetch passwords', err);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/vault/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete password');

      fetchPasswords();
    } catch (err) {
      console.error('Failed to delete password', err);
    }
  }

  function toggleShowPassword(id) {
    if (showPasswordIds.includes(id)) {
      setShowPasswordIds(showPasswordIds.filter(pid => pid !== id));
    } else {
      setShowPasswordIds([...showPasswordIds, id]);
    }
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f4f8', minHeight: '100vh', textAlign: 'center' }}>
      <h2 style={{ color: '#4a4a4a', marginBottom: '20px' }}>🔐 Password Vault</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
        />
        {passwordStrength && (
          <div style={{ marginBottom: '10px', color: '#607d8b' }}>
            Password Strength: {passwordStrength}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button type="button" onClick={generateStrongPassword} style={{ ...buttonStyle, backgroundColor: '#607d8b', marginBottom: '10px' }}>
            ⚡ Generate Strong Password
          </button>
          <button type="submit" style={{ ...buttonStyle, marginTop: '10px' }}>Save Password</button>
        </div>
      </form>

      <input
        type="text"
        placeholder="Search by website or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      <div style={{ marginTop: '30px' }}>
        {filteredPasswords.length === 0 ? (
          <p>No passwords found.</p>
        ) : (
          filteredPasswords.map(p => (
            <div key={p.id} style={cardStyle}>
              <p><strong>Website:</strong> {p.website}</p>
              <p><strong>Username:</strong> {p.username}</p>
              <p>
                <strong>Password:</strong>{' '}
                {showPasswordIds.includes(p.id) ? p.password : '••••••••'}
                <button onClick={() => toggleShowPassword(p.id)} style={eyeButtonStyle}>
                  {showPasswordIds.includes(p.id) ? 'Hide' : 'Show'}
                </button>
              </p>
              <button onClick={() => handleDelete(p.id)} style={deleteButtonStyle}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ ...buttonStyle, marginTop: '30px' }}>
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  margin: '10px auto',
  padding: '10px',
  width: '250px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

const searchInputStyle = {
  ...inputStyle,
  width: '300px',
  marginTop: '10px'
};

const buttonStyle = {
  backgroundColor: '#607d8b',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const eyeButtonStyle = {
  background: 'none',
  border: 'none',
  marginLeft: '10px',
  fontSize: '1rem',
  cursor: 'pointer',
  color: '#607d8b'
};

const deleteButtonStyle = {
  backgroundColor: '#607d8b',
  color: 'white',
  padding: '8px 15px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.9rem',
  marginTop: '10px',
  cursor: 'pointer'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '15px',
  marginBottom: '15px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '300px',
  margin: '0 auto',
  textAlign: 'left'
};
