import React, { useState } from 'react';
import { Client, WealthJourney } from '../types';
import { X } from 'lucide-react';

interface EditClientPopupProps {
  client: Client;
  onClose: () => void;
  onEditClient: (client: Client) => void;
}

const EditClientPopup: React.FC<EditClientPopupProps> = ({ client, onClose, onEditClient }) => {
  const [editedClient, setEditedClient] = useState<Client>(client);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedClient.name && editedClient.email) {
      onEditClient(editedClient);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={editedClient.name}
            onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={editedClient.email}
            onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            value={editedClient.phone}
            onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border rounded"
            value={editedClient.address}
            onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="SSN"
            className="w-full p-2 border rounded"
            value={editedClient.ssn}
            onChange={(e) => setEditedClient({ ...editedClient, ssn: e.target.value })}
          />
          <input
            type="date"
            placeholder="Birthday"
            className="w-full p-2 border rounded"
            value={editedClient.birthday}
            onChange={(e) => setEditedClient({ ...editedClient, birthday: e.target.value })}
          />
          <input
            type="number"
            placeholder="Family Members"
            className="w-full p-2 border rounded"
            value={editedClient.familyMembers}
            onChange={(e) => setEditedClient({ ...editedClient, familyMembers: parseInt(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-2 border rounded"
            value={editedClient.businessName}
            onChange={(e) => setEditedClient({ ...editedClient, businessName: e.target.value })}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditClientPopup;