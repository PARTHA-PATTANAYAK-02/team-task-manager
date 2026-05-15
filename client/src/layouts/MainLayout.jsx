import { Link, useNavigate } from "react-router-dom";
function MainLayout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-5">
        <h1 className="text-2xl font-bold mb-10">Task Manager</h1>
        <div className="mb-10">
          <p className="text-gray-400 text-sm">Logged in as</p>

          <h2 className="font-semibold text-lg">{user?.name}</h2>

          <p className="text-sm text-gray-400">{user?.role}</p>
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/dashboard" className="hover:bg-gray-800 p-2 rounded">
            Dashboard
          </Link>

          <Link to="/projects" className="hover:bg-gray-800 p-2 rounded">
            Projects
          </Link>

          <Link to="/tasks" className="hover:bg-gray-800 p-2 rounded">
            Tasks
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 p-2 rounded mt-10"
        >
          Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

export default MainLayout;
