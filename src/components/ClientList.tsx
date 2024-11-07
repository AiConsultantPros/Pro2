import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client, Note, Attachment } from '../types';
import { getClients, saveClients } from '../utils/localStorage';
import { Mail, Phone, MapPin, CreditCard, Calendar, Users, Briefcase, Edit, PlusCircle, Upload, ChevronDown, ChevronUp, Search } from 'lucide-react';
import EditClientPopup from './EditClientPopup';
import AddClientPopup from './AddClientPopup';
import DragDropAttachment from './DragDropAttachment';
import WealthJourney from './WealthJourney';
import CSVImport from './CSVImport';
import ClientNotes from './ClientNotes';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showAddClientPopup, setShowAddClientPopup] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setClients(getClients());
  }, []);

  const handleEditClient = (updatedClient: Client) => {
    const updatedClients = clients.map((client) =>
      client.id === updatedClient.id ? updatedClient : client
    );
    setClients(updatedClients);
    saveClients(updatedClients);
    setShowEditPopup(false);
  };

  const handleAddClient = (newClient: Client) => {
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveClients(updatedClients);
    setShowAddClientPopup(false);
  };

  const handleCSVImport = (importedClients: Client[]) => {
    const updatedClients = [...clients, ...importedClients];
    setClients(updatedClients);
    saveClients(updatedClients);
    setShowCSVImport(false);
  };

  const handleAttachmentsUpdate = (clientId: string, attachments: Attachment[]) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, attachments } : client
    );
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const handleWealthJourneyUpdate = (clientId: string, updatedWealthJourney: any) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, wealthJourney: updatedWealthJourney } : client
    );
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const toggleCardExpansion = (clientId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const handleAddNote = (clientId: string, content: string, dueDate: string | null, status: 'Not Started' | 'In Progress' | 'Completed') => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        const newNote: Note = {
          id: Date.now().toString(),
          content,
          createdAt: new Date().toISOString(),
          dueDate,
          completed: status === 'Completed',
          status,
        };
        return { ...client, notes: [...(client.notes || []), newNote] };
      }
      return client;
    });
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const handleDeleteNote = (clientId: string, noteId: string) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return { ...client, notes: (client.notes || []).filter((note) => note.id !== noteId) };
      }
      return client;
    });
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const handleEditNote = (clientId: string, noteId: string, content: string, dueDate: string | null, status: 'Not Started' | 'In Progress' | 'Completed') => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        const updatedNotes = (client.notes || []).map((note) =>
          note.id === noteId ? { ...note, content, dueDate, status, completed: status === 'Completed' } : note
        );
        return { ...client, notes: updatedNotes };
      }
      return client;
    });
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const filteredClients = clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowCSVImport(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddClientPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Client
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
        >
          Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>
      {filteredClients.map((client) => (
        <motion.div
          key={client.id}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="p-6 bg-blue-500 text-white cursor-pointer"
            onClick={() => toggleCardExpansion(client.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">{client.name}</h3>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClient(client);
                    setShowEditPopup(true);
                  }}
                  className="text-white hover:text-blue-200 mr-2"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {expandedCards[client.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {expandedCards[client.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 space-y-2 pr-4">
                      <p className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" /> {client.email}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" /> {client.phone}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" /> {client.address}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" /> SSN: {client.ssn}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" /> Birthday: {client.birthday}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" /> Family Members: {client.familyMembers}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" /> Business: {client.businessName}
                      </p>
                      <DragDropAttachment
                        clientId={client.id}
                        attachments={client.attachments}
                        onAttachmentsUpdate={handleAttachmentsUpdate}
                      />
                    </div>
                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                      <h4 className="text-xl font-semibold mb-4 text-center">Wealth Journey</h4>
                      <WealthJourney
                        wealthJourney={client.wealthJourney}
                        onUpdate={(updatedWealthJourney) => handleWealthJourneyUpdate(client.id, updatedWealthJourney)}
                      />
                      <ClientNotes
                        clientId={client.id}
                        notes={client.notes || []}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                        onEditNote={handleEditNote}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      {showEditPopup && editingClient && (
        <EditClientPopup
          client={editingClient}
          onClose={() => setShowEditPopup(false)}
          onEditClient={handleEditClient}
        />
      )}
      {showAddClientPopup && (
        <AddClientPopup
          onClose={() => setShowAddClientPopup(false)}
          onAddClient={handleAddClient}
        />
      )}
      {showCSVImport && (
        <CSVImport
          onClose={() => setShowCSVImport(false)}
          onImport={handleCSVImport}
        />
      )}
    </div>
  );
};

export default ClientList;