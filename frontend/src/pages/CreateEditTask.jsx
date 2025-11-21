import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import API from '../services/api';

const CreateEditTask = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  // If editing, data comes from location.state.task
  const initial = state?.task || { 
    title: '', 
    description: '', 
    status: 'pending' 
  };

  const handleSubmit = async (data) => {
    try {
      if (isEdit) {
        // UPDATE TASK
        await API.put(`/tasks/${id}`, data);
      } else {
        // CREATE TASK
        await API.post('/tasks', data);
      }

      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Edit Task' : 'Create Task'}
      </h2>

      <TaskForm 
        initial={initial} 
        onSubmit={handleSubmit} 
        submitLabel={isEdit ? 'Update' : 'Create'} 
      />
    </div>
  );
};

export default CreateEditTask;
