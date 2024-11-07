import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Client, Task } from '../types';
import { getClients, getTasks } from '../utils/localStorage';
import { Users, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

interface DashboardCardProps {
  item: {
    icon: React.ElementType;
    color: string;
    label: string;
    value: string | number;
    link?: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ item }) => {
  const Icon = item.icon;
  const content = (
    <div className="dashboard-card-content">
      <div className={`dashboard-card-icon ${item.color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="dashboard-card-text">
        <p className="dashboard-card-label">{item.label}</p>
        <p className="dashboard-card-value">{item.value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      className="dashboard-card"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {item.link ? (
        <Link to={item.link} className="block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { username } = useAuth();

  useEffect(() => {
    setClients(getClients());
    setTasks(getTasks());
  }, []);

  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
  const notStartedTasks = tasks.filter((task) => task.status === 'Not Started').length;

  const dashboardItems = [
    { icon: Users, color: 'bg-blue-500', label: 'Total Clients', value: clients.length, link: '/clients' },
    { icon: CheckCircle, color: 'bg-green-500', label: 'Completed Tasks', value: completedTasks },
    { icon: Clock, color: 'bg-yellow-500', label: 'In Progress Tasks', value: inProgressTasks },
    { icon: AlertCircle, color: 'bg-red-500', label: 'Not Started Tasks', value: notStartedTasks },
  ];

  const calendarEvents = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      resource: { type: 'task', status: task.status }
    })),
    ...clients.flatMap(client => 
      (client.notes || []).map((note) => ({
        id: note.id,
        title: `${client.name}: ${note.content}`,
        start: new Date(note.dueDate || note.createdAt),
        end: new Date(note.dueDate || note.createdAt),
        allDay: true,
        resource: { 
          type: 'note', 
          status: note.status, 
          clientId: client.id,
          createdAt: note.createdAt
        }
      }))
    )
  ];

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '';
    if (event.resource.type === 'task') {
      switch (event.resource.status) {
        case 'Completed':
          backgroundColor = '#10B981';
          break;
        case 'In Progress':
          backgroundColor = '#F59E0B';
          break;
        case 'Not Started':
          backgroundColor = '#EF4444';
          break;
        default:
          backgroundColor = '#6B7280';
      }
    } else {
      // For notes
      switch (event.resource.status) {
        case 'Completed':
          backgroundColor = '#8B5CF6';
          break;
        case 'In Progress':
          backgroundColor = '#3B82F6';
          break;
        case 'Not Started':
          backgroundColor = '#EC4899';
          break;
        default:
          backgroundColor = '#6B7280';
      }
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <p className="text-lg text-gray-600 mb-8">Welcome, {username}!</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardItems.map((item, index) => (
          <DashboardCard key={index} item={item} />
        ))}
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">Task and Note Calendar</h3>
        <div className="p-4">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleEventClick}
          />
        </div>
      </motion.div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">{selectedEvent.title}</h3>
            <p className="text-gray-600 mb-2">
              {selectedEvent.resource.type === 'task' ? 'Task' : 'Note'} - {selectedEvent.resource.status}
            </p>
            <p className="text-gray-600 mb-2">
              Due: {selectedEvent.start.toLocaleDateString()}
            </p>
            {selectedEvent.resource.type === 'note' && (
              <p className="text-gray-600 mb-4">
                Created: {formatDate(selectedEvent.resource.createdAt)}
              </p>
            )}
            <button
              onClick={() => setSelectedEvent(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;