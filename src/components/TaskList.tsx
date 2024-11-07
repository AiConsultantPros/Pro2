import React, { useState, useEffect } from 'react';
import { Task, Client } from '../types';
import { getTasks, saveTasks, getClients } from '../utils/localStorage';
import { Plus, CheckCircle, Circle, Clock } from 'lucide-react';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});

  useEffect(() => {
    setTasks(getTasks());
    setClients(getClients());
  }, []);

  const handleAddTask = () => {
    if (newTask.title && newTask.clientId) {
      const task: Task = {
        id: Date.now().toString(),
        clientId: newTask.clientId,
        title: newTask.title,
        description: newTask.description || '',
        priority: newTask.priority || 'Medium',
        status: 'Not Started',
        dueDate: newTask.dueDate || '',
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setNewTask({});
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Task Title"
          className="p-2 border rounded flex-grow"
          value={newTask.title || ''}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={newTask.clientId || ''}
          onChange={(e) => setNewTask({ ...newTask, clientId: e.target.value })}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow flex items-center">
            {getStatusIcon(task.status)}
            <div className="ml-3">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">
                {clients.find((c) => c.id === task.clientId)?.name}
              </p>
            </div>
            <span className="ml-auto text-sm text-gray-500">{task.dueDate}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;