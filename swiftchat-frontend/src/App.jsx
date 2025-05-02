import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ChatBox from './pages/ChatBox';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/chatbox' element={<ChatBox />} />
      </Routes>
    </Router>
  );
}

export default App;
