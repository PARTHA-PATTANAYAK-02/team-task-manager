/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { ...formData, teamMembers: [] });
      await fetchProjects();
      setFormData({ title: "", description: "" });
      toast.success("Project Created Successfully");
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status !== "Completed",
  ).length;
  const completionRate =
    totalProjects > 0
      ? Math.round(((totalProjects - activeProjects) / totalProjects) * 100)
      : 0;

  const statsCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: "from-purple-500 to-purple-600",
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
          <h1 className="text-3xl font-bold text-slate-200">Projects</h1>
          <p className="text-slate-400 mt-2">
            Manage and track all your team projects
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-3d bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
        >
          + Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg stat-icon`}
              >
                <svg
                  className="w-6 h-6 text-white"
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
              <span className="text-3xl font-bold text-slate-200">
                {stat.value}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm">{stat.title}</h3>
            <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                style={{
                  width: `${(stat.value / (totalProjects || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12 text-center animate-slideUp">
          <svg
            className="w-24 h-24 mx-auto text-slate-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">
            No Projects Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Get started by creating your first project
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="project-card bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="project-title text-xl font-bold text-slate-200 mb-2">
                      {project.title}
                    </h2>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="ml-3">
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{project.createdBy?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>{project.tasks?.length || 0} tasks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-slate-800 rounded-2xl w-full max-w-lg mx-4 transform animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-200">
                  Create New Project
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Add a new project to your workspace
                </p>
              </div>
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-slate-200 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-slate-200 transition-all duration-200 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Describe what this project is about
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Projects;
