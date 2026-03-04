import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Accounts/login.jsx';
import SignupClient from './Accounts/signupClient.jsx';
import SignupInfluencer from './Accounts/signupInfluencer.jsx';
import Dashboard from './Pages/dashBoard.jsx';
import LandingPage from './Pages/landingPage.jsx';
import ThemeToggle from './Components/ThemeToggle.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <ThemeToggle />
        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup/client" element={<SignupClient />} />
          <Route path="/signup/influencer" element={<SignupInfluencer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<LandingPage />} /> {/* Default to landing page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
