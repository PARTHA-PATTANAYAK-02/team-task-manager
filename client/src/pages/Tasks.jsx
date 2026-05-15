import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);

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

      alert("Task Created");
    } catch (error) {
      console.log(error);
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
      </div>

      {/* Create Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded-lg text-black"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg text-black"
        />

        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="border p-3 rounded-lg text-black"
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
          className="border p-3 rounded-lg text-black"
        />

        <button type="submit" className="bg-black text-white py-3 rounded-lg">
          Create Task
        </button>
      </form>

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
