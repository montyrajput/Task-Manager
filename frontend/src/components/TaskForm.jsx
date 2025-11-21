import React, { useState, useEffect } from 'react';

const TaskForm = ({
  initial = { title: '', description: '', status: 'pending' },
  onSubmit,
  submitLabel = 'Save'
}) => {
  // Clean any unwanted fields from initial
  const cleanInitial = { ...initial };
  delete cleanInitial._id;
  delete cleanInitial.ownerId;

  const [form, setForm] = useState(cleanInitial);

  // Update form if initial changes
  useEffect(() => {
    const updated = { ...initial };
    delete updated._id;
    delete updated.ownerId;
    setForm(updated);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.title || !form.title.trim()) {
      return alert("Title is required");
    }

    // Ensure payload only contains keys backend expects
    const payload = {
      title: form.title.trim(),
      description: form.description || '',
      status: form.status
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 text-white rounded"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
