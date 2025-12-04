import React, { useState, useEffect } from 'react';
import { leadService, Lead, CreateLeadData, UpdateLeadData } from '../services/leadsService';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<number | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const fetchedLeads = await leadService.getLeads();
      setLeads(fetchedLeads);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setLeadToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (leadToDelete) {
      try {
        await leadService.deleteLead(leadToDelete);
        fetchLeads();
      } catch (err) {
        setError('Failed to delete lead.');
        console.error(err);
      } finally {
        setIsConfirmOpen(false);
        setLeadToDelete(null);
      }
    }
  };

  const handleSave = async (leadData: CreateLeadData | UpdateLeadData) => {
    try {
      if (selectedLead) {
        await leadService.updateLead(selectedLead.id, leadData);
      } else {
        await leadService.createLead(leadData as CreateLeadData);
      }
      fetchLeads();
    } catch (err) {
      setError('Failed to save lead.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setSelectedLead(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('leads')}</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('create_lead')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('full_name')}</th>
              <th scope="col" className="px-6 py-3">{t('company')}</th>
              <th scope="col" className="px-6 py-3">{t('position')}</th>
              <th scope="col" className="px-6 py-3">{t('location')}</th>
              <th scope="col" className="px-6 py-3">{t('profile')}</th>
              <th scope="col" className="px-6 py-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{lead.full_name}</td>
                <td className="px-6 py-4">{lead.company}</td>
                <td className="px-6 py-4">{lead.position}</td>
                <td className="px-6 py-4">{lead.location}</td>
                <td className="px-6 py-4">
                  <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {t('view_profile')}
                  </a>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(lead)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && !loading && (
        <div className="text-center p-6 text-gray-500">
          {t('no_leads_found')}
        </div>
      )}

      {isModalOpen && (
        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          lead={selectedLead}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          message={t('confirm_delete_lead')}
        />
      )}
    </div>
  );
};

// Modal for creating/editing leads
const LeadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLeadData | UpdateLeadData) => void;
  lead: Lead | null;
}> = ({ isOpen, onClose, onSave, lead }) => {
  const [formData, setFormData] = useState<any>({
    full_name: '',
    company: '',
    position: '',
    location: '',
    profile_url: '',
    followers: 0,
    connections: 0,
    education: '',
    personal_message: '',
    message_length: 0,
    generated_at: new Date().toISOString().split('T')[0],
    total_leads: 1,
    ...lead,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6">{lead ? 'Edit Lead' : 'Create Lead'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" />
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="p-2 border rounded" />
            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="p-2 border rounded" />
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" />
            <input type="text" name="profile_url" value={formData.profile_url} onChange={handleChange} placeholder="Profile URL" className="p-2 border rounded col-span-2" />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation dialog
const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8">
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
