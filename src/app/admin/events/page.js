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
  isFeatured: z.boolean().default(false),
});

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'upcoming', isFeatured: false }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/events').catch(async () => {
         return await fetchApi('/public/events');
      });
      setEvents(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      reset({
        ...item,
        eventDate: item.eventDate?.split('T')[0] || '',
        endDate: item.endDate?.split('T')[0] || '',
      });
    } else {
      setEditingId(null);
      reset({ title: '', description: '', eventDate: '', endDate: '', status: 'upcoming', isFeatured: false });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await fetchApi(`/admin/events/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await fetchApi('/admin/events', {
          method: 'POST',
          body: JSON.stringify(data)
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
            <div className="mt-8">
              <FormCheckbox 
                label="Feature on Homepage" 
                name="isFeatured" 
                register={register} 
                error={errors.isFeatured}
              />
            </div>
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
