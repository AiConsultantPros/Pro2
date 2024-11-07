import React, { useState, useCallback, useRef } from 'react';
import { Paperclip, X, Edit2 } from 'lucide-react';
import { Attachment } from '../types';

interface DragDropAttachmentProps {
  clientId: string;
  attachments: Attachment[];
  onAttachmentsUpdate: (clientId: string, attachments: Attachment[]) => void;
}

const DragDropAttachment: React.FC<DragDropAttachmentProps> = ({
  clientId,
  attachments,
  onAttachmentsUpdate,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(Array.from(files));
      }
    },
    [clientId, onAttachmentsUpdate]
  );

  const handleFiles = (files: File[]) => {
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    const updatedAttachments = [...attachments, ...newAttachments];
    onAttachmentsUpdate(clientId, updatedAttachments);
  };

  const handleRemoveAttachment = useCallback((id: string) => {
    const updatedAttachments = attachments.filter(att => att.id !== id);
    onAttachmentsUpdate(clientId, updatedAttachments);
  }, [clientId, attachments, onAttachmentsUpdate]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleRenameClick = (attachment: Attachment) => {
    setEditingAttachment(attachment);
    setNewName(attachment.name);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAttachment && newName.trim()) {
      const updatedAttachments = attachments.map(att =>
        att.id === editingAttachment.id ? { ...att, name: newName.trim() } : att
      );
      onAttachmentsUpdate(clientId, updatedAttachments);
      setEditingAttachment(null);
    }
  };

  return (
    <div
      className={`mt-2 p-4 border-2 border-dashed rounded-lg text-sm ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-center mb-4">
        <Paperclip className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-gray-500">
          Drop files or click to attach
        </span>
        <button
          onClick={handleClick}
          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Select Files
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
      />
      <ul className="space-y-2">
        {attachments && attachments.map((attachment) => (
          <li key={attachment.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            {editingAttachment?.id === attachment.id ? (
              <form onSubmit={handleRenameSubmit} className="flex-1 mr-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </form>
            ) : (
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mr-2 flex-1"
              >
                {attachment.name}
              </a>
            )}
            <div>
              {editingAttachment?.id === attachment.id ? (
                <button
                  onClick={handleRenameSubmit}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleRenameClick(attachment)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DragDropAttachment;