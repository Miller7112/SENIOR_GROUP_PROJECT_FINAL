// src/components/Monitoring.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Monitoring() {
  const [accounts, setAccounts] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1) Load accounts on mount
  useEffect(() => {
    fetch('http://localhost:5000/monitoring/accounts')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        const mapped = data.map(a => ({
          id:           a.id,
          service_name: a.service_name,
          identifier:   a.identifier,
          alert_flag:   a.alert_flag,
          last_checked: a.last_checked,
          breach_count: Array.isArray(a.details) ? a.details.length : 0
        }));
        setAccounts(mapped);
      })
      .catch(err => setError(`Could not load accounts (${err.message})`));
  }, []);

  // 2) Add a new account
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/monitoring/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_name: serviceName, identifier })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const { id } = await res.json();

      // Use serviceName and identifier (the state vars), not undefined service_name
      setAccounts(accs => [
        ...accs,
        {
          id,
          service_name: serviceName,
          identifier:   identifier,
          alert_flag:   false,
          last_checked: null,
          breach_count: 0
        }
      ]);

      setServiceName('');
      setIdentifier('');
    } catch (e) {
      setError(`Add failed: ${e.message}`);
    }
  };

  // 3) Delete an account
  const deleteAccount = async (id) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/monitoring/accounts/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setAccounts(accs => accs.filter(a => a.id !== id));
    } catch (e) {
      setError(`Delete failed: ${e.message}`);
    }
  };

  // 4) Run “Check Now”
  const runCheck = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/monitoring/check', {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const results = await res.json();

      setAccounts(accs =>
        accs.map(a => {
          const r = results.find(x => x.id === a.id);
          return r
            ? {
                ...a,
                alert_flag:   r.breached,
                breach_count: r.breach_count,
                last_checked: r.last_checked
              }
            : a;
        })
      );
    } catch (e) {
      setError(`Check failed: ${e.message}`);
    }
  };

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
        🔒 Account Monitoring
      </h2>

      {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

      <div style={{ width: '320px', marginBottom: '30px' }}>
        {accounts.map(a => (
          <div key={a.id} style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '12px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>{a.service_name}</strong> ({a.identifier})
            </div>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>
              Status:{' '}
              {a.alert_flag
                ? <span style={{ color: 'crimson' }}>⚠️ Breached</span>
                : <span style={{ color: 'green' }}>✅ Safe</span>}
              {' | '}Count: {a.breach_count}
              {' | '}Last Checked:{' '}
              {a.last_checked
                ? new Date(a.last_checked).toLocaleString()
                : 'Never'}
            </div>
            <button
              onClick={() => deleteAccount(a.id)}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '320px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '12px' }}>Add Account</h3>
        <input
          type="text"
          placeholder="Service name"
          value={serviceName}
          onChange={e => setServiceName(e.target.value)}
          required
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '12px'
          }}
        />
        <input
          type="text"
          placeholder="Email or Identifier"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '12px'
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Add
        </button>
      </form>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={runCheck}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Check Now
        </button>
        <button
          onClick={goToDashboard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#777',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ⬅️ Dashboard
        </button>
      </div>
    </div>
  );
}
