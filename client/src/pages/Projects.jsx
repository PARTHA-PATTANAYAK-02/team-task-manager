import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

      toast.success("Project Created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          Create Project
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Create Project</h2>

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
                placeholder="Project title"
                value={formData.title}
                onChange={handleChange}
                required="true"
                className="w-full border p-3 rounded-lg text-black"
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required="true"
                className="w-full border p-3 rounded-lg text-black"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
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
                {/* Team Members: {project.teamMembers.length} */}
                Created By: {project.createdBy?.name}
              </p>

              {/* <button className="bg-black text-white px-4 py-2 rounded-lg">
                View
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default Projects;
