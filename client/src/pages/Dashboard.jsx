/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Task Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Project Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status !== "Completed",
  ).length;
  const projectCompletionRate =
    totalProjects > 0
      ? Math.round(((totalProjects - activeProjects) / totalProjects) * 100)
      : 0;

  // Chart data
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "In Progress", value: inProgressTasks, color: "#f59e0b" },
    { name: "Pending", value: pendingTasks, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3">
          <p className="text-sm font-medium text-slate-200">
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-indigo-400">
            {payload[0].value}
          </p>
          <p className="text-xs text-slate-400">tasks</p>
        </div>
      );
    }
    return null;
  };

  const taskStatsCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Completed Tasks",
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

  const projectStatsCards = [
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
      value: `${projectCompletionRate}%`,
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: "from-purple-500 to-purple-600",
    },
  ];

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-200">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your tasks and projects at a glance
        </p>
      </div>

      {/* Task Stats Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <span>📋 Task Analytics</span>
          <span className="text-xs text-slate-500 bg-slate-700/30 px-2 py-0.5 rounded-full">
            {totalTasks} total
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {taskStatsCards.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg stat-icon`}
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
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{
                    width: `${(stat.value / (totalTasks || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Stats Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <span>📁 Project Analytics</span>
          <span className="text-xs text-slate-500 bg-slate-700/30 px-2 py-0.5 rounded-full">
            {totalProjects} total
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projectStatsCards.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg stat-icon`}
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
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{
                    width: `${(stat.value / (totalProjects || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Distribution Chart & Completion Progress - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Distribution Chart */}
        <div className="card-hover bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-200">
              Task Distribution
            </h3>
            <p className="text-sm text-slate-400 mt-1">Tasks by status</p>
          </div>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: "#64748b", strokeWidth: 1 }}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-5 mt-4">
              {statusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {item.value}
                  </span>
                  <span className="text-xs text-slate-400">
                    (
                    {totalTasks > 0
                      ? Math.round((item.value / totalTasks) * 100)
                      : 0}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="card-hover bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-200">
              Task Completion Progress
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Track your task completion
            </p>
          </div>

          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-300">Overall Completion</span>
              <span className="text-sm font-medium text-indigo-400">
                {taskCompletionRate}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                style={{ width: `${taskCompletionRate}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {statusData.map((item) => (
              <div key={item.name} className="task-card p-2 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300">
                    {item.name === "Completed"
                      ? "✅"
                      : item.name === "In Progress"
                        ? "🔄"
                        : "⏳"}{" "}
                    {item.name}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: item.color }}
                  >
                    {item.value} / {totalTasks}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width:
                        totalTasks > 0
                          ? `${(item.value / totalTasks) * 100}%`
                          : "0%",
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-700">
            <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-emerald-400">
                {taskCompletionRate}%
              </div>
              <p className="text-xs text-slate-400">Rate</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-amber-400">
                {totalTasks - completedTasks}
              </div>
              <p className="text-xs text-slate-400">Remaining</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-indigo-400">
                {totalTasks}
              </div>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card-hover bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              Recent Tasks
            </h2>
            <div className="text-xs text-slate-400 bg-slate-700/30 px-2 py-1 rounded-full">
              {tasks.length} total
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-700">
          {tasks.slice(0, 5).map((task) => (
            <div key={task._id} className="task-card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <h3 className="task-title text-base font-semibold text-slate-200 mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {task.project?.title || "No Project"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <div className="text-sm text-slate-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-slate-400">
                No tasks yet. Create your first task!
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
