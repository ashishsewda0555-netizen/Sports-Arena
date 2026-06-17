'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormTextarea, FormSelect, FormCheckbox } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const schema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters").max(200, "Max 200 characters"),
  type: z.enum(['info', 'warning', 'success', 'error']),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  linkLabel: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'info', isActive: true }
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/announcements').catch(async () => {
        return await fetchApi('/public/announcements/active');
      });
      setAnnouncements(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement._id);
      reset({
        ...announcement,
        startDate: announcement.startDate?.split('T')[0] || '',
        endDate: announcement.endDate?.split('T')[0] || '',
      });
    } else {
      setEditingId(null);
      reset({ message: '', type: 'info', startDate: '', endDate: '', linkUrl: '', linkLabel: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await fetchApi(`/admin/announcements/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await fetchApi('/admin/announcements', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      fetchAnnouncements();
      toast.success(editingId ? 'Announcement updated successfully' : 'Announcement created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save announcement');
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
      await fetchApi(`/admin/announcements/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchAnnouncements();
      toast.success('Announcement deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'message', label: 'Message' },
    { 
      key: 'type', 
      label: 'Type',
      render: (val) => <span className="capitalize">{val}</span>
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-success/10 text-success' : 'bg-text-disabled/20 text-text-secondary'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      key: 'startDate', 
      label: 'Start',
      render: (val) => new Date(val).toLocaleDateString()
    },
    { 
      key: 'endDate', 
      label: 'End',
      render: (val) => new Date(val).toLocaleDateString()
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Announcements" 
        description="Manage top-bar announcements and alerts."
        actionLabel="Add Announcement"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={announcements} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Announcement' : 'Add Announcement'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormTextarea 
            label="Message" 
            name="message" 
            register={register} 
            error={errors.message} 
            rows={3}
            placeholder="Important announcement text..."
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Type" 
              name="type" 
              register={register} 
              error={errors.type}
              options={[
                { value: 'info', label: 'Info (Blue)' },
                { value: 'warning', label: 'Warning (Orange)' },
                { value: 'success', label: 'Success (Green)' },
                { value: 'error', label: 'Error (Red)' }
              ]}
            />
            <FormCheckbox 
              label="Is Active" 
              name="isActive" 
              register={register} 
              error={errors.isActive}
              className="mt-8"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="Start Date" 
              type="date" 
              name="startDate" 
              register={register} 
              error={errors.startDate} 
            />
            <FormInput 
              label="End Date" 
              type="date" 
              name="endDate" 
              register={register} 
              error={errors.endDate} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="Link URL (Optional)" 
              type="url" 
              name="linkUrl" 
              register={register} 
              error={errors.linkUrl} 
              placeholder="https://"
            />
            <FormInput 
              label="Link Label" 
              name="linkLabel" 
              register={register} 
              error={errors.linkLabel} 
              placeholder="Read More"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Announcement'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? It will be removed permanently."
      />
    </div>
  );
}
