import React, { useState } from 'react';
import { Note } from '../types';
import { MessageSquare, Plus, Trash2, Calendar, Edit2, Check, X, Clock } from 'lucide-react';

interface ClientNotesProps {
  clientId: string;
  notes: Note[];
  onAddNote: (clientId: string, content: string, dueDate: string | null, status: 'Not Started' | 'In Progress' | 'Completed') => void;
  onDeleteNote: (clientId: string, noteId: string) => void;
  onEditNote: (clientId: string, noteId: string, content: string, dueDate: string | null, status: 'Not Started' | 'In Progress' | 'Completed') => void;
}

const ClientNotes: React.FC<ClientNotesProps> = ({ clientId, notes, onAddNote, onDeleteNote, onEditNote }) => {
  const [newNote, setNewNote] = useState('');
  const [newNoteDueDate, setNewNoteDueDate] = useState<string | null>(null);
  const [newNoteStatus, setNewNoteStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(clientId, newNote.trim(), newNoteDueDate, newNoteStatus);
      setNewNote('');
      setNewNoteDueDate(null);
      setNewNoteStatus('Not Started');
    }
  };

  const handleEditNote = () => {
    if (editingNote && editingNote.content.trim()) {
      onEditNote(clientId, editingNote.id, editingNote.content.trim(), editingNote.dueDate, editingNote.status);
      setEditingNote(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Notes</h4>
      <div className="flex mb-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-grow p-2 border rounded-l"
        />
        <input
          type="date"
          value={newNoteDueDate || ''}
          onChange={(e) => setNewNoteDueDate(e.target.value)}
          className="p-2 border-t border-b"
        />
        <select
          value={newNoteStatus}
          onChange={(e) => setNewNoteStatus(e.target.value as 'Not Started' | 'In Progress' | 'Completed')}
          className="p-2 border-t border-b"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="bg-gray-100 p-2 rounded-md">
            {editingNote?.id === note.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="flex-grow p-1 mr-2 border rounded"
                />
                <input
                  type="date"
                  value={editingNote.dueDate || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, dueDate: e.target.value })}
                  className="p-1 mr-2 border rounded"
                />
                <select
                  value={editingNote.status}
                  onChange={(e) => setEditingNote({ ...editingNote, status: e.target.value as 'Not Started' | 'In Progress' | 'Completed' })}
                  className="p-1 mr-2 border rounded"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={handleEditNote} className="text-green-500 hover:text-green-700 mr-2">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => setEditingNote(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">{note.content}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {note.dueDate ? new Date(note.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(note.status)}`}>
                      {note.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {formatDate(note.createdAt)}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setEditingNote(note)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(clientId, note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientNotes;