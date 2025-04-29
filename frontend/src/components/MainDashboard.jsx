import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const [accountStatus, setAccountStatus] = useState('Active');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setCurrentDate(formattedDate);

    setTimeout(() => {
      setSystemStatus('Healthy ✅');
    }, 1000);
  }, []);

  function handleLogout() {
    navigate('/login');
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      {/* Top Section with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#607d8b' }}>
          Welcome to Your Security Dashboard
        </h1>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* Cards Section */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <h3 style={cardTitle}>👤 Account Status</h3>
          <p style={cardValue}>{accountStatus}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitle}>📅 Today's Date</h3>
          <p style={cardValue}>{currentDate}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitle}>🖥️ System Health</h3>
          <p style={cardValue}>{systemStatus}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
        <button style={buttonStyle} onClick={() => navigate('/password-checker')}>
          Check Password Strength
        </button>
        <button style={buttonStyle} onClick={() => navigate('/breach-checker')}>
          Check Breach
        </button>
        <button style={buttonStyle} onClick={() => navigate('/monitoring')}>
          System Monitoring
        </button>
        <button style={buttonStyle} onClick={() => navigate('/vault')}>
          Manage My Passwords
        </button>
      </div>

      {/* Security Tips Section */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '15px', color: '#607d8b' }}>🔒 Security Tips</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#333' }}>
          <li>Enable Two-Factor Authentication (2FA) on all accounts.</li>
          <li>Use strong, unique passwords for every account.</li>
          <li>Update your software and devices regularly.</li>
          <li>Beware of phishing emails and suspicious links.</li>
          <li>Backup important data regularly.</li>
        </ul>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  width: '250px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const cardTitle = {
  fontSize: '1.2rem',
  color: '#607d8b',
  marginBottom: '10px',
};

const cardValue = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#607d8b',
};

const buttonStyle = {
  backgroundColor: '#607d8b',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  minWidth: '220px',
};

const logoutButtonStyle = {
  backgroundColor: '#607d8b',
  color: 'white',
  padding: '8px 15px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
};