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
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
});

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isFeatured: false, displayOrder: 0, category: 'general' }
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/faqs').catch(async () => {
         return await fetchApi('/public/faqs');
      });
      setFaqs(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (faq = null) => {
    if (faq) {
      setEditingId(faq._id);
      reset(faq);
    } else {
      setEditingId(null);
      reset({ question: '', answer: '', category: 'general', isFeatured: false, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await fetchApi(`/admin/faqs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await fetchApi('/admin/faqs', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      fetchFaqs();
      toast.success(editingId ? 'FAQ updated successfully' : 'FAQ created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save FAQ');
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
      await fetchApi(`/admin/faqs/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchFaqs();
      toast.success('FAQ deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'question', label: 'Question' },
    { 
      key: 'category', 
      label: 'Category',
      render: (val) => <span className="capitalize">{val}</span>
    },
    { 
      key: 'isFeatured', 
      label: 'Featured',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-accent/10 text-accent' : 'bg-text-disabled/20 text-text-secondary'}`}>
          {val ? 'Yes' : 'No'}
        </span>
      )
    },
    { key: 'displayOrder', label: 'Order' }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="FAQ Management" 
        description="Manage frequently asked questions by category."
        actionLabel="Add FAQ"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={faqs} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit FAQ' : 'Add FAQ'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput 
            label="Question" 
            name="question" 
            register={register} 
            error={errors.question} 
            placeholder="What is..."
          />
          <FormTextarea 
            label="Answer" 
            name="answer" 
            register={register} 
            error={errors.answer} 
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Category" 
              name="category" 
              register={register} 
              error={errors.category}
              options={[
                { value: 'general', label: 'General' },
                { value: 'booking', label: 'Booking' },
                { value: 'coaching', label: 'Coaching' },
                { value: 'facilities', label: 'Facilities' },
                { value: 'pricing', label: 'Pricing' }
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
              {submitting ? 'Saving...' : 'Save FAQ'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? It will be removed permanently."
      />
    </div>
  );
}
