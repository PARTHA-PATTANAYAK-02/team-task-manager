import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    dueDate: "",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch projects
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
      await fetchTasks();

      await fetchProjects();
    };

    loadData();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/tasks", {
        ...formData,
        assignedTo: user._id,
      });

      fetchTasks();

      setFormData({
        title: "",
        description: "",
        project: "",
        dueDate: "",
      });

      toast.success("Task Created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black">Tasks</h1>

          <p className="text-gray-600 mt-2">Track and manage all tasks</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          Create Task
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Create Task</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-black text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                await handleSubmit(e);

                setShowModal(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg text-black"
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg text-black"
              />

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg text-black"
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg text-black"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Dynamic Task Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-4">Task</th>

              <th className="text-left p-4">Project</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Due Date</th>

              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b">
                <td className="p-4 text-black font-medium">{task.title}</td>

                <td className="p-4 text-gray-600">{task.project?.title}</td>

                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {task.status}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="border p-2 rounded text-black"
                  >
                    <option>Pending</option>

                    <option>In Progress</option>

                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default Tasks;
