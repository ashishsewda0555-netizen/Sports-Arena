'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormSelect } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const schema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/leads');
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedLead(item);
    reset({ status: item.status });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await fetchApi(`/admin/leads/${selectedLead._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      setIsModalOpen(false);
      fetchLeads();
      toast.success('Lead status updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update lead status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if(!itemToDelete) return;
    try {
      setSubmitting(true);
      await fetchApi(`/admin/leads/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchLeads();
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (val) => new Date(val).toLocaleDateString()
    },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'sportOfInterest', label: 'Interest', render: (val) => val || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => {
        const styles = {
          new: 'bg-error/10 text-error',
          contacted: 'bg-warning/10 text-warning',
          closed: 'bg-surface-alt text-text-secondary'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${styles[val]}`}>
            {val}
          </span>
        );
      }
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Leads Inbox" 
        description="Review and manage contact form submissions."
      />

      <DataTable 
        columns={columns} 
        data={leads} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title="Lead Details"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="bg-surface-alt p-4 rounded-md space-y-3">
              <div>
                <span className="text-xs text-text-secondary uppercase">From</span>
                <p className="font-medium text-text-primary">{selectedLead.name}</p>
                <p className="text-sm text-text-secondary">{selectedLead.email}</p>
                <p className="text-sm text-text-secondary">{selectedLead.phone}</p>
              </div>
              <div>
                <span className="text-xs text-text-secondary uppercase">Interest</span>
                <p className="text-sm text-text-primary">{selectedLead.sportOfInterest || 'General Inquiry'}</p>
              </div>
              <div>
                <span className="text-xs text-text-secondary uppercase">Message</span>
                <p className="text-sm text-text-primary mt-1 p-3 bg-bg rounded border border-border">
                  {selectedLead.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 border-t border-border">
              <FormSelect 
                label="Update Status" 
                name="status" 
                register={register} 
                error={errors.status}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'closed', label: 'Closed' }
                ]}
              />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Close
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Lead"
        message="Are you sure you want to delete this lead permanently? This action cannot be undone."
      />
    </div>
  );
}
