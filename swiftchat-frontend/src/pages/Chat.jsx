const Chat = () => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-indigo-700">Welcome, {user?.name}</h1>
          <p className="text-lg text-gray-700">You're logged in and ready to chat.</p>
        </div>
      </div>
    );
  };
  
  export default Chat;
  