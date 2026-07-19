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
  const [sportsList, setSportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coachesData, sportsData] = await Promise.all([
        fetchApi('/admin/coaches'),
        fetchApi('/admin/sports')
      ]);
      setCoaches(Array.isArray(coachesData) ? coachesData : (coachesData ? [coachesData] : []));
      setSportsList(Array.isArray(sportsData) ? sportsData : (sportsData ? [sportsData] : []));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setFile(null);
    if (item) {
      setEditingId(item._id);
      setPreviewUrl(item.imageUrl || null);
      const mappedAchievements = item.achievements?.length ? item.achievements.map(text => ({ text })) : [];
      reset({
        ...item,
        specializations: item.specializations?.map(s => s._id) || [],
        achievements: mappedAchievements
      });
    } else {
      setEditingId(null);
      setPreviewUrl(null);
      reset({ name: '', title: '', yearsExperience: 0, shortBio: '', fullBio: '', specializations: [], batchLevels: [], achievements: [], isActive: true, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const payload = { 
        ...formData, 
        achievements: formData.achievements?.map(a => a.text) || [],
        yearsOfExperience: parseInt(formData.yearsExperience, 10) || 0,
        bioShort: formData.shortBio,
        bioFull: formData.fullBio,
        batchLevels: formData.batchLevels?.map(level => level.toLowerCase().replace(/\s+/g, '-')) || []
      };
      
      delete payload.yearsExperience;
      delete payload.shortBio;
      delete payload.fullBio;

      const fd = new FormData();
      Object.keys(payload).forEach(key => {
        const val = payload[key];
        if (Array.isArray(val)) {
          // Send array as JSON string since Zod preprocess will parse it
          fd.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          fd.append(key, val);
        }
      });
      if (file) {
        fd.append('image', file);
      }
      
      if (editingId) {
        await fetchApi(`/admin/coaches/${editingId}`, {
          method: 'PUT',
          body: fd
        });
      } else {
        await fetchApi('/admin/coaches', {
          method: 'POST',
          body: fd
        });
      }
      setIsModalOpen(false);
      fetchData();
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
      fetchData();
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
            <FormInput label="Title (e.g., Head Coach)" name="title" register={register} error={errors.title} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Coach Image
            </label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-alt border border-border">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  setFile(selected);
                  if (selected) {
                    setPreviewUrl(URL.createObjectURL(selected));
                  } else {
                    const current = coaches.find(c => c._id === editingId);
                    setPreviewUrl(current?.imageUrl || null);
                  }
                }}
                className="flex-grow text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
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
              {loading ? (
                <p className="text-sm text-text-secondary italic col-span-full">Loading specializations...</p>
              ) : sportsList.length === 0 ? (
                <p className="text-sm text-error italic bg-error/10 p-3 rounded-md col-span-full">
                  No specializations available. Please run the seed script to populate sports.
                </p>
              ) : (
                sportsList.map(sport => (
                  <label key={sport._id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" value={sport._id} {...register('specializations')} className="rounded border-border text-secondary focus:ring-secondary bg-bg" />
                    {sport.name}
                  </label>
                ))
              )}
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
