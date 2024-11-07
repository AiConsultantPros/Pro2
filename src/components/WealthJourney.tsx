import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FileText, Building, Users, CreditCard, ChevronRight, X } from 'lucide-react';

interface WealthJourneyProps {
  wealthJourney?: {
    taxReturn2024?: { items: { id: string; description: string; completed: boolean }[] };
    businessCorporationSetup?: { items: { id: string; description: string; completed: boolean }[] };
    familyWealthPreservation?: { items: { id: string; description: string; completed: boolean }[] };
    personalCredit?: { items: { id: string; description: string; completed: boolean }[] };
  };
  onUpdate: (updatedWealthJourney: any) => void;
}

const defaultWealthJourney = {
  taxReturn2024: {
    items: [
      { id: '1', description: 'Call to connect, Ask if the client will like to meet in person to the office, do their taxes through email/calling', completed: false },
      { id: '2', description: 'Create physical and digital folder', completed: false },
      { id: '3', description: 'Ask for their 2023 Tax Return and Is all the Info the same', completed: false },
      { id: '4', description: 'Fill out client information sheet', completed: false },
      { id: '5', description: 'Ask the client if they have a PTIN', completed: false },
      { id: '6', description: 'Live in House or Apartment? Double check with the client that it\'s their current address and Apt. #', completed: false },
      { id: '7', description: 'Ask if they have insurance in the marketplace and or if anyone was in college?', completed: false },
      { id: '8', description: 'Receive Social security, ID', completed: false },
      { id: '9', description: 'Acquire W-2 and/or 1099', completed: false },
      { id: '10', description: 'Acquire any other miscellaneous documents (1099-B, 1098-T, 1098 Mortgage Investment)', completed: false },
      { id: '11', description: 'Print out all documentation that was acquired W-2', completed: false },
      { id: '12', description: 'Do they have a business?', completed: false },
      { id: '13', description: 'Request expenses', completed: false },
      { id: '14', description: 'Get bank account info', completed: false },
      { id: '15', description: 'Put information into CRM', completed: false },
      { id: '16', description: 'Fill out Tax', completed: false },
      { id: '17', description: 'Add information into Tax Software from documents acquired', completed: false },
      { id: '18', description: 'Confirm refund', completed: false },
      { id: '19', description: 'Submit', completed: false },
      { id: '20', description: 'Check if Accepted', completed: false },
      { id: '21', description: 'Send client submission', completed: false },
      { id: '22', description: 'Put Return on CRM', completed: false },
      { id: '23', description: 'PAID Zelle/Cashapp', completed: false },
      { id: '24', description: 'PAID VIA TPG', completed: false },
      { id: '25', description: 'Funded', completed: false },
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
      { id: '4', description: 'Discuss legacy planning with family', completed: false },
      { id: '5', description: 'Establish family governance structure', completed: false },
    ]
  },
  personalCredit: { 
    items: [
      { id: '1', description: 'Check credit report', completed: false },
      { id: '2', description: 'Dispute any errors', completed: false },
      { id: '3', description: 'Set up credit monitoring', completed: false },
      { id: '4', description: 'Create debt repayment plan', completed: false },
      { id: '5', description: 'Establish emergency fund', completed: false },
    ]
  },
};

const WealthJourney: React.FC<WealthJourneyProps> = ({ wealthJourney = defaultWealthJourney, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { key: 'taxReturn2024', title: 'Tax Return 2024', color: '#3B82F6', icon: FileText },
    { key: 'businessCorporationSetup', title: 'Business Corporation Setup', color: '#10B981', icon: Building },
    { key: 'familyWealthPreservation', title: 'Family Wealth Preservation', color: '#F59E0B', icon: Users },
    { key: 'personalCredit', title: 'Personal Credit', color: '#8B5CF6', icon: CreditCard },
  ];

  const getCompletedTasks = (tasks: { completed: boolean }[]) => {
    return tasks.filter(task => task.completed).length;
  };

  const getTopUnfulfilledTasks = (tasks: { id: string; description: string; completed: boolean }[], count: number) => {
    return tasks
      .filter(task => !task.completed)
      .slice(0, count);
  };

  const handleTaskToggle = (sectionKey: string, taskId: string) => {
    const updatedWealthJourney = { ...wealthJourney };
    const section = updatedWealthJourney[sectionKey as keyof typeof updatedWealthJourney];
    if (section) {
      const taskIndex = section.items.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        section.items[taskIndex].completed = !section.items[taskIndex].completed;
        onUpdate(updatedWealthJourney);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map(section => {
        const sectionData = wealthJourney[section.key as keyof typeof wealthJourney];
        if (!sectionData) return null;

        const completedTasks = getCompletedTasks(sectionData.items);
        const totalTasks = sectionData.items.length;
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const topUnfulfilledTasks = getTopUnfulfilledTasks(sectionData.items, 3);

        return (
          <div key={section.key} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <section.icon className={`w-6 h-6 mr-2 text-${section.color}`} />
                <span style={{ color: section.color }}>{section.title}</span>
              </h3>
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage.toFixed(0)}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: section.color,
                    textColor: section.color,
                  })}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Top unfulfilled tasks:</h4>
              <ul className="text-sm">
                {topUnfulfilledTasks.map(task => (
                  <li key={task.id} className="flex items-center mb-1">
                    <span className={`w-2 h-2 rounded-full bg-${section.color} mr-2`} style={{ backgroundColor: section.color }}></span>
                    {task.description}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setActiveSection(activeSection === section.key ? null : section.key)}
              className="text-sm font-semibold flex items-center"
              style={{ color: section.color }}
            >
              {activeSection === section.key ? 'Hide Tasks' : 'Show All Tasks'}
              <ChevronRight className={`w-4 h-4 ml-1 transform transition-transform ${activeSection === section.key ? 'rotate-90' : ''}`} />
            </button>
            {activeSection === section.key && (
              <ul className="mt-4 space-y-2">
                {sectionData.items.map(task => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(section.key, task.id)}
                      className="mr-2"
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WealthJourney;