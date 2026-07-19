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
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventDate: z.string().min(1, "Event Date is required"),
  endDate: z.string().optional(),
  status: z.enum(['upcoming', 'past']),
  displayOrder: z.number().int().min(0).default(0).or(z.string().transform(v => parseInt(v) || 0)),
  isActive: z.boolean().default(true),
});

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [file, setFile] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'upcoming', displayOrder: 0, isActive: true }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/events');
      setEvents(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setFile(null);
    if (item) {
      setEditingId(item._id);
      reset({
        ...item,
        eventDate: item.eventDate?.split('T')[0] || '',
        endDate: item.endDate?.split('T')[0] || '',
      });
    } else {
      setEditingId(null);
      reset({ title: '', description: '', eventDate: '', endDate: '', status: 'upcoming', displayOrder: 0, isActive: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      if (file) {
        formData.append('image', file);
      }
      
      if (editingId) {
        await fetchApi(`/admin/events/${editingId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await fetchApi('/admin/events', {
          method: 'POST',
          body: formData
        });
      }
      setIsModalOpen(false);
      fetchEvents();
      toast.success(editingId ? 'Event updated successfully' : 'Event created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
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
      await fetchApi(`/admin/events/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchEvents();
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Event Title' },
    { 
      key: 'eventDate', 
      label: 'Date',
      render: (val) => new Date(val).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${val === 'upcoming' ? 'bg-accent/10 text-accent' : 'bg-surface-alt text-text-secondary'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Events Management" 
        description="Manage upcoming tournaments and past events."
        actionLabel="Add Event"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={events} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Event' : 'Add Event'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput 
            label="Event Title" 
            name="title" 
            register={register} 
            error={errors.title} 
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Event Image (Optional for updates)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <FormTextarea 
            label="Description" 
            name="description" 
            register={register} 
            error={errors.description} 
            rows={5}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="Start Date" 
              type="date" 
              name="eventDate" 
              register={register} 
              error={errors.eventDate} 
            />
            <FormInput 
              label="End Date (Optional)" 
              type="date" 
              name="endDate" 
              register={register} 
              error={errors.endDate} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Status" 
              name="status" 
              register={register} 
              error={errors.status}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past (Archived)' }
              ]}
            />
            <FormInput 
              label="Display Order" 
              type="number"
              name="displayOrder" 
              register={register} 
              error={errors.displayOrder} 
            />
          </div>
          <div className="pt-2">
            <FormCheckbox 
              label="Is Active" 
              name="isActive" 
              register={register} 
              error={errors.isActive}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Event"
        message="Are you sure you want to delete this event? It will be removed permanently."
      />
    </div>
  );
}
