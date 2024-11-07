import React, { useState } from 'react';
import { Client, WealthJourney } from '../types';
import { X } from 'lucide-react';

interface AddClientPopupProps {
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

const AddClientPopup: React.FC<AddClientPopupProps> = ({ onClose, onAddClient }) => {
  const [newClient, setNewClient] = useState<Partial<Client>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone || '',
        address: newClient.address || '',
        ssn: newClient.ssn || '',
        financialGoal: newClient.financialGoal || '',
        birthday: newClient.birthday || '',
        familyMembers: newClient.familyMembers || 0,
        businessName: newClient.businessName || '',
        attachments: [],
        wealthJourney: initializeWealthJourney(),
      };
      onAddClient(client);
      onClose();
    }
  };

  const initializeWealthJourney = (): WealthJourney => ({
    taxReturn2024: {
      items: [
        { id: '1', description: 'Gather all income documents', completed: false },
        { id: '2', description: 'Review deductions and credits', completed: false },
        { id: '3', description: 'File tax return', completed: false },
      ]
    },
    businessCorporationSetup: {
      items: [
        { id: '1', description: 'Create LLC Corporation', completed: false },
        { id: '2', description: 'Check domain availability and generate business name', completed: false },
        { id: '3', description: 'List company members and address', completed: false },
        { id: '4', description: 'Create business email', completed: false },
        { id: '5', description: 'Set up iPostal for business location (if needed)', completed: false },
        { id: '6', description: 'File Articles of Incorporation for LLC (Owner as AMBR)', completed: false },
        { id: '7', description: 'Obtain EIN for Business', completed: false },
        { id: '8', description: 'Design company logo', completed: false },
        { id: '9', description: 'Register with Dun & Bradstreet for DUNS number', completed: false },
        { id: '10', description: 'Set up Paydex Number for Business Credit Score', completed: false },
        { id: '11', description: 'Open Business Bank Account (after Sunbiz visibility)', completed: false },
        { id: '12', description: 'Set up Payroll', completed: false },
        { id: '13', description: 'Register on Nav.com', completed: false },
        { id: '14', description: 'Establish Net 30 Account with Uline or Grainger', completed: false },
        { id: '15', description: 'Apply for Gas Cards', completed: false },
        { id: '16', description: 'Create Website and secure Domain', completed: false },
        { id: '17', description: 'Complete BOI (Beneficial Ownership Information) filing', completed: false },
        { id: '18', description: 'Apply for Retail Credit Card', completed: false },
      ]
    },
    familyWealthPreservation: {
      items: [
        { id: '1', description: 'Create estate plan', completed: false },
        { id: '2', description: 'Set up trust funds', completed: false },
        { id: '3', description: 'Review insurance policies', completed: false },
      ]
    },
    personalCredit: {
      items: [
        { id: '1', description: 'Check credit report', completed: false },
        { id: '2', description: 'Dispute any errors', completed: false },
        { id: '3', description: 'Set up credit monitoring', completed: false },
      ]
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Add New Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={newClient.name || ''}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={newClient.email || ''}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            value={newClient.phone || ''}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border rounded"
            value={newClient.address || ''}
            onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="SSN"
            className="w-full p-2 border rounded"
            value={newClient.ssn || ''}
            onChange={(e) => setNewClient({ ...newClient, ssn: e.target.value })}
          />
          <input
            type="date"
            placeholder="Birthday"
            className="w-full p-2 border rounded"
            value={newClient.birthday || ''}
            onChange={(e) => setNewClient({ ...newClient, birthday: e.target.value })}
          />
          <input
            type="number"
            placeholder="Family Members"
            className="w-full p-2 border rounded"
            value={newClient.familyMembers || ''}
            onChange={(e) => setNewClient({ ...newClient, familyMembers: parseInt(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-2 border rounded"
            value={newClient.businessName || ''}
            onChange={(e) => setNewClient({ ...newClient, businessName: e.target.value })}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientPopup;