import React, { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search + Filter + Pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 4;

  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/tasks?search=${search}&status=${status}&limit=${limit}&offset=${(page - 1) * limit}`
      );
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, search, status, page]);

  // Edit
  const handleEdit = (task) => {
    navigate(`/edit/${task.id}`, { state: { task } });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 space-y-8">

      {/* HEADER BAR */}
      <div className="bg-white shadow-md p-5 flex flex-col md:flex-row justify-between items-center rounded-lg">
        <h1 className="text-3xl font-bold text-slate-800 tracking-wide">
          {user?.role === "admin" ? "📌 All Tasks (Admin)" : "📌 My Tasks"}
        </h1>

        {/* Create Task Button For User */}
        {user?.role !== "admin" && (
          <button
            onClick={() => navigate('/create')}
            className="mt-3 md:mt-0 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg shadow"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* SEARCH + FILTER BOX */}
      <div className="bg-white p-5 shadow-md rounded-lg flex flex-col md:flex-row gap-4">

        <input
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 outline-none"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Completed</option>
        </select>

      </div>

      {/* Task Loader / Error */}
      {loading && <div className="text-center text-indigo-600 text-lg font-semibold">Loading tasks...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={task.createdBy === user?.id ? handleEdit : null}
            onDelete={handleDelete}
            isOwn={task.createdBy === user?.id}
            isAdmin={user?.role === 'admin'}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-6 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 transition shadow"
        >
          ⬅ Prev
        </button>

        <button
          disabled={tasks.length < limit}
          onClick={() => setPage(page + 1)}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 transition shadow"
        >
          Next ➡
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
