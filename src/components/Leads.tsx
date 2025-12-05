
import React, { useState, useEffect } from 'react';
import leadService, { Lead } from '../services/leadsService';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads(); // Refetch leads after deletion
      } catch (err) {
        setError('Failed to delete lead');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleFormSubmit = async (leadData: any) => {
    try {
      if (selectedLead) {
        await leadService.updateLead(selectedLead.id, leadData);
      } else {
        await leadService.createLead(leadData);
      }
      fetchLeads(); // Refetch leads after creating/updating
      handleModalClose();
    } catch (err) {
      setError('Failed to save lead');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Lead
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Profile</th>
              <th className="py-2 px-4 border-b">Actions</th>
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
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(lead)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LeadFormModal
          lead={selectedLead}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

// Placeholder for the LeadFormModal component
const LeadFormModal: React.FC<{ lead: Lead | null; onClose: () => void; onSubmit: (data: any) => void }> = ({ lead, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: lead?.full_name || '',
    position: lead?.position || '',
    company: lead?.company || '',
    location: lead?.location || '',
    profile_url: lead?.profile_url || '',
    followers: lead?.followers || 0,
    connections: lead?.connections || 0,
    education: lead?.education || '',
    personal_message: lead?.personal_message || '',
    message_length: lead?.message_length || 0,
    generated_at: lead?.generated_at || '',
    total_leads: lead?.total_leads || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{lead ? 'Edit Lead' : 'Add Lead'}</h3>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" />
          <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="w-full p-2 border rounded" />
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-2 border rounded" />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
          <input type="text" name="profile_url" value={formData.profile_url} onChange={handleChange} placeholder="Profile URL" className="w-full p-2 border rounded" />
          {/* Add other fields as needed */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leads;
