
import React, { useState } from 'react';

// Mock data based on the provided API documentation
const mockLeads = [
    {
        "id": 2,
        "organisation_id": 9,
        "full_name": "John doe Doe",
        "position": "Senior 22Software Engineer",
        "company": "TechCorp International",
        "location": "Paris, France",
        "profile_url": "https://www.linkedin.com/in/johndoe",
        "followers": 1500,
        "connections": 500,
        "education": "Master in Computer Science",
        "personal_message": "Hello, nice to connect! Updated message",
        "message_length": 35,
        "generated_at": "2025-01-31 00:00:00",
        "total_leads": 1,
        "created_at": "2025-12-02T21:38:57.000000Z",
        "updated_at": "2025-12-02T21:39:50.000000Z"
    },
    {
        "id": 3,
        "organisation_id": 9,
        "full_name": "Jane Smith",
        "position": "Product Manager",
        "company": "Innovate Inc.",
        "location": "New York, USA",
        "profile_url": "https://www.linkedin.com/in/janesmith",
        "followers": 2500,
        "connections": 800,
        "education": "MBA",
        "personal_message": "Looking forward to connecting.",
        "message_length": 30,
        "generated_at": "2025-02-15 00:00:00",
        "total_leads": 1,
        "created_at": "2025-12-03T11:20:30.000000Z",
        "updated_at": "2025-12-03T11:20:30.000000Z"
    }
];


interface Lead {
  id: number;
  full_name: string;
  position: string;
  company: string;
  location: string;
  profile_url: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Profile</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="py-2 px-4 border-b">{lead.full_name}</td>
                <td className="py-2 px-4 border-b">{lead.position}</td>
                <td className="py-2 px-4 border-b">{lead.company}</td>
                <td className="py-2 px-4 border-b">{lead.location}</td>
                <td className="py-2 px-4 border-b">
                  <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Profile
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
