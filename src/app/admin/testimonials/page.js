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
import { Badge } from '@/components/ui/Badge';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const schema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  rating: z.number().min(1).max(5).or(z.string().transform(v => parseInt(v) || 5)),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
  sportId: z.string().optional(),
});

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isFeatured: false, displayOrder: 0, rating: 5 }
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/testimonials').catch(async () => {
         return await fetchApi('/public/testimonials');
      });
      setTestimonials(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      reset(item);
    } else {
      setEditingId(null);
      reset({ customerName: '', role: '', quote: '', rating: 5, sportId: '', isFeatured: false, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await fetchApi(`/admin/testimonials/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await fetchApi('/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      fetchTestimonials();
      toast.success(editingId ? 'Testimonial updated successfully' : 'Testimonial created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save testimonial');
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
      await fetchApi(`/admin/testimonials/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchTestimonials();
      toast.success('Testimonial deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'customerName', label: 'Name' },
    { key: 'rating', label: 'Rating', render: (val) => `${val}/5` },
    { 
      key: 'quote', 
      label: 'Quote',
      render: (val) => val.length > 50 ? `${val.substring(0, 50)}...` : val
    },
    { 
      key: 'isFeatured', 
      label: 'Featured',
      render: (val) => (
        <Badge variant={val ? 'accent' : 'default'} dot>{val ? 'Yes' : 'No'}</Badge>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Testimonials Management" 
        description="Manage customer reviews and quotes."
        actionLabel="Add Testimonial"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={testimonials} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="Customer Name" 
              name="customerName" 
              register={register} 
              error={errors.customerName} 
            />
            <FormInput 
              label="Role/Context" 
              name="role" 
              register={register} 
              error={errors.role} 
              placeholder="e.g. Parent of Junior Player"
            />
          </div>
          <FormTextarea 
            label="Quote" 
            name="quote" 
            register={register} 
            error={errors.quote} 
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Rating" 
              name="rating" 
              register={register} 
              error={errors.rating}
              options={[
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '2', label: '2 Stars' },
                { value: '1', label: '1 Star' }
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
          <div className="mt-4">
            <FormCheckbox 
              label="Feature on Homepage" 
              name="isFeatured" 
              register={register} 
              error={errors.isFeatured}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? It will be removed permanently."
      />
    </div>
  );
}
