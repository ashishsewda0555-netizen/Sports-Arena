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
  description: z.string().optional(),
  videoType: z.enum(['youtube', 'vimeo', 'self-hosted']),
  embedUrl: z.string().url("Must be a valid URL"),
  placement: z.enum(['homepage-arena-tour', 'gallery', 'general']),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
});

export default function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { videoType: 'youtube', isActive: true, displayOrder: 0, placement: 'general' }
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/videos').catch(async () => {
         return await fetchApi('/public/videos');
      });
      setVideos(Array.isArray(data) ? data : (data ? [data] : []));
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
      reset({ title: '', description: '', videoType: 'youtube', embedUrl: '', placement: 'general', isActive: true, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await fetchApi(`/admin/videos/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await fetchApi('/admin/videos', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      fetchVideos();
      toast.success(editingId ? 'Video updated successfully' : 'Video added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save video');
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
      await fetchApi(`/admin/videos/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchVideos();
      toast.success('Video deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'videoType', 
      label: 'Type',
      render: (val) => <span className="capitalize">{val.replace('-', ' ')}</span>
    },
    { 
      key: 'placement', 
      label: 'Placement',
      render: (val) => <span className="capitalize">{val.replace(/-/g, ' ')}</span>
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
    { key: 'displayOrder', label: 'Order' }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Video Management" 
        description="Manage embedded videos (YouTube/Vimeo) across the site."
        actionLabel="Add Video"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={videos} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Video' : 'Add Video'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput 
            label="Video Title" 
            name="title" 
            register={register} 
            error={errors.title} 
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Video Type" 
              name="videoType" 
              register={register} 
              error={errors.videoType}
              options={[
                { value: 'youtube', label: 'YouTube' },
                { value: 'vimeo', label: 'Vimeo' },
                { value: 'self-hosted', label: 'Self Hosted (MP4/WebM)' }
              ]}
            />
            <FormInput 
              label="Video URL" 
              name="embedUrl" 
              register={register} 
              error={errors.embedUrl} 
              placeholder="https://..."
            />
          </div>
          <FormTextarea 
            label="Description (Optional)" 
            name="description" 
            register={register} 
            error={errors.description} 
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Placement" 
              name="placement" 
              register={register} 
              error={errors.placement}
              options={[
                { value: 'general', label: 'General Gallery' },
                { value: 'homepage-arena-tour', label: 'Homepage Arena Tour' },
                { value: 'gallery', label: 'Video Gallery Page' }
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
              {submitting ? 'Saving...' : 'Save Video'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Video"
        message="Are you sure you want to delete this video? It will be removed permanently."
      />
    </div>
  );
}
