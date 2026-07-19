'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormSelect, FormCheckbox } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const schema = z.object({
  planName: z.string().min(2, "Plan Name is required"),
  category: z.enum(['coaching', 'casual-play', 'fitness-zone']),
  priceLabel: z.string().min(1, "Price label is required (e.g. '₹2,500' or 'Contact Us')"),
  numericPrice: z.number().optional().or(z.string().transform(v => parseFloat(v) || undefined)),
  billingPeriod: z.enum(['per-session', 'monthly', 'quarterly', 'one-time']),
  inclusions: z.array(z.object({ text: z.string().min(2, "Inclusion text required") })).min(1, "Add at least one inclusion"),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
});

export default function PricingAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: 'casual-play', billingPeriod: 'one-time', isPopular: false, isActive: true, inclusions: [{ text: '' }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inclusions",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/pricing');
      setPlans(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      // Map inclusions from array of strings to array of objects for react-hook-form
      const mappedInclusions = item.inclusions?.length ? item.inclusions.map(text => ({ text })) : [{ text: '' }];
      reset({ ...item, inclusions: mappedInclusions });
    } else {
      setEditingId(null);
      reset({ planName: '', category: 'casual-play', priceLabel: '', numericPrice: '', billingPeriod: 'one-time', isPopular: false, isActive: true, inclusions: [{ text: '' }], displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // Map inclusions back to array of strings
      const payload = { ...formData, inclusions: formData.inclusions.map(inc => inc.text) };
      
      if (editingId) {
        await fetchApi(`/admin/pricing/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/admin/pricing', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchPlans();
      toast.success(editingId ? 'Pricing plan updated successfully' : 'Pricing plan created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save pricing plan');
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
      await fetchApi(`/admin/pricing/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchPlans();
      toast.success('Pricing plan deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'planName', label: 'Plan Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (val) => <span className="capitalize">{val}</span>
    },
    { key: 'priceLabel', label: 'Price' },
    { 
      key: 'isPopular', 
      label: 'Popular',
      render: (val) => val ? <span className="text-secondary font-medium">Yes</span> : 'No'
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-success/10 text-success' : 'bg-text-disabled/20 text-text-secondary'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Pricing Management" 
        description="Manage membership and casual play pricing plans."
        actionLabel="Add Plan"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={plans} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Plan Name" name="planName" register={register} error={errors.planName} />
            <FormSelect 
              label="Category" 
              name="category" 
              register={register} 
              error={errors.category}
              options={[
                { value: 'casual-play', label: 'Casual Play' },
                { value: 'coaching', label: 'Coaching' },
                { value: 'fitness-zone', label: 'Fitness Zone' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Price Label (e.g. ₹2,500/mo)" name="priceLabel" register={register} error={errors.priceLabel} />
            <FormInput label="Numeric Price (Optional)" type="number" name="numericPrice" register={register} error={errors.numericPrice} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Billing Period" 
              name="billingPeriod" 
              register={register} 
              error={errors.billingPeriod}
              options={[
                { value: 'one-time', label: 'None / One-time' },
                { value: 'per-session', label: 'Per Session' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' }
              ]}
            />
            <FormInput label="Display Order" type="number" name="displayOrder" register={register} error={errors.displayOrder} />
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">Inclusions</label>
              <Button type="button" variant="ghost" size="sm" onClick={() => append({ text: '' })} className="h-8 px-2 text-xs">
                <Plus className="w-4 h-4 mr-1" /> Add Inclusion
              </Button>
            </div>
            {errors.inclusions?.root && <p className="text-error text-sm mb-2">{errors.inclusions.root.message}</p>}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormInput 
                    name={`inclusions.${index}.text`} 
                    register={register} 
                    error={errors.inclusions?.[index]?.text} 
                    placeholder="e.g. Access to all courts"
                  />
                  <button type="button" onClick={() => remove(index)} className="p-2.5 mt-0.5 text-text-secondary hover:text-error transition-colors bg-bg border border-border rounded-md">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <FormCheckbox label="Most Popular" name="isPopular" register={register} error={errors.isPopular} />
            <FormCheckbox label="Is Active" name="isActive" register={register} error={errors.isActive} />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Pricing Plan"
        message="Are you sure you want to delete this pricing plan? It will be removed permanently."
      />
    </div>
  );
}
