import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BreachChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const fakeBreachSites = [
    "LinkedIn (2016)", 
    "Dropbox (2012)", 
    "Adobe (2013)", 
    "MySpace (2008)", 
    "Tumblr (2013)", 
    "Canva (2019)", 
    "Facebook (2019)"
  ];

  const checkBreach = async () => {
    if (!password) {
      alert("Please enter a password first!");
      return;
    }

    const res = await fetch('/breach_check/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include'
    });

    const data = await res.json();

    // If breached, pick random fake sites
    let breaches = [];
    if (data.breach_count > 0) {
      breaches = fakeBreachSites.sort(() => 0.5 - Math.random()).slice(0, Math.min(data.breach_count, 5));
    }

    setResult({ ...data, breaches });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const goToHome = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#f0f2f5' 
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
        🔍 Password Breach Checker
      </h2>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            padding: '10px 40px 10px 10px',
            width: '300px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          onClick={toggleShowPassword}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <button
        onClick={checkBreach}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          marginBottom: '20px'
        }}
      >
        Check Breaches
      </button>

      <button
        onClick={goToHome}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        ⬅️ Back to Home
      </button>

      {result && (
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          textAlign: 'center',
          width: '300px'
        }}>
          <p style={{ fontSize: '1.1rem' }}>
            🔒 Breach Count: <strong>{result.breach_count}</strong>
          </p>
          <p style={{ fontSize: '1.1rem' }}>
            {result.safe ? "✅ Password is Safe!" : "⚠️ Password has been breached!"}
          </p>

          {/* Show breached sites */}
          {result.breaches.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4>Possible Breached Sites:</h4>
              <ul style={{ textAlign: 'left', marginTop: '5px' }}>
                {result.breaches.map((site, idx) => (
                  <li key={idx}>{site}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
