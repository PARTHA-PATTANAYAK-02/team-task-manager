import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");

      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        ...formData,
        teamMembers: [],
      });

      // Reload projects
      fetchProjects();

      // Clear form
      setFormData({
        title: "",
        description: "",
      });

      alert("Project Created");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
    };

    loadProjects();
  }, []);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black">Projects</h1>

          <p className="text-gray-600 mt-2">Manage your team projects</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            name="title"
            placeholder="Project title"
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

          <button
            type="submit"
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Create Project
          </button>
        </form>
      </div>

      {/* Dynamic Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black">{project.title}</h2>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Active
              </span>
            </div>

            <p className="text-gray-600 mb-5">{project.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Team Members: {project.teamMembers.length}
              </p>

              <button className="bg-black text-white px-4 py-2 rounded-lg">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default Projects;
