import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const checkPassword = async () => {
    if (!password) {
      alert("Please enter a password first!");
      return;
    }

    try {
      const res = await fetch('/password_check/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to check password');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error checking password:', err);
      setResult({ strength_score: 0, feedback: ["Unable to check password"], message: "Server error!" });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const goToHome = () => {
    navigate('/dashboard');  // ✅ FIXED: Go to /dashboard
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
        🔒 Password Strength Checker
      </h2>

      {/* Password Input */}
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

      {/* Check Password Button */}
      <button
        onClick={checkPassword}
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
        Check Password
      </button>

      {/* Back to Home Button */}
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

      {/* Result Area */}
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
            🛡️ Strength Score: <strong>{result.strength_score} / 4</strong>
          </p>
          <p style={{ fontSize: '1.1rem' }}>
            Suggestions: {result.feedback && result.feedback.length > 0 ? result.feedback.join(', ') : "No suggestions"}
          </p>
          <p style={{ marginTop: '10px', color: '#555' }}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}
