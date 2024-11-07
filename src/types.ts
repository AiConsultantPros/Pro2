import { IconType } from 'react-icons';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  financialGoal: string;
  birthday: string;
  familyMembers: number;
  businessName: string;
  attachments: Attachment[];
  wealthJourney: WealthJourney;
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  dueDate: string | null;
  completed: boolean;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

// ... (keep the rest of the file unchanged)