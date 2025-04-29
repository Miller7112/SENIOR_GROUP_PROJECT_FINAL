import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainDashboard from './components/MainDashboard';
import BreachChecker from './components/BreachChecker';
import PasswordChecker from './components/PasswordChecker';
import Monitoring from './components/Monitoring';
import Vault from './components/Vault';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default first page = Signup */}
        <Route path="/" element={<Signup />} />

        {/* Other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/breach-checker" element={<BreachChecker />} />
        <Route path="/password-checker" element={<PasswordChecker />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/vault" element={<Vault />} />
      </Routes>
    </Router>
  );
}

export default App;
