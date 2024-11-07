import React, { useState } from 'react';
import { Client } from '../types';
import { X, Upload } from 'lucide-react';
import Papa from 'papaparse';

interface CSVImportProps {
  onClose: () => void;
  onImport: (clients: Client[]) => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const formatName = (firstName: string, lastName: string): string => {
    return `${lastName.trim()}, ${firstName.trim()}`;
  };

  const handleImport = () => {
    if (!file) {
      setError('Please select a file to import.');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        const importedClients: Client[] = results.data
          .filter((row: any) => row['First Name'] && row['Last Name'] && row['Email'])
          .map((row: any, index: number) => ({
            id: Date.now().toString() + index,
            name: formatName(row['First Name'], row['Last Name']),
            email: row['Email'],
            phone: row['Phone Number'] || '',
            address: row['Address'] || '',
            ssn: row['SSN'] || '',
            financialGoal: row['Financial Goal'] || '',
            birthday: row['Birthday'] || '',
            familyMembers: parseInt(row['Family Members']) || 0,
            businessName: row['Business Name'] || '',
            attachmentUrl: '',
            wealthJourney: {
              taxReturn2024: { items: [] },
              businessCorporationSetup: { items: [] },
              familyWealthPreservation: { items: [] },
              personalCredit: { items: [] },
            },
          }));

        onImport(importedClients);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Import Clients from CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csvFile"
          />
          <label
            htmlFor="csvFile"
            className="cursor-pointer bg-gray-200 text-gray-700 p-2 rounded flex items-center justify-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            {file ? file.name : 'Select CSV file'}
          </label>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleImport}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Import Clients
        </button>
      </div>
    </div>
  );
};

export default CSVImport;