import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatDashboard from './pages/ChatDashboard';

function App() {
  return (
    <Router>
      <Routes>       
        <Route path="/" element={<AuthPage />} />
        <Route path="/chatDashboard" element={<ChatDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
