import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  // Stats
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed",
  ).length;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black">Dashboard</h1>

        <p className="text-gray-600 mt-2">
          Welcome to your task management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-lg">Total Tasks</h2>

          <p className="text-4xl font-bold text-black mt-3">{totalTasks}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-lg">Completed</h2>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {completedTasks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 text-lg">Pending</h2>

          <p className="text-4xl font-bold text-red-500 mt-3">{pendingTasks}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-10 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Recent Tasks</h2>

        <div className="space-y-4">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task._id}
              className="border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {task.title}
                </h3>

                <p className="text-gray-500">{task.project?.title}</p>
              </div>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
