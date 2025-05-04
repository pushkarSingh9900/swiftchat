import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import ChatBox from './pages/ChatBox';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>       
        <Route path='/chat' element={<Chat />} />
        <Route path='/chatbox' element={<ChatBox />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
