import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center text-white flex-col space-y-6">
      <h1 className="text-4xl font-bold">Welcome to SwiftChat</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Welcome;
