import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTasks();
      await fetchProjects();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await API.post("/tasks", { ...formData, assignedTo: user._id });
      await fetchTasks();
      setFormData({ title: "", description: "", project: "", dueDate: "" });
      toast.success("Task Created Successfully");
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      await fetchTasks();
      toast.success("Status Updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "In Progress":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default:
        return "bg-red-500/20 text-red-400 border border-red-500/30";
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  const statsCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-red-500 to-red-600",
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slideUp">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Tasks</h1>
          <p className="text-slate-400 mt-2">Manage and track all your tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-3d bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
        >
          + Create New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 bg-linear-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg stat-icon`}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-200">
                {stat.value}
              </span>
            </div>
            <h3 className="text-slate-400 text-xs">{stat.title}</h3>
            <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${stat.color} rounded-full transition-all duration-500`}
                style={{ width: `${(stat.value / (totalTasks || 1)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Task
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Project
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Status
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Due Date
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="table-row-hover animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="p-4">
                    <div>
                      <p className="task-title font-medium text-slate-200">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-slate-400 mt-1">
                          {task.description.substring(0, 50)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    {task.project?.title || "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                      className="border border-slate-600 rounded-lg p-2 text-sm bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400">
                    No tasks found. Create your first task!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-slate-800 rounded-2xl w-full max-w-lg mx-4 transform animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-slate-200">
                Create New Task
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-slate-200"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-slate-200"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Tasks;
