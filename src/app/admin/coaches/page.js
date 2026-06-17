'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormTextarea, FormCheckbox } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const SPORTS = ['Badminton', 'Basketball', 'Football', 'Tennis', 'Swimming', 'Table Tennis', 'Volleyball'];
const LEVELS = ['Junior', 'Senior', 'Beginner', 'Intermediate', 'Advanced', 'Tournament Prep'];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  yearsExperience: z.number().min(0).or(z.string().transform(v => parseInt(v) || 0)),
  shortBio: z.string().max(160, "Short bio must be 160 characters or less"),
  fullBio: z.string().optional(),
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  batchLevels: z.array(z.string()).min(1, "Select at least one batch level"),
  achievements: z.array(z.object({ text: z.string().min(2) })).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
});

export default function CoachesAdmin() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, displayOrder: 0, specializations: [], batchLevels: [], achievements: [] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  const shortBioValue = watch('shortBio', '');
  const specializationsWatch = watch('specializations', []);
  const batchLevelsWatch = watch('batchLevels', []);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/coaches').catch(async () => {
         return await fetchApi('/public/coaches');
      });
      setCoaches(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      const mappedAchievements = item.achievements?.length ? item.achievements.map(text => ({ text })) : [];
      reset({ ...item, achievements: mappedAchievements });
    } else {
      setEditingId(null);
      reset({ name: '', title: '', yearsExperience: 0, shortBio: '', fullBio: '', specializations: [], batchLevels: [], achievements: [], isActive: true, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const payload = { ...formData, achievements: formData.achievements?.map(a => a.text) || [] };
      
      if (editingId) {
        await fetchApi(`/admin/coaches/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/admin/coaches', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchCoaches();
      toast.success(editingId ? 'Coach updated successfully' : 'Coach created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save coach');
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
      await fetchApi(`/admin/coaches/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchCoaches();
      toast.success('Coach deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { 
      key: 'specializations', 
      label: 'Specializations',
      render: (val) => val?.join(', ') || '-'
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
        title="Coach Management" 
        description="Add, edit, and organize coaches."
        actionLabel="Add Coach"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={coaches} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Coach' : 'Add Coach'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name" name="name" register={register} error={errors.name} />
            <FormInput label="Title (e.g. Head Coach)" name="title" register={register} error={errors.title} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Years of Experience" type="number" name="yearsExperience" register={register} error={errors.yearsExperience} />
            <FormInput label="Display Order" type="number" name="displayOrder" register={register} error={errors.displayOrder} />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <label className="font-medium text-text-primary">Short Bio</label>
              <span className={`text-xs ${shortBioValue.length > 160 ? 'text-error font-bold' : 'text-text-secondary'}`}>
                {shortBioValue.length}/160
              </span>
            </div>
            <textarea
              {...register('shortBio')}
              rows={2}
              className={`w-full px-4 py-3 rounded-md border bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary resize-y ${errors.shortBio ? 'border-error' : 'border-border'}`}
            />
            {errors.shortBio && <p className="mt-1 text-sm text-error">{errors.shortBio.message}</p>}
          </div>

          <FormTextarea label="Full Bio (Optional)" name="fullBio" register={register} error={errors.fullBio} rows={4} />

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-2">Specializations</h4>
            {errors.specializations && <p className="text-error text-sm mb-2">{errors.specializations.message}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SPORTS.map(sport => (
                <label key={sport} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={sport} {...register('specializations')} className="rounded border-border text-secondary focus:ring-secondary bg-bg" />
                  {sport}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-2">Batch Levels</h4>
            {errors.batchLevels && <p className="text-error text-sm mb-2">{errors.batchLevels.message}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LEVELS.map(lvl => (
                <label key={lvl} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={lvl} {...register('batchLevels')} className="rounded border-border text-secondary focus:ring-secondary bg-bg" />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-text-primary">Achievements</h4>
              <Button type="button" variant="ghost" size="sm" onClick={() => append({ text: '' })} className="h-8 px-2 text-xs">
                <Plus className="w-4 h-4 mr-1" /> Add Achievement
              </Button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormInput 
                    name={`achievements.${index}.text`} 
                    register={register} 
                    error={errors.achievements?.[index]?.text} 
                  />
                  <button type="button" onClick={() => remove(index)} className="p-2.5 mt-0.5 text-text-secondary hover:text-error transition-colors bg-bg border border-border rounded-md">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <FormCheckbox label="Is Active" name="isActive" register={register} error={errors.isActive} />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Coach'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Coach"
        message="Are you sure you want to delete this coach? It will be removed permanently."
      />
    </div>
  );
}
