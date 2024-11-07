import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Users, Briefcase, BarChart2, LogOut, UserPlus, Menu } from 'lucide-react';
import AddClientPopup from './AddClientPopup';
import { Client } from '../types';
import { getClients, saveClients } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Clients', to: '/clients', icon: Users },
    { name: 'Tasks', to: '/tasks', icon: Briefcase },
    { name: 'Dashboard', to: '/dashboard', icon: BarChart2 },
  ];

  const handleAddClient = (newClient: Client) => {
    const clients = getClients();
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className={`flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link to="/" className="flex items-center justify-center h-16 bg-gray-900">
        {isExpanded ? (
          <h1 className="text-2xl font-bold text-blue-400">Fulfill</h1>
        ) : (
          <Menu className="w-6 h-6 text-blue-400" />
        )}
      </Link>
      <div className="flex-1">
        <ul className="py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 transition-colors duration-200 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {isExpanded && (
                  <span className="ml-4 transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          <UserPlus className="w-6 h-6" />
          {isExpanded && (
            <span className="ml-2 transition-opacity duration-300">
              Add Client
            </span>
          )}
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
      >
        <LogOut className="w-6 h-6" />
        {isExpanded && (
          <span className="ml-4 transition-opacity duration-300">
            Logout
          </span>
        )}
      </button>
      {showPopup && (
        <AddClientPopup
          onClose={() => setShowPopup(false)}
          onAddClient={handleAddClient}
        />
      )}
    </div>
  );
};

export default Sidebar;