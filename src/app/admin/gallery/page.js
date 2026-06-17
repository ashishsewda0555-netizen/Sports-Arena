'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormSelect, FormCheckbox } from '@/components/admin/FormComponents';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { FallbackImage } from '@/components/ui/FallbackImage';

const schema = z.object({
  altText: z.string().min(2, "Alt text is required for accessibility"),
  category: z.enum(['facilities', 'tournaments', 'coaching', 'general']),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0).or(z.string().transform(v => parseInt(v) || 0)),
  // For file uploads, we handle the file separately since z.instanceof(File) is tricky with RHF sometimes
});

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: 'facilities', isFeatured: false, isActive: true, displayOrder: 0 }
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/gallery').catch(async () => {
         return await fetchApi('/public/gallery');
      });
      setImages(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setFile(null); // Reset file selection
    if (item) {
      setEditingId(item._id);
      reset(item);
    } else {
      setEditingId(null);
      reset({ altText: '', category: 'facilities', isFeatured: false, isActive: true, displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingId) {
        // Update (JSON)
        await fetchApi(`/admin/gallery/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        // Create (FormData)
        if (!file) throw new Error("An image file is required for upload.");
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', data.altText);
        formData.append('category', data.category);
        formData.append('isFeatured', data.isFeatured);
        formData.append('isActive', data.isActive);
        formData.append('displayOrder', data.displayOrder);

        // fetchApi will automatically delete Content-Type for FormData
        await fetchApi('/admin/gallery', {
          method: 'POST',
          body: formData
        });
      }
      setIsModalOpen(false);
      fetchImages();
      toast.success(editingId ? 'Image metadata updated successfully' : 'Image uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save image');
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
      await fetchApi(`/admin/gallery/${itemToDelete._id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      fetchImages();
      toast.success('Image deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { 
      key: 'url', 
      label: 'Preview',
      render: (val) => (
        <div className="w-16 h-12 relative overflow-hidden rounded">
          <FallbackImage src={val} alt="Preview" className="w-full h-full" />
        </div>
      )
    },
    { key: 'altText', label: 'Alt Text' },
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
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Gallery Management" 
        description="Upload and organize images for the public gallery."
        actionLabel="Upload Image"
        onAction={() => openModal()}
      />

      <DataTable 
        columns={columns} 
        data={images} 
        isLoading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingId ? 'Edit Image Metadata' : 'Upload Image'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {!editingId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Select Image</label>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                required
              />
              <p className="text-xs text-text-secondary mt-2">Max size: 5MB. Formats: JPG, PNG, WebP.</p>
            </div>
          )}

          <FormInput 
            label="Alt Text" 
            name="altText" 
            register={register} 
            error={errors.altText} 
            placeholder="Description for screen readers..."
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Category" 
              name="category" 
              register={register} 
              error={errors.category}
              options={[
                { value: 'facilities', label: 'Facilities' },
                { value: 'tournaments', label: 'Tournaments & Events' },
                { value: 'coaching', label: 'Coaching' },
                { value: 'general', label: 'General' }
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
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <FormCheckbox 
              label="Feature on Homepage" 
              name="isFeatured" 
              register={register} 
              error={errors.isFeatured}
            />
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
              {submitting ? 'Saving...' : (editingId ? 'Save Metadata' : 'Upload Image')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={submitting}
        title="Delete Image"
        message="Are you sure you want to delete this image? It will be removed permanently."
      />
    </div>
  );
}
